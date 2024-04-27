import express from "express";
import ProductsController from "../controllers/product.js";
import multer from "multer";
import fs from "fs"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = `uploads/products`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + "webp");
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "file", maxCount: 10 },
]);

export const router = express.Router();

router.get("/", ProductsController.getProducts);
router.get("/:id", ProductsController.getProduct);
router.post("/", ProductsController.addProduct);
router.post("/image/add",upload, ProductsController.addImage);
router.post("/image/remove", ProductsController.removeImage);
router.patch("/:id", ProductsController.updateProduct);
router.delete("/:id", ProductsController.deleteProduct);
router.post("/search", ProductsController.searchProduct);
