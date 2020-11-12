const Sequelize = require('sequelize');
const path = ('mysql://root@localhost:3306/DelilahResto');
const sequelize = new Sequelize(path, {operatorAliases : false});

sequelize.authenticate().then(() => {
    console.log('Signed');
}).catch(err => {
    console.log(`Database authentication error: ${err}`);
});

module.exports = sequelize;