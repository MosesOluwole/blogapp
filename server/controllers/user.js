import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { body, validationResult } from "express-validator";

const secret = "test";
const UserModal = db.users;
const Op = db.Sequelize.Op;
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ where: { email } });
    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: oldUser.email, id: oldUser.id, mfaSecret: oldUser?.mfaSecret },
      secret,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ result: oldUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
{
}

export const getUserById = async (id) => {
  return await UserModal.findOne({ where: { id: id } });
};

export const getUser = (token) => {
  const tokens = jwt.decode(token);
  return tokens;
};

export const setUser = async (user) => {
  const result = await UserModal.update(
    { mfaSecret: user.mfaSecret },
    {
      where: {
        email: user.email,
      },
    }
  );
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModal.findOne({ where: { email } });
    if (oldUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({
      email,
      password: hashedPassword,
      firstname: firstName,
      lastname: lastName,
    });

    const token = jwt.sign({ email: result.email, id: result.id }, secret, {
      expiresIn: "1h",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export async function verifyOtp(code) {
  const res = await fetch("/verify_otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  return res.json();
}
