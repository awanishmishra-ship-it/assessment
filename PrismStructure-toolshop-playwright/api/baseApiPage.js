class BaseApiPage {
  constructor(request) {
    this.request = request;
  }

  authorizationHeader(token) {
    if (!token) {
      throw new Error('A bearer token is required for this API operation.');
    }

    return { Authorization: `Bearer ${token}` };
  }
}

module.exports = { BaseApiPage };
