export let mapStateToProps = state => {
  return {
    rUsername: state.rUsername,
    rRoomID: state.rRoomID,
    rGameState: state.rGameState
  };
};

export let mapDispatchToProps = dispatch => {
  return {
    setRUsername: username => dispatch({ type: "SET_RUSERNAME", payload: username }),
    setRRoomID: roomID => dispatch({ type: "SET_RROOMID", payload: roomID }),
    setRGameState: gameState => dispatch({ type: "SET_RGAMESTATE", payload: gameState })
  };
};
