const { BasePage } = require('./basePage');
const { expect } = require('@playwright/test');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productName = page.getByTestId('product-name');
    this.quantityInput = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.cartQuantity = page.getByTestId('cart-quantity');
  }

  async addToCart(quantity = 1, expectedCartQuantity) {
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();

    if (expectedCartQuantity !== undefined) {
      await expect(this.cartQuantity).toHaveText(String(expectedCartQuantity));
    }
  }
}

module.exports = { ProductPage };
