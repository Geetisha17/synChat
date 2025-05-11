import Chat from "../models/Chat.js";
import redisClient from "../redisClient.js";
import axios from "axios";

const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export const getChatHistory = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const cacheKey = `user_chats:${userId}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      console.log(`Serving from Redis`);
      return res.json({ chat: JSON.parse(cached) });
    }

    const chat = await Chat.find({ userId });
    console.log("Mongo result:", chat);

    await redisClient.set(cacheKey, JSON.stringify(chat), { EX: 3600 });

    res.json({ chat }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteChat = async (req, res) => {
  const { userId, chatIndex } = req.body;
  if (!userId || chatIndex === undefined) {
    return res.status(400).json({ error: "User ID and chat index are required" });
  }

  try {
    const chats = await Chat.find({ userId });
    if (!chats[chatIndex]) {
      return res.status(400).json({ error: "Invalid chat index" });
    }

    await Chat.deleteOne({ _id: chats[chatIndex]._id });
    await redisClient.del(`user_chats:${userId}`);

    res.status(200).json({ message: "Chat has been deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveChat = async (req, res) => {
  const { userId, messages, name } = req.body;

  if (!userId || !messages?.length) {
    return res.status(400).json({ error: "Missing userId or messages" });
  }

  try {
    await new Chat({ userId, name, messages }).save();
    await redisClient.del(`user_chats:${userId}`);
    res.status(201).json({ message: "Chat saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: "Message is required" });

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
        }
      }
    );

    const botReply = response.data.choices[0].message.content;
    res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const generateImage = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "a9758cbf3c55f4e27b5b002fdbb2f90b22be2958ff8339b2af2b6cddc9b4b6d0",
        input: { prompt }
      })
    });

    const data = await response.json();
    if (!data?.urls?.get) return res.status(500).json({ error: "Image generation failed to start." });

    let imageUrl;
    for (let i = 0; i < 10; i++) {
      const resultRes = await fetch(data.urls.get, {
        headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` }
      });
      const resultData = await resultRes.json();

      if (resultData.status === "succeeded") {
        imageUrl = resultData.output[0];
        break;
      } else if (resultData.status === "failed") {
        return res.status(500).json({ error: "Image generation failed." });
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    if (!imageUrl) {
      return res.status(500).json({ error: "Image generation timed out." });
    }

    res.json({ image: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation error" });
  }
};