const { BaseApiPage } = require('./baseApiPage');

class InvoicesApiPage extends BaseApiPage {
  createInvoice(token, invoice) {
    return this.request.post('/invoices', {
      headers: this.authorizationHeader(token),
      data: {
        billing_street: invoice.billingStreet,
        billing_city: invoice.billingCity,
        billing_state: invoice.billingState,
        billing_country: invoice.billingCountry,
        billing_postal_code: invoice.billingPostalCode,
        payment_method: invoice.paymentMethod,
        payment_details: invoice.paymentDetails,
        cart_id: invoice.cartId,
      },
    });
  }
}

module.exports = { InvoicesApiPage };
