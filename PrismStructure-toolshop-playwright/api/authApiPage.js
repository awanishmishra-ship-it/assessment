const { BaseApiPage } = require('./baseApiPage');
const { apiBaseUrl } = require('../utils/env');

class AuthApiPage extends BaseApiPage {
  register(user) {
    return this.request.post(`${apiBaseUrl}/users/register`, {
      data: {
        first_name: user.firstName,
        last_name: user.lastName,
        dob: user.dob,
        phone: user.phone,
        email: user.email,
        password: user.password,
        address: {
          street: user.street,
          city: user.city,
          state: user.state,
          country: user.country,
          postal_code: user.postalCode,
        },
      },
    });
  }

  login(credentials) {
    return this.request.post('/users/login', { data: credentials });
  }

  getCurrentUser(token) {
    return this.request.get('/users/me', {
      headers: this.authorizationHeader(token),
    });
  }
}

module.exports = { AuthApiPage };
