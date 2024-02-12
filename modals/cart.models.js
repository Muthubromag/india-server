const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userRef: String,
        productRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },
        orderRef: String,
        bookingRef: String,
        quantity: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("cart", cartSchema);
