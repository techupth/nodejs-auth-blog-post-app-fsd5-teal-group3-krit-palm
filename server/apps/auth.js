import { Router } from "express";
import { db } from "../utils/db";
import bcrypt from "bcrypt";
const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
const usersCollection = db.collection("users");

authRouter.post("/register", async (req, res) => {
  const newUser = { ...req.body };
  const check = await collection
    .find({ username: req.body.username })
    .toArray();
  if (check.length) {
    return res.status(400).json({
      message: "username has been use",
    });
  }
  const salt = await bcrypt.salt(10);

  newUser.username = await bcrypt.hash(newUser.username, salt);

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
  if (!checkUser.length) {
    return res.status(400).json({
      message: "username or password not found",
    });
  }
  const isValidPassword = await bcrypt.compare(
    loginUser.password,
    checkUser.password
  );
  if (!isValidPassword) {
    return res.status(400).json({
      message: "username or password not found",
    });
  }
  const token = jwt.sign(
    {
      id: checkUser.id,
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
