import SignUpPageActions from '../../PageObjects/PageActions/SignUpPage/SignUpPageActions.js'

const signUpPageActions = new SignUpPageActions();

let signUpData;

before(() => {
  cy.fixture('signUp').then(data => {
    signUpData = data;
  });
});

describe('User Sign-Up Functionality', () => {
    it('should sign up successfully with valid credentials', () => {
      cy.visit('/');
  
      //Test Steps
      signUpPageActions.clickSignUpButton();
      signUpPageActions.typeName(signUpData.name);
      signUpPageActions.typeEmail(signUpData.email);
      signUpPageActions.typePassword(signUpData.password);
      signUpPageActions.typeConfirmPassword(signUpData.confirmPassword);
      signUpPageActions.selectUserCategory('General User');
      signUpPageActions.clickRegisterButton();
    })
  })