const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sequelize = require("./connection");
const checkRole = require("../middlewares/checkRole");
const checkProduct = require("../middlewares/checkProduct");
const { response } = require("express");

const JWTSecrest = process.env.JWT_SECRET;

router.use(express.json());

router.post("/", async (req, res) => {
  const order = req.body;

  if (validateProduct(order)) {

    // const paymentMethod = order.pop();

    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, JWTSecrest);

    const paymentMethod = order.paymentMethod;
    const products = order.products;

    const productsPromises = [];

    products.forEach((prod) => {
        
      let prodId = prod.id;
      const select = sequelize.query(
        `SELECT * FROM product WHERE id = ${prod.id}`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      console.log(select);
      productsPromises.push(select);
    });

    const validQueries = [];

    Promise.all(productsPromises)
      .then(async (resp) => {
        resp.some((order) => {
          if (order.length == 0) {
            return true;
          } else {
            validQueries.push(order);
            console.log(order);
          }
        });

        if (validQueries.length === order.length) {
          sequelize.query(
              "INSERT INTO `order` (id, status, hour, paymentMethod) VALUES (:id, :status,  CURTIME(), :paymentMethod)",
              {
                replacements: {
                  id: userId,
                  status: "new",
                  paymentMethod: paymentMethod["paymentMethod"]
                },
                type: sequelize.QueryTypes.INSERT,
              }
            )
            .then(() => {
              console.log("Success");
              order.some((singleOrder) => {
                if (isNaN(singleOrder["id"]) || isNaN(singleOrder["amount"])) {
                  res.status(400).send("Error processing your order, please verify your input");
                  console.log("Bad");
                  return true;
                } else {
                  try {
                    sequelize.query(
                        `INSERT INTO map_order_product (orderId, productId, amount, total)
                            VALUES(:orderId, :productId, :amount, :total)`,
                        {
                          replacements: {
                            orderId: userId,
                            productId: singleOrder["id"],
                            amount: singleOrder["amount"],
                            total: 6,
                          },
                          type: sequelize.QueryTypes.INSERT,
                        }
                      )
                      .then(() => {
                        console.log("SUCCESS");
                        console.log("Successfully table of map_order_product");
                      })
                      .catch((err) => {
                        console.log("SHIT");
                        return true;
                      });
                  } catch (error) {
                    console.log(error);
                  }
                }
              });
              res.status(201).send("Order created successfully");
            })
            .catch((err) => {
              res.status(400).send("Error 111111111111processing your order, please verify your input" +err);
            });
          console.log("Create order here!");
        } else {
          res.status(400).send(`One of your products doesn´t have a valid id`);
        }
      })
      .catch(() => {
        console.log("Uy perro");
      });
    console.log("paradise");
  } else {
    res.status(400).send("Error processing your order, please verify your input");
  }
  
});

function validateProduct(order) {
    if (order !== null && order.hasOwnProperty('paymentMethod') 
        && order.hasOwnProperty('products') && order.products !== null && order.products.length > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports = router;
