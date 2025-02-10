const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate";

// 🔥 Extract text from a file (PDF or Image)
const extractText = async (file) => {
    if (!file) return "";

    if (file.mimetype === "application/pdf") {
        // PDF Handling
        const data = await pdfParse(file.buffer);
        return `Extracted from PDF: \n${data.text}`;
    } else if (file.mimetype.startsWith("image/")) {
        // Image OCR Handling
        const { data } = await Tesseract.recognize(file.buffer, "eng");
        return `Extracted from Image: \n${data.text}`;
    }

    return "Unsupported file type.";
};

// 🔥 Chat Route (Handles File Uploads)
app.post("/chat", upload.single("file"), async (req, res) => {
    try {
        console.log("✅ Received request:", req.body);
        const { message } = req.body;
        const file = req.file;

        if (!message && !file) {
            return res.status(400).json({ error: "No message or file provided" });
        }

        let extractedText = "";
        if (file) {
            extractedText = await extractText(file);
            console.log("📄 Extracted File Text:", extractedText);
        }

        const fullPrompt = `${message}\n\n${extractedText}`;

        console.log("🔄 Sending request to Ollama...");
        const response = await axios.post(OLLAMA_API_URL, {
            model: "llama2",
            prompt: fullPrompt,
            stream: true
        }, { responseType: "stream" });

        res.setHeader("Content-Type", "text/plain");
        response.data.pipe(res); // 🔥 Stream directly to frontend

    } catch (error) {
        console.error("❌ Error communicating with Ollama:", error.message);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
