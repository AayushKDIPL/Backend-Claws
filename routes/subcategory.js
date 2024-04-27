import express from "express";
import SubcategoryController from "../controllers/subcategory.js";
import multer from "multer";
import fs from "fs"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = `uploads/subcategory`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (_, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + "webp");
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "file", maxCount: 1 },
]);

export const router = express.Router();

router.get("/", SubcategoryController.getSubCategories);
router.get("/:id", SubcategoryController.getSubCategory);
router.post("/", upload, SubcategoryController.addSubCategory);
router.patch("/:id",upload, SubcategoryController.updateSubCategory);
router.delete("/:id", SubcategoryController.deleteSubCategory);
