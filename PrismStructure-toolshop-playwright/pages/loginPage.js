const { BasePage } = require('./basePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-submit');
    this.loginError = page.getByTestId('login-error').or(page.getByRole('alert'));
    this.accountMenu = page.getByTestId('nav-menu');
    this.registerLink = page.getByTestId('register-link');
  }

  async open() {
    await super.open('/auth/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
