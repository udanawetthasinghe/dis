describe('Login', () => {
  it('with', () => {
    cy.visit('http://localhost:3000/')
  //Assertion
  cy.get('[data-testid="mainImage"]').should('be.visible');
  cy.get('[data-testid="signInBtn"]').should('be.visible');
  cy.get('[data-testid="signUpBtn"]').should('be.visible');
  })
})