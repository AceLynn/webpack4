import React from "react";
import ReactDOM from "react-dom";
import "./search.scss";
import logo from "./images/qcode.png";
import "../../common/index";
import { a } from "./tree-shaking";

class Search extends React.Component {
  render() {
    const funcA = a();

    return (
      <div class="searchText">
        {funcA}Search <span class="text">React</span> Demo2222 <img src={logo} />
      </div>
    );
  }
}
import { format } from "path";

ReactDOM.render(<Search />, document.getElementById("root"));
