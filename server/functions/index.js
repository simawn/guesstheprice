const functions = require("firebase-functions");
const rp = require("request-promise");
const puppeteer = require("puppeteer");
const $ = require("cheerio");

const url = "https://camelcamelcamel.com/search?sq=mouse";

exports.getAmazonItem = functions.https.onRequest((request, response) => {
  puppeteer
    .launch()
    .then(browser => {
      return browser.newPage();
    })
    .then(page => {
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

/*
exports.gameStartTrigger = functions.database
  .ref("rooms/{roomID}/gameStarted")
  .onUpdate(async (snap, context) => {
    const roomID = context.params.roomID;
    console.log("Update in room: " + roomID);
    if (snap.after.val()) {
      await snap.after.ref.parent.update({ currentRound: 1 });
      setTimeout(async () => {
        console.log("timeout");
        await snap.after.ref.parent.update({ timeLeft: 0 });
      }, 5000);
    } else {
      console.log(JSON.stringify(snap));
    }
  });
*/

exports.nextRoundTrigger = functions.database
  .ref("rooms/{roomID}/currentRound")
  .onUpdate(async (snap, context) => {
    //Update item params
    //Reset timeleft
    const maxTime = 5; //in s
    await snap.after.ref.parent.update({ timeLeft: maxTime });
    //Start countdown
    setTimeout(async () => {
      await snap.after.ref.parent.update({ timeLeft: 0 });
    }, maxTime * 1000);
  });
