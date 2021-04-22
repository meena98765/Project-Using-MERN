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
import axios from "axios";
import { getJwt } from "./../helpers/jwt";

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

class LogIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      type: "",
      error: "",
      color: ""
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
  }

  onSubmit(event) {
    event.preventDefault();

    const user = this.state;
    console.log("user is", user);

    if (
      user["email"] !== "" &&
      user["password"] !== "" &&
      user["type"] !== ""
    ) {
      // console.log("***");
      axios
        .post("http://localhost:4000/users/login", user)
        .then(res => {
          // console.log("**");
          // console.log(res.data);

          if (res.data.data === "Invalid Credentials") {
            // console.log("invalid");
            this.setState({
              error: "Invalid Credentials",
              color: "red",
              email: this.state.email,
              password: "",
              type: this.state.type
            });
          } else {
            // console.log("valid");
            const type = this.state.type;
            this.setState({
              error: "Logged in successfully!",
              color: "green",
              email: "",
              password: "",
              type: ""
            });
            localStorage.setItem("access-token", res.data);

            if (type === "customer") {
              this.props.history.push("/Customer");
            } else {
              this.props.history.push("/Vendor");
            }
          }
        })
        .catch(err => {
          console.log(user);
          console.log("here");
          console.log(err);
          this.setState({
            error: "Cannot login user",
            color: "red",
            email: "",
            password: "",
            type: ""
          });
        });
    } else {
      // console.log("****");

      this.setState({
        email: this.state.email,
        password: "",
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
                onClick={event => (window.location.href = "/Register")}
              >
                Register
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
              Login
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={this.handleChange}
                value={this.state.email}
              />
              <TextField
                variant="outlined"
                margin="normal"
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
              <Grid item xs={12}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormLabel component="legend">Login as a:</FormLabel>
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.onSubmit}
              >
                Log In
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/Register" variant="body2">
                    {"Don't have an account? Register"}
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
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </Container>
    );
  }
}

export default withStyles(styles)(LogIn);
