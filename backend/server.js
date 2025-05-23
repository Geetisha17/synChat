import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./database/database.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/chat", chatRoutes);

setInterval(() => {
  console.log("Running garbage collection");
  if (typeof globalThis.gc === "function") {
    globalThis.gc();
  }
}, 60000);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));