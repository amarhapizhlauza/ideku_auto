const { webdriver, Builder, By, Key, until, WebElement } = require('selenium-webdriver')
const util = require('util')
const generate = require(`${process.cwd()}/tests_explorer/utils/generate_data`)
const { exec } = require("child_process");
const fs = require('fs');
const https = require('https');

async function waitForLocated(driver, locator) {
  try {
    await driver.wait(until.elementLocated(locator), parseInt(process.env.TIMEOUT, 10))
    return
  } catch (err) {
    throw new Error(`Still not able to locate element ${locator.toString()} after maximum retries, Error message: ${err.message.toString()}`)
  }
}

async function waitForVisible(driver, locator) {
  try {
    const element = await driver.findElement(locator)
    await driver.wait(until.elementIsVisible(element), parseInt(process.env.TIMEOUT, 10))
    return
  } catch (err) {
    throw new Error(`Element ${locator.toString()} still not visible after maximum retries, Error message: ${err.message.toString()}`)
  }
}

class basePage {
  constructor(webdriver) {
    this.driver = webdriver
  }

  async visit(url) {
    try {
      await this.driver.get(url)
    } catch (err) {
      throw new Error(`Unable to open ${url}, error : ${err.message}`)
    }
  }

  async quit() {
    try {
      return await this.driver.quit()
    } catch (err) {
      throw new Error(`Unable to quit browser, error : ${err.message}`)
    }
  }

  async goToFrame(locator) {
    try {
      await this.driver.switchTo().frame(this.driver.findElement(locator))
    } catch (err) {
      throw new Error(`Still not able to switch to frame element ${locator.toString()}, Error message: ${err.message.toString()}`)
    }
  }

  async takeScreenshot(fileName) {
    let image = await this.driver.takeScreenshot()
    await fsp.writeFile('Reports/screenshots/' + fileName + '.jpg', image, 'base64')
  }

  async waitForDisplayed(locator) {
    try {
      await waitForLocated(this.driver, locator)
      await waitForVisible(this.driver, locator)
      return this.driver.findElement(locator)
    } catch (err) {
      throw new Error(`Unable to locate ${locator.toString()}, Error message: ${err.message.toString()}`)
    }
  }

  async isNotVisible(locator) {
    try {
      const element = await this.driver.findElement(locator)
      await this.driver.wait(until.elementIsNotVisible(element), parseInt(process.env.TIMEOUT, 10))
      return
    } catch (err) {
      throw new Error(`Element ${locator.toString()} still visible after maximum retries, Error message: ${err.message.toString()}`)
    }
  }

  async isElementExist(locator) {
    try {
      let findElement = await this.driver.findElements(locator)
      let isExist = findElement.length != 0
      let result
      if (isExist) { await this.waitForDisplayed(locator) }
      isExist ? result = true : result = false
      return result
    } catch (err) {
      throw new Error(`Unable to get element, error : ${err.message}`)
    }
  }

  async countElements(locator) {
    try {
      let findElements = await this.driver.findElements(locator)
      let result = findElements.length
      return result
    } catch (err) {
      throw new Error(`Unable to get elements, error : ${err.message}`)
    }
  }

  async scroll(locator, condition) {
    try {
      let check = condition == null || condition == undefined ? true : false

      const element = await this.driver.findElement(locator)
      this.driver.executeScript(`arguments[0].scrollIntoView(${check})`, element);
      return
    } catch (err) {
      throw new Error(`Unable to scroll to ${locator.toString()}, error : ${err.message}`)
    }
  }

  async scroll2(locator) {
    try {
      const element = await this.driver.findElement(locator)
      await this.driver.actions()
        .scroll(0, 0, 0, 0, element)
        .perform()

      return
    } catch (err) {
      throw new Error(`Unable to scroll to ${locator.toString()}, error : ${err.message}`)
    }
  }

  async removeContents(locator) {
    try {
      const element = await this.driver.findElement(locator)
      let del = Key.chord(Key.CONTROL, "a") + Key.DELETE;
      await element.sendKeys(del)
      return
    } catch (err) {
      throw new Error(`Unable to send keys to ${locator.toString()}, error : ${err.message}`)
    }
  }

  async clearInput(locator) {
    try {
      let element = await this.waitForDisplayed(locator)
      element.clear()
      return element
    } catch (error) {
      throw new Error(`Still not able to clear field ${locator.toString()}, Error message: ${err.message.toString()}`)
    }
  }

  async sendKeys(locator, keys) {
    try {
      const element = await this.driver.findElement(locator)
      await element.sendKeys(keys)
      return
    } catch (err) {
      throw new Error(`Unable to send keys to ${locator.toString()}, error : ${err.message}`)
    }
  }

  async sendKeys2(locator, keys) {
    try {
      const element = await this.driver.findElement(locator)
      await element.sendKeys(keys)
      const inputType = await element.getAttribute('type')
      if (inputType != 'file') {
        await this.driver.wait(async function () {
          let value = await element.getAttribute('value')
          return value == keys
        }, parseInt(process.env.TIMEOUT, 10))
      }
      return
    } catch (err) {
      throw new Error(
        `Unable to send keys to ${locator.toString()}, error : ${err.message}`
      )
    }
  }

  async selectDropdown(locator, keys) {
    try {
      const element = await this.driver.findElement(locator)
      await element.click()
      await element.sendKeys(keys)
      await element.click()
      return
    } catch (err) {
      throw new Error(`Unable to select dropdown to ${locator.toString()}, error : ${err.message}`)
    }
  }

  async selectSearchableDropdown(dropdown, searchfield, keys) {
    try {
      const element = await this.driver.findElement(dropdown)
      await element.click()
      const field = await this.driver.findElement(searchfield)
      await field.click()
      await field.sendKeys(keys)
      await field.click()
      return
    } catch (err) {
      throw new Error(`Unable to select dropdown to ${locator.toString()}, error : ${err.message}`)
    }
  }

  async getTitle() {
    try {
      const title = await this.driver.getTitle()
      return title
    } catch (err) {
      throw new Error(`Unable to get title, error : ${err.message}`)
    }
  }

  async getText(locator) {
    try {
      const element = await this.driver.findElement(locator)
      const text = await element.getText()
      return text
    } catch (err) {
      throw new Error(`Unable to get ${locator.toString()} text, error : ${err.message}`)
    }
  }

  async getAttribute(locator, attribute) {
    try {
      const element = await this.driver.findElement(locator)
      const text = await element.getAttribute(attribute)
      return text
    } catch (err) {
      throw new Error(`Unable to get ${locator.toString()} attribute, error : ${err.message}`)
    }
  }

  async isEnabled(locator) {
    try {
      const element = await this.driver.findElement(locator)
      const text = await element.isEnabled()
      return text
    } catch (err) {
      throw new Error(`Unable to get ${locator.toString()} enable or disable, error : ${err.message}`)
    }
  }

  async isSelected(locator) {
    try {
      const element = await this.driver.findElement(locator)
      const text = await element.isSelected()
      return text
    } catch (err) {
      throw new Error(`Unable to get ${locator.toString()} selected or not selected, error : ${err.message}`)
    }
  }

  async sleep(time) {
      await this.driver.sleep(time)
  }

  async click(locator) {
    try {
      const element = await this.driver.findElement(locator)
      await this.driver.wait(function () {
        return element.isDisplayed().then(function (displayed) {
          if (!displayed) return false
          return element.isEnabled()
        })
      }, parseInt(process.env.TIMEOUT, 10))
      await element.click(locator)
    } catch (err) {
      throw new Error(
        `Still not able to click ${locator.toString()}, Error message: ${err.message.toString()}`
      )
    }
  }

  async clickData(locator) {
    try {
      await this.click(locator)
      const element = await this.driver.findElement(locator)
      await this.driver.wait(async function () {
        let className = await element.getAttribute('class')
        return className == 'active'
      }, parseInt(process.env.TIMEOUT, 10))
    } catch (err) {
      throw new Error(
        `Still not able to click ${locator.toString()}, Error message: ${err.message.toString()}`
      )
    }
  }

  async clickBox(locator) {
    try {
      let element = await this.driver.findElement(locator)
      let isChecked = await element.isSelected()
      await this.click(locator)
      await this.driver.wait(async function () {
        let afterClick = await element.isSelected()
        return isChecked != afterClick
      }, parseInt(process.env.TIMEOUT, 10))
    } catch (err) {
      throw new Error(
        `Unable to check and click ${locator.toString()}, error : ${err.message}`
      )
    }
  }

  async clickForce(locator) {
    try {
      const element = await this.driver.findElement(locator)
      this.driver.executeScript("arguments[0].click();", element);
      return

    } catch (err) {
      throw new Error(`Still not able to click ${locator.toString()}, Error message: ${err.message.toString()}`)
    }
  }

  async doubleClick(locator) {
    try {
      const element = await this.driver.findElement(locator)
      const actions = await this.driver.actions({ async: true });
      await actions.doubleClick(element).perform();
      return
    } catch (err) {
      throw new Error(`Still not able to double click ${locator.toString()}, Error message: ${err.message.toString()}`)
    }
  }

  async moveCursor(locator) {
    try {
      const element = await this.driver.findElement(locator)
      const actions = await this.driver.actions({ async: true });
      await actions.move({ origin: element }).perform();
      return
    } catch (err) {
      throw new Error(`Still not able to move cursor ${locator.toString()}, Error message: ${err.message.toString()}`)
    }
  }

  async moveToClick(locator) {
    try {
      const element = await this.driver.findElement(locator)
      const actions = await this.driver.actions({ async: true });
      await actions.move({ origin: element }).click().perform();
      return
    } catch (err) {
      throw new Error(`Still not able to click ${locator.toString()}, Error message: ${err.message.toString()}`)
    }
  }

  async dragAndDrop(drag, drop) {
    try {
      const dragelement = await this.driver.findElement(drag)
      const dropelement = await this.driver.findElement(drop)
      const actions = await this.driver.actions({ async: true });
      await actions.dragAndDrop(dragelement, dropelement).perform();
      return
    } catch (err) {
      throw new Error(`Still not able to move cursor ${locator.toString()}, Error message: ${err.message.toString()}`)
    }
  }
}

module.exports = basePage