import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "url";
import express from "express";
import path from "path";
import cors from "cors";
import axios from "axios"; 
import connectDB from "./database.js";
import Chat from './models/Chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.FOREFRONT_API_KEY; 
const FOREFRONT_API_URL = "https://api.forefront.ai/v1/chat/completions";

const app = express();
app.use(cors());
app.use(express.json());  
connectDB();

app.post("/api/message", async (req, res) => {
    const { message } = req.body;

    if(!message) {
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
        res.status(200).json({reply : botReply});
    } catch (error) {
        console.error("Forefront API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.post("/api/chat/save",async(req,res)=>{
    const {userId, messages , name} = req.body;

    if(!userId || !messages || messages.length===0)
        return res.status(400).json({error:"Missing userId or messages"});

    try {
        const newChat = new Chat({userId , name,messages});
        await newChat.save();

        res.status(201).json({message:"Chat saved succesfully"});
    } catch (error) {
        req.status(500).json({error:error.message});
    }
})

app.get("/api/chat/history",async(req,res)=>{
    try{
        const {userId} = req.query;
        if(!userId){
            return res.status(400).json({error: "user Id is required"});
        }
        const chat = await Chat.find({userId});

        if(chat.length ===0 )
            return res.json({messages:[]});
        
        res.json({chat});
        
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
        
        const chats = await Chat.find({userId});

        if(!chats ||  chatIndex <0 || chatIndex >= chats.length)
            return res.status(400).json({messages:"Invalid chat"});

        const chatToDelete = chats[chatIndex];
        await Chat.deleteOne({_id:chatToDelete._id});
        res.status(200).json({messgae: "Chat has been deleted"});
    }catch(error)
    {
        res.status(500).json({error:error.message});
    }
});

setInterval(() => {
    console.log("Running garbage collection");
    if (typeof globalThis.gc === "function") {
        globalThis.gc();
    }
}, 60000); 

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,"../dist", "index.html"));
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));