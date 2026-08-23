const { BaseApiPage } = require('./baseApiPage');

class ProductsApiPage extends BaseApiPage {
  getProducts(params = {}) {
    return this.request.get('/products', { params });
  }

  getProduct(productId) {
    return this.request.get(`/products/${productId}`);
  }
}

module.exports = { ProductsApiPage };
