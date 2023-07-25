const Order = require("../../models/order");
const Product = require("../../models/product");
const Cart = require("../../models/cart");
const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  transportMethod: "SMTP",
  secureConnection: true,
  auth: {
    user: "bisma.m@gortnm.in",
    pass: "ugzkophqmyblxuti",
  },
});
exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    console.log({ userId });
    const checkCart = await Cart.findOne({ userId })
      .populate("products.pId")
      .exec();
    console.log("xxxxxxxxxxx", checkCart);
    if (!checkCart.products.length) {
      return res.status(400).json({
        message: "Nothing is in cart with this user!.",
      });
    }
    // console.log("0000000000000000000000000000", checkCart.products);
    let totalAmount = 0;
    checkCart.products.map(
      (e) => (totalAmount = e.quantity * e.pId.price + totalAmount)
    );
    // console.log("mmmmmmmmmmmmm", totalAmount); //[id, price]
    const quantityPIdArray = checkCart.products.map((e) => {
      return {
        pId: e.pId._id,
        quantity: e.quantity,
      };
    });
    console.log({ quantityPIdArray });
    const address = {
      address: req.body.address,
    };
    // console.log({ address });
    // console.log("aaaaaaaaaa", address.address.address);
    const body = {
      userId,
      totalAmount,
      address: {
        pincode: address.address.pincode,
        country: address.address.country,
        address: address.address.address,
      },
      isDelivered: req.body.isDelivered,
      paymentMethod: req.body.paymentMethod,
      products: quantityPIdArray,
    };

    const orderCreate = await Order.create(body);
    const cartBody = {
      products: [],
      total: 0,
    };
    await Cart.updateOne(
      { userId },
      { products: cartBody.products, total: cartBody.total }
    );
    const updatedCart = await Cart.findOne({ userId });
    console.log("xxxxxxxxx", updatedCart);
    transport.sendMail(
      {
        from: "bisma.m@gortnm.in",
        to: "bisma.m@gortnm.in",
        subject: "Testing Message Message",
        html: `<b>Congratulations!, Your Order Has Been Created!.</b>
      `,
      },
      async (error, data) => {
        if (error) {
          return res.status(400).json({ message: "Unable to send email!." });
        }
        res.status(200).json({
          message: "Order Created Successfully!.",
          response: { orderCreate, updatedCart },
        });
      }
    );
    // res.status(200).json({
    //   message: "Order Created Successfully!.",
    //   response: { orderCreate, updatedCart },
    // });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};

exports.getAllOrdersOfAUser = async (req, res) => {
  try {
    const userId = req?.userId;
    const query = req.query;
    console.log({ query });
    const allOrders = await Order.find({ userId })
      .populate("products.pId")
      .exec();
    console.log("88888888888888", allOrders);
    // { status: 'active' }
    let orders = [];
    let orderCount = 0;
    if (query.status == "active") {
      // jo delivered nai huai
      orders = await Order.find({ isDelivered: false, userId })
        .populate("products.pId")
        .exec();
      orderCount = await Order.count({ isDelivered: false, userId });
    }
    if (query.status == "inactive") {
      orders = await Order.find({ isDelivered: true, userId })
        .populate("products.pId")
        .exec();
      orderCount = await Order.count({ isDelivered: true, userId });
    }

    res.status(200).json({
      message: "All Orders of a User Fetched Successfully!.",
      response: { orders, orderCount },
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req?.params?.orderId;
    const orderById = await Order.findById(orderId)
      .populate("products.pId")
      .exec();
    if (!orderById) {
      return res.status(400).json({
        message: "No Order Present!.",
      });
    }
    res.status(200).json({
      message: "Succcessfully Fetched Single Order!.",
      response: orderById,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      message: "Internal Server Error!.",
    });
  }
};
