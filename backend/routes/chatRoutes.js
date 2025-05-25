import express from "express";
import {
  getChatHistory,
  deleteChat,
  saveChat,
  sendMessage,
  generateImage
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/history", getChatHistory);
router.delete("/delete", deleteChat);
router.post("/save", saveChat);
router.post("/message", sendMessage);
router.post("/image", generateImage);
router.get("/",(req,res)=>{
  res.send("Chat route is working");
})

export default router;