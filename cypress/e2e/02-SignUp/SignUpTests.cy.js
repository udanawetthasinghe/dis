import SignUpPageActions from '../../PageObjects/PageActions/SignUpPage/SignUpPageActions.js'

const signUpPageActions = new SignUpPageActions();

let signUpData;

before(() => {
  cy.fixture('signUp').then(data => {
    signUpData = data;
  });
});

describe('User sign-up functionality', () => {
    it('should general user sign up successfully with valid details', () => {
      cy.visit('/');
  
      //Test Steps
      signUpPageActions.clickSignUpButton();
      signUpPageActions.typeName(signUpData.nameGeneralUser);
      signUpPageActions.typeEmail(signUpData.emailGeneralUser);
      signUpPageActions.typePassword(signUpData.passwordGeneralUser);
      signUpPageActions.typeConfirmPassword(signUpData.confirmPasswordGeneralUser);
      signUpPageActions.selectUserCategory('General User');
      signUpPageActions.clickRegisterButton();

      //Assertion
      // Ensure the variable is properly referenced
      signUpPageActions.assertSuccessPopupMessage(`Welcome ${signUpData.nameGeneralUser}, Account created successfully - Please login here`);
    })

    it('should researcher sign up successfully with valid details', () => {
      cy.visit('/');
  
      //Test Steps
      signUpPageActions.clickSignUpButton();
      signUpPageActions.typeName(signUpData.nameResearcherUser);
      signUpPageActions.typeEmail(signUpData.emailResearcherUser);
      signUpPageActions.typePassword(signUpData.passwordResearcherUser);
      signUpPageActions.typeConfirmPassword(signUpData.confirmPasswordResearcherUser);
      signUpPageActions.selectUserCategory('Researcher');
      signUpPageActions.clickRegisterButton();

      //Assertion
      signUpPageActions.assertSuccessPopupMessage(`Welcome ${signUpData.nameResearcherUser}, Account created successfully - Please login here`);
    })
  })