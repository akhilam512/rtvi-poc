"use client";

import { useState, useEffect, useRef } from "react";
import { RTVIClient } from "realtime-ai";
import { DailyTransport } from "realtime-ai-daily";
import { RTVIClientProvider } from "realtime-ai-react";
import { DeviceSelector } from "./components/DeviceSelector";
import { defaultServices, defaultConfigV2 } from "@/rtvi.config";

export default function Home() {
  const rtviClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDevicesInitialized, setIsDevicesInitialized] = useState(false);

  useEffect(() => {
    if (!rtviClientRef.current) {
      const dailyTransport = new DailyTransport();
      const client = new RTVIClient({
        transport: dailyTransport,
        params: {
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "/api",
          endpoints: {
            connect: "/connect",
          },
          requestData: {
            services: defaultServices,
            config: defaultConfigV2,
          },
          enableMic: true,
          enableCam: false,
          callbacks: {
            onConnected: () => {
              console.log("[CALLBACK] User connected.");
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
        },
        timeout: 15 * 1000,
      });

      rtviClientRef.current = client;
    }
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    console.log("rtviClient ref:", rtviClientRef.current);
    console.log("isConnected state:", isConnected);
  }, [isConnected]);

  const handleConnect = async () => {
    console.log("handleConnect called, current isConnected:", isConnected);
    if (isConnected) {
      console.log("Disconnecting...");
      await rtviClientRef.current?.disconnect();
      setIsConnected(false);
      rtviClientRef.current = null;
      console.log("Disconnected, rtviClient set to null");
      return;
    }

    console.log("Connecting...");
    const dailyTransport = new DailyTransport();
    const client = new RTVIClient({
      transport: dailyTransport,
      params: {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "/api",
        endpoints: {
          connect: "/connect",
        },
        requestData: {
          services: defaultServices,
          config: defaultConfigV2, // Use defaultConfigV2 from rtvi.config.js
        },
        enableMic: true,
        enableCam: false,
        callbacks: {
          onConnected: () => {
            console.log("[CALLBACK] User connected.");
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
      }, 
      timeout: 15 * 1000,
    });

    try {
      console.log("Attempting to connect...");
      await client.connect();
      console.log("Connected successfully");
      rtviClientRef.current = client;
      setIsConnected(true);
    } catch (e) {
      console.error("Failed to connect:", e);
    }
  };

  const handleInitDevices = async () => {
    if (rtviClientRef.current && !isDevicesInitialized) {
      console.log("Initializing devices...");
      try {
        await rtviClientRef.current.initDevices();
        console.log("Devices initialized successfully");
        setIsDevicesInitialized(true);
      } catch (error) {
        console.error("Error initializing devices:", error);
      }
    } else if (!rtviClientRef.current) {
      console.log("No RTVIClient instance found. Please connect first.");
    }
  };

  return (
    <main className="container">
      {rtviClientRef.current && (
        <RTVIClientProvider client={rtviClientRef.current}>
          <DeviceSelector isInitialized={isDevicesInitialized} />
        </RTVIClientProvider>
      )}

      <button 
        onClick={handleConnect}
        className="connect-button"
      >
        {isConnected ? "Disconnect" : "Connect"}
      </button>

      <button 
        onClick={handleInitDevices}
        className="init-devices-button"
      >
        {isDevicesInitialized ? "Devices Initialized" : "Initialize Devices"}
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
        .init-devices-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 1rem;
          margin-left: 1rem;
        }
        .init-devices-button:hover {
          background-color: #45a049;
        }
        .init-devices-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}
