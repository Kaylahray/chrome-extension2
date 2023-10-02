const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
let recording;
let ws;

startBtn.addEventListener("click", () => {
  startBtn.setAttribute("disabled", "");
  stopBtn.removeAttribute("disabled");
  navigator.mediaDevices
    .getDisplayMedia({ video: true, audio: true, systemAudio: "include" })
    .then((screenStream) => {
      ws = new WebSocket("ws://localhost:3000/");
      ws.onopen = () => {
        console.log("WebSocket connection established");
        recording = new MediaRecorder(screenStream, {
          mimeType: "video/webm",
        });
        recording.ondataavailable = (buffer) => {
          if (buffer.data.size > 0) ws.send(buffer.data);
        };
        recording.start();
        recording.onstop = () => {
          ws.close();
        };
      };
      ws.onmessage = (message) => {
        console.log("message from server", message.data);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    });
});
stopBtn.addEventListener("click", () => {
  startBtn.removeAttribute("disabled");
  stopBtn.setAttribute("disabled", "");
  recording.stop();
});
