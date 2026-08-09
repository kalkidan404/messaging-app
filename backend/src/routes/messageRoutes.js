const express = require("express");

const {
    getmessages,
    getmessage,
    sendmessage,
    update,
    deleted, 
    getConversation
} = require("../controller/messageController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getmessages);

router.get("/:id", authMiddleware, getmessage);

router.post("/send", authMiddleware, sendmessage);

router.put("/:id", authMiddleware, update);

router.delete("/:id", authMiddleware, deleted);
router.get("/conversation/:userId", authMiddleware, getConversation);
module.exports = router;