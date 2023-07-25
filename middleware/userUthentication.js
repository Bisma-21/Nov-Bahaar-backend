const jsonwebtoken = require("jsonwebtoken");

exports.userAuthentication = async (req, res, next) => {
  try {
    const header = req.headers;
    const secretKey = process.env.UserSecretKey;
    // console.log("1111===", header);
    const token = header["x-access-token"];
    if (!token) {
      return res.status(400).json({
        message: "Token Not Provided!.",
      });
    }
    const verifyToken = jsonwebtoken.verify(token, secretKey);
    // console.log("verifyToken=====>>>>>>>>>>>>>", verifyToken);
    if (verifyToken) {
      req.userId = verifyToken.userId;
    }
    next();
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};
