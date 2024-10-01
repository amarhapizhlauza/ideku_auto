require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
require('datejs');

const chai = require('chai')

global.expect = chai.expect
global.should = chai.should();
global.assert = chai.assert
global.addContext = require("mochawesome/addContext")
global.fsp = require('fs').promises

module.exports = {
    chai
}