module.exports = function (config) {
    config.set({
        frameworks: ['jasmine', 'karma-typescript'],
        files: [{pattern: 'test/**/*.ts'}],
        preprocessors: {
            '**/*.ts': ['karma-typescript'],
        },
        reporters: ['dots'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        browsers: ['ChromeHeadless'],
        karmaTypescriptConfig: {
            include: ['test/**/*.ts'],
            tsconfig: 'tsconfig.json',
        },
    });
};
