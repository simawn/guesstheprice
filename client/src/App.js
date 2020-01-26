import React, { Component } from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Switcher from "./screens/Switcher";

const initialState = {
  rUsername: "",
  rRoomID: "",
  rGameState: 0 //0: Main screen, 1: Lobby, 2: Game
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_RUSERNAME":
      return {
        rUsername: action.payload,
        rRoomID: state.rRoomID,
        rGameState: state.rGameState
      };
    case "SET_RROOMID":
      return {
        rUsername: state.rUsername,
        rRoomID: action.payload,
        rGameState: state.rGameState
      };
    case "SET_RGAMESTATE":
      return {
        rUsername: state.rUsername,
        rRoomID: state.rRoomID,
        rGameState: action.payload
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <Switcher />
        </Provider>
      </div>
    );
  }
}
