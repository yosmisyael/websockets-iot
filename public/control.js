const autoButton = document.getElementById("auto-button");
const manualButton = document.getElementById("manual-button");
const serverConnState = document.getElementById("server-conn-status");
const iotConnState = document.getElementById("iot-conn-status");
const iotModeDisplay = document.getElementById("iot-mode-state");
const pumpStateDisplay = document.getElementById("pump-state");
const pumpSwitch = document.getElementById("pump-switch");

const connectedToServerElement = `
  <span class="online">
    <span class="material-symbols-outlined">leak_add </span>
    connected to server
  </span>
`;

const disconnectedToServerElement = `
  <span class="offline">
      <span class="material-symbols-outlined">signal_disconnected </span>
      disconnected from server
  </span>
`;

const onlineDeviceElement = `
  <span class="online">
    <span class="material-symbols-outlined">stream</span>  
    device is online
  </span>
`;

const offlineDeviceElement = `
  <span class="offline">
    <span class="material-symbols-outlined">stream</span>  
    device is offline
  </span>
`;

const socket = io({
  auth: {
    token: document.cookie.split("=")[1],
  },
});

autoButton.addEventListener("click", () => {
  socket.emit("message", "auto");
});

manualButton.addEventListener("click", () => {
  socket.emit("message", "manual");
});

pumpSwitch.addEventListener("change", function () {
  if (this.checked) {
    socket.emit("message", "pumpOn");
  } else {
    socket.emit("message", "pumpOff");
  }
});
