const { test, expect } = require('../../fixtures/testFixtures');
const testData = require('../../testdata/toolshopData');

test('TC-API-01 @Smoke products can be retrieved', async ({ productsApi }) => {
  const response = await productsApi.getProducts({
    between: 'price,1,100',
    by_name: testData.products.primary,
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: expect.stringContaining('Claw Hammer') }),
    ]),
  );
});

test('TC-API-02 @Regression unknown product returns not found', async ({
  productsApi,
}) => {
  const response = await productsApi.getProduct('unknown-product-id');

  expect(response.status()).toBe(404);
});
