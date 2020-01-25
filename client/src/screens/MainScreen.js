import React, { Component } from "react";
import { TextField, Typography, Button } from "@material-ui/core";

export default class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      roomID: ""
    };
  }

  render() {
    return (
      <div>
        <Typography>Playername</Typography>
        <TextField
          onChange={e => this.setState({ username: e.target.value })}
        />
        <Typography>Room ID (optional)</Typography>
        <TextField onChange={e => this.setState({ roomID: e.target.value })} />
        <Button
          onClick={() => console.log(this.state.username + " " + this.state.roomID)}
          variant="contained"
          color="primary"
        >
          Create/Join Room
        </Button>
      </div>
    );
  }
}
