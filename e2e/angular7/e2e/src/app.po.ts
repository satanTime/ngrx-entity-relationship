import {browser, by, element, promise} from 'protractor';

export class AppPage {
    navigateTo(): promise.Promise<unknown> {
        return browser.get(browser.baseUrl) as Promise<unknown>;
    }

    getAppEntity(): promise.Promise<string> {
        return element(by.css('app-entity')).getText();
    }
}
