import React, { Component } from "react";
import { TextField, Typography, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { connect } from "react-redux";

import {
  createRoom,
  joinRoom,
  checkIfRoomExist,
  checkIfUserExist
} from "../helpers/dbHelper";
import { isAlphaNumeric } from "../helpers/utils";
import { mapStateToProps, mapDispatchToProps } from "../redux/reduxMap";

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
      <div style={mainBody}>
        {this.state.errorMessage !== "" && (
          <Alert severity="error">{this.state.errorMessage}</Alert>
        )}

        <TextField
          onChange={e => this.setState({ username: e.target.value })}
          label="Playername"
        />
        <TextField
          onChange={e => this.setState({ roomID: e.target.value })}
          label="Room ID (optional)"
        />
        <Button onClick={this.handleSubmit} variant="contained" color="primary">
          Create/Join Room
        </Button>
      </div>      
    );
  }
}

const mainBody = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '90vh' 
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
