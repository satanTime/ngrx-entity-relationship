import {AppPage} from './app.po';
import {browser, logging} from 'protractor';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display blocks', async () => {
        page.navigateTo();
        const content = await page.getAppEntity();
        expect(content).toContain('userAll:');
        expect(content).toContain('user1:');
        expect(content).toContain('user2:');

        expect(content).toContain('companyAll:');
        expect(content).toContain('company3:');
        expect(content).toContain('company4:');

        expect(content).toContain('addressAll:');
        expect(content).toContain('address5:');
        expect(content).toContain('address6:');
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(
            jasmine.objectContaining({
                level: logging.Level.SEVERE,
            } as logging.Entry),
        );
    });
});
