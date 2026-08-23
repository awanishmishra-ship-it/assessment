const { BaseApiPage } = require('./baseApiPage');

class AuthApiPage extends BaseApiPage {
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
