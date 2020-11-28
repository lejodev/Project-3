const express = require("express");
const router = express.Router();
const sequelize = require("./connection");
const checkRole = require("../middlewares/checkRole");

const productService = require("../../services/product-service");

router.use(express.json());

router.get("/", async (req, res) => {
  // Get the list of products
  productService.getProducts().then((products) => res.json(products));
});

router.get("/:id", async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  product.length > 0 ? res.status(200).send(product): res.status(404).send(`Product with id ${req.params.id} not found`);
});

router.post("/", checkRole, async (req, res) => {
  productService
    .addProduct(req.body.name, req.body.price)
    .then((resp) => {
      res.status(201).send("Product added successfully");
    })
    .catch((err) => {
      res.status(400).send("Bad request, check your input");
    });
});

router.put("/:id", checkRole, async (req, res, next) => {
  const product = await productService.getProductById(req.params.id);

  if (product.length > 0) {
    productService
      .updateById(req.body.name, req.body.price, req.params.id)
      .then((resp) => {
        console.log("WELL");
      });
    res.status(200).send("Product successfully modified");
  } else {
    res.status(400).send("This product doesn't exists in our store");
  }
});

router.delete("/:id", checkRole, async (req, res) => {

  const id = req.params.id;
  console.log(req.params.id);

  await productService.selectExists(id).then(() => {
    res.status(200).send('Product successfully deleted');
  }).catch(err =>{
    res.status(400).send(`An error accurred while trying to delete the product: ${err}`);
  });
});

module.exports = router;

// ========== PENDING ==========

//  Make first query (SELECT) importable from another file to provide code reusability
