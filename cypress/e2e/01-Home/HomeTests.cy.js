import Locators from '../../PageObjects/PageElements/HomeLocators.json';

describe('Home Page Load Test', () => {
  it('should load the home page and display main elements', () => {
    cy.visit('/');
  //Assertion
  cy.get(Locators.mainImage).should('be.visible');
  cy.get(Locators.signInBtn).should('be.visible');
  cy.get(Locators.signUpBtn).should('be.visible');
  })
})