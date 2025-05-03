import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: {type:String, required:true},
    name: { type: String, default: "Chat" },
    messages:[
        {
            user: {type: String, required:true},
            bot: {type: String, required:true},
            timestamp: {type: Date, default: Date.now}
        }
    ]
})

const Chat = mongoose.model("Chat",chatSchema);
export default Chat;