const { test, expect } = require('../../fixtures/testFixtures');
const testData = require('../../testdata/toolshopData');
const { uniqueUser } = require('../../utils/dataFactory');

test('TC-UI-06 @regression require a postal code before payment', async ({
  authApi,
  cartPage,
  catalogPage,
  checkoutPage,
  loginPage,
  productPage,
}) => {
  test.setTimeout(90_000);
  const user = uniqueUser();

  const registration = await authApi.register(user);
  expect(registration.status()).toBe(201);

  await loginPage.open();
  await loginPage.login(user.email, user.password);
  await expect(loginPage.accountMenu).toBeVisible({ timeout: 20_000 });

  await catalogPage.open();
  await catalogPage.openProduct(testData.products.primary);
  await productPage.addToCart(1, 1);

  await cartPage.open();
  await cartPage.proceed();
  await checkoutPage.continueAsLoggedInUser();

  await checkoutPage.postalCode.clear();
  await checkoutPage.postalCode.blur();

  await expect(checkoutPage.postalCode).toHaveValue('');
  await expect(checkoutPage.proceedFromAddress).toBeDisabled();
  await expect(checkoutPage.paymentMethod).not.toBeVisible();
});
