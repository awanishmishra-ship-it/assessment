const { BasePage } = require('./basePage');

class CatalogPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.productCards = page.locator('a[data-test^="product-"]');
  }

  async open() {
    await super.open('/');
  }

  async search(productName) {
    await this.searchInput.fill(productName);
    await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.url().includes('/products') && response.request().method() === 'GET',
      ),
      this.searchButton.click(),
    ]);
  }

  productByName(productName) {
    return this.page.getByText(productName, { exact: true }).first();
  }

  async openProduct(productName) {
    await this.search(productName);
    await this.productCards.filter({ hasText: productName }).first().click();
    await this.page.waitForURL(/\/product\//);
  }
}

module.exports = { CatalogPage };
