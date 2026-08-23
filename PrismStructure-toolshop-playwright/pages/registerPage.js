const { BasePage } = require('./basePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.dobInput = page.getByTestId('dob');
    this.countrySelect = page.getByTestId('country');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.houseNumberInput = page.getByTestId('house_number');
    this.streetInput = page.getByTestId('street');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.phoneInput = page.getByTestId('phone');
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.registerButton = page.getByTestId('register-submit');
    this.registerError = page.getByRole('alert');
  }

  async open() {
    await super.open('/auth/register');
  }

  async register(user) {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.dobInput.fill(user.dob);
    await this.countrySelect.selectOption(user.country);
    await this.postalCodeInput.fill(user.postalCode);
    await this.houseNumberInput.fill(user.houseNumber);
    await this.streetInput.fill(user.street);
    await this.cityInput.fill(user.city);
    await this.stateInput.fill(user.state);
    await this.phoneInput.fill(user.phone);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };
