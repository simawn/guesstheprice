const functions = require("firebase-functions");
const rp = require("request-promise");
const puppeteer = require("puppeteer");
const $ = require("cheerio");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

/*
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
*/

exports.nextRoundTrigger = functions.database
  .ref("rooms/{roomID}/currentRound")
  .onUpdate(async (snap, context) => {
    let randomIndex = getRandomInt(0, data.length);
    let chosen = data[randomIndex];

    await snap.after.ref.parent.update({
      productName: chosen.itemName
    });
    await snap.after.ref.parent.update({
      productImage: chosen.itemImage
    });
    await snap.after.ref.parent.update({
      productPrice: chosen.itemPrice
    });

    //Reset timeleft
    const maxTime = 30; //in s
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

//Checks if all user have answered. Then end round.
exports.doneAnswering = functions.database
  .ref("rooms/{roomID}/playersDoneAnswering")
  .onUpdate(async (snap, context) => {
    let currentDoneAnswering = snap.after.val();
    let totalPlayerInRoom;

    await snap.after.ref.parent.once("value", snapshot => {
      totalPlayerInRoom = snapshot.val().currentPlayerCount;
    })

    //If all player answers, timer ends.
    if(currentDoneAnswering === totalPlayerInRoom) {
      console.log("round end. all player answer")
      await snap.after.ref.parent.update({ timeLeft: 0 });
    }
  });
/*
function dbFetch() {
  db.collection("items")
    .get()
    .then(snapDB => {
      let docArray = [];
      snapDB.forEach(doc => {
        docArray.push(doc);
      });
      let arrayLength = docArray.length;
      let index = getRandomInt(0, arrayLength);

      console.log("Chosen: " + docArray[index].get("itemName"));
      let chosenIndex = docArray[index];
      return {
        name: chosenIndex.get("itemName"),
        price: chosenIndex.get("itemPrice"),
        image: chosenIndex.get("itemImage")
      };
    })
    .catch(error => {
      console.log("Error db col: " + error);
    });
}
*/

let data = [
  {
    itemName: "Archie Mcphee Instant underpants. Just add water one pair",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/61XuLWJvSeL._SY355_.jpg",
    itemPrice: 12.95
  },
  {
    itemName: "Cat Farts Cotton Candy",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/61f9C-eqPdL._SX679_.jpg",
    itemPrice: 8.95
  },
  {
    itemName: "Madagascar Hissing Cockroach SEXED Pair M/F",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/51bt9Uft0oL._SX450_.jpg",
    itemPrice: 12.5
  },
  {
    itemName:
      "Amusing Simulation Tasty Salmon Fish Sushi Pillow Cushion Home Decor",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/51oqej9eOmL._SX522_.jpg",
    itemPrice: 11.8
  }
];
