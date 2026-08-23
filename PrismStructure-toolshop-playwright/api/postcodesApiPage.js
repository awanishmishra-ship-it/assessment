const { BaseApiPage } = require('./baseApiPage');

class PostcodesApiPage extends BaseApiPage {
  lookup({ country, postcode, houseNumber }) {
    return this.request.get('/postcode-lookup', {
      params: {
        country,
        postcode,
        house_number: houseNumber,
      },
    });
  }
}

module.exports = { PostcodesApiPage };
