const _ = require("lodash");

const OnlineOrder = require("../modals/onlineOrderModal");
const TakeAway = require("../modals/takeAwayModal");
const DeliveryAddress = require("../modals/deliveraddress.models");
const TableBooking = require("../modals/tableBookingModal");

const getMyOnlineOrder = async (req, res) => {
  try {
    const result = await OnlineOrder.find({
      userId: _.get(req, "body.userDetails._id", ""),
    }).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getMyTakeAwayOrder = async (req, res) => {
  try {
    const result = await TakeAway.find({
      userId: _.get(req, "body.userDetails._id", ""),
    }).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getMyDeliveryAddress = async (req, res) => {
  try {
    const result = await DeliveryAddress.find({
      userId: _.get(req, "body.userDetails._id", ""),
    }).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

const getMyProfileDining = async (req, res) => {
  try {
    const result = await TableBooking.find({
      userId: _.get(req, "body.userDetails._id", ""),
    }).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  getMyOnlineOrder,
  getMyTakeAwayOrder,
  getMyDeliveryAddress,
  getMyProfileDining,
};
