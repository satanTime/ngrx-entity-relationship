import {browser, by, element} from 'protractor';

export class AppPage {
    navigateTo() {
        return browser.get(browser.baseUrl);
    }

    getAppEntity() {
        return element(by.css('app-entity')).getText();
    }
}
