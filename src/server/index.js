const express = require("express");
const serverless = require("serverless-http");
const axios = require("axios");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());


const clientFolderPath = path.join(__dirname, '..', 'client');
// Serve static files from the "client" directory
app.use(express.static(clientFolderPath));

const PORT = 4000; // Set the port number as per your preference

const allowedOrigins = ["http://example.com", "*"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the request's origin is in the allowedOrigins array or if it's a browser's same-origin request (e.g., from localhost)
      const isAllowed = !origin || allowedOrigins.includes(origin);
      callback(null, isAllowed);
    },
  })
);

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.get("/hi", (req, res) => {
  res.send("Hello");
});

function downloadFile(filePath, file, onSaveCallback) {
  try {
    // Move the file to the 'uploads' folder
    file.mv(filePath, (err) => {
      if (err) {
        throw new Error("Erro uploading file");
      }
      onSaveCallback();
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

function uploadFile(uploadUrlPath, filePath, res ) {
  try {
    const fileData = fs.readFileSync(filePath);
    const headers = {
      "Content-Type": "image/jpeg",
    };
    axios
      .put(uploadUrlPath, fileData, { headers })
      .then((response) => {
        console.log("Upload successful!");
        console.log("Response:", response.data);
        res.send(response.data);
      })
      .catch((error) => {
        console.error("Error uploading image to S3 bucket:", error.message);
        res.status(500).send("Error uploading image to S3 bucket");
      });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

app.put("/uploadImage", async (req, res) => {
  const imageUrl = req.query.uploadUrl;
  try {
    const { file } = req.files;
    const filePath = path.join(__dirname, "uploads", file.name);
    downloadFile(filePath, file, () => {
      uploadFile(imageUrl, filePath, res);
    });
  } catch (error) {
    console.error("Error uploading image to S3 bucket:", error.message);
    res.status(500).send("Error uploading image to S3 bucket");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

module.exports = app;
module.exports.handler = serverless(app);