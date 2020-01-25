import firebase from "../config/firebase"
import { genRandomString } from "./utils"

let database = firebase.database();

/**
 * Create a new room.
 * 
 * @returns Room ID of the new room
 */
export let createRoom = async () => {
    let roomID = genRandomString(4);
}

export let joinRoom = (username, roomID, isLeader) => {

}

export let checkIfLeader = (username, roomID) => {

}

export let startGame = (roomID) => {

}

export let listenPlayersList = (roomID) => {

}

export let listenCurrentItem = (roomID) => {

}

export let listenCurrentRound = (roomID) => {

}
