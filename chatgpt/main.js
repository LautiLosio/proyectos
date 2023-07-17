const messagesDiv = document.getElementById("messages");

function sendMessage() {
  const message = document.getElementById("message").value;
  const request = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  };
  fetch("https://chatgpt-api.shn.hk/v1/", {
    method: "POST",
    body: JSON.stringify(request),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      let message = data.choices[0].message.content;
      console.log(message);
      
      // replace < with &lt;
      message = message.replace(/</g, "&lt;");
      // replace > with &gt;
      message = message.replace(/>/g, "&gt;");
      // replace \t with &nbsp;&nbsp;&nbsp;&nbsp;
      message = message.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");

      // replace \r
      message = message.replace(/(?:\r \n|\r|\n)/g, "<br>");
      // replace the first two <br> with nothing
      message = message.replace(/<br><br>/, "");
      
      // wrap the text between ``` with <code> and </code>
      message = message.replace(/```([\s\S]*?)```/g, "<code>$1</code>");
  
      messagesDiv.innerHTML += `<div class="message"><span class="name assistant">Assistant</span><span class="text">${message}</span></div>`;
      scrollToBottom();
    })
    .catch((error) => console.error(error));

  messagesDiv.innerHTML += `<div class="message align-right"><span class="name user">You</span><span class="text">${message}</span></div>`;
  
  scrollToBottom();
  document.getElementById("message").value = "";
}

function scrollToBottom() {
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

const textArea = document.getElementById("message");

textArea.addEventListener("input", () => {
  textArea.style.height = "auto";
  textArea.style.height = `${textArea.scrollHeight}px`;
});

// send message on enter but prevent sending message matching regex
textArea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {

    // regex to match message that should not be sent
    const regex = /^(\s*|\s*<br>\s*)$/;
    if (regex.test(textArea.value)) {
      textArea.value = "";
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
      return;
    }

    e.preventDefault();
    sendMessage();
    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }
} );

// add new line on shift + enter
textArea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    textArea.value += "\n";
    textArea.style.height = "auto";
    textArea.style.height = `${textArea.scrollHeight}px`;
  }
} );


let darkMode = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector("#dark-mode-toggle");

const enableDarkMode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkMode", "enabled");
  darkModeToggle.innerHTML = "light_mode";
}

const disableDarkMode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkMode", null);
  darkModeToggle.innerHTML = "dark_mode";
}

if (darkMode === "enabled") {
  enableDarkMode();
}

darkModeToggle.addEventListener("click", () => {
  darkMode = localStorage.getItem("darkMode");
  if (darkMode !== "enabled") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});