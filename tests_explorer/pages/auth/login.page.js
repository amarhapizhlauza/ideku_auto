// Harus selalu ada
const basePage = require(process.cwd() + '/tests_explorer/pages/basePage')
const {webdriver, Builder, By, Key, until} = require('selenium-webdriver')

// Page Locators
const LOGO = By.xpath('//img[@alt="company-branding"]')
const USERNAME_TEXT_FIELD = By.xpath('//input[@name="username"]')
const PASSWORD_TEXT_FIELD = By.xpath('//input[@name="password"]')
const LOGIN_BUTTON = By.xpath('//button[@type="submit"]')
const REQUIRED_BUTTON = By.xpath('//span[text()="Required"]')
const CHECK_DASHBOARD = By.xpath('//img[@alt="client brand banner"]')
const INVALID_CREDENTIAL = By.xpath('//p[text()="Invalid credentials"]')

// Page Actions
class loginPage extends basePage {

  async isLoaded() {
    await this.waitForDisplayed(LOGO)
    await this.waitForDisplayed(USERNAME_TEXT_FIELD)
    await this.waitForDisplayed(PASSWORD_TEXT_FIELD)
    await this.waitForDisplayed(LOGIN_BUTTON)
  }

  async login(username, pass) {
    await this.sendKeys(USERNAME_TEXT_FIELD, username)
    await this.sendKeys(PASSWORD_TEXT_FIELD, pass)
    await this.click(LOGIN_BUTTON)
  }

  async checkRequired() {
    await this.waitForDisplayed(REQUIRED_BUTTON)
    return this.getText(REQUIRED_BUTTON)
  }

  async checkDashboard() {
    await this.waitForDisplayed(CHECK_DASHBOARD)
  }

  async checkFailed() {
    await this.waitForDisplayed(INVALID_CREDENTIAL)
    return this.getText(INVALID_CREDENTIAL)
  }
}

module.exports = loginPage;