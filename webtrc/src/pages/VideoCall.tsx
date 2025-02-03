import React, { useEffect, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import { Publisher, Session, Subscriber } from 'openvidu-browser';

const VideoChat = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const sessionId = "mySession";

        // 1️⃣ 세션이 존재하는지 확인
        let response = await fetch(`https://localhost:4443/openvidu/api/sessions/${sessionId}`, {
          method: "GET",
          headers: {
            Authorization: "Basic " + btoa("OPENVIDUAPP:talktalk123"),
            "Content-Type": "application/json",
          },
        });

        // 2️⃣ 세션이 없으면 생성
        if (response.status === 404) {
          response = await fetch("https://localhost:4443/openvidu/api/sessions", {
            method: "POST",
            headers: {
              Authorization: "Basic " + btoa("OPENVIDUAPP:talktalk123"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ customSessionId: sessionId }),
          });

          if (!response.ok) {
            throw new Error("Failed to create session");
          }
        }

        // 3️⃣ 세션에 참가할 토큰 요청
        response = await fetch(`https://localhost:4443/openvidu/api/sessions/${sessionId}/connection`, {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa("OPENVIDUAPP:talktalk123"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error("Failed to create connection");
        }

        const data = await response.json();
        setSessionToken(data.token);
      } catch (error) {
        console.error(error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (sessionToken) {
      const OV = new OpenVidu();
      const mySession = OV.initSession();

      // 스트림 생성 이벤트 핸들러
      mySession.on("streamCreated", (event: any) => {
        const subscriber = mySession.subscribe(event.stream, 'subscriber-container');
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      });

      mySession
        .connect(sessionToken)
        .then(() => {
          // 퍼블리셔 초기화
        const publisher = OV.initPublisher('publisher-container', {
          videoSource: undefined,
          audioSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
        });

          mySession.publish(publisher);
          setPublisher(publisher);
        })
        .catch((error) => {
          console.error("Error connecting to the session:", error);
        });

      setSession(mySession);
    }
  }, [sessionToken]);

  return (
    <div>
      <h1>OpenVidu Video Chat</h1>
      {sessionToken ? <p>Session Token: {sessionToken}</p> : <p>Loading...</p>}
      <div id="video-container">
        <div>
          <h2>내 비디오</h2>
          <div id="publisher-container"></div>
        </div>
        <div>
          <h2>참가자 비디오</h2>
          <div id="subscriber-container">
            {subscribers.map((sub, index) => (
              <div key={index} className="subscriber-video"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );  
};

export default VideoChat;
