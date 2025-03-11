import SignInPageActions from '../../PageObjects/PageActions/SignInPage/SignInPageActions.js'

const signInPageActions = new SignInPageActions();

let signInData;

before(() => {
  cy.fixture('signIn').then(data => {
    signInData = data;
  });
});

describe('User Sign-In Functionality', () => {
  it('should sign in successfully with valid credentials', () => {
    cy.visit('/');

    //Test Steps
    signInPageActions.clickSignInButton();
    signInPageActions.typeEmail(signInData.email);
    signInPageActions.typePassword(signInData.password);
    signInPageActions.clickSignInFormButton();
  })
})