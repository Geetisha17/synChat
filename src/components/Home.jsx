import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../ChatPage.css";  

export default function Home() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const navigate = useNavigate();

    const sendMessage = async () => {
        if (!message.trim()) return;
        const user = auth.currentUser;
        if (!user) {
            toast.error("User not logged in");
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, userId: user.uid }),
            });

            const data = await res.json();
            const cleanReply = data.reply.replace(/<\|im_[^>]+\|>/g, "").trim();
            setChat((prevChat) => [...prevChat, { user: message ,  bot: cleanReply }]);
            setMessage("");
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate("/login");
                toast.error("You must be logged in to access this page");
            } else {
                fetchChatHistory(user.uid);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchChatHistory = async (userId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/chat/history?userId=${userId}`);
            const data = await res.json();
            setChat(Array.isArray(data.messages) ? data.messages : []);
        } catch (error) {
            console.log(error.message);
        }
    };

    async function handleLogout() {
        try {
            await auth.signOut();
            navigate("/login");
            toast.success("Successfully logged out");
        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <div className="chat-container">
            <div className="sidebar">
                <h2>AI Chat Bot</h2>
                <button className="logoutBtn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="chat-window">
                <div className="chat-messages">
                        {Array.isArray(chat) &&
                        chat.map((c, idx) => (
                            <div key={idx}>
                                <div className="message user">
                                    <h3>You:</h3>
                                    <p>{c.user}</p>
                                </div>
                                {
                                    c.bot && (<div className="message bot">
                                    <h3>Bot:</h3>
                                    <p>{c.bot}</p>
                                </div>)
                                }
                            </div>
                    ))}
                </div>

                <div className="input-area">
                    <textarea
                        rows="2"
                        cols="50"
                        value={message}
                        placeholder="Type your message here..."
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    <button className='sendbtn' onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}
