require("dotenv").config();

const router = require("express").Router();
let Order = require("./../models/order");
let Product = require("../models/product");
let User = require("../models/user");
// let User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const FuzzySearch = require("fuzzy-search");

// Getting all the users
router.route("/").get((req, res) => {
  Product.find(function(err, products) {
    if (err) {
      console.log(err);
    } else {
      res.json(products);
    }
  });
});

// Adding a new user
router.post(
  "/add",
  [check("price").isNumeric(), check("quantity").isNumeric()],
  (req, res) => {
    // console.log("here");
    // console.log(req.body);
    let product = new Product({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      sellerID: req.body.sellerID,
      quantityRemaining: req.body.quantity
    });

    console.log("here", product);
    // console.log("heyya");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    product
      .save()
      .then(product => {
        res.status(200).json({ Product: "Product added successfully" });
      })
      .catch(err => {
        console.log("yep", err);
        res.status(400).send(err);
      });
  }
);

// Getting a user by id
router.route("/:id", (req, res) => {
  let id = req.params.id;
  Product.findById(id, function(err, product) {
    res.json(product);
  });
});

router.post("/seller", (req, res) => {
  let sellerID = req.body.sellerID;

  console.log(sellerID);

  Product.find({
    sellerID: sellerID,
    isCancelled: false,
    isReady: false,
    hasDispatched: false,
    quantityRemaining: { $gte: 1 }
  })
    .then(products => {
      res.status(200).json(products);
    })
    .catch(err => {
      res.status(200).send(err);
      console.log(err);
    });
});

router.post("/delete", (req, res) => {
  let id = req.body.id;
  Product.deleteOne({ _id: id })
    .exec()
    .then(res => {
      res.status(200).send("deleted");
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/cancel", (req, res) => {
  let id = req.body.id;
  Product.findByIdAndUpdate({ _id: id }, { isCancelled: true })
    .exec()
    .then(res => {
      res.status(200).send("cancelled");
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/ready", (req, res) => {
  let sellerID = req.body.sellerID;

  console.log(sellerID);

  Product.find({
    sellerID: sellerID,
    isCancelled: false,
    quantityRemaining: 0,
    hasDispatched: false
  })
    .then(products => {
      res.status(200).json(products);
    })
    .catch(err => {
      res.status(200).send(err);
      console.log(err);
    });
});

router.post("/dispatch", (req, res) => {
  let id = req.body.id;
  Product.findByIdAndUpdate(
    { _id: id },
    { hasDispatched: true },
    (err, product) => {
      if (err) {
        res.status(400).json(err);
      }
      console.log("dispatching");
      return res.status(200).json({ success: true });
    }
  );
});

// router.post("/dispatched", (req, res) => {
//   let sellerID = req.body.sellerID;
//
//   console.log(sellerID);
//
//   Product.find({
//     sellerID: sellerID,
//     isCancelled: false,
//     hasDispatched: true
//   })
//     .then(products => {
//       res.status(200).json(products);
//     })
//     .catch(err => {
//       res.status(500).json(err);
//       console.log(err);
//     });
// });

router.post("/dispatched", (req, res) => {
  let sellerID = req.body.sellerID;

  console.log(sellerID);

  Product.find(
    {
      sellerID: sellerID,
      isCancelled: false,
      hasDispatched: true
    },
    (err, products) => {
      if (err) {
        return res.status(500).json(err);
      }

      toRet = [];
      let done = 0;
      if (products.length === 0) {
        return res.status(200).send(toRet);
      } else {
        for (var i = 0; i < products.length; i++) {
          let product = products[i];

          let temp = {};
          temp._id = product._id;
          temp.name = product.name;
          temp.price = product.price;
          temp.quantity = product.quantity;

          done = 0;

          Order.find(
            {
              productID: product._id
            },
            (err, orders) => {
              if (err) {
                return res.status(500).json(err);
              }

              let ratings = [];
              let reviews = [];
              let tot = 0;

              if (orders.length === 0) {
                temp.ratings = ratings;
                temp.reviews = reviews;

                toRet.push(temp);

                done++;

                if (done === products.length) {
                  return res.status(200).send(toRet);
                }
              }

              for (var j = 0; j < orders.length; j++) {
                let order = orders[j];

                if (order.isRated) {
                  ratings.push(order.productRating);
                }

                if (order.isReviewed) {
                  reviews.push(order.productReview);
                }

                tot++;

                if (tot === orders.length) {
                  temp.ratings = ratings;
                  temp.reviews = reviews;

                  console.log("reached here again", temp);
                  toRet.push(temp);

                  done++;

                  if (done === products.length) {
                    return res.status(200).send(toRet);
                  }
                }
              }

              // toRet.push(temp);
              // done++;
              // console.log("temp is", temp);
              // // console.log(done, toRet);
              //
              // if (done === orders.length) {
              //   return res.status(200).send(toRet);
              // }
            }
          );
        }

        // return res.status(200).send(toRet);
      }
    }
  );
});

router.post("/search", (req, res) => {
  Product.find({
    name: req.body.search,
    isCancelled: false,
    isReady: false,
    hasDispatched: false,
    quantityRemaining: { $gte: 1 }
  })
    .then(products => {
      toRet = [];
      let done = 0;
      if (products.length === 0) {
        return res.status(200).send(toRet);
      } else {
        for (var i = 0; i < products.length; i++) {
          let product = products[i];
          let sellerID = product.sellerID;
          User.find(
            {
              _id: sellerID
            },
            (err, user) => {
              if (err) {
                return res.status(500).json(err);
              }

              let temp = {};
              temp._id = product._id;
              temp.id = done + 1;
              temp.name = product.name;
              temp.vendorName = user[0].firstName + " " + user[0].lastName;
              temp.vendorID = user[0]._id;
              temp.price = product.price;
              temp.quantity = product.quantity;
              temp.quantityRemaining = product.quantityRemaining;
              temp.isCancelled = product.isCancelled;
              temp.isReady = product.isReady;
              temp.hasDispatched = product.hasDispatched;
              temp.vendorRating = user[0].rating / user[0].rateCount;
              toRet.push(temp);
              done++;
              // console.log(i + 1, temp);
              // console.log(done, toRet);

              if (done === products.length) {
                return res.status(200).send(toRet);
              }
            }
          );
        }

        // return res.status(200).send(toRet);
      }

      //
      // console.log("FINAL");
      // console.log(toRet);
      //
    })
    .catch(err => {
      res.status(200).send([]);
      console.log(err);
    });
});

router.post("/vendorReviews", (req, res) => {
  let sellerID = req.body.vendorID;

  console.log("sellerID", sellerID);

  Product.find(
    {
      sellerID: sellerID,
      hasDispatched: true
    },
    (err, products) => {
      if (err) {
        return res.status(500).json(err);
      }

      toRet = [];
      let done = 0;
      if (products.length === 0) {
        return res.status(200).send(toRet);
      } else {
        for (var i = 0; i < products.length; i++) {
          let product = products[i];

          let temp = {};

          done = 0;

          Order.find(
            {
              productID: product._id
            },
            (err, orders) => {
              if (err) {
                return res.status(500).json(err);
              }

              // let reviews = [];
              let tot = 0;

              if (orders.length === 0) {
                // temp.reviews = reviews;

                // toRet.push(temp);

                done++;

                if (done === products.length) {
                  return res.status(200).send(toRet);
                }
              }

              for (var j = 0; j < orders.length; j++) {
                let order = orders[j];

                if (order.isReviewed) {
                  toRet.push(order.productReview);
                }

                tot++;

                if (tot === orders.length) {
                  // temp.reviews = reviews;

                  console.log("reached here again 2", temp);
                  // toRet.push(temp);

                  done++;

                  if (done === products.length) {
                    return res.status(200).send(toRet);
                  }
                }
              }

              // toRet.push(temp);
              // done++;
              // console.log("temp is", temp);
              // // console.log(done, toRet);
              //
              // if (done === orders.length) {
              //   return res.status(200).send(toRet);
              // }
            }
          );
        }

        // return res.status(200).send(toRet);
      }
    }
  );
});

module.exports = router;
