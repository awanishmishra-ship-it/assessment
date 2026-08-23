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
    const card = this.productCards.filter({ hasText: productName }).first();
    await expect(card).toBeVisible();
    await card.click();
    await this.page.waitForURL(/\/product\//);
    await expect(this.page.getByTestId('product-name')).toHaveText(productName);
  }
}

module.exports = { CatalogPage };
