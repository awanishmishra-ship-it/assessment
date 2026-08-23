const { test, expect } = require('../../fixtures/testFixtures');
test('TC-API-01 @smoke products can be retrieved', async ({ productsApi }) => {
  const response = await productsApi.getProducts({
    between: 'price,1,100',
    sort: 'name,asc',
  });

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
  body.data.forEach((product) => {
    expect(product).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number),
      }),
    );
    expect(product.price).toBeGreaterThanOrEqual(1);
    expect(product.price).toBeLessThanOrEqual(100);
  });
});

test('TC-API-02 @regression unknown product returns not found', async ({
  productsApi,
}) => {
  const response = await productsApi.getProduct('unknown-product-id');

  expect(response.status()).toBe(404);
});
