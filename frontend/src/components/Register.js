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
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      type: "",
      error: "",
      color: "green"
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // console.log("mount start");
    const jwt = getJwt();

    // console.log("jwt", jwt);

    if (jwt) {
      // console.log("else", jwt);
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
            this.props.history.push("/customer");
          }
          if (res.data.type === "vendor") {
            this.props.history.push("/vendor");
          }
          console.log("mine", this.state);
        })
        .catch(err => {
          console.log("haha", JSON.stringify(err));
        });
      console.log("final");
    }
  }

  handleChange(event) {
    // console.log(this.state)
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    // console.log(this.state)
  }

  onSubmit(event) {
    // console.log("hi");

    event.preventDefault();

    const user = this.state;
    // console.log(user);

    if (
      user["email"] !== "" &&
      user["password"] !== "" &&
      user["firstName"] !== "" &&
      user["lastName"] !== "" &&
      user["type"] !== ""
    ) {
      // console.log("***");
      axios
        .post("http://localhost:4000/users/register", user)
        .then(res => {
          // console.log("**");
          // console.log(res.data.User);
          this.setState({
            error: res.data.User,
            color: "green",
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            type: ""
          });
        })
        .catch(err => {
          console.log(user);
          console.log("here");
          console.log(err);
          this.setState({
            error: "Error: Cannot Register User",
            color: "red",
            email: this.state.email,
            password: "",
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            type: this.state.type
          });
        });
    } else {
      // console.log("****");

      this.setState({
        email: this.state.email,
        password: "",
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        type: this.state.type,
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
      <Container>
        <Container component="header" maxWidth="xl">
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                className={classes.title}
                style={{ flex: 1 }}
              ></Typography>
              <Button
                color="inherit"
                className="float-right"
                onClick={event => (window.location.href = "/LogIn")}
              >
                Log in
              </Button>
            </Toolbar>
          </AppBar>
        </Container>

        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
              <br />
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={this.handleChange}
                    value={this.state.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    onChange={this.handleChange}
                    value={this.state.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={this.handleChange}
                    value={this.state.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={this.handleChange}
                    value={this.state.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <FormLabel component="legend">Register as a:</FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="type"
                      value={this.state.type}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel
                        value="customer"
                        control={<Radio />}
                        label="Customer"
                      />
                      <FormControlLabel
                        value="vendor"
                        control={<Radio />}
                        label="Vendor"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.onSubmit}
              >
                Register
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/LogIn" variant="body2">
                    Already have an account? Log in
                  </Link>
                </Grid>
              </Grid>

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
      </Container>
    );
  }
}

export default withStyles(styles)(Register);
