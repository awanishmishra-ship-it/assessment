function uniqueEmail(prefix = 'qa.ui') {
  return `${prefix}.${Date.now()}.${process.pid}@example.com`;
}

function uniqueUser() {
  const stamp = `${Date.now()}${process.pid}`.slice(-8);

  return {
    firstName: 'Test',
    lastName: `User${stamp}`,
    dob: '1992-05-15',
    country: 'US',
    postalCode: '10001',
    houseNumber: '42',
    street: '101 Testing Way',
    city: 'New York',
    state: 'NY',
    phone: '5555555555',
    email: uniqueEmail(),
    password: `Qa#${stamp}Aa1`,
  };
}

function invalidLoginUser() {
  return {
    email: uniqueEmail('qa.invalid'),
    password: 'WrongPass!1',
  };
}

module.exports = { invalidLoginUser, uniqueEmail, uniqueUser };
