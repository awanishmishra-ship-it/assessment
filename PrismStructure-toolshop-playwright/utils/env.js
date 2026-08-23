const uiBaseUrl =
  process.env.UI_BASE_URL || 'https://practicesoftwaretesting.com';
const apiBaseUrl =
  process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com';

function getUserCredentials() {
  const email = process.env.TOOLSHOP_USER_EMAIL;
  const password = process.env.TOOLSHOP_USER_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Set TOOLSHOP_USER_EMAIL and TOOLSHOP_USER_PASSWORD before running authenticated tests.',
    );
  }

  return { email, password };
}

module.exports = {
  apiBaseUrl,
  getUserCredentials,
  uiBaseUrl,
};
