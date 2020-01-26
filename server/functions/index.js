const functions = require('firebase-functions');
const rp = require('request-promise');
const puppeteer = require('puppeteer');
const $ = require('cheerio');

const url = 'https://camelcamelcamel.com/search?sq=mouse';

exports.getAmazonItem = functions.https.onRequest((request, response) => {
    puppeteer
  .launch()
  .then((browser) => {
    return browser.newPage();
  })
  .then((page) => {
    return page.goto(url).then(function() {
      return page.content();
    });
  })
  .then(function(html) {
    return response.send(html);

  })
  .catch(function(err) {
    console.log(err);
  });
});

