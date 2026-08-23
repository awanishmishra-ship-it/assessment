const { test, expect } = require('../../fixtures/testFixtures');
const testData = require('../../testdata/toolshopData');
const { uniqueUser } = require('../../utils/dataFactory');

test('TC-UI-03 @smoke @regression complete COD purchase and verify invoice', async ({
  authApi,
  cartPage,
  catalogPage,
  checkoutPage,
  invoicesPage,
  loginPage,
  page,
  productPage,
}) => {
  test.setTimeout(180_000);
  const user = uniqueUser();
  const { primary, secondary } = testData.products;

  const registration = await authApi.register(user);
  expect(registration.status()).toBe(201);

  await loginPage.open();
  await loginPage.login(user.email, user.password);
  await expect(page).toHaveURL(/\/account/, { timeout: 20_000 });
  await expect(loginPage.accountMenu).toBeVisible({ timeout: 20_000 });

  await catalogPage.open();
  await catalogPage.openProduct(primary);
  await expect(productPage.productName).toHaveText(primary);
  await productPage.addToCart(1, 1);

  await catalogPage.open();
  await catalogPage.openProduct(secondary);
  await expect(productPage.productName).toHaveText(secondary);
  await productPage.addToCart(1, 2);

  await cartPage.open();
  await expect(cartPage.rowFor(primary)).toBeVisible();
  await expect(cartPage.rowFor(secondary)).toBeVisible();

  const primaryUnitPrice = await cartPage.readMoney(
    cartPage.unitPriceFor(primary),
  );
  const secondaryLinePrice = await cartPage.readMoney(
    cartPage.linePriceFor(secondary),
  );

  await cartPage.updateQuantity(primary, 2);
  await expect(cartPage.quantityFor(primary)).toHaveValue('2');
  await expect
    .poll(() => cartPage.readMoney(cartPage.linePriceFor(primary)))
    .toBeCloseTo(primaryUnitPrice * 2, 2);

  const expectedSubtotal = primaryUnitPrice * 2 + secondaryLinePrice;
  await expect
    .poll(() => cartPage.readMoney(cartPage.total))
    .toBeCloseTo(expectedSubtotal, 2);
  const cartTotal = await cartPage.readMoney(cartPage.total);

  await cartPage.proceed();
  await checkoutPage.continueAsLoggedInUser();
  await checkoutPage.continueWithAddress(user);
  await checkoutPage.selectPayment(testData.checkout.paymentMethod);
  const invoiceNumber = await checkoutPage.confirmTwice();

  expect(invoiceNumber).toBeTruthy();

  await invoicesPage.open();
  await expect(invoicesPage.pageTitle).toContainText(/invoices/i);
  await expect(invoicesPage.invoiceRow(invoiceNumber)).toBeVisible();
  await invoicesPage.openInvoice(invoiceNumber);

  await expect(invoicesPage.invoiceNumber).toHaveValue(invoiceNumber);
  await expect(invoicesPage.paymentMethod).toHaveValue(/cash on delivery/i);
  await expect(invoicesPage.productRow(primary)).toContainText(primary);
  await expect(invoicesPage.productRow(primary)).toContainText('2');
  await expect(invoicesPage.productRow(secondary)).toContainText(secondary);
  await expect
    .poll(() => cartPage.readMoney(invoicesPage.total))
    .toBeCloseTo(cartTotal, 2);

  await expect(page).toHaveURL(/\/account\/invoices\/[a-z0-9]+$/);
});
