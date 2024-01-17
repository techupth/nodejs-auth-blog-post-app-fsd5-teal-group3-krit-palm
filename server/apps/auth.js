import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
const usersCollection = db.collection("users");

authRouter.post("/register", async (req, res) => {
  const newUser = { ...req.body };
  const check = await usersCollection
    .find({ username: req.body.username })
    .toArray();
  if (check.length) {
    return res.status(400).json({
      message: "username has been use",
    });
  }
  const salt = await bcrypt.genSalt(10);

  newUser.password = await bcrypt.hash(newUser.password, salt);

  const result = await usersCollection.insertOne(newUser);

  return res.json({
    message: "User has been created successfully",
  });
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
  const loginUser = { ...req.body };
  const checkUser = await usersCollection
    .find({ username: loginUser.username })
    .toArray();
  console.log(checkUser);
  if (!checkUser.length) {
    return res.status(400).json({
      message: "username or password not found",
    });
  }
  const isValidPassword = await bcrypt.compare(
    loginUser.password,
    checkUser[0].password
  );
  if (!isValidPassword) {
    return res.status(400).json({
      message: "username or password not found",
    });
  }
  const token = jwt.sign(
    {
      id: checkUser._id,
      firstName: checkUser.firstName,
      lastName: checkUser.lastName,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "900000",
    }
  );
  return res.json({
    message: "login succesfully",
    token,
  });
});

export default authRouter;
