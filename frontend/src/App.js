import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Register from "./components/Register";
import LogIn from "./components/LogIn";
import NavBar from "./components/Navbar";
import AuthenticatedComponent from "./components/AuthenticatedComponent";
import Vendor from "./components/Vendor";
import VendorAdd from "./components/VendorAdd";
import VendorView from "./components/VendorView";
import VendorReady from "./components/VendorReady";
import VendorDispatched from "./components/VendorDispatched";
import Customer from "./components/Customer";
import CustomerSearch from "./components/CustomerSearch";
import CustomerView from "./components/CustomerView";

function App(props) {
  return (
    <Router>
      <Switch>
        <Route exact path="/Auth" component={AuthenticatedComponent} />
        <Route exact path="/" component={LogIn} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/vendor" component={Vendor} />
        <Route exact path="/vendor/add" component={VendorAdd} />
        <Route exact path="/vendor/view" component={VendorView} />
        <Route exact path="/vendor/ready" component={VendorReady} />
        <Route exact path="/vendor/dispatched" component={VendorDispatched} />
        <Route exact path="/customer" component={Customer} />
        <Route exact path="/customer/search" component={CustomerSearch} />
        <Route exact path="/customer/view" component={CustomerView} />
        <Route
          component={() => (
            <div style={{ marginTop: 150 }}>
              <b>
                <center>
                  <h1>404 Not found</h1>
                </center>
              </b>{" "}
            </div>
          )}
        />
      </Switch>
    </Router>
  );
}

export default App;
