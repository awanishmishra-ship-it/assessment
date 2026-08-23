const { BasePage } = require('./basePage');
const { expect } = require('@playwright/test');

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
    await this.searchButton.click();
  }

  productByName(productName) {
    return this.page.getByText(productName, { exact: true }).first();
  }

  async openProduct(productName) {
    await this.search(productName);
    await expect(this.productByName(productName)).toBeVisible();
    await this.productCards.filter({ hasText: productName }).first().click();
    await this.page.waitForURL(/\/product\//);
  }
}

module.exports = { CatalogPage };
