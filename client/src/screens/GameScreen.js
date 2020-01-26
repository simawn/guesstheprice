import React, { Component } from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import { connect } from "react-redux";
import {
  listenCurrentRound,
  listenCurrentItemImage,
  listenCurrentItemName,
  listenCurrentItemPrice,
  listenTimeLeft,
  increaseRound
} from "../helpers/dbHelper";
import { mapStateToProps, mapDispatchToProps } from "../redux/reduxMap";
import Countdown from "react-countdown";

class GameScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRound: 0,
      currentItemImage: "",
      currentItemName: "",
      currentItemPrice: -1,
      timeLeft: -1,
      userPriceGuess: -1,
    };
  }

  componentDidMount() {
    listenCurrentRound(this.props.rRoomID, round =>
      this.setState({
        currentRound: round
      })
    );
    listenCurrentItemImage(this.props.rRoomID, img =>
      this.setState({
        currentItemImage: img
      })
    );
    listenCurrentItemName(this.props.rRoomID, name =>
      this.setState({
        currentItemName: name
      })
    );
    listenCurrentItemPrice(this.props.rRoomID, price =>
      this.setState({
        currentItemPrice: price
      })
    );
    listenTimeLeft(this.props.rRoomID, time =>
      this.setState({
        timeLeft: time
      })
    );
    increaseRound(this.props.rRoomID);
  }

  //For Countdown
  renderer = ({ hours, minutes, seconds, completed }) => {
    return <span>{seconds}</span>;
  };

  handleSubmit
  render() {
    return (
      <div>
        {this.state.timeLeft !== -1 && (
          <Countdown
            date={Date.now() + this.state.timeLeft * 1000}
            renderer={this.renderer}
          ></Countdown>
        )}
        <Typography>Round: {this.state.currentRound}</Typography>
        <Typography>Image: {this.state.currentItemImage}</Typography>
        <Typography>Name: {this.state.currentItemName}</Typography>
        <Typography>Price: {this.state.currentItemPrice}</Typography>
        <TextField type="number" label="Your guess:"></TextField>
        <Button onClick={this.handleSubmit} variant="contained" color="primary" disabled={this.state.timeLeft === 0 ? true : false}>
          Submit
        </Button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen);
