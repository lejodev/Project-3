const sequelize = require("../routes/connection");


function checkProduct(productId) {

    const product =  sequelize.query(`SELECT * FROM product WHERE id = :id`,
    {
        replacements : {id : productId},
        type : sequelize.QueryTypes.SELECT
    });

    if(product.length == 0) {
        console.log('Product doesn´t exists');
    } else {
        console.log('Exists');
    }
}

module.exports = checkProduct;