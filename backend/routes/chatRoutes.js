import express from "express";
import {
  getChatHistory,
  deleteChat,
  saveChat,
  sendMessage,
  generateImage
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/history/:userId", getChatHistory);
router.delete("/delete/:userId/:chatIndex", deleteChat);
router.post("/save/:userId", saveChat);
router.post("/message", sendMessage);
router.post("/image", generateImage);
router.get("/",(req,res)=>{
  res.send("Chat route is working");
})

export default router;