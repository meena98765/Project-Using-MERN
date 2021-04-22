require("dotenv").config();

const router = require("express").Router();
let Order = require("./../models/order");
let Product = require("../models/product");
let User = require("../models/user");
const { check, validationResult } = require("express-validator");

// Getting all the users
router.route("/").get((req, res) => {
  Order.find(function(err, orders) {
    if (err) {
      console.log(err);
    } else {
      res.json(orders);
    }
  });
});

router.post("/buy", (req, res) => {
  const id = req.body.productID;
  const customerID = req.body.customerID;
  const buyQuantity = req.body.buyQuantity;

  console.log("parameters are", req.body);

  Product.find(
    {
      _id: id
    },
    (err, products) => {
      if (err) {
        return res.status(200).json(err);
      }

      console.log(products);

      let quantityRemaining = products[0].quantityRemaining;

      if (quantityRemaining < buyQuantity) {
        return res.status(200).json({ success: false });
      }

      let order1 = new Order({
        productID: id,
        customerID: customerID,
        quantity: buyQuantity
      });

      console.log("new order is", order1);

      quantityRemaining -= buyQuantity;

      if (quantityRemaining !== 0) {
        Product.findByIdAndUpdate(
          { _id: id },
          { quantityRemaining: quantityRemaining },
          (err, product) => {
            if (err) {
              return res.status(200).json(err);
            }
            console.log("if");
            order1.save();
            console.log("if saved");
            return res.status(200).json({ success: true });
          }
        );
      } else {
        Product.findByIdAndUpdate(
          { _id: id },
          { quantityRemaining: 0, isReady: true },

          (err, product) => {
            if (err) {
              return res.status(200).json(err);
            }
            console.log("else");
            order1.save();
            console.log("else saved");
            return res.status(200).json({ success: true });
          }
        );
      }
    }
  );
});

// Getting a user by id
router.route("/:id", (req, res) => {
  let id = req.params.id;
  Order.findById(id, function(err, order) {
    res.json(order);
  });
});

router.post("/view", (req, res) => {
  const customerID = req.body.customerID;

  console.log("parameters are", req.body);

  Order.find(
    {
      customerID: customerID
    },
    (err, orders) => {
      if (err) {
        return res.status(200).json(err);
      }

      toRet = [];
      let done = 0;
      if (orders.length === 0) {
        return res.status(200).send(toRet);
      } else {
        for (var i = 0; i < orders.length; i++) {
          let order = orders[i];
          Product.find(
            {
              _id: order.productID
            },
            (err, product) => {
              if (err) {
                return res.status(500).json(err);
              }

              let temp = {};
              temp._id = order._id;
              temp.productID = order.productID;
              temp.id = done + 1;
              temp.name = product[0].name;
              temp.quantity = order.quantity;
              temp.quantityRemaining = product[0].quantityRemaining;
              temp.isReviewed = order.isReviewed;
              temp.isRated = order.isRated;
              temp.rating = order.productRating;
              temp.review = order.productReview;

              if (product[0].isCancelled) {
                temp.status = "CANCELLED";
                temp.color = "red";
              } else if (product[0].hasDispatched) {
                temp.status = "DISPATCHED";
                temp.color = "green";
              } else if (
                product[0].isReady ||
                product[0].quantityRemaining === 0
              ) {
                temp.status = "PLACED";
                temp.color = "blue";
              } else {
                temp.status = "WAITING";
                temp.color = "black";
              }

              toRet.push(temp);
              done++;
              console.log("temp is", temp);
              // console.log(done, toRet);

              if (done === orders.length) {
                return res.status(200).send(toRet);
              }
            }
          );
        }

        // return res.status(200).send(toRet);
      }
    }
  );
});

router.post("/edit", (req, res) => {
  const customerID = req.body.customerID;
  const orderID = req.body.orderID;
  const productID = req.body.productID;
  const oldQuantity = req.body.oldQuantity;
  const newQuantity = req.body.newQuantity;

  console.log(
    "entered",
    customerID,
    orderID,
    productID,
    oldQuantity,
    newQuantity
  );

  Product.find(
    {
      _id: productID
    },
    (err, products) => {
      if (err) {
        return res.status(500).json(err);
      }

      let quantityRemaining = products[0].quantityRemaining + oldQuantity;

      if (quantityRemaining < newQuantity) {
        return res.status(500).json({ success: false });
      }

      console.log("quanitity", quantityRemaining);

      quantityRemaining -= newQuantity;

      if (quantityRemaining !== 0) {
        Product.findByIdAndUpdate(
          { _id: productID },
          { quantityRemaining: quantityRemaining },
          (err, product) => {
            if (err) {
              return res.status(200).json(err);
            }
            console.log("if");
            Order.findByIdAndUpdate(
              { _id: orderID },
              { quantity: newQuantity },
              (err, order) => {
                if (err) {
                  return res.status(500).json(err);
                }

                return res.status(200).json({ success: true });
              }
            );
            console.log("if saved");
            // return res.status(200).json({ success: true });
          }
        );
      } else {
        Product.findByIdAndUpdate(
          { _id: productID },
          { quantityRemaining: 0, isReady: true },
          (err, product) => {
            if (err) {
              return res.status(200).json(err);
            }

            Order.findByIdAndUpdate(
              { _id: orderID },
              { quantity: newQuantity },
              (err, order) => {
                if (err) {
                  return res.status(500).json(err);
                }

                return res.status(200).json({ success: true });
              }
            );
            console.log("else saved");
            // return res.status(200).json({ success: true });
          }
        );
      }
    }
  );
});

router.post("/rate", (req, res) => {
  const orderID = req.body.orderID;
  const productID = req.body.productID;
  const ratingGiven = req.body.ratingGiven;

  console.log("to rate", orderID, productID, ratingGiven);

  Order.findByIdAndUpdate(
    {
      _id: orderID
    },
    {
      isRated: true,
      productRating: ratingGiven
    },
    (err, orders) => {
      if (err) {
        return res.status(500).json(err);
      }

      Product.find(
        { _id: productID },

        (err, product) => {
          if (err) {
            return res.status(500).json(err);
          }

          let vendorID = product[0].sellerID;

          User.find({ _id: vendorID }, (err, user) => {
            if (err) {
              return res.status(500).json(err);
            }

            let rateCount = user[0].rateCount;
            rateCount++;

            let rating = user[0].rating;
            rating += ratingGiven;

            User.findByIdAndUpdate(
              {
                _id: vendorID
              },
              {
                rating: rating,
                rateCount: rateCount
              },
              (err, user) => {
                if (err) {
                  return res.status(500).json(err);
                }

                return res.status(200).json({ success: true });
              }
            );
          });
        }
      );
    }
  );
});

router.post("/review", (req, res) => {
  const orderID = req.body.orderID;
  const productID = req.body.productID;
  const reviewGiven = req.body.reviewGiven;

  console.log("to review", orderID, productID, reviewGiven);

  Order.findByIdAndUpdate(
    {
      _id: orderID
    },
    {
      isReviewed: true,
      productReview: reviewGiven
    },
    (err, orders) => {
      if (err) {
        return res.status(500).json(err);
      }

      return res.status(200).json({ success: true });
    }
  );
});

module.exports = router;
