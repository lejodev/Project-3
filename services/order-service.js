const sequelize = require("../controller/routes/connection");

const createOrder = async (user, paymentMethod, products) => {
  sequelize
    .query(
      "INSERT INTO `order` (userId, status, hour, paymentMethod) VALUES (:userId, :status,  CURTIME(), :paymentMethod)",
      {
        replacements: {
          userId: user.id,
          status: "new",
          paymentMethod: paymentMethod,
        },
        type: sequelize.QueryTypes.INSERT,
      }
    )
    .then((result) => {
      const orderId = result[0];

      products.forEach((product) => {
        sequelize.query(
          `INSERT INTO map_order_product (orderId, productId, amount, total) VALUES(:orderId, :productId, :amount, ${product.amount} * (select price from product where id = ${product.id}))`,
          {
            replacements: {
              orderId: orderId,
              productId: product["id"],
              amount: product["amount"],
            },
            type: sequelize.QueryTypes.INSERT,
          }
        ).catch(() => {
            console.log('AY MIERDA');
        });
      });
      return true;
    })
    .catch((err) => {
        return false;
    });
};

const myOrder = async (userId) => {
    return await sequelize.query("select status, hour, order.id, paymentMethod, userName, address from `order` inner join user on `order`.userId = user.id where userId =" + userId, {
        type: sequelize.QueryTypes.SELECT
    })
}

const detailedOrders = async () => {
    return await sequelize.query("select status, hour, order.id, paymentMethod, userName, user.id as userId, address from `order` inner join user on `order`.userId = user.id", {
        type: sequelize.QueryTypes.SELECT
    })
}

const totalOrder = async (id, hour) => {
    const result = await sequelize.query("select sum(total) from `order` inner join map_order_product on map_order_product.orderId = order.id inner join product on map_order_product.productId = product.id where hour = :hour and userId = :id",{
        replacements : {
            hour: hour,
            id: id
        },
        type: sequelize.QueryTypes.SELECT
    }).then(result => {
        console.log(result);
        return result;
    })

    // console.log(result);

}

const orderDescription = async (userId, hour) => {
    const result =  await sequelize.query("select amount, name from `order` inner join map_order_product on map_order_product.orderId = order.id inner join product on map_order_product.productId = product.id where hour = " + '"' + hour + '"' + " and userId = " + userId, {
        type: sequelize.QueryTypes.SELECT
    }).then(result => {
        console.log(result);
        return result
    })
    
    // console.log(result);
    console.log('OFF');
    // return result;
}

module.exports = {
  createOrder,
  myOrder,
  orderDescription,
  totalOrder,
  detailedOrders
};
