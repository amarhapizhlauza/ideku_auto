const DriverManager = require(process.cwd() + '/tests_explorer/drivers/driverManager')

/* Function login yang akan dipanggil di before di dalam describe */
async function load(browser, url) {
    let driver = DriverManager.buildDriver(browser)
    driver.manage().window().maximize()
    driver.get(url)
    
    return driver
}

module.exports = {
   load
}