import React, { Component } from "react";
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
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { getJwt } from "./../helpers/jwt";
import axios from "axios";
import { withRouter } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Tanish Lad
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const styles = theme => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none"
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6)
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2)
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    }
  }
});

class VendorAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      price: "",
      quantity: "",
      error: "",
      userData: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    console.log("mount start");
    const jwt = getJwt();

    console.log("jwt", jwt);

    if (!jwt) {
      this.props.history.push("/LogIn");
    } else {
      console.log("else", jwt);
      axios
        .get("http://localhost:4000/auth", {
          headers: { authorization: `Bearer: ${jwt}` }
        })
        .then(res => {
          console.log("yo", this.state);

          this.setState({
            userData: res.data
          });

          if (res.data.type === "customer") {
            localStorage.removeItem("access-token");
            this.props.history.push("/login");
          }

          console.log(this.state);
        })
        .catch(err => {
          console.log("haha", JSON.stringify(err));
          localStorage.removeItem("access-token");
          this.props.history.push("/LogIn");
        });
      console.log("final");
    }
  }

  handleChange(event) {
    console.log("here");
    console.log(this.state);
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    // console.log(this.state)
  }

  logout() {
    localStorage.removeItem("access-token");
    window.location.reload();
  }

  onSubmit(event) {
    // console.log("hi");

    event.preventDefault();

    const product = {
      name: this.state.name,
      price: this.state.price,
      quantity: this.state.quantity,
      sellerID: this.state.userData.id
    };

    if (
      product["name"] !== "" &&
      product["price"] !== "" &&
      product["quantity"] !== "" &&
      product["sellerID"] !== ""
    ) {
      console.log("posting", product);
      axios
        .post("http://localhost:4000/products/add", product)
        .then(res => {
          // console.log("**");
          // console.log(res.data.User);
          this.setState({
            error: "Product Added Succesfully!",
            color: "green",
            name: "",
            price: "",
            quantity: ""
          });
        })
        .catch(err => {
          // console.log("errored");
          this.setState({
            error: "Error: Cannot Add Product",
            color: "red",
            name: this.state.name,
            price: this.state.price,
            quantity: this.state.quantity
          });
        });
    } else {
      // console.log("****");

      this.setState({
        name: this.state.name,
        price: this.state.price,
        quantity: this.state.quantity,
        error: "All fields are Mandatory!",
        color: "red"
      });
    }
  }

  render() {
    const { classes } = this.props;

    const styles = {
      errorColor: {
        color: this.state.color
      }
    };

    return (
      <div>
        <AppBar
          position="static"
          color="default"
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar className={classes.toolbar}>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              className={classes.toolbarTitle}
            >
              Bulk Purchase App
            </Typography>
            <nav>
              <Link variant="button" href="#" className={classes.link}>
                Add
              </Link>
              <Link
                variant="button"
                color="textPrimary"
                href="/vendor/view"
                className={classes.link}
              >
                View
              </Link>
              <Link
                variant="button"
                color="textPrimary"
                href="/vendor/ready"
                className={classes.link}
              >
                Ready to Dispatch
              </Link>
              <Link
                variant="button"
                color="textPrimary"
                href="/vendor/dispatched"
                className={classes.link}
              >
                Dispatched
              </Link>
            </nav>
            <Button
              href="#"
              color="primary"
              variant="outlined"
              className={classes.link}
              onClick={this.logout}
            >
              Log Out
            </Button>
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              <br />
              <center>
                <b>ADD A PRODUCT</b>
              </center>
              <br />
              <br />
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormLabel component="legend">
                    <b>Name of Product:</b>
                    <br />
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    name="name"
                    autoComplete="name"
                    onChange={this.handleChange}
                    value={this.state.name}
                  />
                </Grid>

                <Grid item xs={12}>
                  <br />
                  <FormLabel component="legend">
                    <b>Price of Bundle: (in INR)</b>
                    <br />
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="price"
                    id="price"
                    autoComplete="price"
                    onChange={this.handleChange}
                    value={this.state.price}
                  />
                </Grid>
                <Grid item xs={12}>
                  <br />
                  <FormLabel component="legend">
                    <b>Quantity in Bundle:</b>
                    <br />
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="quantity"
                    id="quantity"
                    autoComplete="quantity"
                    onChange={this.handleChange}
                    value={this.state.quantity}
                  />
                </Grid>
              </Grid>
              <br />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.onSubmit}
              >
                Add Product
              </Button>
              <br />
              <br />
              <Grid container>
                <Grid item>
                  <p style={styles.errorColor}>{this.state.error}</p>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Container>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(VendorAdd));
