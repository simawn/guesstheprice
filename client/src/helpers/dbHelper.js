import firebase from "../config/firebase";
import { genRandomString } from "./utils";

let database = firebase.database();

/**
 * Create a new room.
 *
 * @returns Room ID of the new room
 */
export let createRoom = async () => {
  let genRoomID = genRandomString(4);
  //Creates an empty room
  await database.ref("/rooms").update({ [genRoomID]: "" });
  //Create room settings
  await database.ref("/rooms/" + genRoomID).update({
    currentRound: 0,
    gameStarted: false,
    productImage: "",
    productName: "",
    productPrice: -1,
    timeLeft: -1,
    maxPlayers: 4
  });
  return genRoomID;
};

/**
 * Add user to the specified room. Sets the user as leader if needed.
 * Create user params
 * @param {String} username
 * @param {String} roomID
 * @param {Boolean} isLeader
 */
export let joinRoom = (username, roomID, isLeader) => {
  database.ref("/rooms/" + roomID + "/players").update({
    [username]: {
      leader: isLeader,
      points: 0,
      guessAmount: 0
    }
  });
};

/**
 * Check if roomID exists
 * @param {String} roomID
 * @returns true if room exists, false otherwise
 */
export let checkIfRoomExist = async roomID => {
  let roomExists;
  await database.ref("/rooms/" + roomID).once("value", snap => {
    if (snap.exists()) {
      roomExists = true;
    } else {
      roomExists = false;
    }
  });
  return roomExists;
};

/**
 * Check if the username exists in the roomID.
 * @param {String} username
 * @param {String} roomID
 */
export let checkIfUserExist = async (username, roomID) => {
  let userExists;
  await database
    .ref("/rooms/" + roomID + "/players/" + username)
    .once("value", snap => {
      if (snap.exists()) {
        userExists = true;
      } else {
        userExists = false;
      }
    });
  return userExists;
};

export let checkIfLeader = (username, roomID, callback) => {
  database
    .ref("rooms/")
    .child(roomID + "/players/" + username + "/leader")
    .once("value", snap => {
      if (snap.val()) {
        callback(true);
        return true;
      } else {
        callback(false);
        return false;
      }
    });
};

export let startGame = roomID => {
  database
    .ref("rooms/")
    .child(roomID)
    .update({
      gameStarted: true
    });
};

export let increaseRound = async roomID => {
  let currentRound = await getCurrentRound(roomID);
  let nextRound = currentRound + 1;
  database
    .ref("rooms/")
    .child(roomID)
    .update({
      currentRound: nextRound
    });
};

export let getCurrentRound = async roomID => {
  let currentRound;
  await database
    .ref("/rooms/" + roomID + "/currentRound")
    .once("value", snap => {
      currentRound = snap.val();
    });
  return currentRound;
};

/**
 * Listens to all players joining the game
 * @param {String} roomID
 * @returns A list of players in the current room
 */
export let listenPlayersList = (roomID, callback) => {
  database
    .ref("rooms/")
    .child(roomID + "/players")
    .on("value", snap => {
      let players = [];
      snap.forEach(player => {
        players.push(player.key);
      });
      callback(players);
    });
};

export let listenGameStart = (roomID, callback) => {
  database
    .ref("rooms/")
    .child(roomID + "/gameStarted")
    .on("value", snap => {
      callback(snap.val());
    });
};

export let listenCurrentRound = (roomID, callback) => {
  database
    .ref("rooms/")
    .child(roomID + "/currentRound")
    .on("value", snap => {
      callback(snap.val());
    });
};

export let listenCurrentItemImage = (roomID, callback) => {
  database
    .ref("rooms/")
    .child(roomID + "/productImage")
    .on("value", snap => {
      callback(snap.val());
    });
};

export let listenCurrentItemName = (roomID, callback) => {
  database
    .ref("rooms/")
    .child(roomID + "/productName")
    .on("value", snap => {
      callback(snap.val());
    });
};

export let listenCurrentItemPrice = (roomID, callback) => {
  database
    .ref("rooms/")
    .child(roomID + "/productPrice")
    .on("value", snap => {
      callback(snap.val());
    });
};

export let listenTimeLeft = (roomID, callback) => {
  database
    .ref("rooms/")
    .child(roomID + "/timeLeft")
    .on("value", snap => {
      callback(snap.val());
    });
};
