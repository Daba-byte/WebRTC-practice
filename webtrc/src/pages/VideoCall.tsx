import React, { useEffect, useState } from 'react';

const VideoChat = () => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    // OpenVidu 서버에서 토큰을 생성하는 함수
    const fetchToken = async () => {
      try {
        const response = await fetch('https://localhost:4443/api/start-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('OPENVIDU_SECRET:talktalk123'), // 인증 정보 추가
          },
        });

        if (!response.ok) {
          throw new Error('Failed to create session');
        }

        const data = await response.json();
        setSessionToken(data.token);
      } catch (error) {
        console.error(error);
      }
    };

    fetchToken();
  }, []);

  if (!sessionToken) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>OpenVidu Video Chat</h1>
      <p>Session Token: {sessionToken}</p>
    </div>
  );
};

export default VideoChat;
