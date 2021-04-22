import React, { Component } from "react";
import { getJwt } from "./../helpers/jwt";
import axios from "axios";

class AuthenticatedComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: undefined
    };
  }

  componentDidMount() {
    const jwt = getJwt();

    console.log("jwt", jwt);

    if (!jwt) {
      this.props.history.push("/LogIn");
    }

    axios
      .get("http://localhost:4000/auth", {
        headers: { authorization: `Bearer: ${jwt}` }
      })
      .then(res =>
        res.setState({
          userData: res.data
        })
      )
      .catch(err => {
        // console.log(err);
        localStorage.removeItem("access-token");
        this.props.history.push("/LogIn");
      });
  }

  render() {
    if (this.state.user === undefined) {
      return <div>Loading...</div>;
    }
    return <div>{this.props.children}</div>;
  }
}

export default AuthenticatedComponent;
