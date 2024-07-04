const express = require("express");
const bodyParser = require("body-parser");
const JWT = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const jwtSecret = process.env.JWT_SECRET;

app.post("/journeybuilder/save", (req, res) => {
  console.log("Save endpoint called");
  res.status(200).json({ success: true });
});

app.post("/journeybuilder/publish", (req, res) => {
  console.log("Publish endpoint called");
  res.status(200).json({ success: true });
});

app.post("/journeybuilder/validate", (req, res) => {
  console.log("Validate endpoint called");
  res.status(200).json({ success: true });
});

app.post("/journeybuilder/stop", (req, res) => {
  console.log("Stop endpoint called");
  res.status(200).json({ success: true });
});

app.post("/journeybuilder/execute", (req, res) => {
  console.log("Execute endpoint called");

  // Verify JWT
  const token = req.body.jwt;
  JWT.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Process the split logic here
    const inArguments = decoded.inArguments[0];
    const { dataExtension, field, condition, value } = inArguments;

    // This is where you'd typically query the Data Extension
    // For this example, we'll just return a random result
    const splitPath = Math.random() < 0.5 ? "path1" : "path2";

    res.status(200).json({ branchResult: splitPath });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
