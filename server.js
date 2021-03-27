const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Product = require("./model/product");
const WishList = require("./model/wishList");

//app: innitializing Express
//db: connencting to mongodb
const app = express();
const db = mongoose.connect("mongodb://localhost/konga", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.json());

//new Product(): Model constructor that Provides the interface to MongoDB collections as well as creates document instances.
app.post("/product", (req, res) => {
  const product = new Product({ title: req.body.title, price: req.body.price });

  //save document if it matches model
  product.save((err, savedProduct) => {
    if (err) {
      res.status(500).json({ error: "SERVER ERROR" });
    } else {
      res.json(savedProduct);
    }
  });
});

app.get("/product", (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      res.status(500).json({ error: "SERVER ERROR" });
    } else {
      res.json(products);
    }
  });
});

app.post("/wishlist", (req, res) => {
  const wishList = new WishList({ title: req.body.title });
  wishList.save((err, newWishList) => {
    if (err) {
      res.status(500).json({ error: "WRONG CREDENTIALS" });
    } else {
      res.json(newWishList);
    }
  });
});

//.find({}): find collection(wishlist)
//.populate(): populate path(products array in Schema) with corresponding model(Product)
//.exec(): execute? then res.json
app.get("/wishlist", (req, res) => {
  WishList.find({}).populate({path:'products', model:'Product'}).exec((err, wishLists) => {
    if (err) {
      res.status(500).json({ error: "SERVER ERROR" });
    } else {
      res.json(wishLists);
    }
  });
});

app.put("/wishlist/product/add", (req, res) => {
  Product.findOne({ _id: req.body.productId }, (err, product) => {
    if (err) {
      res.status(500).json({ error: "PRODUCT NOT FOUND" });
    } else {
      WishList.updateOne(
        { _id: req.body.wishListId },
        { $addToSet: { products: product._id } },
        (err, wishList) => {
          if (err) {
            res.status(500).json({ error: "WISHLIST NOT UPDATED" });
          } else {
            res.json(wishList);
          }
        }
      );
    }
  });
});

app.listen(3000, function () {
  console.log("SERVER RUNNING ON PORT 3000");
});
