const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sequelize = require("./connection");
const checkRole = require("../middlewares/checkRole");

const productService = require("../../services/product-service");
const orderService = require("../../services/order-service");

const JWTSecrest = process.env.JWT_SECRET;

router.use(express.json());

router.post("/", async (req, res, next) => {
  const order = req.body;

  if (validateProduct(order)) {
    const token = req.headers.authorization.split(" ")[1]; //service
    const user = jwt.verify(token, JWTSecrest); //service

    const paymentMethod = order.paymentMethod;
    const products = order.products;

    const prodsResult = await productService.amountMatches(products);

    if (prodsResult) {
      const orderQuery = orderService.createOrder(
        user,
        paymentMethod,
        products
      );
      if (orderQuery) {
        res.status(201).send("Order created successfully");
      } else {
        res
          .status(400)
          .send("Error processing your order, please verify your input" + err);
      }
    } else {
      res.status(404).send("Some of the ids you provided, doesn´t exists");
    }
  } else {
    res
      .status(400)
      .send("Error processing your order, please verify your input");
  }
});

router.put("/", checkRole, (req, res) => {});

router.get("/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, JWTSecrest);
  const userId = user.id;

  let orders = null;

  if (user.role === 1) {
    orders = await orderService.detailedOrders();
  } else {
    orders = await orderService.myOrder(userId);
  }

  const result = null;

  await Promise.all(orders).then(async orders => {
    orders.map(order => {
      order.description = orderService.orderDescription(order.userId, order['hour']);
      order.total = orderService.totalOrder(order.userId, order['hour'])
    })
  }).then(() => {
    res.send(orders)
    console.log(orders);
  }).catch(err => {
    console.log(err);
  })




});

function validateProduct(order) {
  if (
    order !== null &&
    order.hasOwnProperty("paymentMethod") &&
    order.hasOwnProperty("products") &&
    order.products !== null &&
    order.products.length > 0
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = router;
