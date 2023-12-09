const SERVER_NAME = "localhost";
const singleton = { wss: null };
const autoButton = document.getElementById("auto-button");
const manualButton = document.getElementById("manual-button");
const serverConnState = document.getElementById("server-conn-status");
const iotConnState = document.getElementById("iot-conn-status");
const iotModeDisplay = document.getElementById("iot-mode-state");
const pumpStateDisplay = document.getElementById("pump-state");
const pumpSwitch = document.getElementById("pump-switch");
const chart1 = document.getElementById("chart1");
const chart2 = document.getElementById("chart2");
const chart3 = document.getElementById("chart3");
const chart4 = document.getElementById("chart4");
const chart5 = document.getElementById("chart5");
const chart6 = document.getElementById("chart6");
let lastHeartbeat = 0;

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

function getWebSocketConnection() {
  if (!singleton.wss || singleton.wss.readyState === WebSocket.CLOSED) {
    singleton.wss = new WebSocket(`ws://${SERVER_NAME}/auto`);
    singleton.wss.onopen = () => {
      serverConnState.innerHTML = connectedToServerElement;
    };
    singleton.wss.onclose = () => {
      serverConnState.innerHTML = disconnectedToServerElement;
      setInterval(getWebSocketConnection, 3000);
    };
    singleton.wss.onmessage = ({ data }) => {
      if (data === "online") {
        iotConnState.innerHTML = onlineDeviceElement;
        lastHeartbeat = Date.now();
      }
      switch (data) {
        case "auto":
          iotModeDisplay.innerHTML = "AUTO";
          break;
        case "manual":
          iotModeDisplay.innerHTML = "MANUAL";
          break;
        case "pumpOn":
          pumpStateDisplay.innerHTML = "ON";
          break;
        case "pumpOff":
          pumpStateDisplay.innerHTML = "OFF";
          break;
      }
    };
  }
}

setInterval(() => {
  const currentTime = Date.now();
  if (currentTime - lastHeartbeat > 3000) {
    iotConnState.innerHTML = offlineDeviceElement;
  }
}, 500);

getWebSocketConnection();

autoButton.addEventListener("click", () => {
  singleton.wss && singleton.wss.send("auto");
});

manualButton.addEventListener("click", () => {
  singleton.wss && singleton.wss.send("manual");
});

pumpSwitch.addEventListener("change", function () {
  if (this.checked) {
    singleton.wss && singleton.wss.send("pumpOn");
  } else {
    singleton.wss && singleton.wss.send("pumpOff");
  }
});

const chartOptions = {
  chart: {
    height: 280,
    type: "radialBar",
  },
  series: [67],
  colors: ["#20E647"],
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      track: {
        background: "#333",
        startAngle: -135,
        endAngle: 135,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          fontSize: "30px",
          show: true,
        },
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "horizontal",
      gradientToColors: ["#87D4F9"],
      stops: [0, 100],
    },
  },
  stroke: {
    lineCap: "butt",
  },
  labels: ["Progress"],
};

new ApexCharts(chart1, chartOptions).render();
new ApexCharts(chart2, chartOptions).render();
new ApexCharts(chart3, chartOptions).render();
new ApexCharts(chart4, chartOptions).render();
new ApexCharts(chart5, chartOptions).render();
new ApexCharts(chart6, chartOptions).render();
