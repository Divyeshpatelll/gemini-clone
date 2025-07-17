"use client";
import { useEffect, useRef, useState } from "react";
import {
  FiUser,
  FiCheckCircle,
  FiCopy,
  FiPlus,
  FiSettings,
  FiMic,
  FiArrowUp,
} from "react-icons/fi";
import TextareaAutosize from "react-textarea-autosize";
import useMessageStore from "@/store/messageStore";
import useChatStore from "@/store/chatStore";
import { getRandomAiReply } from "@/utils/aiReply";
import { useRouter } from "next/navigation";
import useChatScroll from "@/hooks/useChatScroll";

const PAGE_SIZE = 20;

export default function ChatWindow({ chatId }) {
  const { messages, sendMessage, loadMessages } = useMessageStore();
  const addChatroom = useChatStore((state) => state.addChatroom);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const aiReplySentRef = useRef({});
  const roomMessages = chatId ? messages[chatId] || [] : [];
  const {
    messagesContainerRef,
    messagesEndRef,
    handleScroll,
    atBottomRef,
    loadingOlder,
    setLoadingOlder,
    page,
    setPage,
    hasMore,
    setHasMore,
  } = useChatScroll({ roomMessages, PAGE_SIZE });

  useEffect(() => {
    loadMessages();
  }, [chatId, loadMessages]);

  useEffect(() => {
    if (!chatId) return;
    const msgs = messages[chatId] || [];
    if (
      msgs.length === 1 &&
      msgs[0].sender === "user" &&
      !msgs.find((m) => m.sender === "ai") &&
      !aiReplySentRef.current[chatId]
    ) {
      aiReplySentRef.current[chatId] = true;
      setIsAITyping(true);
      setTimeout(() => {
        const aiMsg = {
          id: Date.now() + 1,
          sender: "ai",
          text: getRandomAiReply(input),
          image: null,
          time: new Date().toISOString(),
        };
        sendMessage(chatId, aiMsg);
        setIsAITyping(false);
      }, 1500 + Math.random() * 1000);
    }
    if (msgs.length === 0) {
      aiReplySentRef.current[chatId] = false;
    }
  }, [chatId, messages, sendMessage, input]);

  const paginated = roomMessages.slice(-PAGE_SIZE * (page + 1));

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() && !image) return;
    if (!chatId) {
      const title = `New Chat`;
      const newId = addChatroom(title);
      setTimeout(() => {
        router.push(`/chatroom/${newId}`);
      }, 10);
      const userMsg = {
        id: Date.now(),
        sender: "user",
        text: input,
        image,
        time: new Date().toISOString(),
      };
      sendMessage(newId, userMsg);
      setInput("");
      setImage(null);
      return;
    }

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: input,
      image,
      time: new Date().toISOString(),
    };
    sendMessage(chatId, userMsg);
    setInput("");
    setImage(null);

    const msgs = messages[chatId] || [];
    if (msgs.length > 0) {
      setIsAITyping(true);
      setTimeout(() => {
        const aiMsg = {
          id: Date.now() + 1,
          sender: "ai",
          text: getRandomAiReply(input),
          image: null,
          time: new Date().toISOString(),
        };
        sendMessage(chatId, aiMsg);
        setIsAITyping(false);
      }, 1500 + Math.random() * 1000);
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isAITyping && (input.trim() || image)) {
        handleSend(e);
      }
    }
  };

  const handlePaste = (e) => {
    if (e.clipboardData && e.clipboardData.items) {
      const items = Array.from(e.clipboardData.items);
      const imageItem = items.find((item) => item.type.startsWith("image/"));
      if (imageItem) {
        const file = imageItem.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => setImage(ev.target.result);
          reader.readAsDataURL(file);
        }
        e.preventDefault();
      }
    }
  };

  return (
    <div className="chat-window flex flex-col h-full w-full">
      <div
        className="flex-1 overflow-y-auto px-2 py-4 md:px-8 md:py-8 chat-scrollbar"
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          {loadingOlder && (
            <div>
              <div className="skeleton-bubble ai"></div>
              <div className="skeleton-bubble user"></div>
              <div className="skeleton-bubble ai" style={{width: '55%'}}></div>
              <div className="skeleton-bubble user" style={{width: '40%'}}></div>
            </div>
          )}
          {paginated.length === 0 && !loadingOlder && (
            <div className="text-center text-blue-500 mt-24 text-xl font-semibold animate-pulse">
              👋 Welcome to your new chat!
              <br />
              <span className="text-gray-500 text-base font-normal">
                Start typing to begin the conversation...
              </span>
            </div>
          )}
          {paginated.map((msg, idx) => (
            <div
              key={msg.id}
              className={`group flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative rounded-2xl px-5 py-4 shadow-md max-w-[80%] whitespace-pre-line text-base font-normal flex items-start gap-2
                  ${
                    msg.sender === "user"
                      ? "bg-blue-500/90 text-white rounded-br-md"
                      : "chat-bubble-ai"
                  }
                `}
              >
                {msg.sender === "user" ? (
                  <FiUser className="mt-1 text-lg text-blue-200 shrink-0" />
                ) : (
                  <FiCheckCircle className="mt-1 text-lg text-green-400 shrink-0" />
                )}
                <div className="flex flex-col">
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="uploaded"
                      className="mb-2 max-w-xs rounded-lg"
                    />
                  )}
                  <span>{msg.text}</span>
                  <span
                    className={`text-xs ${
                      msg.sender === "user" ? "text-white" : "text-gray-400"
                    }  mt-1`}
                  >
                    {new Date(msg.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <button
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => handleCopy(msg.text)}
                  title="Copy"
                >
                  <FiCopy className="text-base" />
                </button>
              </div>
            </div>
          ))}
          {isAITyping && (
            <div className="flex justify-start">
              <div className="chat-bubble-ai flex items-center gap-2 animate-pulse">
                <FiCheckCircle className="mt-1 text-lg text-green-400 shrink-0" />
                <span>Gemini is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form
        onSubmit={handleSend}
        className="w-full max-w-2xl mx-auto px-2 md:px-8 pb-4 md:pb-8"
        style={{ position: "sticky", bottom: 0, background: "transparent" }}
      >
        <div className="chat-input-box flex flex-col rounded-2xl shadow border px-3 py-3 gap-2">
          {image && (
            <div className="flex items-center gap-2 mb-2">
              <img
                src={image}
                alt="preview"
                className="max-h-24 rounded-lg border"
              />
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setImage(null)}
                title="Remove image"
              >
                Remove
              </button>
            </div>
          )}
          <TextareaAutosize
            minRows={1}
            maxRows={6}
            className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder:text-lg text-gray-900 dark:text-white"
            placeholder="Message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isAITyping}
            autoComplete="off"
            style={{ lineHeight: "1.6" }}
            onKeyDown={handleInputKeyDown}
            onPaste={handlePaste}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                id="chat-image-upload"
                className="hidden"
                onChange={handleImage}
                disabled={isAITyping}
              />
              <button
                type="button"
                className="text-2xl text-gray-400 hover:text-blue-500"
                onClick={() =>
                  document.getElementById("chat-image-upload").click()
                }
                title="Upload image"
                disabled={isAITyping}
              >
                <FiPlus />
              </button>
              <button
                type="button"
                className="flex items-center text-gray-500 hover:text-blue-500 text-base gap-1"
              >
                <FiSettings className="text-xl" />
                <span className="hidden sm:inline">Tools</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-2xl text-gray-500 hover:text-blue-500"
              >
                <FiMic />
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-400 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isAITyping || (!input.trim() && !image)}
                title="Send"
              >
                <FiArrowUp className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
