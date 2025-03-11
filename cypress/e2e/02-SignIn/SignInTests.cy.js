import SignInPageActions from '../../PageObjects/PageActions/SignInPage/SignInPageActions.js'

const signInPageActions = new SignInPageActions();

let signInData;

before(() => {
  cy.fixture('signIn').then(data => {
    signInData = data;
  });
});

describe('Login', () => {
  it('with', () => {
    cy.visit('http://localhost:3000/')

    //Test Steps
    signInPageActions.clickSignInButton();
    signInPageActions.typeEmail(signInData.email);
    signInPageActions.typePassword(signInData.password);
  })
})