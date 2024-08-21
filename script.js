const sendChatBtn = document.querySelector(".chat-input span");
const chatBox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userInput;
const apiKey = "AIzaSyBDFi8SytFtKQr33uqsEXAiNwsR9oRnQjk";
const inputInitHeight = chatInput.scrollHeight;

const createChatli = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<p></p>` : ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
}

const generateResponse = (incomingChatLI) => {
   const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
   const messageElement = incomingChatLI.querySelector("p");
   const requestOptions = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      Contents: [{
        role: "user",
        parts: [{text: userInput}]
      }]
    }), 
  }
  fetch(apiUrl, requestOptions).then(res => res.json()).then(data => {
    messageElement.textContent = data.candidate[0].content.parts[0].text;
    console.log(data);
  })
  .catch((error) => {
    messageElement.classList.add("error");
      messageElement.textContent = "Oops! Something went wrong. Please try again!";
  }).finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
};

const handleChat = () => {
  userInput = chatInput.value.trim();

  if (!userInput) return; 
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  chatBox.appendChild(createChatli(userInput, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);
  
  setTimeout(() => {
    const incomingChatLI = createChatli("Typing...", "incoming")
    chatBox.appendChild(incomingChatLI);
    chatBox.scrollTo(0, chatBox.scrollHeight);
    generateResponse(incomingChatLI);
  }, 600);

  console.log(userInput);
}
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));


