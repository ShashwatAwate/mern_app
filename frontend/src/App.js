import { useEffect, useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  // Load messages
  const fetchMessages = () => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Add message
  const addMessage = async () => {
    if (!text.trim()) return;

    await fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });

    setText('');
    fetchMessages();
  };

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '50px',
      fontFamily: 'Arial'
    }}>
      <h1>Simple MERN App</h1>

      <input
        type="text"
        placeholder="Enter message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          padding: '10px',
          width: '250px',
          marginRight: '10px'
        }}
      />

      <button
        onClick={addMessage}
        style={{
          padding: '10px 20px',
          cursor: 'pointer'
        }}
      >
        Add
      </button>

      <h2>Messages</h2>

      {messages.map((msg) => (
        <div key={msg._id}>
          {msg.text}
        </div>
      ))}
    </div>
  );
}

export default App;