/* eslint-disable react/prop-types */
import { FiPaperclip } from "react-icons/fi";

export default function MessageInput({ message, setMessage, sendMessage, imageMode, setImageMode }) {
  return (
    <div className="input-area">
      <div className="input-wrapper">
        <textarea
          rows="2"
          cols="50"
          value={message}
          placeholder="Type your message here..."
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <div className="icon-wrapper" onClick={() => setImageMode(!imageMode)}>
          <FiPaperclip className="clip-icon" />
          <span className="tooltip">
            {imageMode ? "Switch to Text Mode" : "Switch to Image Mode"}
          </span>
        </div>
      </div>

      <button className="sendbtn" onClick={sendMessage}>Send</button>
    </div>
  );
}