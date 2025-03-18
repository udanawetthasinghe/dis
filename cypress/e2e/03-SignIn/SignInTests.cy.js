import SignInPageActions from '../../PageObjects/PageActions/SignInPage/SignInPageActions.js'

const signInPageActions = new SignInPageActions();

let signInData;
let signUpData;

before(() => {
  cy.fixture('signIn').then(data => {
    signInData = data;
  });
  cy.fixture('signUp').then(data => {
    signUpData = data;
  });
});

describe('User sign-in functionality', () => {
  it('should display an error message when signing in with invalid credentials', () => {
    cy.visit('/');

    //Test Steps
    signInPageActions.clickSignInButton();
    signInPageActions.typeEmail(signInData.emailInvalid);
    signInPageActions.typePassword(signInData.passwordIncorrect);
    signInPageActions.clickSignInFormButton();

    //Assertion
    signInPageActions.assertPopupMessage('Invalid email or password');
  })

  it('should general user sign in successfully with valid credentials', () => {
    cy.visit('/');

    //Test Steps
    signInPageActions.clickSignInButton();
    signInPageActions.typeEmail(signUpData.emailGeneralUser);
    signInPageActions.typePassword(signUpData.passwordGeneralUser);
    signInPageActions.clickSignInFormButton();

    //Assertion
    signInPageActions.assertSiginSuccess(signUpData.nameGeneralUser);
  })

  it('should display an error message when signing in with not activated resercher user', () => {
    cy.visit('/');

    //Test Steps
    signInPageActions.clickSignInButton();
    signInPageActions.typeEmail(signUpData.emailResearcherUser);
    signInPageActions.typePassword(signUpData.passwordResearcherUser);
    signInPageActions.clickSignInFormButton();

    //Assertion
    signInPageActions.assertPopupMessage('Still your account is not activated');
  })
after(() => {
  cy.deleteTestUsers(); // Calls the custom command to delete test users
  })
});