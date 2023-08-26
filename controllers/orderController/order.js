const Order = require("../../models/order");
const Product = require("../../models/product");
const Cart = require("../../models/cart");
const nodemailer = require("nodemailer");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  transportMethod: "SMTP",
  secureConnection: true,
  auth: {
    user: "bisma.m@gortnm.in",
    pass: "ugzkophqmyblxuti",
  },
});

const razorpayKeyId = "rzp_test_pYVTJ4CAdU9NhW";
const razorpayKeySecret = "vDEAPTHuss9oBZjEqIuDzVYm";

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});
exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    console.log({ userId });
    const checkCart = await Cart.findOne({ userId })
      .populate("products.pId")
      .exec();
    console.log("xxxxxxxxxxx", checkCart);
    if (!checkCart?.products.length) {
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

exports.createPayment = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: "rzp_test_pYVTJ4CAdU9NhW",
      key_secret: "vDEAPTHuss9oBZjEqIuDzVYm",
    });
    const amount = req.body.amount;
    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// exports.verifyPayment = async (req, res) => {
//   try {
//     // getting the details back from our font-end
//     const {
//       orderCreationId,
//       razorpayPaymentId,
//       razorpayOrderId,
//       razorpaySignature,
//     } = req.body;
//     console.log("1===>", req.body);
//     // Creating our own digest
//     // The format should be like this:
//     // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
//     const shasum = crypto.createHmac("sha256", "vDEAPTHuss9oBZjEqIuDzVYm");
//     console.log("2");
//     shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
//     console.log("3");
//     const digest = shasum.digest("hex");
//     console.log("4");
//     if (digest !== razorpaySignature)
//       return res.status(400).json({ msg: "Transaction not legit!" });
//     console.log("5");
//     res.status(200).json({
//       msg: "success",
//       orderId: razorpayOrderId,
//       paymentId: razorpayPaymentId,
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };
exports.verifyPayment = async (req, res) => {
  try {
    console.log("77777777777", req.body);
    body = req.body.razorpayOrderId + "|" + req.body.razorpayPaymentId;
    var expectedSignature = crypto
      .createHmac("sha256", "vDEAPTHuss9oBZjEqIuDzVYm")
      .update(body.toString())
      .digest("hex");
    console.log("expooo", expectedSignature);
    console.log("sig---", req.body.razorpaySignature);
    if (expectedSignature === req.body.razorpaySignature) {
      console.log("sucess");
      res.json({
        msg: "success",
        orderId: req.body.razorpayOrderId,
        paymentId: req.body.razorpayPaymentId,
      });
    } else {
      console.log("failed");
    }
  } catch (error) {
    console.log(error);
  }
};
// exports.createPayment = async (req, res) => {
//   try {
//     const orderAmount = 1000; // Amount in paise (e.g., 1000 paise = ₹10)
//     const orderCurrency = "INR";
//     const orderReceipt = "order_rcptid_11";

//     const orderData = {
//       amount: orderAmount,
//       currency: orderCurrency,
//       receipt: orderReceipt,
//       payment_capture: 1, // Auto-capture payment when order is created
//     };

//     razorpay.orders.create(orderData, (error, order) => {
//       if (error) {
//         console.error("Error creating order:", error);
//         return res.status(500).json({ error: "Error creating order" });
//       } else {
//         console.log("Order created successfully:");
//         console.log("Order ID:", order.id);
//         console.log("Amount:", order.amount);
//         console.log("Currency:", order.currency);
//         console.log("Receipt:", order.receipt);
//         console.log("Status:", order.status);
//         console.log("Created At:", order.created_at);

//         return res.status(200).json({ order });
//       }
//     });
//   } catch (error) {
//     console.error("An error occurred:", error);
//     return res.status(500).json({ error: "An error occurred" });
//   }
// };
// exports.verifyPayment = async (req, res) => {
//   try {
//     body = req?.body?.razorpay_order_id + "|" + req?.body?.razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature === req?.body?.razorpay_signature) {
//       const body = {
//         status: "1",
//       };
//       console.log(body);
//       const updateData = await Order.update(body, {
//         where: { orderId: req.body.razorpay_order_id },
//       });

//       const get = await Order.findOne({
//         where: { orderId: req.body.razorpay_order_id },
//       });

//       return res.status(200).json({
//         message: "Payment Success",
//         response: updateData,
//       });
//     } else {
//       const body = {
//         status: "2",
//       };
//       await Order.update(body, {
//         where: { orderId: req.body.razorpay_order_id },
//       });
//       const updatedOrder = await Order.findOne({
//         where: { orderId: req.body.razorpay_order_id },
//       });
//       return res.status(400).json({
//         message: "Payment Failed",
//         response: updatedOrder,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: error.message || "Internal Server Error.",
//     });
//   }
// };
