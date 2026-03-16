const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const DBconnection = require("./config/DBconnetction");
const patientRoute = require("./routers/patientRoute");
const uploadImage = require("./serveses/uploadImageServes.js");
const { isTokenBlacklisted } = require("./serveses/patientServes");

dotenv.config();
DBconnection();

// Add this before other middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Increase the limit for JSON payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Configure CORS properly
app.use(
  cors({
    origin: "*", // In production, specify your actual domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
// app.use(express.static("public")); // assuming 'public' is the folder with your HTML/CSS/JS files
app.use(express.static(path.join(__dirname, "images"))); // => to show any image into browser by image name

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Apply the blacklist middleware to all routes under /api/patient
app.use("/api/patient", isTokenBlacklisted, patientRoute);

// Route for uploading images (if needed)
app.use("/api/patient/uploadimage", isTokenBlacklisted, uploadImage);

app.use((req, res, next) => {
  res.header("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  next();
});
// Serve only frontsend folder statically
app.use("/", express.static(path.join(__dirname, "frontend")));

// ✅ Serve home.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "home.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port : ${process.env.PORT}`);
});
