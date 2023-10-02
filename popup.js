/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Declare initial state variables within the same scope
let requestButtonClicked = false;
let requestButton2Clicked = false;
let requestButtonInitialState = true; // Initially, the class is "request"
let requestButton2InitialState = true; // Initially, the class is "request2"

document.addEventListener("DOMContentLoaded", () => {
  // GET THE SELECTORS OF THE BUTTONS
  const startVideoButton = document.querySelector(".start_record");
  const requestButton = document.querySelector(".request");
  const requestButton2 = document.querySelector(".request2");

  // Check if the buttons were found
  if (startVideoButton && requestButton && requestButton2) {
    // Adding event listener for Request button click
    requestButton.addEventListener("click", () => {
      requestButtonClicked = !requestButtonClicked; // Toggle the click state
      toggleButtonClass(requestButton, requestButtonClicked);
      startVideoButton.disabled = !(
        requestButtonClicked && requestButton2Clicked
      ); // Enable Start Recording if both buttons are clicked
    });

    requestButton2.addEventListener("click", () => {
      requestButton2Clicked = !requestButton2Clicked; // Toggle the click state
      toggleButtonClass(requestButton2, requestButton2Clicked);
      startVideoButton.disabled = !(
        requestButtonClicked && requestButton2Clicked
      ); // Enable Start Recording if both buttons are clicked
    });

    // Adding event listener for Start Recording button click
    startVideoButton.addEventListener("click", () => {
      if (requestButtonClicked && requestButton2Clicked) {
        // If both Request buttons have been clicked, proceed with action
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { action: "request_recording" },
              function (response) {
                if (!chrome.runtime.lastError) {
                  console.log(response);
                } else {
                  console.error(chrome.runtime.lastError, "error line 14");
                }
              }
            );
          }
        );
      } else {
        console.error(
          "Both Request buttons must be clicked before starting recording."
        );
      }
    });
  } else {
    console.error("Buttons not found in the DOM.");
  }
});

function toggleButtonClass(button, clicked) {
  if (clicked) {
    button.classList.remove("request", "request2");
    button.classList.add("granted");
  } else {
    button.classList.remove("granted");
    button.classList.add(
      button.classList.contains("request") ? "request" : "request2"
    );
  }

  // Toggle initial state variables
  if (button.classList.contains("request")) {
    requestButtonInitialState = !clicked;
  } else if (button.classList.contains("request2")) {
    requestButton2InitialState = !clicked;
  }
}

const requestButton = document.querySelector(".request"); // Select the button with class "request"

if (requestButton) {
  requestButton.addEventListener("click", () => {
    toggleButtonClass(requestButton, requestButtonClicked);
  });
}

const requestButton2 = document.querySelector(".request2"); // Select the button with class "request2"

if (requestButton2) {
  requestButton2.addEventListener("click", () => {
    toggleButtonClass(requestButton2, requestButton2Clicked);
  });
}
