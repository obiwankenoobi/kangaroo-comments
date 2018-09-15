import React, { Component } from "react";
import "./App.css";

import { Provider } from "react-redux";
import store from "../store";
import Main from "./Main";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <div>
          {typeof window !== "undefined" ? ( // make sure it render only on the client
            <Main
              pageName={this.props.pageName}
              siteName={this.props.siteName}
            />
          ) : null}
        </div>
      </Provider>
    );
  }
}

export default App;
