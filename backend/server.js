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

const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

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
            TOGETHER_API_URL,
            {
                model: "mistralai/Mixtral-8x7B-Instruct-v0.1", 
                messages: [{ role: "user", content: message }],
                max_tokens: 1024,
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOGETHER_API_KEY}`, 
                },
            }
        );
        const botReply = response.data.choices[0].message.content;
        res.status(200).json({reply : botReply});
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
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

app.post("/api/image",async(req,res)=>{
    const {prompt} = req.body;

    if(!prompt) return res.status(400).json({error:"Prompt is required"});

    try{
        const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "a9758cbf3c55f4e27b5b002fdbb2f90b22be2958ff8339b2af2b6cddc9b4b6d0", // SD 1.5
        input: { prompt }
      })
    });

    const data = await response.json();
    if (data?.urls?.get) {
      const getUrl = data.urls.get;
      let imageUrl;

      for (let i = 0; i < 10; i++) {
        const resultRes = await fetch(getUrl, {
          headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` }
        });
        const resultData = await resultRes.json();

        if (resultData.status === "succeeded") {
          imageUrl = resultData.output[0];
          break;
        } else if (resultData.status === "failed") {
          return res.status(500).json({ error: "Image generation failed." });
        }

        await new Promise(resolve => setTimeout(resolve, 1500)); // wait 1.5s
      }

      if (!imageUrl) {
        return res.status(500).json({ error: "Image generation timed out." });
      }

      return res.json({ image: imageUrl });
    } else {
      return res.status(500).json({ error: "Failed to start prediction." });
    }
    }
    catch(error)
    {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Image generation failed" });
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