import React, { Component } from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import { connect } from "react-redux";
import {
  listenCurrentRound,
  listenCurrentItemImage,
  listenCurrentItemName,
  listenCurrentItemPrice,
  listenTimeLeft,
  increaseRound,
  checkIfLeader,
  setPlayerGuess,
  listenCurrentUserScore
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
      isLeader: false,
      submitted: false,
      userScore: -1
    };

    increaseRound(this.props.rRoomID);
  }

  componentDidMount = async () => {
    listenCurrentRound(this.props.rRoomID, round =>
      this.setState({
        currentRound: round,
        submitted: false
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
    listenCurrentUserScore(this.props.rUsername, this.props.rRoomID, score => {
      this.setState({
        userScore: score
      });
    });
    //Sets if current client is a leader. For start game button
    await checkIfLeader(this.props.rUsername, this.props.rRoomID, value =>
      this.setState({
        isLeader: value
      })
    );
  };

  //For Countdown
  renderer = ({ hours, minutes, seconds, completed }) => {
    return <span>{seconds}</span>;
  };

  handleSubmitAnswer = () => {
    if (this.state.userPriceGuess !== -1) {
      setPlayerGuess(
        this.props.rUsername,
        this.props.rRoomID,
        this.state.userPriceGuess
      );
      this.setState({
        submitted: true
      });
    }
  };

  handleNextRound = () => {
    increaseRound(this.props.rRoomID);
    this.setState({
      submitted: false
    });
  };

  render() {
    return (
      <div>
        <Typography>Your score: {this.state.userScore}</Typography>
        <Typography>Round: {this.state.currentRound}</Typography>
        <img src={this.state.currentItemImage} alt="img" height="300px" />
        <Typography>{this.state.currentItemName}</Typography>
        {this.state.timeLeft === 0 && (
          <Typography>Price: {this.state.currentItemPrice}</Typography>
        )}
        <TextField
          onChange={e => this.setState({ userPriceGuess: e.target.value })}
          type="number"
          label="Your guess ($CAD):"
        ></TextField>
        <Button
          onClick={this.handleSubmitAnswer}
          variant="contained"
          color="primary"
          disabled={
            this.state.submitted ? true : false
          }
        >
          Submit
        </Button>
        {this.state.isLeader && (
          <Button
            onClick={this.handleNextRound}
            variant="contained"
            color="primary"
            disabled={this.state.timeLeft === 0 ? false : true}
          >
            Next Round
          </Button>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen);
