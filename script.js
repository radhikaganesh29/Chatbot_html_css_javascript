// Select elements from the DOM
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

// Variables
let userMessage; // User's message
const API_KEY = ""; // API key for OpenAI: generate this by logging in to https://platform.openai.com/api-keys

const inputInitHeight = chatInput.scrollHeight; // Initial height of the input

// Function to create a chat list item
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<p></p>`
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

// Function to generate a response from the chatbot
const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
        })
    }
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));

}

// Function to handle user chat input
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return; // If message is empty, do nothing
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the outgoing chat message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Show "Thinking..." message while generating response
        const incomingChatLi = createChatLi("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi); // Generate and display the response
    },600)

}

// Event listener for adjusting the height of the input box
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

// Event listener for sending the chat on pressing Enter
chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }

    
})

// Event listener for sending the chat on clicking the send button
sendChatBtn.addEventListener("click", handleChat);

// Event listener for closing the chatbot
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

// Event listener for toggling the chatbot visibility
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

