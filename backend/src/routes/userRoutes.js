const express = require("express");

const {
    getUser,
    updateUser,
    deleteAccount
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/",authMiddleware, getUser);
router.put("/update",authMiddleware, updateUser);
router.delete("/delete",authMiddleware, deleteAccount);

module.exports = router;