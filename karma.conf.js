// Karma configuration
// Generated on Sun Feb 11 2018 02:31:49 GMT+0530 (India Standard Time)

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: "",


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ["mocha", "chai"],


		// list of files / patterns to load in the browser
		// overridden by grunt config
		files: [
			"src/**/*.js",
			"test/**/*.js",
			"bower_components/**/*.js"
		],


		// list of files / patterns to exclude
		exclude: [],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		// overridden by grunt config
		preprocessors: {
			"src/**/*.js": "coverage"
		},


		// test results reporter to use
		// possible values: "dots", "progress"
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ["progress", "coverage"],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ["PhantomJS"],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		// overridden by grunt config
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		// mocha test output
		client: {
			mocha: {
				// change Karma's debug.html to the mocha web reporter
				reporter: "html"
			}
		}
	});
}
