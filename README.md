
#  SYNCHAT – AI Chatbot Interface

SYNCHAT is a sleek, fully responsive AI chatbot built using the MERN stack. It offers a user-friendly interface for human-AI interaction, complete with animated bot responses, chat history, authentication, and smooth transitions that enhance the overall user experience.

---

##  Features

### 1. **Real-Time AI Interaction**
 One of the key elements of the real-time communication is the inclusion of animated typing indicators. These small but impactful animations show when the bot is "thinking" or "typing," which enhances the human-like experience of the conversation. By integrating this feature, SynChat mimics the flow of natural communication, ensuring that users feel like they are engaging in a real dialogue, rather than just receiving static responses. Additionally, the AI is contextually aware of prior interactions, allowing it to provide answers that are relevant to the ongoing conversation, creating a more coherent and personalized experience.

### 2. **New Chat Functionality**
This option is particularly useful for users who want to change the topic or simply start over without any lingering context from previous discussions. When users click the "New Chat" button, the entire chat history is cleared, allowing them to engage with the bot as if it were a brand new session. 

### 3. **Redis Performace Optimisation**
To enhance responsiveness and reduce load times, SYNCHAT integrates Redis as an in-memory caching layer for chat history. When a user logs in, the system first checks Redis for a cached version of their previous chats. If available, the data is returned almost instantly — drastically improving load speeds. If not cached, the data is fetched from MongoDB and then cached in Redis for future use. This optimization ensures that both first-time and repeat users enjoy a lightning-fast experience, even as the dataset grows.

### 4. **User-Specific Chat History**
SynChat provides users with the ability to review and revisit their past conversations, enhancing the personalization of their experience. All chat histories are stored in a secure MongoDB database, ensuring that each user's data is private and accessible only to them. Once logged in, users can easily access their previous chats and continue where they left off.

### 5. **New Chat Session Management**
The “New Chat” feature empowers users to start fresh conversations at any time without lingering context. This is especially useful when users want to reset the AI’s memory for a different topic or interaction style. Each new session is stored independently, keeping previous chats intact and accessible in the user’s history sidebar.

### 6. **Docker-Enabled Deployment**
SYNCHAT is fully containerized using Docker, ensuring platform-agnostic development and deployment. By encapsulating the backend, and Redis server within Docker containers.

---

## Demo

[▶️ Watch Demo Video](https://drive.google.com/file/d/1EVMnz8NYz3-j7gAtoYmN_nvNdTW2z9vI/view?usp=sharing)

---

##  Tech Stack

### **Frontend:**
- React.js
- JavaScript (ES6)
- CSS Modules / Styled Components
- Axios

### **Backend:**
- Node.js
- Express.js

### **Database:**
- MongoDB + Mongoose
- Redis (user chat history cache)

---

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your/repository.git
   ```

2. Navigate to the project directory:
   ```bash
     cd synChat
   ```
3. Install dependencies:
   ```bash
     npm install
   ```
4. Create a .env file with the following keys:
   ```bash
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   REDIS_URL=redis://localhost:6379
   ```

4. Start the server:
   ```bash
    npm start
   ```
5. Open your browser and go to:
   ```bash
    http://localhost:3000 to use the application.   
