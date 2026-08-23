const { expect } = require('@playwright/test');
const { BasePage } = require('./basePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.proceedFromLogin = page.getByTestId('proceed-2');
    this.proceedFromAddress = page.getByTestId('proceed-3');
    this.country = page.getByTestId('country');
    this.postalCode = page.getByTestId('postal_code');
    this.houseNumber = page.getByTestId('house_number');
    this.street = page.getByTestId('street');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.paymentMethod = page.getByTestId('payment-method');
    this.confirmButton = page.getByTestId('finish');
    this.paymentSuccess = page.getByTestId('payment-success-message');
    this.orderConfirmation = page.locator('#order-confirmation');
  }

  async continueAsLoggedInUser() {
    await expect(this.proceedFromLogin).toBeEnabled();
    await this.proceedFromLogin.click();
  }

  async fillAddress(user) {
    await this.country.selectOption({ value: user.country });
    await this.postalCode.fill(user.postalCode);

    const postcodeLookup = this.page.waitForResponse(
      (response) => /postcode/i.test(response.url()),
      { timeout: 10_000 },
    );
    await this.houseNumber.fill(user.houseNumber);
    await postcodeLookup;

    await expect(this.street).not.toHaveValue('');
    await expect(this.city).not.toHaveValue('');
    await expect(this.state).not.toHaveValue('');
  }

  async continueWithAddress(user) {
    await this.fillAddress(user);
    await expect(this.proceedFromAddress).toBeEnabled();
    await this.proceedFromAddress.click();
  }

  async selectPayment(method) {
    await this.paymentMethod.selectOption(method);
    await expect(this.confirmButton).toBeEnabled();
  }

  async confirmTwice() {
    const paymentCheck = this.page.waitForResponse(
      (response) =>
        response.url().includes('/payment/check') &&
        response.request().method() === 'POST',
    );
    await this.confirmButton.click();
    await paymentCheck;
    await expect(this.paymentSuccess).toBeVisible();

    const invoiceCreation = this.page.waitForResponse(
      (response) =>
        /\/invoices$/.test(new URL(response.url()).pathname) &&
        response.request().method() === 'POST',
      { timeout: 15_000 },
    );
    await this.confirmButton.click();
    const invoiceResponse = await invoiceCreation;
    if (invoiceResponse.status() !== 201) {
      throw new Error(
        `Invoice creation failed (${invoiceResponse.status()}): ${await invoiceResponse.text()}`,
      );
    }
    await expect(this.orderConfirmation).toBeVisible({ timeout: 15_000 });

    const confirmationText = await this.orderConfirmation.innerText();
    const invoiceNumber = confirmationText.match(/INV-\d+/)?.[0];
    if (!invoiceNumber) {
      throw new Error(`Invoice number missing from confirmation: ${confirmationText}`);
    }

    return invoiceNumber;
  }
}

module.exports = { CheckoutPage };
