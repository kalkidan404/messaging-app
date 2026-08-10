const express=require("express");
const authRoutes=require("./src/routes/authRoutes");
const userRoutes=require("./src/routes/userRoutes");
const messageRoutes=require("./src/routes/messageRoutes");
const cors=require("cors");
const authMiddleware=require("./src/middleware/authMiddleware");
const app=express();
app.use(cors());
app.use(express.json())

app.use("/user",userRoutes);
app.use("/messages",authMiddleware,messageRoutes)
app.use("/auth",authRoutes)



app.get("/",(req,res)=>{
    res.json({message:"messaging open"});
})
app.use((error, req, res, next) => {
  console.error(error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      message: "Profile image must be smaller than 10 MB."
    });
  }

  res.status(500).json({
    message: error.message || "Internal server error"
  });
});
module.exports=app;