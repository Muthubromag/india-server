const _ = require("lodash");
const Cart = require("../modals/cart.models.js");
const Product = require("../modals/productModal.js");

const addtocart = async (req, res) => {
  try {
    let formData = {
      userRef: _.get(req, "body.userDetails._id", ""),
      productRef: _.get(req, "body.productRef", ""),
      orderRef: _.get(req, "body.orderRef", ""),
      bookingRef: _.get(req, "body.bookingRef", ""),
    };

    await Cart.create(formData);
    return res
      .status(200)
      .send({ message: " Food successfully added to the cart" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getCurrentUserCarts = async (req, res) => {
  try {
    let where = {
      userRef: _.get(req, "body.userDetails._id", ""),
      orderRef: _.get(req, "params.id", ""),
    };

    const result = await Cart.find(where, { userRef: 0, orderRef: 0 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getCurrentUserCartProducts = async (req, res) => {
  try {
    const { order_ref, bookingref } = JSON.parse(req.params.id);

    let where = {
      userRef: _.get(req, "body.userDetails._id", ""),
      orderRef: order_ref,
    };

    if (bookingref) {
      where.bookingRef = bookingref;
    }

    const collect_current_user_carts = await Cart.find(where, {
      userRef: 0,
      orderRef: 0,
    }).populate("productRef");

    return res.status(200).send({ data: collect_current_user_carts });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { orderRef, ptoductRef, bookingRef } = JSON.parse(req.params.id);
    let where = {
      userRef: _.get(req, "body.userDetails._id", ""),
      productRef: ptoductRef,
      orderRef: orderRef,
    };

    if (bookingRef) {
      where.bookingRef = bookingRef;
    }

    await Cart.deleteOne(where);
    return res.status(200).send({ message: "Success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const incrementCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Cart.findByIdAndUpdate(
      { _id: id },
      { $inc: { quantity: 1 } }
    );

    return res.status(200).send({ message: "Success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const handleDecrement = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndUpdate({ _id: id }, { $inc: { quantity: -1 } });
    return res.status(200).send({ message: "Success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const removeSoloFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete({ _id: id });
    return res.status(200).send({ message: "Success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  addtocart,
  getCurrentUserCarts,
  getCurrentUserCartProducts,
  removeFromCart,
  incrementCartQuantity,
  handleDecrement,
  removeSoloFromCart,
};
