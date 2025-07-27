import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const VirtualSession = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedBackground, setSelectedBackground] = useState(null);
  const socketRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    // Initialize session
    const initSession = async () => {
      const response = await axios.get(`/api/v1/virtual/sessions/${sessionId}`);
      setSession(response.data.session);
    };

    // Initialize WebSocket connection
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      query: { sessionId }
    });

    // Handle incoming messages
    socketRef.current.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Handle pose suggestions
    socketRef.current.on('pose_suggestion', (pose) => {
      // Update pose overlay
    });

    // Handle background updates
    socketRef.current.on('background_updated', ({ backgroundUrl }) => {
      setSelectedBackground(backgroundUrl);
    });

    initSession();

    return () => {
      socketRef.current.disconnect();
    };
  }, [sessionId]);

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketRef.current.emit('send_message', {
      sessionId,
      message: newMessage,
      type: 'text'
    });

    setNewMessage('');
  };

  const updateBackground = async (backgroundUrl) => {
    try {
      await axios.post(`/api/v1/virtual/sessions/${sessionId}/background`, {
        backgroundUrl
      });
    } catch (error) {
      console.error('Error updating background:', error);
    }
  };

  const capturePhoto = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Draw video frame
      ctx.drawImage(videoRef.current, 0, 0);
      
      // If there's a background, composite it
      if (selectedBackground) {
        // Add background composition logic here
      }
      
      const photoUrl = canvas.toDataURL('image/jpeg');
      
      await axios.post(`/api/v1/virtual/sessions/${sessionId}/photos`, {
        photoUrl,
        backgroundUrl: selectedBackground
      });
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  if (!session) {
    return <div>Loading session...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Video feed */}
        <div className="relative flex-1 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
          {selectedBackground && (
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${selectedBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.5
              }}
            />
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-white border-t">
          <div className="flex justify-center space-x-4">
            <button
              onClick={capturePhoto}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Capture Photo
            </button>
            <button
              onClick={() => {/* Toggle pose suggestions */}}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Suggest Pose
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white border-l flex flex-col">
        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-4">
              <div className="font-medium text-gray-900">
                {message.sender_name}
              </div>
              <div className="text-gray-600">{message.message}</div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <form onSubmit={sendMessage} className="p-4 border-t">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </form>
      </div>
    </div>
  );
};

export default VirtualSession;
