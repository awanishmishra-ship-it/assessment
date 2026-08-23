const { BasePage } = require('./basePage');
const { expect } = require('@playwright/test');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productName = page.getByTestId('product-name');
    this.quantityInput = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.cartQuantity = page.getByTestId('cart-quantity');
    this.outOfStockMessage = page.getByTestId('out-of-stock');
  }

  async addToCart(quantity = 1, expectedCartQuantity) {
    await expect(this.addToCartButton).toBeEnabled();
    await this.quantityInput.fill(String(quantity));

    const itemAdded = this.page.waitForResponse((response) => {
      const { pathname } = new URL(response.url());
      return (
        /\/carts\/[^/]+$/.test(pathname) &&
        response.request().method() === 'POST' &&
        response.ok()
      );
    });

    await this.addToCartButton.click();
    await itemAdded;

    if (expectedCartQuantity !== undefined) {
      await expect(this.cartQuantity).toHaveText(String(expectedCartQuantity));
    }
  }
}

module.exports = { ProductPage };
