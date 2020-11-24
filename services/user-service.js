const sequelize = require("../controller/routes/connection");

const signIn = async (requestBody) => {
  return await sequelize.query(
    `INSERT INTO user(fullName, userName, password, email, phone, address, isAdmin) 
  VALUES(
        '${requestBody.fullName}',
        '${requestBody.userName}',
        '${requestBody.password}',
        '${requestBody.email}',
        ${requestBody.phone},
        '${requestBody.address}',
        ${requestBody.isAdmin}
    )`,
    { type: sequelize.QueryTypes.INSERT }
  );
};

const login = async (requestBody) => {
  if (requestBody.userName && requestBody.password) {
    return await sequelize.query(
      `SELECT * FROM user WHERE userName = :userName and password = :password`,
      {
        replacements: {
          userName: requestBody.userName,
          password: requestBody.password,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
  } else {
    res
      .status(400)
      .send(
        "Error: We are getting problems while processing the data you sent, please verify it"
      );
  }
};

module.exports = {
  signIn,
  login
};
