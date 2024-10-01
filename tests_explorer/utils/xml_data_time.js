const fs = require("fs");
const xml2js = require('xml2js');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const directoryPath = `${process.cwd()}/Reports/${process.env.LOKASI_REPORT}`;

let modifyLastXmlFile = fs.readdir(directoryPath, function (err, files) {
  // handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  // get the last xml files
  let listFiles = String(files).split(',');
  let countFiles = String(files).split(',').length;

  let listXmlFile = [];
  for (let i = 0; i < countFiles; i++) {
    let fileExt = listFiles[i].substring(listFiles[i].length - 4, listFiles[i].length)
    if (fileExt != ".xml") {
      continue;
    }

    let xmlFileName = listFiles[i];
    listXmlFile.push(xmlFileName);
  }

  let lastXmlFileIndex = listXmlFile.length - 1;
  let lastXmlFile = listXmlFile[lastXmlFileIndex];

  let fileName = lastXmlFile;

  let getFileYear, getFileMonth, getFileDay, getFileHour, getFileMinute, getFileSecond;
  // get timestamp from file name
  if (process.env.LOKASI_REPORT == 'QC') {
    getFileYear = fileName.substring(3, 7);
    getFileMonth = fileName.substring(7, 9);
    getFileDay = fileName.substring(9, 11);
    getFileHour = fileName.substring(12, 14);
    getFileMinute = fileName.substring(14, 16);
    getFileSecond = fileName.substring(16, 18);
  }

  if (process.env.LOKASI_REPORT == 'STAGING') {
    getFileYear = fileName.substring(8, 12);
    getFileMonth = fileName.substring(12, 14);
    getFileDay = fileName.substring(14, 16);
    getFileHour = fileName.substring(17, 19);
    getFileMinute = fileName.substring(19, 21);
    getFileSecond = fileName.substring(21, 23);
  }

  // set the timestamp
  const xmlTimestamp = `${getFileYear}-${getFileMonth}-${getFileDay}T${getFileHour}:${getFileMinute}:${getFileSecond}`;

  // set the path to file
  let filePath = `${directoryPath}/${fileName}`;

  // read XML file
  fs.readFile(`${filePath}`, "utf-8", (err, data) => {
    if (err) {
      return console.log('Unable to read the file: ' + err);
    }

    // convert XML data to JSON object
    xml2js.parseString(data, (err, result) => {
      if (err) {
        return console.log('Unable to convert from xml to json object: ' + err);
      }

      // get JSON object
      let xmlData = result;

      let countTestSuite = xmlData.testsuites.testsuite.length;

      // modify the timestamp
      for (let i = 0; i < countTestSuite; i++) {
        xmlData.testsuites.testsuite[i].$.timestamp = xmlTimestamp;
      }

      // convert JSON object back to xml
      var builder = new xml2js.Builder();
      var modifiedXml = builder.buildObject(xmlData);

      // save the modified xml
      fs.writeFile(`${filePath}`, modifiedXml, function (err, data) {
        if (err) console.log(err);

        // console.log(listXmlFile);
        console.log("----", fileName, "successfully updated xml timestamp ---");
      });

    }); // xml file updated

  }); // finished reading xml file

}); // DONE