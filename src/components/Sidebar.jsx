/* eslint-disable react/prop-types */
export default function Sidebar({
  userInfo,
  searchQuery,
  setSearchQuery,
  previousChats,
  loadChat,
  deleteChat,
  setNewChat,
  handleLogout,
  setMessage,
}) {
  const filteredChats = previousChats.filter((chat) =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sidebar">
      <h2>AI Chat Bot</h2>

      <input
        type="text"
        className="chat-search"
        placeholder="Search Chats..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {userInfo && (
        <div className="userInfo-pfp">
          <h3>{userInfo.user}</h3>
          <h4>{userInfo.email}</h4>
        </div>
      )}

      <button className="newChatBtn" onClick={setNewChat}>➕ New Chat</button>

      <div>
        <h3>Previous Chats</h3>
        {filteredChats.length > 0 ? (
          filteredChats.map((c, idx) => (
            <div key={idx} className="chat-list-item">
              <button
                className="prevChat-btn"
                onClick={() => {
                  loadChat(c.messages);
                  if (c.messages.length > 0) {
                    setMessage(c.messages[0].user); 
                  }
                }}
              >
                {c.name || `Chat ${previousChats.length - idx}`}
              </button>
              <button className="delete-btn" onClick={() => deleteChat(idx)}>🗑️</button>
            </div>
          ))
        ) : (
          <p className="no-chats">No chats found.</p>
        )}
      </div>

      <button className="logoutBtn" onClick={handleLogout}>Logout</button>
    </div>
  );
}