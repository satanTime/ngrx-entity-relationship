process.on('infrastructure_error', error => {
    console.error('infrastructure_error', error);
});

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        frameworks: ['jasmine', 'karma-typescript'],
        files: [{pattern: 'src/**/*.ts'}, {pattern: 'test/**/*.ts'}],
        preprocessors: {
            '**/*.ts': ['karma-typescript'],
        },
        client: {
            clearContext: false,
        },
        reporters: ['dots', 'junit', 'coverage'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox'],
            },
        },
        karmaTypescriptConfig: {
            tsconfig: 'tsconfig.spec.json',
        },
        coverageReporter: {
            dir: '../../test-reports/coverage',
            reporters: [
                {
                    type: 'lcov',
                    subdir: 'lcov',
                },
                {
                    type: 'html',
                    subdir: 'html',
                },
            ],
        },
        junitReporter: {
            outputDir: require('path').join(__dirname, '../../test-reports'),
            outputFile: 'specs-junit.xml',
            useBrowserName: false,
        },
    });
};
