const User = require("../modals/userModal");
const onlineOrderModal = require("../modals/onlineOrderModal");
const takeAwayModal = require("../modals/takeAwayModal");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { default: axios } = require("axios");

const getUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      const createUser = await User.create({ ...req.body });
      const token = jwt.sign(
        {
          userId: createUser._id,
          name: createUser.user,
          email: createUser.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "10000h" }
      );
      res.status(200).send({ message: token });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.user, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "10000h" }
    );
    res.status(200).send({ message: token });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).send({ message: users });
  } catch (err) {
    console.log(err);
  }
};

// web
const careteSignUp = async (req, res) => {
  try {
    const result = await User.find({ phoneNumber: req.body.phoneNumber });
    if (!_.isEmpty(result)) {
      return res
        .status(500)
        .send({ message: "This phone number has already been used." });
    }
    const result2 = await User.create(req.body);
    return res.status(200).send({ data: result2 });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const verifyOtp = async (req, res) => { //========================
  const { transactionId } = req.params;
  const apiKey = process.env.OTP_BSNL_API;
  const resObj = {};

  try {
    const response = await axios.get(
      `https://transapi.edumarcsms.com/api/v1/e/transaction/${transactionId}`,
      {
        headers: {
          Host: "transapi.edumarcsms.com",
          apikey: apiKey,
          "content-type": "application/json",
        },
      }
    );
    if (response.data.success) {
      resObj.status = true;
      resObj.message = "user autherized successfully";
    } else {
      resObj.status = true;
      resObj.message = "user autherized failed";
    }
    res.status(200).json(resObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOneUserdata = async (req, res) => {
  try {
    const result = await User.find({ phoneNumber: `${req.params.number}` });

    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const makeUserToken = async (req, res) => {
  try {
    const result = await User.find({ phoneNumber: `${req.body.number}` });
    let tokenConstraints = {
      id: _.get(result, "[0]._id", ""),
      phonenumber: _.get(result, "[0].phoneNumber", ""),
      username: _.get(result, "[0].user", ""),
      email: _.get(result, "[0].email", ""),
    };
    const token = jwt.sign(tokenConstraints, process.env.SECRET_KEY, {});
    res.status(200).send({ data: token, message: "Start Your Journey" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const checkTokenStatus = async (req, res) => {
  try {
    const result = await User.find({
      _id: _.get(req, "body.userDetails._id", ""),
    });
    return res.status(200).send({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const makeLogoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      { _id: _.get(req, "body.userDetails._id", "") },
      { tokenRef: "" }
    );
    return res.status(200).send({ message: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const updateMyPic = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      { _id: _.get(req, "body.userDetails._id", "") },
      { user_image: _.get(req, "body.user_image", "") }
    );
    return res.status(200).send({ message: "success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const formData = {
      user: _.get(req, "body.user", ""),
      email: _.get(req, "body.email", ""),
      phoneNumber: _.get(req, "body.phoneNumber", ""),
      alter_mobile_number: _.get(req, "body.alter_mobile_number", ""),
    };
    await User.findByIdAndUpdate(
      { _id: _.get(req, "body.userDetails._id", "") },
      formData
    );
    return res.status(200).send({ message: "success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_type } = req.body;
    if (order_type === "online") {
      await onlineOrderModal.findByIdAndUpdate(
        { _id: id },
        { status: "Cancelled" }
      );
    } else {
      await takeAwayModal.findByIdAndUpdate(
        { _id: id },
        { status: "Cancelled" }
      );
    }

    return res.status(200).send({ message: "success" });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  getUser,
  getAllUsers,
  careteSignUp,
  getOneUserdata,
  makeUserToken,
  checkTokenStatus,
  makeLogoutUser,
  updateMyPic,
  updateProfile,
  cancelMyOrder,
  verifyOtp
};
