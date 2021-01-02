import {browser, by, element} from 'protractor';

export class AppPage {
    navigateTo() {
        return browser.get(browser.baseUrl);
    }

    getCompany() {
        return element(by.css('[role="company"]')).getText();
    }

    getUsers() {
        return element(by.css('[role="users"]')).getText();
    }

    clickButton(role: string) {
        return element(by.css(`button[role="${role}"]`)).click();
    }
}
