document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // ✅ FIXED Gemini API Configuration
    const apiKey = "AIzaSyA9BsAI1WJftdsAWDIdJj-zOm7bkgzetjs"; // works only locally
    const model = "gemini-2.5-flash-preview-09-2025";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const chatHistory = [];
    const systemPrompt = "You are Astra, a friendly and helpful AI assistant. You are concise in your answers unless asked for detail.";

    if (chatForm) chatForm.addEventListener('submit', handleFormSubmit);
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            errorModal.classList.add('hidden');
        });
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const userMessage = messageInput.value.trim();

        if (!userMessage) return;

        setChatInputActive(false);
        appendMessage(userMessage, 'user');
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });
        messageInput.value = '';
        showTypingIndicator();

        try {
            const botResponse = await getAIResponse(chatHistory);
            chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
            removeTypingIndicator();
            appendMessage(botResponse, 'bot');
        } catch (error) {
            console.error("Error:", error);
            removeTypingIndicator();
            showError("Oops! Something went wrong. " + error.message);
        } finally {
            setChatInputActive(true);
        }
    }

    async function getAIResponse(history) {
        const payload = {
            contents: history,
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn’t understand that.";
        return text;
    }

    function appendMessage(message, sender) {
        const div = document.createElement('div');
        div.classList.add('chat-bubble');
        if (sender === 'user') {
            div.classList.add('bg-teal-600', 'text-white', 'self-end', 'rounded-br-none');
        } else {
            div.classList.add('bg-gray-700', 'text-gray-100', 'self-start', 'rounded-bl-none');
        }
        div.textContent = message;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.id = 'typing-indicator';
        typing.classList.add('chat-bubble', 'bg-gray-700', 'text-gray-400', 'self-start', 'rounded-bl-none');
        typing.innerHTML = `<span class="animate-pulse">Astra is typing...</span>`;
        chatWindow.appendChild(typing);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) chatWindow.removeChild(typing);
    }

    function setChatInputActive(active) {
        messageInput.disabled = !active;
        sendButton.disabled = !active;
        sendButton.classList.toggle('opacity-50', !active);
        sendButton.classList.toggle('cursor-not-allowed', !active);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
    }

    // Welcome message
    const welcomeMessage = "Hi! I'm Astra, your AI assistant. You can ask me anything!";
    appendMessage(welcomeMessage, 'bot');
    chatHistory.push({ role: "model", parts: [{ text: welcomeMessage }] });

});
