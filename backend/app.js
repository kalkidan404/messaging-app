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
module.exports=app;