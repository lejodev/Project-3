const sequelize = require("../controller/routes/connection");

const amountMatches = async (products) => {
  var counter = 0;

  console.log("START");

  for (let product = 0; product < products.length; product++) {
    const select = await sequelize.query(
      `SELECT * FROM product WHERE id = ${products[product].id}`,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (select.length === 0) {
      counter--;
    } else {
      counter++;
    }
  }

  console.log("END");
  return counter === products.length;
};

const getProducts = () => {
  return sequelize.query("select * from product", {
    type: sequelize.QueryTypes.SELECT,
  });
};

const getProductById = (id) => {
  const product = sequelize.query(`SELECT * FROM product WHERE id = :id`, {
    type: sequelize.QueryTypes.SELECT,
    replacements: { id: id },
  });

  return product;
};

const addProduct = async (name, price) => {
  return sequelize.query(
    `insert into product(name, price) VALUES('${name}',${price})`,
    { type: sequelize.QueryTypes.INSERT }
  );
};

const updateById = async (name, price, id) => {
  return await sequelize.query(
    `UPDATE product SET name = :name , price = :price WHERE id = ${id}`,
    {
      replacements: {
        name: name,
        price: price,
      },
      type: sequelize.QueryTypes.UPDATE,
    }
  );
};

const selectExists = async (id) => {
  
  const result = await sequelize.query(
    `SELECT * FROM map_order_product where productId = ${id}`, {
      type : sequelize.QueryTypes.SELECT
    }
  );

  if (result.length >= 1) {
    await sequelize.query(`delete from map_order_product where productId = ${id}`, {
      type : sequelize.QueryTypes.DELETE
    }).then(() => {
      console.log('DELETED');
      deleteProductById(id);
    })
  } else {
    deleteProductById(id);
  }
  console.log('AFFTER');
};

const deleteProductById = async (id) => {

  sequelize.query(`delete from product where id = ${id}`,{
    type : sequelize.QueryTypes.DELETE
  })

};

const createProduct = () => {};

module.exports = {
  amountMatches,
  getProducts,
  getProductById,
  addProduct,
  updateById,
  selectExists,
  createProduct,
};
