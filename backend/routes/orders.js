const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// POST /api/orders - passer une commande (checkout)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: "Le panier est vide." });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: "Adresse de livraison requise." });
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Produit ${item.productId} introuvable.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour ${product.name}.` });
      }
      total += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total: Math.round(total * 100) / 100,
      shippingAddress,
    });

    res.status(201).json({ message: "Commande passée avec succès.", order });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la commande." });
  }
});

// GET /api/orders - historique de l'utilisateur connecté (ou tout pour un admin)
router.get("/", requireAuth, async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// GET /api/orders/:id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Commande introuvable." });

    if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    res.json(order);
  } catch (err) {
    res.status(404).json({ message: "Commande introuvable." });
  }
});

module.exports = router;
