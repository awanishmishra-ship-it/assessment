const { BasePage } = require('./basePage');

class CatalogPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.productCards = page.locator('[data-test^="product-"]');
  }

  async open() {
    await super.open('/');
  }

  async search(productName) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  productByName(productName) {
    return this.page.getByText(productName, { exact: true }).first();
  }
}

module.exports = { CatalogPage };
