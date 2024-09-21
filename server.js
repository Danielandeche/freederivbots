const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Enable CORS for your Vercel app
app.use(cors({
    origin: 'https://freederivbots.vercel.app' // Replace with your front-end URL
}));

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

// Serve static files (manifest, service worker, icons)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Upload route
app.post("/upload", (req, res) => {
    upload.single("xmlFile")(req, res, (err) => {
        if (err) {
            return res.status(500).send({ message: "Error uploading file." });
        }

        const description = req.body.description;
        const fileName = req.file.originalname;

        // Store description in a JSON file
        const metadataFilePath = path.join(__dirname, "uploads", "metadata.json");

        // Read existing metadata
        let metadata = {};
        if (fs.existsSync(metadataFilePath)) {
            metadata = JSON.parse(fs.readFileSync(metadataFilePath));
        }

        // Add the new file entry with description
        metadata[fileName] = { description };

        // Write back the metadata
        fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));

        res.send({ message: "File uploaded successfully! Thanks for sharing your bot and strategy." });
    });
});

// Get list of files
app.get("/files", (req, res) => {
    const metadataFilePath = path.join(__dirname, "uploads", "metadata.json");

    let metadata = {};
    if (fs.existsSync(metadataFilePath)) {
        metadata = JSON.parse(fs.readFileSync(metadataFilePath));
    }

    fs.readdir("uploads", (err, files) => {
        if (err) {
            return res.status(500).send({ message: "Unable to scan files!" });
        }

        const xmlFiles = files
            .filter(file => file.endsWith('.xml'))
            .map(file => ({
                name: file.slice(0, -4),
                description: metadata[file]?.description || null
            }));

        res.send(xmlFiles);
    });
});

// Download route
app.get("/download/:filename", (req, res) => {
    const fileName = req.params.filename + '.xml'; // Add .xml extension
    const filePath = path.join(__dirname, "uploads", fileName);

    res.download(filePath, err => {
        if (err) {
            res.status(404).send({ message: "File not found." });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
