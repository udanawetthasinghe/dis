import Locators from '../../PageObjects/PageElements/HomeLocators.json';

describe('Login', () => {
  it('with', () => {
    cy.visit('http://localhost:3000/')
  //Assertion
  cy.get(Locators.mainImage).should('be.visible');
  cy.get(Locators.signInBtn).should('be.visible');
  cy.get(Locators.signUpBtn).should('be.visible');
  })
})