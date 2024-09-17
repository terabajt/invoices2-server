import express from "express";
import User from "../models/user.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(400).send({ message: "Token is required" });
    }

    const user = await User.findOne({ activationToken: token });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.isActive) {
      return res.status(400).send({ message: "The user is already activated" });
    }

    user.isActive = true;
    await user.save();

    res.status(200).send({ message: "User activated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export default router;
