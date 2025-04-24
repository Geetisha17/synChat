
#  SYNCHAT – AI Chatbot Interface

SYNCHAT is a sleek, fully responsive AI chatbot built using the MERN stack. It offers a user-friendly interface for human-AI interaction, complete with animated bot responses, chat history, authentication, and smooth transitions that enhance the overall user experience.

---

##  Features

### 1. **Real-Time AI Interaction**
 One of the key elements of the real-time communication is the inclusion of animated typing indicators. These small but impactful animations show when the bot is "thinking" or "typing," which enhances the human-like experience of the conversation. By integrating this feature, SynChat mimics the flow of natural communication, ensuring that users feel like they are engaging in a real dialogue, rather than just receiving static responses. Additionally, the AI is contextually aware of prior interactions, allowing it to provide answers that are relevant to the ongoing conversation, creating a more coherent and personalized experience.

### 2. **New Chat Functionality**
This option is particularly useful for users who want to change the topic or simply start over without any lingering context from previous discussions. When users click the "New Chat" button, the entire chat history is cleared, allowing them to engage with the bot as if it were a brand new session. 

### 3. **Authentication System**
SynChat incorporates a robust authentication system to ensure that each user’s data remains secure and private. User authentication is powered by JSON Web Tokens (JWT), which securely manage user sessions. With this system, users are required to sign up for an account, log in, and can securely log out when they’re finished. 

### 4. **User-Specific Chat History**
SynChat provides users with the ability to review and revisit their past conversations, enhancing the personalization of their experience. All chat histories are stored in a secure MongoDB database, ensuring that each user's data is private and accessible only to them. Once logged in, users can easily access their previous chats and continue where they left off.

### 5. **Clean Architecture**
SynChat is built with a clear and modular architecture, ensuring that the project is easy to maintain and scale. The application is designed with a separation of concerns between the frontend, backend, and API calls, which enhances the clarity of the codebase and makes it easier to update or extend individual components.

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
- MongoDB
- Mongoose

### **Authentication:**
- JWT (JSON Web Tokens)

### **API:**
- Integrated with external AI APIs (Forefrond API)

---

## How to Run Locally

```bash
# 1. Clone the repository
## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your/repository.git
2. Navigate to the project directory:
   ```bash
     cd synChat
3. Install dependencies:
   ```bash
     npm install
4. Start the server:
   ```bash
    npm start
5. Open your browser and go to:
   ```bash
    http://localhost:3000 to use the application.   
