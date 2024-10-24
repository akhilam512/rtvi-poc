"use client";

import { useRTVIClientMediaDevices } from "realtime-ai-react";
import { useEffect } from "react";

export function DeviceSelector() {
    console.log('DeviceSelector component rendering');
  const {
    availableMics,
    availableCams,
    selectedMic,
    selectedCam,
    updateMic,
    updateCam
  } = useRTVIClientMediaDevices();

  // Debug logging
  useEffect(() => {
    console.log('Available Mics:', availableMics);
    console.log('Available Cams:', availableCams);
    console.log('Selected Mic:', selectedMic);
    console.log('Selected Cam:', selectedCam);
  }, [availableMics, availableCams, selectedMic, selectedCam]);

  if (!availableMics.length && !availableCams.length) {
    console.log('No devices available');
    return <div>Waiting for device information...</div>;
  }

  return (
    <div className="device-selector">
      <div className="device-group">
        <label htmlFor="mic-select">Microphone: </label>
        {availableMics.length > 0 ? (
          <select 
            id="mic-select"
            value={selectedMic?.deviceId || ''}
            onChange={(e) => {
              console.log('Updating mic to:', e.target.value);
              updateMic(e.target.value);
            }}
          >
            {availableMics.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId}`}
              </option>
            ))}
          </select>
        ) : (
          <div className="no-devices">No microphones detected</div>
        )}
      </div>

      <div className="device-group">
        <label htmlFor="cam-select">Camera: </label>
        {availableCams.length > 0 ? (
          <select
            id="cam-select"
            value={selectedCam?.deviceId || ''}
            onChange={(e) => {
              console.log('Updating camera to:', e.target.value);
              updateCam(e.target.value);
            }}
          >
            {availableCams.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
        ) : (
          <div className="no-devices">No cameras detected</div>
        )}
      </div>

      <style jsx>{`
        .device-selector {
          padding: 1rem;
        }
        .device-group {
          margin-bottom: 1rem;
        }
        .device-group label {
          display: block;
          margin-bottom: 0.5rem;
        }
        .device-group select {
          width: 100%;
          padding: 0.5rem;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
