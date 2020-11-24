require("dotenv").config();

const express = require("express");
const router = express.Router();
const sequelize = require("./connection");
const jwt = require("jsonwebtoken");
const user_service = require("../../services/user-service");
const checkRole = require("../middlewares/checkRole");

const JWTSecret = process.env.JWT_SECRET;

router.use(express.json());

router.get("/login", async (req, res) => {
  const user = await user_service.login(req.body);
  console.log(user);

  if (user.length > 0) {
    const userPayload = {
      id: user[0].id,
      userName: user[0].userName,
      fullName: user[0].fullName,
      role: user[0].isAdmin,
    };

    const token = jwt.sign(userPayload, JWTSecret);

    res.status(200).send(token);
  } else {
    res.status(404).send("User not found");
  }
});

router.post("/signin", (req, res) => {
  user_service
    .signIn(req.body)
    .then(() => {
      res.status(201).send("SignedIn successfully");
    })
    .catch((err) => {
      res.status(400).send("Error while signing in");
    });
});

module.exports = router;
