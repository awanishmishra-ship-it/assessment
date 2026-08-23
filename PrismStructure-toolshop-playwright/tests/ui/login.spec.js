const { test, expect } = require('../../fixtures/testFixtures');
const { invalidLoginUser, uniqueUser } = require('../../utils/dataFactory');

test('TC-UI-01 @Smoke register a unique user and log in', async ({
  registerPage,
  loginPage,
  page,
}) => {
  const user = uniqueUser();

  await registerPage.open();
  await registerPage.register(user);

  await expect(page).toHaveURL(/\/auth\/login/);

  await loginPage.login(user.email, user.password);

  await expect(page).toHaveURL(/\/account/);
  await expect(loginPage.accountMenu).toBeVisible();
  await expect(loginPage.accountMenu).toContainText(user.firstName);
});

test('TC-UI-02 @Regression reject login with invalid credentials', async ({
  loginPage,
  page,
}) => {
  const invalidUser = invalidLoginUser();

  await loginPage.open();
  await loginPage.login(invalidUser.email, invalidUser.password);

  await expect(loginPage.loginError).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(loginPage.accountMenu).toHaveCount(0);
});
