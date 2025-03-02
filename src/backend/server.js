import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios"; 
import connectDB from "./database.js";
import Chat from './models/Chat.js';

dotenv.config();
const API_KEY = process.env.FOREFRONT_API_KEY; 
const FOREFRONT_API_URL = "https://api.forefront.ai/v1/chat/completions";

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.post("/api/chat", async (req, res) => {
    const { message , userId } = req.body;

    if(!message || !userId) {
        return res.status(400).json({error:"Message and userId required"});
    }

    try {
        const response = await axios.post(
            FOREFRONT_API_URL,
            {
                model: "mistralai/Mistral-7B-v0.1", 
                messages: [{ role: "user", content: message }],
                stream:true
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`, 
                },
            }
        );
        const botReply = response.data.choices[0].message.content;

        let chat = await Chat.findOne({userId});

        if(!chat)
        {
            chat = new Chat({userId, messages:[]});
        }

        chat.messages.push({user: message, bot:botReply});
        await chat.save();

        res.json({ reply: botReply });
    } catch (error) {
        console.error("Forefront API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/api/chat/history",async(req,res)=>{
    const {userId} = req.query;

    if(!userId)
    {
        return res.status(400).json({error: "user Id is required"});
    }

    try{
        const chat = await Chat.findOne({userId});

        if(!chat )
        {
            return res.json({messages:[]});
        }
        res.json({messgaes:chat.messages || []});
    }catch(error)
    {
        console.log("Error here ",error.message);
        res.status(500).json({error:"Something went wrong"});
    }
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));

