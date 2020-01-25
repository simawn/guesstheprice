import React, { Component } from "react";
import { TextField, Typography, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
  createRoom,
  joinRoom,
  checkIfRoomExist,
  checkIfUserExist
} from "../helpers/dbHelper";
import { isAlphaNumeric } from "../helpers/utils";

export default class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      roomID: "",
      errorMessage: ""
    };

    this.setErrorMessage = message => {
      this.setState({
        errorMessage: message
      });
    };

    this.handleSubmit = async () => {
      //Resets error message
      this.setState({
        errorMessage: ""
      });
      //User validation check
      if (this.state.username === "" || !isAlphaNumeric(this.state.username)) {
        this.setErrorMessage("Username cannot be used.")
        return;
      }
      //Room name validation
      if (this.state.roomID !== "" && !isAlphaNumeric(this.state.roomID)) {
        this.setErrorMessage("Room ID does not exist.")
        return;
      }
      //If no roomID is provided, create a new room and join
      if (this.state.roomID === "") {
        let _roomID = await createRoom();
        this.setState({
          roomID: _roomID
        });
        //We are skipping username validation as we can guarantee that the username will be unique
        await joinRoom(this.state.username, this.state.roomID, true);
        //TODO: Jump to gamescreen
      } else {
        if (await checkIfRoomExist(this.state.roomID)) {
          //Username validation
          if (await checkIfUserExist(this.state.username, this.state.roomID)) {
            this.setErrorMessage("Username is taken.");
            return;
          }

          await joinRoom(this.state.username, this.state.roomID, false);
          //TODO: Jump to gamescreen
        } else {
          this.setState({
            errorMessage: "Room ID does not exist!"
          });
        }
      }
    };
  }

  render() {
    return (
      <div>
        {this.state.errorMessage !== "" && (
          <Alert severity="error">{this.state.errorMessage}</Alert>
        )}

        <Typography>Playername</Typography>
        <TextField
          onChange={e => this.setState({ username: e.target.value })}
        />
        <Typography>Room ID (optional)</Typography>
        <TextField onChange={e => this.setState({ roomID: e.target.value })} />
        <Button onClick={this.handleSubmit} variant="contained" color="primary">
          Create/Join Room
        </Button>
      </div>
    );
  }
}
