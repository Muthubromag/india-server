const onlineOrder = require("../modals/onlineOrderModal");
const Cart = require("../modals/cart.models");
const _ = require("lodash");

const createOnlineOrder = async (req, res) => {
  try {
    const result = await onlineOrder.create({ ...req.body });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while creating online order");
  }
};
const getOnlineOrder = async (req, res) => {
  try {
    const result = await onlineOrder.find({}).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while fetching online order");
  }
};
const updateOnlineOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await onlineOrder.findByIdAndUpdate(id, { ...req.body });
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while updating online order");
  }
};

const deleteOnlineOrder = async (req, res) => {};

// Web
const addOnlineOrder = async (req, res) => {
  try {
    let formData = {
      customerName: _.get(req, "body.customerName", ""),
      mobileNumber: _.get(req, "body.mobileNumber", ""),
      billAmount: _.get(req, "body.billAmount", ""),
      gst: _.get(req, "body.gst", ""),
      delivery_charge: _.get(req, "body.delivery_charge", ""),
      packing_charge: _.get(req, "body.packing_charge", ""),
      transaction_charge: _.get(req, "body.transaction_charge", ""),
      coupon_amount: _.get(req, "body.coupon_amount", ""),
      item_price: _.get(req, "body.item_price", ""),
      userId: _.get(req, "body.userDetails._id", ""),
      orderedFood: _.get(req, "body.orderedFood", ""),
      orderId: _.get(req, "body.orderId", ""),
      location: _.get(req, "body.location", ""),
    };
    const result = await onlineOrder.create(formData);
    let where = {
      userRef: _.get(req, "body.userDetails._id", ""),
      orderRef: "online_order",
    };
    await Cart.deleteMany(where);
    return res.status(200).send({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Something went wrong");
  }
};

module.exports = {
  createOnlineOrder,
  getOnlineOrder,
  deleteOnlineOrder,
  updateOnlineOrder,
  addOnlineOrder,
};
