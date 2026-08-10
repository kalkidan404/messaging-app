
const express = require("express");

const {
  getUser,
  updateUser,
  deleteAccount,
  getUsers
} = require("../controller/userController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getUser
);

router.get(
  "/all",
  authMiddleware,
  getUsers
);

router.put(
  "/update",
  authMiddleware,
  upload.single("profileImage"),
  updateUser
);

router.delete(
  "/delete",
  authMiddleware,
  deleteAccount
);

module.exports = router;
