const product = require("../modals/productModal");
const Cart = require("../modals/cart.models.js");
const { isEmpty, get } = require("lodash");
const helpers = require("../utils/helpers");

const createProduct = async (req, res) => {
  try {
    let maximumCuisines = 500;
    let totalMenu = 50;
    const { categoryName, categoryId } = req.body;
    const { name } = req.body;
    const isCount = await product.find({ categoryId });
    const totalMenuCount = await product.countDocuments({});
    const existingMenu = await product.aggregate([
      {
        $match: {
          name: { $eq: name },
        },
      },
    ]);
    if (existingMenu.length > 0) {
      return res
        .status(400)
        .send(`Menu with the name '${name}' already exists .`);
    }
    if (isCount.length >= totalMenu) {
      return res
        .status(400)
        .send(
          `Your ${categoryName} Menu limit reached. Cannot create more ${categoryName}.`
        );
    }
    if (totalMenuCount >= maximumCuisines) {
      return res.status(400).send(`Your can't add more than 500 Menu.`);
    }
    const menu = req.file;
    if (menu) {
      const path = `Menu/${menu.originalname}${Date.now()}/${menu.filename}`;
      await helpers.uploadFile(menu, path);
      if (path) {
        await helpers.deleteS3File(path);
      }
      const image = helpers.getS3FileUrl(path);
      helpers.deleteFile(menu);
      const result = await product.create({
        name: req.body.name,
        status: req.body.status,
        discountPrice: req.body.discountPrice,
        offer: req.body.offer,
        price: req.body.price,
        categoryId: req.body.categoryId,
        subCategoryId: req.body.subCategoryId,
        categoryName: req.body.categoryName,
        types: req.body.types,
        subCategoryName: req.body.subCategoryName,
        image: image,
      });
      return res.status(200).send({ message: "Menu created successfully" });
    }
  } catch (err) {
    return res.status(500).send("Something went wrong while creating products");
  }
};

const getProduct = async (req, res) => {
  try {
    const result = await product.find({});
    return res.status(200).send({ data: result });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Something went wrong while fetching Products");
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const imageUrl = req.body.image;
    if (get(req, "file", false)) {
      const menu = req.file;
      if (menu) {
        const path = `Menu/${menu.originalname}${Date.now()}/${menu.filename}`;
        await helpers.uploadFile(menu, path);
        if (imageUrl) {
          await helpers.deleteS3File(imageUrl);
        }
        const image = helpers.getS3FileUrl(path);
        helpers.deleteFile(menu);
        const result = await product.findByIdAndUpdate(id, {
          name: req.body.name,
          status: req.body.status,
          discountPrice: req.body.discountPrice,
          offer: req.body.offer,
          price: req.body.price,
          categoryId: req.body.categoryId,
          subCategoryId: req.body.subCategoryId,
          categoryName: req.body.categoryName,
          subCategoryName: req.body.subCategoryName,
          image: image,
        });
        return res
          .status(200)
          .send({ message: "Cusines updated successfully" });
      }
    } else {
      await product.findByIdAndUpdate(id, {
        name: req.body.name,
        status: req.body.status,
        offer: req.body.offer,
        price: req.body.price,
        discountPrice: req.body.discountPrice,
        categoryId: req.body.categoryId,
        subCategoryId: req.body.subCategoryId,
        categoryName: req.body.categoryName,
        types: req.body.types,
        subCategoryName: req.body.subCategoryName,
        image: get(req, "body.image", ""),
      });
      return res.status(200).send({ Message: "created successfully" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send("Something went wrong while updating product");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;
    await product.findByIdAndDelete(id);
    await helpers.deleteS3File(image);
    return res.status(200).send("Menu deleted");
  } catch (e) {
    return res.status(500).send("Something went wrong while delete product");
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await product.find({ _id: id });
    return res.status(200).send({ data: result });
  } catch (e) {
    return res.status(500).send("Something went wrong");
  }
};

const addToCartFromProductDetails = async (req, res) => {
  try {
    let where = {
      userRef: get(req, "body.userDetails._id", ""),
      productRef: get(req, "body.productRef", ""),
      orderRef: get(req, "body.orderRef", ""),
    };
    if (get(req, "body.bookingRef", "")) {
      where.bookingRef = get(req, "body.bookingRef", "");
    }

    const result = await Cart.find(where);

    if (!isEmpty(result)) {
      return res.status(200).send({ data: "already exist" });
    }

    const resultcart = await Cart.create(where);
    return res.status(200).send({ data: resultcart });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getProductDetails,
  addToCartFromProductDetails,
};
