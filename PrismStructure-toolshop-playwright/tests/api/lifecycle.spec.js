const { test, expect } = require('../../fixtures/testFixtures');
const testData = require('../../testdata/toolshopData');
const { uniqueUser } = require('../../utils/dataFactory');

function expectProduct(product) {
  expect(product).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
      in_stock: expect.any(Boolean),
    }),
  );
}

async function registerAndLogin(authApi) {
  const user = uniqueUser('qa.api');
  const registerResponse = await authApi.register(user);
  const registerBody = await registerResponse.json().catch(() => ({}));

  expect(
    registerResponse.status(),
    `Registration failed: ${JSON.stringify(registerBody)}`,
  ).toBe(201);
  const registeredUser = registerBody;
  expect(registeredUser).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    }),
  );
  expect(registeredUser).not.toHaveProperty('password');

  const loginResponse = await authApi.login({
    email: user.email,
    password: user.password,
  });

  expect(loginResponse.status()).toBe(200);
  const login = await loginResponse.json();
  expect(login).toEqual(
    expect.objectContaining({
      access_token: expect.any(String),
      token_type: expect.any(String),
      expires_in: expect.any(Number),
    }),
  );
  expect(login.token_type.toLowerCase()).toBe('bearer');
  expect(login.access_token.length).toBeGreaterThan(20);

  return { token: login.access_token, user, userId: registeredUser.id };
}

async function retrieveSelectedProducts(productsApi) {
  const response = await productsApi.getProducts({ page: 1, sort: 'name,asc' });

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toEqual(
    expect.objectContaining({
      current_page: expect.any(Number),
      data: expect.any(Array),
      total: expect.any(Number),
    }),
  );
  expect(body.data.length).toBeGreaterThan(0);
  const products = [...body.data];

  for (let page = 2; page <= body.last_page; page += 1) {
    const pageResponse = await productsApi.getProducts({
      page,
      sort: 'name,asc',
    });
    expect(pageResponse.status()).toBe(200);

    const pageBody = await pageResponse.json();
    expect(pageBody.current_page).toBe(page);
    expect(pageBody.data).toEqual(expect.any(Array));
    products.push(...pageBody.data);
  }

  products.forEach(expectProduct);

  return [testData.products.primary, testData.products.secondary].map((name) => {
    const product = products.find((item) => item.name === name);
    expect(product, `Expected product "${name}" in the catalog`).toBeTruthy();
    expect(product.in_stock, `Expected product "${name}" to be in stock`).toBe(true);
    return product;
  });
}

async function createCartWithProducts(cartsApi, products) {
  const createResponse = await cartsApi.createCart();

  expect(createResponse.status()).toBe(201);
  const createdCart = await createResponse.json();
  expect(createdCart).toEqual(
    expect.objectContaining({ id: expect.any(String) }),
  );
  expect(createdCart.id.length).toBeGreaterThan(0);

  const expectedItems = products.map((product, index) => ({
    productId: product.id,
    quantity: index + 1,
  }));

  for (const item of expectedItems) {
    const addResponse = await cartsApi.addItem(createdCart.id, item);

    expect(addResponse.status()).toBe(200);
    const added = await addResponse.json();
    expect(added).toEqual(
      expect.objectContaining({ result: expect.any(String) }),
    );
    expect(added.result.length).toBeGreaterThan(0);
  }

  return { cartId: createdCart.id, expectedItems };
}

async function verifyCartContents(cartsApi, cartId, expectedItems) {
  const response = await cartsApi.getCart(cartId);

  expect(response.status()).toBe(200);
  const cart = await response.json();
  expect(cart).toEqual(
    expect.objectContaining({
      id: cartId,
      cart_items: expect.any(Array),
    }),
  );
  expect(cart.cart_items).toHaveLength(expectedItems.length);

  for (const expectedItem of expectedItems) {
    expect(cart.cart_items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product_id: expectedItem.productId,
          quantity: expectedItem.quantity,
        }),
      ]),
    );
  }

  return cart;
}

test('TC-API-03 @smoke unique customer can register and obtain a bearer token', async ({
  authApi,
}) => {
  await registerAndLogin(authApi);
});

test('TC-API-04 @regression cart preserves dynamically selected products and quantities', async ({
  cartsApi,
  productsApi,
}) => {
  const products = await retrieveSelectedProducts(productsApi);
  const { cartId, expectedItems } = await createCartWithProducts(
    cartsApi,
    products,
  );

  await verifyCartContents(cartsApi, cartId, expectedItems);
});

test('TC-API-05 @smoke @regression authenticated customer completes the COD API lifecycle', async ({
  authApi,
  cartsApi,
  invoicesApi,
  postcodesApi,
  productsApi,
}) => {
  const { token, user, userId } = await test.step('Register and log in', () =>
    registerAndLogin(authApi),
  );
  const products = await test.step('Retrieve selected products', () =>
    retrieveSelectedProducts(productsApi),
  );
  const { cartId, expectedItems } = await test.step(
    'Create a cart and add selected products',
    () => createCartWithProducts(cartsApi, products),
  );
  await test.step('Verify cart contents', () =>
    verifyCartContents(cartsApi, cartId, expectedItems),
  );

  const addressResponse = await test.step('Resolve a valid billing address', () =>
    postcodesApi.lookup({
      country: user.country,
      postcode: user.postalCode,
      houseNumber: user.houseNumber,
    }),
  );
  expect(addressResponse.status()).toBe(200);
  const address = await addressResponse.json();
  expect(address).toEqual(
    expect.objectContaining({
      street: expect.any(String),
      city: expect.any(String),
      state: expect.any(String),
      country: user.country,
      postcode: user.postalCode,
    }),
  );

  const invoiceResponse = await test.step('Generate a COD invoice', () =>
    invoicesApi.createInvoice(token, {
      billingStreet: address.street,
      billingCity: address.city,
      billingState: address.state,
      billingCountry: address.country,
      billingPostalCode: address.postcode,
      paymentMethod: testData.checkout.paymentMethod,
      paymentDetails: {},
      cartId,
    }),
  );

  const invoice = await invoiceResponse.json();
  expect(
    invoiceResponse.status(),
    `Invoice response: ${JSON.stringify(invoice)}`,
  ).toBe(201);
  expect(invoice).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      user_id: userId,
      invoice_number: expect.stringMatching(/^INV-\d+$/),
      billing_street: address.street,
      billing_city: address.city,
      billing_state: address.state,
      billing_country: address.country,
      billing_postal_code: address.postcode,
      subtotal: expect.any(Number),
      total: expect.any(Number),
      invoice_date: expect.any(String),
      created_at: expect.any(String),
    }),
  );
  expect(invoice.id.length).toBeGreaterThan(0);
  expect(invoice.total).toBeGreaterThan(0);
  const expectedSubtotal = products.reduce(
    (total, product, index) => total + product.price * expectedItems[index].quantity,
    0,
  );
  expect(invoice.subtotal).toBeCloseTo(expectedSubtotal, 2);
  expect(invoice.total).toBe(invoice.subtotal);
});
