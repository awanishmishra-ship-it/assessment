const { BasePage } = require('./basePage');

function currencyValue(text) {
  return Number(text.replace(/[^0-9.-]/g, ''));
}

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartLink = page.getByTestId('nav-cart');
    this.subtotal = page.getByTestId('cart-subtotal');
    this.total = page.getByTestId('cart-total');
    this.proceedButton = page.getByTestId('proceed-1');
  }

  rowFor(productName) {
    return this.page
      .getByRole('row')
      .filter({ has: this.page.getByTestId('product-title').filter({ hasText: productName }) });
  }

  quantityFor(productName) {
    return this.rowFor(productName).getByTestId('product-quantity');
  }

  unitPriceFor(productName) {
    return this.rowFor(productName).getByTestId('product-price');
  }

  linePriceFor(productName) {
    return this.rowFor(productName).getByTestId('line-price');
  }

  async open() {
    await this.cartLink.click();
  }

  async updateQuantity(productName, quantity) {
    const input = this.quantityFor(productName);
    await input.fill(String(quantity));
    await input.press('Tab');
  }

  async readMoney(locator) {
    const text = await locator.evaluate((element) =>
      element instanceof HTMLInputElement ? element.value : element.textContent,
    );
    return currencyValue(text);
  }

  async proceed() {
    await this.proceedButton.click();
  }
}

module.exports = { CartPage, currencyValue };
