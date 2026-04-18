import { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('Loading...');

  useEffect(() => {
    fetch('/api/message')
      .then(res => res.json())
      .then(data => setMsg(data.message))
      .catch(() => setMsg('Error fetching data'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '80px', fontFamily: 'Arial' }}>
      <h1>Simple MERN App</h1>
      <h2>{msg}</h2>
    </div>
  );
}

export default App;