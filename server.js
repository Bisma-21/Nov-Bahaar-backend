require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2;
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const whishlistRoute = require("./routes/whishlistRoute");
const reviewRoute = require("./routes/reviewRoute");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    console.log({ file });
    const extName = path.extname(file.originalname);
    // console.log(file.originalname.replace(extName, "")); // ist method
    const originalName = file.originalname;
    // const nameWithoutExt = originalName.split(".").slice(0, -1).join("."); //2nd method
    const nameWithoutExt = originalName.split(".").shift(); //2nd method
    // console.log({ nameWithoutExt }); // extension name
    cb(null, nameWithoutExt + "-" + uniqueSuffix + extName);
  },
});
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});
// console.log("disk----", diskStorage);
const app = express();
app.use(cors());
app.use(express.json());

app.get('/test',function(req,res){
  console.log("this is test route")
  res.send("hello world")
})

const publicPath = path.join(__dirname, "uploads");
// console.log("xxxxxxxxxxx", publicPath);
app.use("/uploads", express.static(publicPath));
// app.use(multer({ storage: diskStorage }).single("image"));
app.use(multer({ storage: diskStorage }).array("images", 4));
app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/whishlist", whishlistRoute);
app.use("/review", reviewRoute);
app.listen(4000, async () => {
  await mongoose.connect(process.env.MongoURI);
  console.log("server is running at port 3000");
});
