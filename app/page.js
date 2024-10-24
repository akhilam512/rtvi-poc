"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { RTVIClient } from "realtime-ai";
import { DailyTransport } from "realtime-ai-daily";
import { RTVIClientProvider } from "realtime-ai-react";
import { DeviceSelector } from "./components/DeviceSelector";

export default function Home() {
  const [rtviClient, setRtviClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log("rtviClient state:", rtviClient);
    console.log("isConnected state:", isConnected);
  }, [rtviClient, isConnected]);

  const handleConnect = async () => {
    console.log("handleConnect called, current isConnected:", isConnected);
    if (isConnected) {
      console.log("Disconnecting...");
      await rtviClient?.disconnect();
      setIsConnected(false);
      setRtviClient(null);
      console.log("Disconnected, rtviClient set to null");
      return;
    }

    console.log("Connecting...");
    const dailyTransport = new DailyTransport();
    const client = new RTVIClient({
      transport: dailyTransport,
      params: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "/api",
        services: {
          llm: "together",
          tts: "cartesia",
        },
        config: [
          {
            service: "tts",
            options: [
              { name: "voice", value: "79a125e8-cd45-4c13-8a67-188112f4dd22" }
            ]
          },
          {
            service: "llm",
            options: [
              { name: "model", value: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo" },
              {
                name: "messages",
                value: [
                  {
                    role: "system",
                    content:
                      "You are a assistant called ExampleBot. You can ask me anything. Keep responses brief and legible. Your responses will be converted to audio, so please avoid using any special characters except '!' or '?'.",
                  }
                ]
              }
            ]
          }
        ],
        enableMic: true,
        enableCam: false,
        timeout: 15 * 1000,
        callbacks: {
          onConnected: () => {
            console.log("[CALLBACK] User connected");
            setIsConnected(true);
          },
          onDisconnected: () => {
            console.log("[CALLBACK] User disconnected");
            setIsConnected(false);
          },
          onTransportStateChanged: (state) => {
            console.log("[CALLBACK] State change:", state);
          },
          onBotConnected: () => {
            console.log("[CALLBACK] Bot connected");
          },
          onBotDisconnected: () => {
            console.log("[CALLBACK] Bot disconnected");
          },
          onBotReady: () => {
            console.log("[CALLBACK] Bot ready to chat!");
          },
        },
      }
    });

    try {
      console.log("Attempting to connect...");
      await client.connect();
      console.log("Connected successfully");
      setRtviClient(client);
    } catch (e) {
      console.error("Failed to connect:", e);
    }
  };

  return (
    <main className="container">
      <RTVIClientProvider client={rtviClient}>
        <DeviceSelector />
      </RTVIClientProvider>

      <button 
        onClick={handleConnect}
        className="connect-button"
      >
        {isConnected ? "Disconnect" : "Connect"}
      </button>

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .connect-button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
        }
        .connect-button:hover {
          background-color: #0051b3;
        }
      `}</style>
    </main>
  );
}
