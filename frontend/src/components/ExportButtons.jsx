/* eslint-disable react/prop-types */

import jsPDF from "jspdf";

export default function ExportButtons({ chat }) {
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

  return (
    <div className="export-buttons">
      <button onClick={() => downloadFile(formatChatAsText(), "chat.txt")} title="Download as Text">
        📄 TXT
      </button>
      <button onClick={exportAsPDF} title="Download as PDF">
        📕 PDF
      </button>
    </div>
  );
}
