const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Smartphones", "Ordinateurs", "Accessoires", "Électronique", "Mode"],
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    oldPrice: { type: Number, default: null }, // pour afficher une réduction éventuelle
  },
  { timestamps: true } // ajoute createdAt / updatedAt automatiquement
);

module.exports = mongoose.model("Product", productSchema);
