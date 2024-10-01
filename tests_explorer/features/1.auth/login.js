// Harus selalu ada
require(process.cwd() + '/tests_explorer/base')

// Initialize variable driver
let driver

// Initialize page that we using
const initial = require(process.cwd() + '/tests_explorer/features/initial') // Harus selalu ada
  , loginPage = require(process.cwd() + '/tests_explorer/pages/auth/login.page')
  
// Tests suites
describe('Authentication', function () {
  beforeEach(async function () {
    driver = await initial.load('chrome', process.env.URL_LOGIN)
    const LoginPage = new loginPage(driver)
    await LoginPage.isLoaded()
  })

  // Tests cases
  it('Login successfull', async function () {
    const LoginPage = new loginPage(driver)
    await LoginPage.login("Admin", "admin123")
    await LoginPage.checkDashboard()
  })

  it('Login without Username', async function () {
    const LoginPage = new loginPage(driver)
    await LoginPage.login("", "admin123")
    let result = await LoginPage.checkRequired()
    result.should.equal("Required")
  })

  it('Login without Password', async function () {
    const LoginPage = new loginPage(driver)
    await LoginPage.login("Admin", "")
    let result = await LoginPage.checkRequired()
    result.should.equal("Required")
  })

  it('Login failed', async function () {
    const LoginPage = new loginPage(driver)
    await LoginPage.login("asd", "asd")
    let result = await LoginPage.checkFailed()
    result.should.equal("Invalid credentials")
  })

  // Screenshot of failed test
  afterEach(async function () {
    if (this.currentTest.state == 'failed') {
      let fileName = generate.uniqueByDate('yyyyMMddHHmmss')
      let image = await driver.takeScreenshot()
      await fsp.writeFile('Reports/screenshots/' + fileName + '.jpg', image, 'base64')
      let imageFileName = fileName + '.jpg';
      
      addContext(this, 'Screenshot of failed test')
      addContext(this, '../screenshots/' + imageFileName)
    }
  })

  // Close driver
  afterEach(async function () {
    await driver.close();
    await driver.quit();
  })
})
