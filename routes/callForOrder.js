const express = require("express");
const router = express.Router();
const {
  createCallOrder,
  getCallOrder,
  updateCallOrder,
  getMyCallForOrder,
} = require("../controllers/callForOrderController");
const { webTokenMiddleware } = require("../middleWare/webMiddleware");

router
  .post("/createcallorder", createCallOrder)
  .get("/getcallorder", getCallOrder)
  .put("/updatecallorder/:id", updateCallOrder);

// web
router.get("/get_my_call_for_order", webTokenMiddleware, getMyCallForOrder);
module.exports = router;
