const { BaseApiPage } = require('./baseApiPage');

class CartsApiPage extends BaseApiPage {
  createCart() {
    return this.request.post('/carts');
  }

  addItem(cartId, item) {
    return this.request.post(`/carts/${cartId}`, {
      data: {
        product_id: item.productId,
        quantity: item.quantity,
      },
    });
  }

  getCart(cartId) {
    return this.request.get(`/carts/${cartId}`);
  }
}

module.exports = { CartsApiPage };
