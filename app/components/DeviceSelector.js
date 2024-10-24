import { useEffect } from "react";
import { useRTVIClientMediaDevices } from "realtime-ai-react";

export const DeviceSelector = ({ hideMeter = false }) => {
  const { availableMics, selectedMic, updateMic } = useRTVIClientMediaDevices();
  console.log("Number of availableMics: ", availableMics.length);
  useEffect(() => {
    console.log("Selected mic updated:", selectedMic);
    updateMic(selectedMic?.deviceId);
  }, [updateMic, selectedMic]);

  const handleMicChange = (deviceId) => {
    console.log("Mic changed to:", deviceId);
    updateMic(deviceId);
  };

  return (
    <div className="flex flex-col flex-wrap gap-4">
      <label>
        Microphone:
        {availableMics.length === 0 && (
          <span className="ml-4 mr-4">No devices</span>
        )}
        <select
          onChange={(e) => handleMicChange(e.currentTarget.value)}
          value={selectedMic?.deviceId}
        >
          {availableMics.length === 0 ? (
            <>
              <option value="">None</option>
            </>
          ) : (
            availableMics.map((mic) => (
              <option key={mic.deviceId} value={mic.deviceId}>
                {mic.label}
              </option>
            ))
          )}
        </select>
      </label>

      {/* Uncomment this section to add speaker selection
      <label>
        Speakers:
        <select
          onChange={(e) => handleSpeakerChange(e.target.value)}
          defaultValue={currentSpeaker?.device.deviceId}
        >
          {speakers.length === 0 ? (
            <option value="default">Use system default</option>
          ) : (
            speakers.map((m) => (
              <option key={m.device.deviceId} value={m.device.deviceId}>
                {m.device.label}
              </option>
            ))
          )}
        </select>
      </label>
      */}
    </div>
  );
};

export default DeviceSelector;