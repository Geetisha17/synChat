import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios"; 

dotenv.config();
const API_KEY = process.env.FOREFRONT_API_KEY; 
const FOREFRONT_API_URL = "https://api.forefront.ai/v1/chat/completions";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            FOREFRONT_API_URL,
            {
                model: "mistralai/Mistral-7B-v0.1", 
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`, 
                },
            }
        );

        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Forefront API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

const PORT = process.env.PORT || 5000;
console.log("PORT from .env:", process.env.PORT);

app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));

