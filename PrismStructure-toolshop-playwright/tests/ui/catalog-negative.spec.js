const { test, expect } = require('../../fixtures/testFixtures');
const testData = require('../../testdata/toolshopData');

test('TC-UI-04 @regression show an empty result for an unknown product', async ({
  catalogPage,
}) => {
  await catalogPage.open();
  await catalogPage.search(`no-product-${Date.now()}`);

  await expect(catalogPage.productCards).toHaveCount(0);
});

test('TC-UI-05 @regression prevent adding an out-of-stock product', async ({
  catalogPage,
  productPage,
}) => {
  const productName = testData.products.outOfStock;

  await catalogPage.open();
  await catalogPage.openProduct(productName);

  await expect(productPage.productName).toHaveText(productName);
  await expect(productPage.outOfStockMessage).toBeVisible();
  await expect(productPage.addToCartButton).toBeDisabled();
});
