import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {doc , getDoc  } from "firebase/firestore";
import ThreeBackground from "../components/ThreeBackground";
import "../ChatPage.css";  
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ExportButtons from "../components/ExportButtons";
import MessageInput from "../components/MessageInput";

export default function Home() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [userInfo,setUserInfo] = useState(null);
    const [previousChats,setPreviousChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [imageMode,setImageMode] = useState(false);
    const navigate = useNavigate();

    const sendMessage = async () => {
        if (!message.trim()) return;
        const user = auth.currentUser;
        if (!user) {
            toast.error("User not logged in");
            return;
        }

        const userMessage = message;
        setMessage("");
        setChat(prevChat => [...prevChat, { user: userMessage, bot: imageMode? "Generating image" : <span className="bouncing-dots"></span> }]);
        try {
            if(imageMode)
            {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/image`,{
                    method:"POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({prompt:userMessage}),
                });

                const data = await res.json();
                setChat(prev=>{
                    const updatedChat = [...prev];
                    updatedChat[updatedChat.length-1].bot = (
                        `data:image/png;base64,${data.image}`
                    );
                    return updatedChat;
                })
            }
            else{
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({message}),
                });

                const data = await res.json();
                const cleanReply = data.reply.replace(/<\|im_[^>]+\|>/g, "").trim();
                setChat(prevChat=>{
                    const updatedChat = [...prevChat];
                    updatedChat[updatedChat.length-1].bot = cleanReply;
                    return updatedChat;
                })
            }
            
        } catch (error) {
            console.error(error.message);
        setChat(prevChat => {
            const updatedChat = [...prevChat];
            updatedChat[updatedChat.length - 1].bot = "Error: Unable to get response.";
            return updatedChat;
        });
        }
    };

    const deleteChat = async(chatsIdx)=>{
        const user = auth.currentUser;
        if(!user)
        {
            toast.error("User not logged in");
            return;
        }
        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/delete`,{
                method:"DELETE",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({userId:user.uid , chatIndex:chatsIdx})
            });

            const result = await res.json();
            console.log("Server response:", result);

            if(!res.ok) throw new Error("failed to delete chat from server");

            setPreviousChats(prev=>prev.filter((_,idx)=> idx!==chatsIdx));
            fetchChatHistory(user.uid);
            toast.success("Chat is sucessfully deleted");
        }catch(error)
        {
            console.log(error.message);
            toast.error(`Error!! ${error.message}`);
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate("/login");
                toast.error("You must be logged in to access this page");
            } else {
                fetchChatHistory(user.uid);
                fetchUserInfo(user.uid);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchChatHistory = async (userId) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/history?userId=${userId}`);
            const data = await res.json();
            if (Array.isArray(data.chat)) {
                setPreviousChats(data.chat);
                console.log(data.chat);
            } else {
                setPreviousChats([]);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const fetchUserInfo = async(userId)=>{
        try {
            const useRef = doc(db,"Users",userId);
            const userSnap = await getDoc(useRef);

            if(userSnap.exists())
            {
                setUserInfo(userSnap.data());
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    const extractKeyword = (messages) => {
        const stopwords = new Set([
            "what","tell","me","the", "is", "at", "which", "on", "a", "an", "and", "or", "but", "of", "to", "in", "for", "with", "as", "by", "it", "this", "that", "are", "was"
        ]);
    
        const wordCounts = {};
        const allWords = messages.flatMap(msg => msg.user.toLowerCase().split(/\W+/));
    
        allWords.forEach(word => {
            if (word && !stopwords.has(word)) {
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
        });
    
        const sortedWords = Object.entries(wordCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3) 
            .map(([word]) => word);
    
        return sortedWords.length > 0 ? sortedWords.join(" ") : "Chat";
    };
    
    const setNewChat= async()=>{
        if(chat.length===0) return;

        const user =auth.currentUser;
        if(!user)
        {
            toast.error("User not logged in");
            return;
        }
        const keyword = extractKeyword(chat);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/save`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({
                    userId: user.uid,
                    name:keyword,
                    messages:chat
                })
            });
            const result = await res.json();
            if(!res.ok) throw new Error(result.error || "Failed to save");

            setPreviousChats(prev=>[{name:keyword, messages : [...chat]},...prev]);
        } catch (error) {
            toast.error("Error in saving chat "+error.message);
        }
        setChat([]);
    }
    const loadChat = (chatMessages)=>{
        setChat(chatMessages);
    }

    async function handleLogout() {
        try {
            await auth.signOut();
            navigate("/");
            toast.success("Successfully logged out");
        } catch (e) {
            console.log(e.message);
        }
    }
    
    return (
        <div className="chat-container">
            <ThreeBackground/>
                <Sidebar
                userInfo={userInfo}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                previousChats={previousChats}
                loadChat={loadChat}
                deleteChat={deleteChat}
                setNewChat={setNewChat}
                handleLogout={handleLogout}
                setMessage={setMessage}
                />
                <div className="chat-window">
                    <ExportButtons chat={chat} />
                    <ChatWindow chat={chat} />
                    <MessageInput
                        message={message}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                        imageMode={imageMode}
                        setImageMode={setImageMode}
                    />
                </div>
        </div>
    );
}