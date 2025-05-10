/* eslint-disable react/prop-types */
export default function ChatWindow({ chat }) {
  return (
    <div className="chat-messages">
      {Array.isArray(chat) &&
        chat.map((c, idx) => (
          <div key={idx}>
            <div className="message user">
              <h3>You:</h3>
              <p>{c.user}</p>
            </div>
            {c.bot && (
              <div className="message bot">
                <h3>Bot:</h3>
                <p>
                  {typeof c.bot==="string" && c.bot.startsWith("data:image") ? (
                    <img src={c.bot} alt="Generated" style={{ maxWidth: "100%", borderRadius: "8px" }} />
                  ) : (
                    c.bot
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}