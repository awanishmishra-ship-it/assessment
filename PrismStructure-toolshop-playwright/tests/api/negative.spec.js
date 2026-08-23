const { test, expect } = require('../../fixtures/testFixtures');
const { invalidLoginUser, uniqueUser } = require('../../utils/dataFactory');

async function accessTokenForNewUser(authApi) {
  const user = uniqueUser('qa.api.neg');
  const registerResponse = await authApi.register(user);
  expect(registerResponse.status()).toBe(201);

  const loginResponse = await authApi.login({
    email: user.email,
    password: user.password,
  });
  expect(loginResponse.status()).toBe(200);

  const login = await loginResponse.json();
  expect(login.access_token).toEqual(expect.any(String));
  return login.access_token;
}

test('TC-API-06 @regression login rejects an unknown customer', async ({
  authApi,
}) => {
  const credentials = invalidLoginUser();
  const response = await authApi.login(credentials);

  expect(response.status()).toBe(401);
  expect(await response.json()).toEqual({ error: 'Unauthorized' });
});

test('TC-API-07 @regression invoice creation rejects missing and invalid bearer tokens', async ({
  invoicesApi,
}) => {
  const missingAuth = await invoicesApi.createInvoice(undefined, {}, { omitAuth: true });
  expect(missingAuth.status()).toBe(401);
  expect(await missingAuth.json()).toEqual({ message: 'Unauthorized' });

  const invalidAuth = await invoicesApi.createInvoice('not-a-real-token', {});
  expect(invalidAuth.status()).toBe(401);
  expect(await invalidAuth.json()).toEqual({ message: 'Unauthorized' });
});

test('TC-API-08 @regression invoice creation rejects a payload missing required fields', async ({
  authApi,
  invoicesApi,
}) => {
  const token = await accessTokenForNewUser(authApi);
  const response = await invoicesApi.createInvoice(token, {});

  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(body).toEqual(
    expect.objectContaining({
      billing_street: expect.arrayContaining([expect.any(String)]),
      billing_city: expect.arrayContaining([expect.any(String)]),
      billing_country: expect.arrayContaining([expect.any(String)]),
      payment_method: expect.arrayContaining([expect.any(String)]),
      payment_details: expect.arrayContaining([expect.any(String)]),
      cart_id: expect.arrayContaining([expect.any(String)]),
    }),
  );
  expect(body.billing_street[0]).toMatch(/required/i);
  expect(body.cart_id[0]).toMatch(/required/i);
  expect(body.payment_method[0]).toMatch(/required/i);
});
