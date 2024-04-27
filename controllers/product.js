import Product from "../models/product.js";
import { removeImage } from "../utils/common.js";

const ProductsController = {
  getProducts: async (req, res) => {
    try {
      if (!req.query.page || !req.query.limit)
        throw new Error("Page, Limit is required !");

      const skipUsers = (req.query.page - 1) * req.query.limit;
      const ITEM_PER_PAGE = req.query.page * req.query.limit;

      const products = await Product.find({
        ...(req.query.subcategory
          ? { subcategory: req.query.subcategory }
          : {}),
      })
        .sort({ priority: -1 })
        .skip(skipUsers)
        .limit(req.query.limit);

      const totalProducts = await Product.find({
        ...(req.query.subcategory
          ? { subcategory: req.query.subcategory }
          : {}),
      }).count();

      res.status(200).send({
        succss: true,
        message: products,
        totalProducts,
        hasNextPage: ITEM_PER_PAGE < totalProducts,
        hasPreviousPage: req.query.page > 1,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getProduct: async (req, res) => {
    try {
      const data = await Product.findById(req.params.id);
      if (!data) throw new Error("Product not found");
      return res.status(200).json({ message: data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  addImage: async (req, res) => {
    try {
      const files = req?.files?.file;
      return res
        .status(200)
        .json({ message: files.map((file) => file.filename) });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  removeImage: async (req, res) => {
    try {
      const { images } = req.body;
      if (!images?.length) throw new Error("Images are required !");

      images.map((img) => {
        removeImage("uploads/products/", img);
      });
      return res.status(200).json({ message: "Images removed successfully !" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  addProduct: async (req, res) => {
    try {
      let {
        name,
        isActive,
        priority,
        subcategory,
        description,
        mrp,
        price,
        images,
      } = req.body;

      if (
        !name ||
        !priority ||
        !subcategory ||
        !description ||
        !mrp ||
        !price ||
        !images?.length
      )
        throw new Error(
          "name, priority, subcategory, description, mrp, price and images are reqired !"
        );

      const product = await Product.create({
        name,
        isActive,
        priority,
        subcategory,
        description,
        mrp,
        price,
        images,
      });

      return res.status(200).json({ message: product });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      let params = { ...req.body };
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        params,
        { new: true }
      );

      return res.status(200).json({ message: updatedProduct });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      let product = await Product.findById(req.params.id);
      if (!product) throw new Error("Invalid call");
      removeImage("uploads/products/", product.image);
      await Product.findByIdAndDelete(req.params.id);

      return res
        .status(200)
        .json({ message: "Deleted Successfully", status: true });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  searchProduct: async (req, res) => {
    try {
      const { searchValue } = req.body;
      let products = await Product.find({
        ...(searchValue
          ? { name: { $regex: searchValue, $options: "i" } }
          : {}),
      });

      return res.status(200).json({ message: products, status: true });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default ProductsController;
