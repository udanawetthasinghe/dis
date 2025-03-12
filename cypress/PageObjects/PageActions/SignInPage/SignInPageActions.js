const HomeLocators = require('../../../PageObjects/PageElements/HomeLocators.json');
const Locators = require('../../../PageObjects/PageElements/SignInLocators.json');

export class SignInPageActions {
    clickSignInButton() {
        cy.get(HomeLocators.signInBtn).click();
    }

    typeEmail(typeEmailAddress) {
        cy.get(Locators.email).type(typeEmailAddress);
    }

    typePassword(typePassword) {
        cy.get(Locators.password).type(typePassword);
    }

    clickSignInFormButton() {
        cy.get(Locators.submitSigninBtn).click();
    }

    assertPopupMessage(enterExpectedMessage) {
        cy.get(Locators.errorPopup)
          .should('be.visible')
          .and('contain.text', enterExpectedMessage);
    }     
}
export default SignInPageActions;
