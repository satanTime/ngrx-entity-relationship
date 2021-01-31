// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('puppeteer').executablePath();

const {join} = require('path');
const {constants} = require('karma');

module.exports = () => {
    return {
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-chrome-launcher'),
            require('karma-coverage'),
            require('karma-ie-launcher'),
            require('karma-jasmine'),
            require('karma-jasmine-html-reporter'),
            require('karma-junit-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },
        coverageReporter: {
            dir: join(__dirname, 'test-reports/coverage'),
            reporters: [
                {
                    type: 'lcov',
                    subdir: 'lcov',
                },
            ],
        },
        junitReporter: {
            outputDir: join(__dirname, 'test-reports'),
            outputFile: 'specs-junit.xml',
            useBrowserName: false,
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: constants.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeCi'],
        customLaunchers: {
            ChromeCi: {
                base: 'ChromeHeadless',
                flags: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'],
            },
            IECi: {
                base: 'IE',
                flags: ['-extoff'],
            },
        },
        singleRun: true,
    };
};
