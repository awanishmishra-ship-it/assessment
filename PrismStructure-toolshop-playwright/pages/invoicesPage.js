const { BasePage } = require('./basePage');

class InvoicesPage extends BasePage {
  constructor(page) {
    super(page);
    this.accountMenu = page.getByTestId('nav-menu');
    this.myInvoicesLink = page.getByTestId('nav-my-invoices');
    this.pageTitle = page.getByTestId('page-title');
    this.invoiceNumber = page.getByTestId('invoice-number');
    this.total = page.locator('#total');
    this.paymentMethod = page.getByTestId('payment-method');
  }

  invoiceRow(invoiceNumber) {
    return this.page.getByRole('row').filter({ hasText: invoiceNumber });
  }

  productRow(productName) {
    return this.page.getByRole('row').filter({ hasText: productName });
  }

  async open() {
    await this.accountMenu.click();
    await this.myInvoicesLink.click();
  }

  async openInvoice(invoiceNumber) {
    await this.invoiceRow(invoiceNumber).getByRole('link').click();
  }
}

module.exports = { InvoicesPage };
