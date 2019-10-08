import React from "react";
import ReactDOM from "react-dom";
import "./search.scss";
import logo from "./images/qcode.png";
// import "../../common/index";
import { a } from "./tree-shaking";

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
    const funcA = a();
    const { Text } = this.state;

    return (
      <div class="searchText">
        {
          Text ? <Text /> : null
        }
        {funcA}Search <span class="text">React</span> Demo2222{" "}
        <img src={logo} onClick={this.loadComponent.bind(this)} />
      </div>
    );
  }
}
import { format } from "path";

ReactDOM.render(<Search />, document.getElementById("root"));
