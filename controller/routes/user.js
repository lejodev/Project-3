const express = require("express");
const router = express.Router();
const sequelize = require("./connection");

router.use(express.json());

router.post("/user", (req, res) => {
  sequelize
    .query(
      `INSERT INTO user(fullName, userName, userPassword, email, phone, userAddress) VALUES
    (
        '${req.body.fullName}',
        '${req.body.userName}',
        '${req.body.userPassword}',
        '${req.body.email}',
        ${req.body.phone},
        '${req.body.userAddress}'
    )`
    )
    .then(() => {
      res.status(200).send("You have signed in correctly");
    })
    .catch((err) => {
      res.status(400).send("Bad request, check your input" + err);
    });
});

module.exports = router;
