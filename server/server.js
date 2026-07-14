const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

dns.setDefaultResultOrder("ipv4first");


const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env")
});


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


console.log(
  "MONGO URI:",
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/seoAnalyzer"
);


const analyzeRoutes = require("./routes/analyzeRoutes");


const app = express();


app.use(cors());

app.use(express.json());


// API Routes
app.use("/api", analyzeRoutes);



app.get("/", (req, res) => {

  res.send("SEO Analyzer Backend Running");

});


app.get("/health", (req, res) => {

  res.json({

    status: "ok",

    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"

  });

});



const connectDB = async () => {

  const mongoUri =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/seoAnalyzer";


  try {

    await mongoose.connect(mongoUri, {

      serverSelectionTimeoutMS: 10000,

      family: 4

    });


    console.log("✅ MongoDB Connected");


  } catch (error) {

    console.warn(
      "⚠️ MongoDB connection failed. Continuing without database:",
      error.message
    );

  }

};



connectDB();



const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );

});