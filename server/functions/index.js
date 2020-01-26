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
    });

    //If all player answers, timer ends.
    if (currentDoneAnswering === totalPlayerInRoom) {
      console.log("round end. all player answer");
      await snap.after.ref.parent.update({ timeLeft: 0 });
    }
  });

//Calculates points when timer reaches 0
exports.roundOver = functions.database
  .ref("rooms/{roomID}/timeLeft")
  .onUpdate(async (snap, context) => {
    if (snap.after.val() === 0) {
      let correctPrice;
      await snap.after.ref.parent.once("value", snapshot => {
        correctPrice = snapshot.val().productPrice;
      });
      console.log("Correct item price: " + correctPrice);

      let userLeastDiff = "";
      let leastDiffAmount = -1;

      await snap.after.ref.parent.once("value", snapshot => {
        let playerList = snapshot.val().players;

        Object.entries(playerList).forEach(([key, value]) => {
          let user = key;
          let properties = value;
          let diff = Math.abs(correctPrice - properties.guessAmount);
          if(leastDiffAmount === -1){
            userLeastDiff = user;
            leastDiffAmount = diff;
          } else if (diff <= leastDiffAmount) {
            userLeastDiff = user;
            leastDiffAmount = diff;
          }
        });
      });

      console.log(
        "user with least diff " +
          userLeastDiff +
          " with diff of: " +
          leastDiffAmount
      );
      //Search score of least diff
      let currentLeastDiffScore;
      await snap.after.ref.parent.once("value", snapshot => {
        //console.log("search scoe val: " + JSON.stringify(snapshot.val()))
        //console.log("search scoe val: " + JSON.stringify(snapshot.val()["players"][userLeastDiff]))
        currentLeastDiffScore = snapshot.val()["players"][userLeastDiff]["points"];
      })

      
      console.log("they have: " + currentLeastDiffScore);

      //Update score
      await snap.after.ref.parent.child("players/" + userLeastDiff).update({
        points: currentLeastDiffScore + 1
      })

    } else {
      return null;
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
