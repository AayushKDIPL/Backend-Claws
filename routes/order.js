import express from "express";
import OrdersController from "../controllers/order.js";

export const router = express.Router();

router.get("/", OrdersController.getOrders);
router.get("/:id", OrdersController.getOrder);
router.post("/create", OrdersController.createOrder);
router.patch("/:id", OrdersController.updateOrder);

