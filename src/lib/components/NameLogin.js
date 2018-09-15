import React, { Component } from "react";
import { Input, Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import MaterialBtn from "@material-ui/core/Button";
import { nameLoginHandler } from "../actions/commentsAction";
import helpers from "../config";

class NameLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      noEnoughChars: false
    };
  }

  handleInput = e => {
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({ [name]: value }, () => helpers.alertD(this.state[name]));
    this.removeNoEnoughCharsError();
  };

  // checking if name has enough chars to login
  isEnoughChars = (name, loginWithNameCb) => {
    helpers.alertD("data.length", name.length);
    if (!name || name.length < 5 || name.length > 15) {
      this.setState({ noEnoughChars: true }, () => {
        helpers.alertD("this.state.noEnoughChars", this.state.noEnoughChars);
      });
    } else {
      loginWithNameCb();
    }
  };

  // removing the error indication
  // invoked on new typing
  removeNoEnoughCharsError = () => {
    if (this.state.noEnoughChars) {
      this.setState({ noEnoughChars: false });
    }
  };

  render() {
    return (
      <div>
        <div style={{ float: "left" }}>
          <Input
            placeholder="whats your name?"
            error={this.state.noEnoughChars ? true : false}
            name="userName"
            value={this.state.userName}
            onChange={this.handleInput}
          />

          <MaterialBtn
            style={{ marginLeft: "3px", marginBottom: "5px" }}
            onClick={() =>
              this.isEnoughChars(this.state.userName, () =>
                this.props.nameLoginHandler(this.state.userName)
              )
            }
            color="primary">
            Join
          </MaterialBtn>
        </div>
        <br />
        {this.state.noEnoughChars ? (
          <label style={{ color: "red", float: "left", clear: "left" }}>
            min 5 and max 15 chars
          </label>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  nameError: state.comments.nameError
});

export default connect(
  mapStateToProps,
  { nameLoginHandler }
)(NameLogin);
