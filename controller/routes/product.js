const express = require("express");
const { type } = require("os");
const router = express.Router();
const sequelize = require("./connection");

router.use(express.json());

router.get("/", (req, res) => {
  sequelize
    .query("select * from product", { type: sequelize.QueryTypes.SELECT })
    .then((products) => {
      res.json(products);
      console.log(products);
    })
    .catch((err) => {
      console.log(`Error getting products ${err}`);
    });
});

router.post("/", (req, res) => {
  // console.log(req.body);
  sequelize
    .query(
      `insert into product(name, price) VALUES('${req.body.name}',${req.body.price})`,
      { type: sequelize.QueryTypes.INSERT }
    )
    .then(() => {
      console.log(req.body);
      res.status(201).send('Producto añadido satisfactoriamente');
    })
    .catch((err) => {
      console.log(`Error setting your product ${err}`);// Catch errors from api documentation
    });
});

router.put("/:id", async (req, res) => {

    var product = await sequelize.query(`SELECT * FROM product where id = ${req.params.id}`, {
        type : sequelize.QueryTypes.SELECT
    });

    if (product.length > 0) {
        console.log(req.params);
        await sequelize.query(`UPDATE product SET price = :price WHERE id = ${req.params.id}`,{
            replacements: {
                price : req.body.price
            },
            type: sequelize.QueryTypes.UPDATE
        })
        res.status(200).send('Price successfully changed')
    } else {
        res.status(400).json({message: "This product doesn't exists in our store"})
    }
});

router.delete('/:id', async(req, res) => {
    const product = await sequelize.query(`SELECT * FROM product WHERE id = ${req.params.id}`, {
        type : sequelize.QueryTypes.SELECT
    });

    if (product.length > 0) {

        await sequelize.query(`delete from product where id = ${req.params.id};`)
        res.status(200).send('Product successfully deleted');
    } else {
        res.status(404).json({message: "Product not found"});
    }
})

module.exports = router;