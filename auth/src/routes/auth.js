import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "email required" });
    }

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        email,
        passwordHash: "dummy"
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES
    });

    return res.json({ token, userId: user.id });
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
});

export default router;
