const HomeLocators = require('../../../PageObjects/PageElements/HomeLocators.json');
const Locators = require('../../../PageObjects/PageElements/SignUpLocators.json');

export class SignUpPageActions {
    clickSignUpButton() {
        cy.get(HomeLocators.signUpBtn).click();
    }

    typeName(typeName) {
        cy.get(Locators.name).type(typeName);
    }

    typeEmail(typeEmail) {
        cy.get(Locators.email).type(typeEmail);
    }

    typePassword(typePassword) {
        cy.get(Locators.password).type(typePassword);
    }

    typeConfirmPassword(typeConfirmPassword) {
        cy.get(Locators.confirmPassword).type(typeConfirmPassword);
    }

    selectUserCategory(userType) {
        cy.get(Locators.userCategory).check(userType);
    }

    clickRegisterButton() {
        cy.get(Locators.registerBtn).click();
    }

    assertSuccessPopupMessage(enterExpectedMessage) {
        cy.get(Locators.successPopup)
          .should('be.visible')
          .and('contain.text', enterExpectedMessage);
    }

    assertErrorPopupMessage(enterExpectedMessage) {
        cy.get(Locators.errorPopup)
          .should('be.visible')
          .and('contain.text', enterExpectedMessage);
    } 
}
export default SignUpPageActions;
