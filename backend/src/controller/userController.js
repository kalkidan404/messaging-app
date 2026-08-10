const prisma = require("../config/prisma");

const getUser = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                email: true,
                name: true,
                profileImage: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
};
const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        profileImage: true
      }
    });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};


const updateUser = async (req, res, next) => {
  try {
    const { name } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    let profileImage = user.profileImage;

    if (req.file) {
      const cloudinary = require("../config/cloudinary");

      profileImage =
        await new Promise((resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: "messaging-app/profiles",
                resource_type: "image"
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result.secure_url);
                }
              }
            );

          uploadStream.end(req.file.buffer);
        });
    }

    const updatedUser =
      await prisma.user.update({
        where: {
          id: req.user.id
        },

        data: {
          name: name?.trim() || user.name,
          profileImage
        },

        select: {
          id: true,
          email: true,
          name: true,
          profileImage: true
        }
      });

    res.status(200).json({
      message: "Account updated",
      user: updatedUser
    });

  } catch (error) {
    next(error);
  }
};



const deleteAccount = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await prisma.user.delete({
            where: {
                id: req.user.id
            }
        });

        res.status(200).json({
            message: "Account deleted"
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getUser,
    updateUser,
    deleteAccount,
    getUsers
};