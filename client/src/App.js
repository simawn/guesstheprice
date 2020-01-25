import React, { Component } from 'react'

import MainScreen from "./screens/MainScreen"

export default class App extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
        <MainScreen/>
      </div>
    )
  }
}

