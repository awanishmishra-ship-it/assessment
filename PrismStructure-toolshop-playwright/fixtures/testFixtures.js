const { test: base, expect } = require('@playwright/test');
const { AuthApiPage } = require('../api/authApiPage');
const { CartsApiPage } = require('../api/cartsApiPage');
const { InvoicesApiPage } = require('../api/invoicesApiPage');
const { PostcodesApiPage } = require('../api/postcodesApiPage');
const { ProductsApiPage } = require('../api/productsApiPage');
const { CartPage } = require('../pages/cartPage');
const { CatalogPage } = require('../pages/catalogPage');
const { CheckoutPage } = require('../pages/checkoutPage');
const { InvoicesPage } = require('../pages/invoicesPage');
const { LoginPage } = require('../pages/loginPage');
const { ProductPage } = require('../pages/productPage');
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
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  invoicesPage: async ({ page }, use) => {
    await use(new InvoicesPage(page));
  },
  authApi: async ({ request }, use) => {
    await use(new AuthApiPage(request));
  },
  cartsApi: async ({ request }, use) => {
    await use(new CartsApiPage(request));
  },
  invoicesApi: async ({ request }, use) => {
    await use(new InvoicesApiPage(request));
  },
  postcodesApi: async ({ request }, use) => {
    await use(new PostcodesApiPage(request));
  },
  productsApi: async ({ request }, use) => {
    await use(new ProductsApiPage(request));
  },
});

module.exports = { expect, test };
