const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"; // Force IPv4

// Handle chat requests
app.post("/chat", async (req, res) => {
    try {
        console.log("✅ Received request:", req.body); // Debugging log

        const { message } = req.body;
        if (!message) {
            console.error("❌ No message provided in request.");
            return res.status(400).json({ error: "No message provided" });
        }

        console.log("🔄 Sending request to Ollama...");
        const response = await axios.post(OLLAMA_API_URL, {
            model: "llama2",
            prompt: message,
            stream: false
        });

        console.log("✅ Ollama Response:", response.data.response);
        res.json({ reply: response.data.response });

    } catch (error) {
        console.error("❌ Error communicating with Ollama:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

// Start the backend server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
