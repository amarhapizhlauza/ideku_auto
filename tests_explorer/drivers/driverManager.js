const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');
const chrome = require("selenium-webdriver/chrome");

/** Builds WebDriver object for tests */
let chromeOptions = new chrome.Options();
chromeOptions.addArguments("--disable-notifications");
chromeOptions.addArguments("--ignore-certificate-errors");
chromeOptions.addArguments("--ignore-ssl-errors");
chromeOptions.excludeSwitches("enable-automation");
// chromeOptions.setUserPreferences({
//     "download.default_directory": "D:\\Test",
// });

let buildDriver = function (browser) {
    return new webdriver.Builder()
        .forBrowser(browser)
        .setChromeOptions(chromeOptions)
        .build()
};

module.exports.buildDriver = buildDriver;

