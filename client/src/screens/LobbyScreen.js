import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";

import { listenPlayersList } from "../helpers/dbHelper";
import { mapStateToProps, mapDispatchToProps } from "../redux/reduxMap";
import firebase from "../config/firebase";

class LobbyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: []
    };

    this.database = firebase.database();
  }
  componentDidMount() {
    listenPlayersList(this.props.rRoomID, _players =>
      this.setState({
        players: _players
      })
    );
  }

  render() {
    return (
      <div>
        <Typography>
          Send this code to friends so they can join your game.
        </Typography>
        <Typography>{this.props.rRoomID}</Typography>
        <Typography>Current players in the lobby:</Typography>
        {this.state.players.map(player => (
          <Typography>{player}</Typography>
        ))}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LobbyScreen);
