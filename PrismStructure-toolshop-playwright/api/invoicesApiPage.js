const { BaseApiPage } = require('./baseApiPage');

class InvoicesApiPage extends BaseApiPage {
  createInvoice(token, invoice = {}, options = {}) {
    const headers = options.omitAuth
      ? undefined
      : this.authorizationHeader(token);

    return this.request.post('/invoices', {
      headers,
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
