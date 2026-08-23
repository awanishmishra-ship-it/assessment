const { test: base, expect } = require('@playwright/test');
const { AuthApiPage } = require('../api/authApiPage');
const { ProductsApiPage } = require('../api/productsApiPage');
const { CatalogPage } = require('../pages/catalogPage');
const { LoginPage } = require('../pages/loginPage');
const { RegisterPage } = require('../pages/registerPage');

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  authApi: async ({ request }, use) => {
    await use(new AuthApiPage(request));
  },
  productsApi: async ({ request }, use) => {
    await use(new ProductsApiPage(request));
  },
});

module.exports = { expect, test };
