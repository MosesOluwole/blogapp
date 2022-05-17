import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan, { token } from "morgan";
import mysql from "mysql2";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import fileUpload from "express-fileupload";
import bcrypt from "bcryptjs";
import { body } from "express-validator";
import db from "./models/index.js";
import qrcode from "qrcode";
import util from "util";
import crypto from "crypto";
import base32Encode from "base32-encode";
import { verifyTOTP } from "./middleware/otp.js";
import { setUser, getUser, getUserById } from "./controllers/user.js";

const whitelist = ["http://localhost:3000"];

const app = express();

// db.sequelize.sync({ force: false });
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Origin:", origin);
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    exposedHeaders: ["Access-Control-Allow-Origin"],
  })
);
app.use(fileUpload());

// Restore user from session
app.use(function (req, res, next) {
  if (req.headers.authorization) {
    req.user = getUserByToken(req.headers.authorization);
  }
  const t = req.param("authorization");
  if (t) {
    req.user = getUserByToken(t);
  }
  next();
});

function getUserByToken(token = "") {
  // console.log(token);
  token = token.replace("Bearer ", "");
  const f = getUser(token);
  return f;
}

const IMGAE_PATH = "/Users/olumide/Desktop/Osagie/blog/client/public/images/";
app.use("/api/users", userRouter);
app.use("/api/post", postRouter);

app.get("/api/mfa_qr_code", async (req, res) => {
  const user = req.user;
  // For security, we no longer show the QR code after is verified
  //if (user.mfaEnabled) return res.status(404).end();

  if (!user.mfaSecret) {
    // generate unique secret for user
    // this secret will be used to check the verification code sent by user
    const buffer = await util.promisify(crypto.randomBytes)(14);
    user.mfaSecret = base32Encode(buffer, "RFC4648", { padding: false });
    await setUser(user);
  }

  const issuer = "Blog";
  const algorithm = "SHA1";
  const digits = "6";
  const period = "30";
  const otpType = "totp";
  const configUri = `otpauth://${otpType}/${issuer}:${user.username}?algorithm=${algorithm}&digits=${digits}&period=${period}&issuer=${issuer}&secret=${user.mfaSecret}`;

  res.setHeader("Content-Type", "image/png");

  otpauth: qrcode.toFileStream(res, configUri);
});
app.post("/api/verify_otp", async (req, res) => {
  const user = req.user;
  const currentUser = await getUserById(user.id);
  if (!currentUser) {
    res.send(new Error("user not found"));
    return;
  }
  if (verifyTOTP(req.body.code, currentUser.mfaSecret)) {
    user.mfaEnabled = true;
    setUser(user);
    res.json(true);
  } else {
    res.json(false);
  }
});
const port = 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
