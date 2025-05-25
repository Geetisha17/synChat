import { useEffect, useState } from "react";
import axios from "axios";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import ThreeBackground from "../components/ThreeBackground";
import "../ChatPage.css";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ExportButtons from "../components/ExportButtons";
import MessageInput from "../components/MessageInput";

const API_BASE = "http://174.129.135.117:5000/api/chat";

export default function Home() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [previousChats, setPreviousChats] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [imageMode, setImageMode] = useState(false);
    const navigate = useNavigate();

    const sendMessage = async () => {
        if (!message.trim()) return;
        const user = auth.currentUser;
        if (!user) return toast.error("User not logged in");

        const userMessage = message;
        setMessage("");
        setChat(prev => [...prev, { user: userMessage, bot: imageMode ? "Generating image..." : <span className="bouncing-dots" /> }]);

        try {
            if (imageMode) {
                const res = await axios.post(`${API_BASE}/image`, { prompt: userMessage });
                const imageUrl = res.data.image;
                setChat(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1].bot = `data:image/png;base64,${imageUrl}`;
                    return updated;
                });
            } else {
                const res = await axios.post(`${API_BASE}/message`, { message: userMessage });
                const reply = res.data.reply.replace(/<\|im_[^>]+\|>/g, "").trim();
                setChat(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1].bot = reply;
                    return updated;
                });
            }
        } catch (error) {
            console.error(error);
            setChat(prev => {
                const updated = [...prev];
                updated[updated.length - 1].bot = "Error: Unable to get response.";
                return updated;
            });
        }
    };

    const deleteChat = async (idx) => {
        const user = auth.currentUser;
        if (!user) return toast.error("User not logged in");

        try {
            await axios.delete(`${API_BASE}/delete/${user.uid}/${idx}`);
            toast.success("Chat deleted");
            setPreviousChats(prev => prev.filter((_, i) => i !== idx));
            fetchChatHistory(user.uid);
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        }
    };

    const fetchChatHistory = async (userId) => {
        try {
            const res = await axios.get(`${API_BASE}/history/${userId}`);
            setPreviousChats(Array.isArray(res.data.chat) ? res.data.chat : []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUserInfo = async (userId) => {
        try {
            const userRef = doc(db, "Users", userId);
            const snap = await getDoc(userRef);
            if (snap.exists()) setUserInfo(snap.data());
        } catch (err) {
            console.error(err);
        }
    };

    const extractKeyword = (messages) => {
        const stopwords = new Set([
            "what", "tell", "me", "the", "is", "at", "which", "on", "a", "an", "and", "or", "but", "of", "to", "in", "for", "with", "as", "by", "it", "this", "that", "are", "was"
        ]);
        const counts = {};
        messages.flatMap(msg => msg.user.toLowerCase().split(/\W+/))
            .forEach(word => {
                if (word && !stopwords.has(word)) {
                    counts[word] = (counts[word] || 0) + 1;
                }
            });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([word]) => word)
            .join(" ") || "Chat";
    };

    const setNewChat = async () => {
        if (chat.length === 0) return;
        const user = auth.currentUser;
        if (!user) return toast.error("User not logged in");

        const keyword = extractKeyword(chat);
        try {
            await axios.post(`${API_BASE}/save/${user.uid}`, {
                name: keyword,
                messages: chat
            });
            toast.success("Chat saved");
            setPreviousChats(prev => [{ name: keyword, messages: [...chat] }, ...prev]);
        } catch (err) {
            toast.error("Failed to save chat: " + err.message);
        } finally {
            setChat([]);
        }
    };

    const loadChat = (messages) => setChat(messages);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate("/");
            toast.success("Logged out");
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
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

    return (
        <div className="chat-container">
            <ThreeBackground />
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