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

    clickSignInButton() {
        cy.get(Locators.submitBtn).click();
    }
}
export default SignInPageActions;
