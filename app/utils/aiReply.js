// More realistic, human-like AI reply generator
export function getRandomAiReply(userMessage = "") {
  const genericReplies = [
    "That's interesting! Tell me more.",
    "Can you elaborate on that?",
    "I'm here to help. What would you like to discuss?",
    "Let me think about that for a moment...",
    "Here's what I found based on your message.",
    "Absolutely! Let's dive deeper into this topic.",
    "Could you clarify your question a bit more?",
    "I'm processing your request...",
    "That's a great point!",
    "I'm glad you brought this up.",
    "Let's explore this together.",
    "Interesting perspective!",
    "I'm here if you have more questions.",
    "Thanks for sharing that!",
    "If you need examples or code, just ask!",
    "Would you like a step-by-step explanation?",
    "Here's a quick summary:",
    "Let me know if you want more details.",
    "I'm always learning new things!",
    "Let's break this down together.",
  ];

  // Optionally, you can add some context-aware replies
  if (userMessage) {
    if (/hello|hi|hey|greetings/i.test(userMessage)) {
      return "Hello! How can I assist you today?";
    }
    if (/thank/i.test(userMessage)) {
      return "You're welcome! If you have more questions, feel free to ask.";
    }
    if (/help|support|assist/i.test(userMessage)) {
      return "Of course! Please tell me what you need help with.";
    }
    if (/bye|goodbye|see you/i.test(userMessage)) {
      return "Goodbye! Have a great day!";
    }
    if (/example|code|sample/i.test(userMessage)) {
      return "Sure! Would you like a code example or a step-by-step explanation?";
    }
  }

  const i = Math.floor(Math.random() * genericReplies.length);
  return genericReplies[i];
} 