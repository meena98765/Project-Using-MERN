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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

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

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

function createData(name, id, price, quantityRemaining) {
  return { name, id, price, quantityRemaining };
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

class CustomerView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userData: ""
    };

    this.handleQuantity = this.handleQuantity.bind(this);
    this.edit = this.edit.bind(this);
    this.onChangeRating = this.onChangeRating.bind(this);
    this.onChangeReview = this.onChangeReview.bind(this);
    this.rate = this.rate.bind(this);
    this.review = this.review.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const jwt = getJwt();

    console.log("jwt", jwt);

    if (!jwt) {
      this.props.history.push("/LogIn");
    } else {
      axios
        .get("http://localhost:4000/auth", {
          headers: { authorization: `Bearer: ${jwt}` }
        })
        .then(res => {
          this.setState({
            userData: res.data
          });

          if (res.data.type === "vendor") {
            localStorage.removeItem("access-token");
            this.props.history.push("/login");
          }

          axios
            .post("http://localhost:4000/orders/view", {
              customerID: this.state.userData.id
            })
            .then(res => {
              this.setState({
                products: res.data
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log("now");
          // console.log(this.state.userData);
          console.log(err);
          localStorage.removeItem("access-token");
          this.props.history.push("/LogIn");
        });
    }
  }

  handleQuantity(event, id) {
    const { value } = event.target;
    const key = "quantity" + id;
    this.setState({
      [key]: value
    });
    console.log(this.state);
  }

  onChangeReview(event, id) {
    const { value } = event.target;
    const key = "review" + id;
    this.setState({
      [key]: value
    });
    console.log(this.state);
  }

  logout() {
    localStorage.removeItem("access-token");
    window.location.reload();
  }

  edit(event, orderID, productID, oldQuantity, quantityRemaining) {
    console.log("ordering");

    const key = "quantity" + orderID;
    const entered = this.state[key];

    console.log(
      "entered",
      orderID,
      productID,
      oldQuantity,
      entered,
      quantityRemaining
    );

    if (isNaN(entered)) {
      alert("Please enter a number.");
      return;
    }

    if (entered == undefined || entered <= 0) {
      alert("Enter a positive quantity");
      return;
    }

    if (entered > quantityRemaining + oldQuantity) {
      alert(
        "Your required quantity should not exceed maximum avialable quantity."
      );
      return;
    }

    axios
      .post("http://localhost:4000/orders/edit", {
        customerID: this.state.userData.id,
        orderID: orderID,
        productID: productID,
        oldQuantity: oldQuantity,
        newQuantity: entered
      })
      .then(res => {
        axios
          .post("http://localhost:4000/orders/view", {
            customerID: this.state.userData.id
          })
          .then(res => {
            this.setState({
              products: res.data
            });
            alert("Bought Succesfully");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onChangeRating(event, orderID) {
    const { value } = event.target;
    const key = "rating" + orderID;
    console.log("value is", orderID, value);
    this.setState(
      {
        [key]: value
      },
      () => {
        console.log("rating change", this.state);
      }
    );
  }

  rate(event, orderID, productID) {
    event.preventDefault();
    console.log("rating");
    const key = "rating" + orderID;
    console.log("entered2", orderID, productID);

    const rating = this.state[key];

    console.log("entered", orderID, productID, rating);

    if (isNaN(rating)) {
      alert("Please select a value");
      return;
    }

    if (rating == undefined || rating <= 0) {
      alert("Please select a value");
      return;
    }

    axios
      .post("http://localhost:4000/orders/rate", {
        orderID: orderID,
        productID: productID,
        ratingGiven: rating
      })
      .then(res => {
        axios
          .post("http://localhost:4000/orders/view", {
            customerID: this.state.userData.id
          })
          .then(res => {
            this.setState({
              products: res.data
            });
            alert("Rated Succesfully");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  review(event, orderID, productID) {
    event.preventDefault();
    console.log("review");
    const key = "review" + orderID;
    console.log("entered2", orderID, productID);

    const review = this.state[key];

    console.log("entered", orderID, productID, review);

    if (review == undefined || review === "") {
      alert("Please enter a review.");
      return;
    }

    console.log("just before review");

    axios
      .post("http://localhost:4000/orders/review", {
        orderID: orderID,
        productID: productID,
        reviewGiven: review
      })
      .then(res => {
        console.log("hope reached here");
        axios
          .post("http://localhost:4000/orders/view", {
            customerID: this.state.userData.id
          })
          .then(res => {
            console.log("check haha");
            this.setState({
              products: res.data
            });
            alert("Reviewed Succesfully");
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log("did it reach here?");
        console.log(err);
      });
  }

  render() {
    const { classes } = this.props;
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
              <Link
                variant="button"
                color="textPrimary"
                href="/customer/search"
                className={classes.link}
              >
                Search for Product
              </Link>
              <Link variant="button" href="#" className={classes.link}>
                View Orders
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
        <br />
        <br />
        <br />
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sr. No</StyledTableCell>
                <StyledTableCell align="center">Product Name</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">
                  Quantity Ordered
                </StyledTableCell>
                <StyledTableCell align="center">
                  Remaining Quantity
                </StyledTableCell>
                <StyledTableCell align="center">Edit Quantity</StyledTableCell>
                <StyledTableCell align="center">Order ?</StyledTableCell>
                <StyledTableCell align="center">Rate Order</StyledTableCell>
                <StyledTableCell align="center">Rate?</StyledTableCell>
                <StyledTableCell align="center">Review Order</StyledTableCell>
                <StyledTableCell align="center">Review ?</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.products && this.state.products.length ? (
                this.state.products.map(row => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.id}
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ color: row.color }}
                      align="center"
                      component="th"
                      scope="row"
                    >
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="center" component="th" scope="row">
                      {row.quantityRemaining}
                    </StyledTableCell>
                    {row.status === "WAITING" ? (
                      <StyledTableCell align="center">
                        <form
                          className={classes.root}
                          noValidate
                          autoComplete="off"
                          onChange={e => this.handleQuantity(e, row._id)}
                        >
                          <TextField id="standard-basic" label="New Quantity" />
                        </form>
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell align="center"></StyledTableCell>
                    )}
                    {row.status === "WAITING" ? (
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          name="isCancelled"
                          onClick={e =>
                            this.edit(
                              e,
                              row._id,
                              row.productID,
                              row.quantity,
                              row.quantityRemaining
                            )
                          }
                        >
                          Order
                        </Button>
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell align="center"></StyledTableCell>
                    )}
                    {row.status === "DISPATCHED" ? (
                      <StyledTableCell align="center">
                        {!row.isRated ? (
                          <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-helper-label">
                              Rating
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-helper-label"
                              id="demo-simple-select-helper"
                              onChange={e => this.onChangeRating(e, row._id)}
                              value={this.state["rating" + row._id] || 0}
                            >
                              <MenuItem value={1}>1</MenuItem>
                              <MenuItem value={2}>2</MenuItem>
                              <MenuItem value={3}>3</MenuItem>
                              <MenuItem value={4}>4</MenuItem>
                              <MenuItem value={5}>5</MenuItem>
                            </Select>
                            <FormHelperText>Select from 1 to 5</FormHelperText>
                          </FormControl>
                        ) : (
                          <p style={{ color: "blue" }}>
                            <b>{row.rating}</b>
                          </p>
                        )}
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell align="center"></StyledTableCell>
                    )}
                    {row.status === "DISPATCHED" ? (
                      <StyledTableCell align="center">
                        {!row.isRated ? (
                          <Button
                            variant="outlined"
                            color="primary"
                            name="isCancelled"
                            onClick={e => this.rate(e, row._id, row.productID)}
                          >
                            Rate
                          </Button>
                        ) : (
                          <p>Already rated!</p>
                        )}
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell align="center"></StyledTableCell>
                    )}
                    {row.status === "DISPATCHED" ? (
                      <StyledTableCell align="center">
                        {!row.isReviewed ? (
                          <form
                            className={classes.root}
                            noValidate
                            autoComplete="off"
                            onChange={e => this.onChangeReview(e, row._id)}
                          >
                            <TextField id="standard-basic" label="Review" />
                          </form>
                        ) : (
                          <p>
                            <b>{row.review}</b>
                          </p>
                        )}
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell align="center"></StyledTableCell>
                    )}
                    {row.status === "DISPATCHED" ? (
                      <StyledTableCell align="center">
                        {!row.isReviewed ? (
                          <Button
                            variant="outlined"
                            color="primary"
                            name="isCancelled"
                            onClick={e =>
                              this.review(e, row._id, row.productID)
                            }
                          >
                            Review
                          </Button>
                        ) : (
                          <p>Already reviewed!</p>
                        )}
                      </StyledTableCell>
                    ) : (
                      <StyledTableCell align="center"></StyledTableCell>
                    )}
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow></StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(CustomerView));
