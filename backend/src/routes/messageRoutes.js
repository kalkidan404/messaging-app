const express = require("express");

const {
    getmessages,
    getmessage,
    sendmessage,
    update,
    deleted
} = require("../controller/messageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getmessages);

router.get("/:id", authMiddleware, getmessage);

router.post("/send", authMiddleware, sendmessage);

router.put("/:id", authMiddleware, update);

router.delete("/:id", authMiddleware, deleted);

module.exports = router;