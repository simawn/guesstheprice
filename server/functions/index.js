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
  },
  {
    itemName:
      "Goldfish Cheddar Crackers, 22 Snack Packs, 28g Each",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/919-rzzYIIL._SX679_.jpg",
    itemPrice: 7.97
  },
  {
    itemName:
      "Kellogg's Rice Krispies Square Bars 660g Jumbo Pack-Original, 30 Cereal Bars",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/41xen8wZISL.jpg",
    itemPrice: 7.98
  },
  {
    itemName:
      "Quaker Chewy Chocolate Chip Granola Bars, 40-Count",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/91kzLlTkdGL._SX679_.jpg",
    itemPrice: 10.27
  },
  {
    itemName:
      "Mott's Fruitsations Veggie Gluten Free Berry, 32-Count, 723 Gram",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/811kPLndHIL._SX522_.jpg",
    itemPrice: 7.50
  },
  {
    itemName:
      "1500 Live Ladybugs - Good Bugs - Ladybugs - Guaranteed Live Delivery!",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/51Fyrf%2BC42L.jpg",
    itemPrice: 8.25
  },
  {
    itemName:
      "Pocket Pets Live Dalmation Roly Polys! Rolie Polie Isopods",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/81YZpV3EYzL._SX679_.jpg",
    itemPrice: 10.99 
  },
  {
    itemName:
      "Fluker's Freeze-Dried Crickets",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/81eydQeORZL._SY679_.jpg",
    itemPrice: 2.46
  },
  {
    itemName:
      "TRUEGARD Way Lube 68 Oil 55-Gallon Drum",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/414DaavkYfL._SX342_.jpg",
    itemPrice: 599.89
  },
  {
    itemName:
      "Graham The Moon Mens Flying-Tourbillon Moon-Retrograde 8 Piece Limited Edition Watch - 46mm 18K White Gold Watch with Blue Face and 48 Diamond Constellation",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/71AmQkTcuIL._UX679_.jpg",
    itemPrice: 59995
  },
  {
    itemName:
      "Stührling Original Mens Watch Stainless Steel Automatic, Skeleton Dial, Dual Time, AM/PM Sun Moon",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/91OqzIDVA9L._UY679_.jpg",
    itemPrice: 249.95
  },
  {
    itemName:
      "Rolex Cosmograph Daytona Ice Blue Dial Platinum Mens Watch",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/61ZqxOu8lML._UX679_.jpg",
    itemPrice: 66500
  },
  {
    itemName:
      "23.32 Carat Natural Blue Tanzanite and Diamond (F-G Color, VS1-VS2 Clarity) 14K White Gold Luxury Cocktail Ring for Women Exclusively Handcrafted in USA",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/61VUd8-vHQL._UX625_.jpg",
    itemPrice: 6435
  },
  {
    itemName:
      "Unique Royal Jewelry 18k White Gold GIA Yellow Radiant Cut Diamond .97 VS1 HPHT Ring",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/41fEnb7n9yL.jpg",
    itemPrice: 30397
  },
  {
    itemName:
      "Ray-Ban RB3576N BLAZE CLUBMASTER Sunglasses For Men For Women",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/419D3DroKfL._UX679_.jpg",
    itemPrice: 200
  },
  {
    itemName:
      "Daisysboutique Men's Holiday Reindeer Snowman Santa Snowflakes Sweater",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/71GWV4TNsYL._UY741_.jpg",
    itemPrice: 14.99
  },
  {
    itemName:
      "Levenkeness Shiba Inu Dog Plush Pillow",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/514KL6gAvYL._SX679_.jpg",
    itemPrice: 13.95
  },
  {
    itemName:
      "Cat Lamp, GoLine Gifts for Women Teen Girls Baby,Night Lights for Kids Bedroom, Cute Christmas Kitty",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/61Q2btOQVBL._SX679_.jpg",
    itemPrice: 14.99
  },
  {
    itemName:
      "Y- STOP Hammock Chair Hanging Rope Swing - Max 320 Lbs - 2 Seat Cushions Included - Quality Cotton Weave for Superior Comfort & Durability(Beige)",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/71iNQpv0XgL._SX522_.jpg",
    itemPrice: 46.99
  },
  {
    itemName:
      "ygmoner Lucky Cat Car Charm Porcelain Figurine Hanging Pendant (Blue & Pink)",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/61I9qIHXKoL._SX679_.jpg",
    itemPrice: 7.5
  },
  {
    itemName:
      "GUND Pusheen Snackables Birthday Cupcake Plush Stuffed Animal, Gray, 10.5",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/71TTbee5oKL._SX679_.jpg",
    itemPrice: 17.5
  },
  {
    itemName:
      "Fifty Shades Trilogy (Fifty Shades of Grey / Fifty Shades Darker / Fifty Shades Freed) Paperback",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/51Rcd2VHuaL._SX352_BO1,204,203,200_.jpg",
    itemPrice: 23
  },
  {
    itemName:
      "Fresh Black Burgundy Truffles (Tuber Uncinatum) 3 oz",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/812hWgMhUML._SX679_.jpg",
    itemPrice: 125
  },
  {
    itemName:
      "Parmigiano Reggiano PDO",
    itemImage:
      "https://images-na.ssl-images-amazon.com/images/I/51f4QAOVwlL.jpg",
    itemPrice: 54.5
  }
];
