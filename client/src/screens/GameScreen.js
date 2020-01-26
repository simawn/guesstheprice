import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import { connect } from "react-redux";

import { mapStateToProps, mapDispatchToProps } from "../redux/reduxMap";

class GameScreen extends Component {
  render() {
    return (
      <div>
        <Typography>Game Screen</Typography>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameScreen);
