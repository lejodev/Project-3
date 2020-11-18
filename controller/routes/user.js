require ('dotenv').config();

const express = require("express");
const router = express.Router();
const sequelize = require("./connection");
const jwt = require('jsonwebtoken');
const checkRole = require('../middlewares/checkRole');

const JWTSecret = process.env.JWT_SECRET;

router.use(express.json());

// router.use(checkRole);

router.get("/", checkRole, async (req, res) => {

  sequelize
    .query(`SELECT id, fullName, userName, email, phone, address, isAdmin FROM user`, { type: sequelize.QueryTypes.SELECT })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.send(`Error geting all users: ${err}`);
    });
});

router.get("/login", async(req, res) => {

  if (req.body.userName && req.body.password) {
    const user = await sequelize.query(`SELECT * FROM user WHERE userName = :userName and password = :password`,{
      replacements : {
        userName : req.body.userName,
        password : req.body.password
      },
      type : sequelize.QueryTypes.SELECT
    });

    if (user.length > 0) {

      const userPayload = {
        id : user[0].id,
        userName : user[0].userName,
        fullName : user[0].fullName,
        role : user[0].isAdmin
      }
      
      console.log(userPayload);

      const token = jwt.sign(userPayload, JWTSecret);

      res.status(200).send(token)
    } else {
      res.status(404).send('User not found')
    }

  } else {
    res.status(400).send('Error: We are getting problems while processing the data you sent, please verify it')
  }
});

router.get("/:id", checkRole, async (req, res) => { // Pending: User only can see its information, not that about other users

  if (isNaN(req.params.id)) {
    res.status(400).send(`Error: ${req.params.id} is an invalid id`);
  } else {

    const user = await sequelize.query(`SELECT  id, fullName, userName, email, phone, address, isAdmin FROM user WHERE id = :id`, {
      replacements: { id: req.params.id },
      type: sequelize.QueryTypes.SELECT,
    });

    if (user.length > 0) {
      res.status(200).json(user);
    } else {
      res.status(404).send('User doesn´t exist is this database');
    }

  }

});

router.post('/signin', (req, res) => {
  sequelize
    .query(
      `INSERT INTO user(fullName, userName, password, email, phone, address, isAdmin) 
  VALUES(
        '${req.body.fullName}',
        '${req.body.userName}',
        '${req.body.password}',
        '${req.body.email}',
        ${req.body.phone},
        '${req.body.address}',
        ${req.body.isAdmin}
    )`,
      { type: sequelize.QueryTypes.INSERT }
    )
    .then(() => {
      res.status(200).send("You have signed in correctly");
    })
    .catch((err) => {
      res.status(400).send("Bad request, check your input " + err);
    });
});

module.exports = router;
