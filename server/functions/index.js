const functions = require("firebase-functions");
const rp = require("request-promise");
const puppeteer = require("puppeteer");
const $ = require("cheerio");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.gameStartTrigger = functions.database
  .ref("rooms/{roomID}/gameStarted")
  .onUpdate(async (snap, context) => {
    console.log("in get doc");
    db.collection("items")
      .get()
      .then(snap => {
        let docArray = [];
        snap.forEach(doc => {
          docArray.push(doc);
        });
        let arrayLength = docArray.length;
        let index = getRandomInt(0, arrayLength);
        console.log("Chosen: " + docArray[index].get("itemName"));
        return;
      })
      .catch(error => {
        console.log("Error db col: " + error);
      });
  });

exports.nextRoundTrigger = functions.database
  .ref("rooms/{roomID}/currentRound")
  .onUpdate(async (snap, context) => {
    //Fetch item param
    let chosenItem = db
      .collection("items")
      .get()
      .then(snap => {
        let docArray = [];
        snap.forEach(doc => {
          docArray.push(doc);
        });
        let arrayLength = docArray.length;
        let index = getRandomInt(0, arrayLength);

        console.log("Chosen: " + docArray[index].get("itemName"));
        return docArray[index];
      })
      .catch(error => {
        console.log("Error db col: " + error);
      });
    await snap.afer.ref.parent.update({productName: chosenItem.get("itemName")});
    await snap.afer.ref.parent.update({productImage: chosenItem.get("itemImage")});
    await snap.afer.ref.parent.update({productPrice: chosenItem.get("itemPrice")});
    //Reset timeleft
    const maxTime = 5; //in s
    await snap.after.ref.parent.update({ timeLeft: maxTime });
    //Start countdown
    setTimeout(async () => {
      await snap.after.ref.parent.update({ timeLeft: 0 });
    }, maxTime * 1000);
  });

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
