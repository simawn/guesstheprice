import React, { Component } from "react";
import { Typography, Button } from "@material-ui/core";
import { connect } from "react-redux";

import {
  listenPlayersList,
  checkIfLeader,
  startGame,
  listenGameStart
} from "../helpers/dbHelper";
import { mapStateToProps, mapDispatchToProps } from "../redux/reduxMap";
import firebase from "../config/firebase";

class LobbyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      isLeader: false
    };

    this.database = firebase.database();
  }
  componentDidMount = async () => {
    //Listen for players joining the game
    listenPlayersList(this.props.rRoomID, _players =>
      this.setState({
        players: _players
      })
    );

    //Listen for game start
    listenGameStart(this.props.rRoomID, _started => {
      if (_started) {
        this.props.setRGameState(2);
      }
    });

    //Sets if current client is a leader. For start game button
    await checkIfLeader(this.props.rUsername, this.props.rRoomID, value =>
      this.setState({
        isLeader: value
      })
    );
  };

  handleStartGame = () => {
    startGame(this.props.rRoomID);
  };

  render() {
    return (
      <div style={container}>
        <div style={mainBody}>
          <Typography variant="h5">
            Send this code to friends so they can join your game
          </Typography>
        </div>
        <div style={roomCode}>
          <Typography variant="h4">{this.props.rRoomID}</Typography>
        </div>
        <Typography variant="overline">Current players in the lobby</Typography>
        {this.state.players.map(player => {
          return (
            <div style={{margin:"15px"}} key={player}>
              <Typography>{player}</Typography>
            </div>
          );
        })}
        {this.state.isLeader && (
          <Button
            onClick={this.handleStartGame}
            variant="contained"
            color="primary"
          >
            Start Game
          </Button>
        )}
      </div>
    );
  }
}

const container = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "90vh"
};

const mainBody = {
  margin: "10px",

};

const roomCode = {
  margin: "30px",
  width: "80px",
  height: "40px",
  border: "solid black 3px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

export default connect(mapStateToProps, mapDispatchToProps)(LobbyScreen);
