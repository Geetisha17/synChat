import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {doc , getDoc  } from "firebase/firestore";
import jsPDF from "jspdf";
import "../ChatPage.css";  

export default function Home() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [userInfo,setUserInfo] = useState(null);
    const [previousChats,setPreviousChats] = useState([]);
    const navigate = useNavigate();

    const sendMessage = async () => {
        if (!message.trim()) return;
        const user = auth.currentUser;
        if (!user) {
            toast.error("User not logged in");
            return;
        }

        setChat(prevChat => [...prevChat, { user: message, bot: <span className="bouncing-dots"></span> }]);
        setMessage("");
        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, userId: user.uid }),
            });

            const data = await res.json();
            const cleanReply = data.reply.replace(/<\|im_[^>]+\|>/g, "").trim();
            setChat(prevChat=>{
                const updatedChat = [...prevChat];
                updatedChat[updatedChat.length-1].bot = cleanReply;
                return updatedChat;
            })
            
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
            const res = await fetch("http://localhost:5000/api/chat/delete",{
                method:"DELETE",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({userId:user.uid , chatIndex:chatsIdx})
            })

            if(!res.ok) throw new Error("failed to delete chat from server");

            setPreviousChats(prev=>prev.filter((_,idx)=> idx!==chatsIdx));
            fetchChatHistory(user.uid);
            toast.success("Chat is sucessfully deleted");
        }catch(error)
        {
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
            const res = await fetch(`http://localhost:5000/api/chat/history?userId=${userId}`);
            const data = await res.json();
            setPreviousChats(data.chats || []);
            // setChat(Array.isArray(data.messages) ? data.messages : []);
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
    const downloadFile = (content, filename, type = "text/plain") => {
        const blob = new Blob([content], { type });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };
    const exportAsPDF = () => {
        const doc = new jsPDF();
        let y = 10;
        chat.forEach((msg) => {
            doc.text(`You: ${msg.user}`, 10, y);
            y += 10;
            doc.text(`Bot: ${msg.bot}`, 10, y);
            y += 20;
            if (y > 270) {
                doc.addPage();
                y = 10;
            }
        });
        doc.save("chat.pdf");
    };
    const formatChatAsText = () => {
        return chat.map((msg, i) =>
            `Chat #${i + 1}\nYou: ${msg.user}\nBot: ${msg.bot}\n---\n`
        ).join("\n");
    };
    


    const setNewChat= ()=>{
        if(chat.length>0)
        {
            setPreviousChats(prev=>[[...chat],...prev]);
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
            <div className="sidebar">
                <h2>AI Chat Bot</h2>
                {
                    userInfo && (
                        <div className="userInfo-pfp">
                            <h3>{userInfo.user}</h3>
                            <h4>{userInfo.email}</h4>
                        </div>
                    )
                }
                <button className="newChatBtn" onClick={setNewChat}>➕ New Chat</button>
                <div>
                    <h3>Previous Chats</h3>
                    {
                        previousChats.map((c, idx) => (
                            <div key={idx} className="chat-list-item">
                                {
                        previousChats.map((c, idx) => (
                            <div key={idx} className="chat-list-item">
                                <button className="prevChat-btn" onClick={() => loadChat(c)}>
                                    Chat {previousChats.length - idx}
                                </button>
                                <button className="delete-btn" onClick={() => deleteChat(idx)}>🗑️</button>
                            </div>
                        ))
                    }
                            </div>
                        ))
                    }
                </div>
                <button className="logoutBtn" onClick={handleLogout}>Logout</button>
            </div>

            <div className="chat-window">
            <div className="export-buttons">
                <button onClick={() => downloadFile(formatChatAsText(), "chat.txt")} title="Download as Text">📄 TXT</button>
                <button onClick={exportAsPDF} title="Download as PDF">📕 PDF</button>
            </div>
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