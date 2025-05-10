import { useState } from 'react';
import ThreeBackground from './ThreeBackground';
import Login from '../pages/Login';
import Signup from '../pages/SignUp';

export default function Main() {
  const [activeComponent, setActiveComponent] = useState('login'); // 'login' or 'signup'

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', fontFamily: 'sans-serif' }}>
      <ThreeBackground />
      <div style={{
        overflow:"hidden",
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        height: '100%',
        width: '100%',
        color: 'white',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '130px',
        }}>
          <h1 style={{ fontSize: '5rem', fontWeight: 'bold', marginBottom: '1rem' }}>SynChat</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '500px', color: '#ccc' }}>
            Your intelligent AI-powered chat assistant. Built for smooth conversations, smart interactions, and effortless collaboration.
          </p>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingRight: '60px',
          marginTop:'30px'
        }}>
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveComponent('login')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeComponent === 'login' ? '#ffffff33' : '#ffffff11',
                border: '1px solid #ffffff55',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
              }}
            >
              Login
            </button>
            <button
              onClick={() => setActiveComponent('signup')}
              style={{
                padding: '10px 20px',
                backgroundColor: activeComponent === 'signup' ? '#ffffff33' : '#ffffff11',
                border: '1px solid #ffffff55',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
              }}
            >
              Signup
            </button>
          </div>

          <div style={{
            backgroundColor: '#ffffff11',
            padding: '30px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            width: '100%',
            maxWidth: '400px',
          }}>
            {activeComponent === 'login' ? <Login /> : <Signup />}
          </div>
        </div>
      </div>
    </div>
  );
}
