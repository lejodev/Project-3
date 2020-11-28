const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const checkRole = require("../middlewares/checkRole");

const productService = require("../../services/product-service");
const orderService = require("../../services/order-service");

const JWTSecrest = process.env.JWT_SECRET;

router.use(express.json());

router.post("/", async (req, res, next) => {
  const order = req.body;

  if (productService.validateProduct(order)) {
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

router.put("/:id", checkRole, async (req, res) => {

  const orderId = req.params.id;
  const orderStatus = req.body.orderStatus;
  
  const orderExists = await orderService.getOrderById(orderId);
  console.log(orderExists);

  if (orderExists) {
    orderService.updateOrder(orderId, orderStatus).then(() => {
      res.status(200).send('Order status modified successfully')
    }).catch(err => {
      res.status(400).send(`Some error has occurred, please check your input. ERROR: ${err} `)
    });
  } else {
    res.status(404).send(`Order with id ${req.params.id} doesn´t exist`);
  }
});

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

  const response = await Promise.all(
    orders.map(async (order) => {
      // console.log(order);
      order["description"] = await orderService.orderDescription(
        order.userId,
        order["hour"]
      );
      const total = await orderService.totalOrder(order.userId, order["hour"])
      order["total"] = total[0]["total"];
      delete order.userId;
      return order;
    })
  );

  if (response.length >= 1) {
    res.status(200).json(response)
  } else {
    res.status(404).send('You have no orders');
  }
});

module.exports = router;
