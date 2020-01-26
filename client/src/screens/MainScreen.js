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
import { connect } from "react-redux";

let mapStateToProps = state => {
  return {
    rUsername: state.rUsername,
    rRoomID: state.rRoomID,
    rGameState: state.rGameState
  };
};

let mapDispatchToProps = dispatch => {
  return {
    setRUsername: username => dispatch({ type: "SET_RUSERNAME", payload: username }),
    setRRoomID: roomID => dispatch({ type: "SET_RROOMID", payload: roomID }),
    setRGameState: gameState => dispatch({ type: "SET_RGAMESTATE", payload: gameState })
  };
};

class MainScreen extends Component {
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
        this.setErrorMessage("Username cannot be used.");
        return;
      }
      //Room name validation
      if (this.state.roomID !== "" && !isAlphaNumeric(this.state.roomID)) {
        this.setErrorMessage("Room ID does not exist.");
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
        this.goToLobby();
      } else {
        if (await checkIfRoomExist(this.state.roomID)) {
          //Username validation
          if (await checkIfUserExist(this.state.username, this.state.roomID)) {
            this.setErrorMessage("Username is taken.");
            return;
          }

          await joinRoom(this.state.username, this.state.roomID, false);
          this.goToLobby();
        } else {
          this.setState({
            errorMessage: "Room ID does not exist!"
          });
        }
      }
    };

    this.goToLobby = () => {
      this.props.setRUsername(this.state.username);
      this.props.setRRoomID(this.state.roomID);
      this.props.setRGameState(1);
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

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
