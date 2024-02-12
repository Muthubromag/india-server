const callForOrder = require("../modals/callForOrder");
const _ = require("lodash");

const createCallOrder = async (req, res) => {
  try {
    const result = await callForOrder.create({ ...req.body.formData });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while creating call order");
  }
};

const getCallOrder = async (req, res) => {
  try {
    const result = await callForOrder.find({}).sort({ createdAt: -1 });
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while fetching call order");
  }
};

const updateCallOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await callForOrder.findByIdAndUpdate(id, {
      ...req.body,
    });
    return res.status(200).send({ data: result });
  } catch (e) {
    return res
      .status(500)
      .send("Something went wrong while updating call order");
  }
};

const getMyCallForOrder = async (req, res) => {
  try {
    let user_contact = _.get(req, "body.userDetails.phoneNumber", "").slice(
      3,
      14
    );
    const result = await callForOrder
      .find({ mobileNumber: user_contact })
      .sort({ createdAt: -1 });
    
    return res.status(200).send({ data: result });
  } catch (err) {
    return res
      .status(500)
      .send("Something went wrong while fetching call order");
  }
};

module.exports = {
  createCallOrder,
  getCallOrder,
  updateCallOrder,
  getMyCallForOrder,
};
