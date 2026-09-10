const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI manquant dans le fichier .env");
    }
    await mongoose.connect(uri);
    console.log("✅ Connecté à MongoDB");
  } catch (err) {
    console.error("❌ Erreur de connexion à MongoDB :", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
