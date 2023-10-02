/* eslint-disable no-undef */
console.log("Hi, I have been injected whoopie!!!");

var recorder = null;
function onAccessApproved(stream) {
  ws = new WebSocket("ws://martdev.tech:3000");
  ws.onopen(() => {
    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    recorder.ondataavailable = (buffer) => {
      if (buffer.data.size > 0) ws.send(buffer.data);
    };
    recorder.start();
    recorder.onstop = () => {
      ws.close();
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
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("requesting recording");

    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 9999999999,
          height: 9999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  if (message.action === "stopvideo") {
    console.log("stopping video");
    sendResponse(`processed: ${message.action}`);
    if (!recorder) return console.log("no recorder");

    recorder.stop();
  }
});
