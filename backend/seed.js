// Peuple la base de données avec des produits de démonstration.
// ⚠️ Les images pointent vers frontend/images/ — place tes vraies photos
// dans ce dossier AVANT de lancer ce script (voir frontend/images/README.md
// pour la liste exacte des noms de fichiers attendus).
// Lancer avec : npm run seed

require("dotenv").config();
const connectDB = require("./config/db");
const Product = require("./models/Product");

const products = [
  {
    name: "Smartphone Alpha X12",
    description: "Écran AMOLED 6.5\", triple caméra 108MP, batterie 5000mAh, charge rapide 65W.",
    price: 449.99,
    oldPrice: 549.99,
    image: "images/smartphone-alpha-x12.jpg",
    category: "Smartphones",
    stock: 35,
  },
  {
    name: "Smartphone Alpha S8 Lite",
    description: "Design compact, écran 6.1\", double caméra 50MP, idéal pour un usage quotidien.",
    price: 249.99,
    image: "images/smartphone-alpha-s8-lite.jpg",
    category: "Smartphones",
    stock: 50,
  },
  {
    name: "Ordinateur Portable ProBook 14",
    description: "Intel Core i5, 16 Go RAM, SSD 512 Go, écran Full HD 14 pouces, léger et puissant.",
    price: 699.0,
    oldPrice: 799.0,
    image: "images/probook-14.jpg",
    category: "Ordinateurs",
    stock: 20,
  },
  {
    name: "Ordinateur Portable UltraBook Air",
    description: "Châssis en aluminium, 8 Go RAM, SSD 256 Go, autonomie 12h, parfait pour le nomadisme.",
    price: 549.0,
    image: "images/ultrabook-air.jpg",
    category: "Ordinateurs",
    stock: 18,
  },
  {
    name: "Casque Audio Sans Fil",
    description: "Casque Bluetooth avec réduction de bruit active et 20h d'autonomie.",
    price: 59.99,
    image: "images/casque-audio.jpg",
    category: "Accessoires",
    stock: 40,
  },
  {
    name: "Souris Sans Fil Ergonomique",
    description: "Souris silencieuse avec capteur précis 1600 DPI et connexion Bluetooth stable.",
    price: 19.99,
    image: "images/souris-sans-fil.jpg",
    category: "Accessoires",
    stock: 70,
  },
  {
    name: "Sac à Dos pour Ordinateur Portable",
    description: "Sac à dos résistant à l'eau avec compartiment rembourré pour ordinateur 15 pouces.",
    price: 39.5,
    image: "images/sac-a-dos.jpg",
    category: "Accessoires",
    stock: 45,
  },
  {
    name: "Montre Connectée Fit Pro",
    description: "Suivi d'activité, notifications, suivi du sommeil et de la fréquence cardiaque.",
    price: 129.99,
    oldPrice: 159.99,
    image: "images/montre-connectee.jpg",
    category: "Électronique",
    stock: 25,
  },
  {
    name: "Clavier Mécanique RGB",
    description: "Clavier mécanique rétroéclairé avec switches bleus, idéal pour le gaming et la bureautique.",
    price: 89.0,
    image: "images/clavier-mecanique.jpg",
    category: "Électronique",
    stock: 22,
  },
  {
    name: "Enceinte Bluetooth Portable",
    description: "Son puissant à 360°, étanche IPX7, autonomie de 15 heures.",
    price: 45.0,
    image: "images/enceinte-bluetooth.jpg",
    category: "Électronique",
    stock: 33,
  },
  {
    name: "Veste Coupe-Vent Urbaine",
    description: "Veste légère et imperméable, coupe moderne, idéale pour toutes les saisons.",
    price: 54.99,
    image: "images/veste-coupe-vent.jpg",
    category: "Mode",
    stock: 38,
  },
  {
    name: "Chaussures de Running",
    description: "Chaussures légères et respirantes avec semelle amortissante pour la course.",
    price: 74.99,
    oldPrice: 94.99,
    image: "images/chaussures-running.jpg",
    category: "Mode",
    stock: 30,
  },
];

async function seed() {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`✅ ${products.length} produits insérés avec succès.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erreur lors du seed :", err);
  process.exit(1);
});
