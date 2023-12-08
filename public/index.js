const autoBtn = document.getElementById("set-auto");
const manualBtn = document.getElementById("set-manual");
const serverStat = document.getElementById("server-status");
const iotStat = document.getElementById("iot-status");
const systemInfo = document.getElementById("system-info");
const pumpInfo = document.getElementById("pump-info");
const pumpOn = document.getElementById("pump-on");
const pumpOff = document.getElementById("pump-off");
const chart1 = document.getElementById("chart1");
const chart2 = document.getElementById("chart2");
const chart3 = document.getElementById("chart3");
const chart4 = document.getElementById("chart4");
const chart5 = document.getElementById("chart5");
const chart6 = document.getElementById("chart6");
let lastHeartbeat = 0;
const htmlOnConnectedServer = `
                              <span class="online">
                                  <span class="material-symbols-outlined">leak_add </span>
                                  connected to server
                              </span>
                              
                              `;
const htmlOnDisconnectServer = `
                                <span class="offline">
                                    <span class="material-symbols-outlined">signal_disconnected </span>
                                    disconnected from server
                                </span>
                              `;
const onlineDevice = `
  <span class="online">
  <span class="material-symbols-outlined">stream</span>  
  device is online
  </span>
  `;
const offlineDevice = `
  <span class="offline">
    <span class="material-symbols-outlined">stream</span>  
    device is offline
  </span>
`;

autoBtn.addEventListener("click", () => {
  fetch("http://localhost/auto", {
    method: "GET",
    mode: "no-cors",
  });
});

manualBtn.addEventListener("click", () => {
  fetch("http://localhost/manual", {
    method: "GET",
    mode: "no-cors",
  });
});

pumpOn.addEventListener("click", () => {
  fetch("http://localhost/on", {
    method: "GET",
    mode: "no-cors",
  });
});
pumpOff.addEventListener("click", () => {
  fetch("http://localhost/off", {
    method: "GET",
    mode: "no-cors",
  });
});

const singleton = { wss: null };

function getWebSocketConnection() {
  if (!singleton.wss || singleton.wss.readyState === WebSocket.CLOSED) {
    singleton.wss = new WebSocket("ws://localhost");
    singleton.wss.onopen = () => {
      serverStat.innerHTML = htmlOnConnectedServer;
    };
    singleton.wss.onclose = () => {
      serverStat.innerHTML = htmlOnDisconnectServer;
      setInterval(getWebSocketConnection, 3000);
    };
    singleton.wss.onmessage = ({ data }) => {
      if (data === "online") {
        iotStat.innerHTML = onlineDevice;
        lastHeartbeat = Date.now();
      }
      switch (data) {
        case "auto":
          systemInfo.innerHTML = "AUTO";
          break;
        case "manual":
          systemInfo.innerHTML = "MANUAL";
          break;
        case "pumpOn":
          pumpInfo.innerHTML = "ON";
          break;
        case "pumpOff":
          pumpInfo.innerHTML = "OFF";
          break;
      }
    };
  }
}

setInterval(() => {
  const currentTime = Date.now();
  if (currentTime - lastHeartbeat > 3000) {
    iotStat.innerHTML = offlineDevice;
  }
}, 500);

getWebSocketConnection();

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
