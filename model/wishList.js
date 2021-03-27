const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

//wishList: specifying wishlist structure
const wishList = new Schema({
  title: { type: String, default: "MY WISH LIST" },
  products: [{ type: ObjectId, ref: 'Product' }],
});

module.exports = mongoose.model("WishList", wishList);
