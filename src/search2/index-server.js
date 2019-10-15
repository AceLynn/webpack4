"use strict";

// import React from "react";
// import "./search.scss";
// import logo from "./images/qcode.png";

const React = require("react");
// const largeNumber = require("large-number");
const logo = require("./images/qcode.png");
require("./search.scss");

class Search extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      Text: null
    };
  }

  loadComponent() {
    // import后，会生成一个Promise对象
    import("./test.js").then(Text => {
      this.setState({
        Text: Text.default
      });
    });
  }

  render() {
    const { Text } = this.state;

    return (
      <div class="searchText">
        {Text ? <Text /> : null}
        Search <span class="text">React</span> Demo2222{" "}
        <img src={logo} onClick={this.loadComponent.bind(this)} />
      </div>
    );
  }
}

module.exports = <Search />;
