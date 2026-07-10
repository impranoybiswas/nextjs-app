'use client';

import { useState } from 'react';
import { useBrowserNotification } from './useBrowserNotification';

// Mock Type for Data
interface RequestData {
  id: string;
  title: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}



export default function NotificationTest() {
  const { sendNotification } = useBrowserNotification();
  const [requests, setRequests] = useState<RequestData[]>([
    { id: '1', title: 'Leave Application', status: 'Pending' },
    { id: '2', title: 'Server Upgrade Request', status: 'Pending' },
  ]);

  // Simulated Real-time Update (Mocking Socket.io or Supabase Webhook)
  // Apnar backend jokhon data change korbe, tokhon shudhu sendNotification call hobe
  const simulateDataChange = () => {
    const randomStatus: ('Pending' | 'Approved' | 'Rejected')[] = ['Approved', 'Rejected'];
    const updatedStatus = randomStatus[Math.floor(Math.random() * randomStatus.length)];
    
    // Status update logic simulation
    setRequests((prev) =>
      prev.map((req, index) =>
        index === 0 ? { ...req, status: updatedStatus } : req
      )
    );

    // 🚀 Browser e notification trigger hocche data change er fole
    sendNotification('⚠️ Request Updated!', {
      body: `Your "Leave Application" status has been changed to: ${updatedStatus}`,
      tag: 'request-update', // Tag dile ekui notification bar bar stack hobe na, overwrite hobe
    });
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>🔔 Next.js Real-time Notification Test</h2>
      <p>Nicher button-e click korle data change simulate hobe ebong browser notification ashbe.</p>
      
      <button
        onClick={simulateDataChange}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Simulate Data Update & Notify
      </button>

      <div style={{ marginTop: '2rem' }}>
        <h3>Current Requests Data:</h3>
        <ul>
          {requests.map((req) => (
            <li key={req.id}>
              <strong>{req.title}</strong> — Status:{' '}
              <span
                style={{
                  color: req.status === 'Approved' ? 'green' : req.status === 'Rejected' ? 'red' : 'orange',
                  fontWeight: 'bold',
                }}
              >
                {req.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}



