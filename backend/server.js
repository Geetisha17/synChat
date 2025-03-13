import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";
import express from "express";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios"; 
import connectDB from "./database.js";
import Chat from './models/Chat.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.FOREFRONT_API_KEY; 
const FOREFRONT_API_URL = "https://api.forefront.ai/v1/chat/completions";

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json());

connectDB();

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
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
                
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`, 
                },
            }
        );
        const botReply = response.data.choices[0].message.content.replace(/<\|im_start\|>/g, "").replace(/<\|im_end\|>/g, "").trim();

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
        res.json({messages:chat.messages || []});
    }catch(error)
    {
        console.log("Error here ",error.message);
        res.status(500).json({error:"Something went wrong"});
    }
})

app.delete("/api/chat/delete",async(req,res)=>{
    try{
        const {userId , chatIndex} = req.body;
        if(!userId || chatIndex === undefined || chatIndex ===null)  
            return res.status(400).json({error:"User ID and chat index are required!!"});
        
        const chatDoc = await Chat.findOne({userId});
        if(!chatDoc || !Array.isArray(chatDoc.messages)) 
            return res.status(404).json({error:"Chat not found"});

        if(chatIndex <0 || chatIndex >= chatDoc.messages.length)
            return res.status(400).json({messages:"Invalid chat"});

        chatDoc.messages.splice(chatIndex,1);
        await chatDoc.save();

        res.status(200).json({messgae: "Chat has been deleted successfully"});
    }catch(error)
    {
        res.status(500).json({error:error.message});
    }
})
setInterval(() => {
    console.log("Running garbage collection");
    if (typeof globalThis.gc === "function") {
        globalThis.gc();
    }
}, 60000); // Every minute



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));
