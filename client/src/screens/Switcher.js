/**
 * Used to swap around screens depending on the state
 */
import React, { Component } from "react";
import { connect } from "react-redux";

import GameScreen from "./GameScreen";
import LobbyScreen from "./LobbyScreen";
import MainPage from "./MainScreen";
import { mapDispatchToProps, mapStateToProps } from "../redux/reduxMap";

class Switcher extends Component {
  render() {
    switch (this.props.rGameState) {
      case 0:
        return <MainPage />;
      case 1:
        return <LobbyScreen />;
      case 2:
        return <GameScreen />;
      default:
        return <MainPage />;
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Switcher);
