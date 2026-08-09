const prisma = require("../config/prisma");

const getmessages = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: req.user.id,
                        receiverId: userId
                    },
                    {
                        senderId: userId,
                        receiverId: req.user.id
                    }
                ]
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};


const getmessage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const message = await prisma.message.findUnique({
            where: {
                id
            }
        });

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
};


const sendmessage = async (req, res, next) => {
    try {
        const { content, receiverId } = req.body;

        const message = await prisma.message.create({
            data: {
                content,
                senderId: req.user.id,
                receiverId
            }
        });

        res.status(201).json({
            message: "Message sent successfully",
            data: message
        });
    } catch (error) {
        next(error);
    }
};


const update = async (req, res, next) => {
    try {
        const { content } = req.body;
        const { id } = req.params;

        const message = await prisma.message.findUnique({
            where: {
                id
            }
        });

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        if (message.senderId !== req.user.id) {
            return res.status(403).json({
                message: "Not allowed"
            });
        }

        const updatedMessage = await prisma.message.update({
            where: {
                id
            },
            data: {
                content
            }
        });

        res.status(200).json({
            message: "Message updated",
            data: updatedMessage
        });
    } catch (error) {
        next(error);
    }
};


const deleted = async (req, res, next) => {
    try {
        const { id } = req.params;

        const message = await prisma.message.findUnique({
            where: {
                id
            }
        });

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        if (message.senderId !== req.user.id) {
            return res.status(403).json({
                message: "Not allowed"
            });
        }

        await prisma.message.delete({
            where: {
                id
            }
        });

        res.status(200).json({
            message: "Message deleted"
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getmessages,
    getmessage,
    sendmessage,
    update,
    deleted
};