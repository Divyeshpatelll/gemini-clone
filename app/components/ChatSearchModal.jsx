"use client";
import { FiX, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { FaRocketchat } from "react-icons/fa6";

export default function ChatSearchModal({
  open,
  onClose,
  chatrooms,
  onNewChat,
  onChatSelect,
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);
  if (!open) return null;

  const filtered = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="chat-search-modal fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl backdrop-blur-md p-0 overflow-hidden border">
        <div className="flex items-center px-6 py-4 border-b bg-[#1b253a]">
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="flex-1 bg-transparent outline-none text-lg placeholder-gray-400"
          />
          <button
            onClick={onClose}
            className="ml-2 p-2 rounded hover:bg-transparent transition-all"
            tabIndex={0}
            role="button"
            aria-label="Close search modal"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
          >
            <FiX className="text-2xl text-gray-400" />
          </button>
        </div>
        <div className="px-4 pt-4">
          <button
            onClick={onNewChat}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-500 text-white font-medium text-base hover:bg-blue-400 transition-all mb-2"
            tabIndex={0}
            role="button"
            aria-label="Create new chat"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onNewChat(); }}
          >
            <FiPlus className="text-xl" />
            New chat
          </button>
        </div>
        <div className="px-6 pt-2 pb-1 text-sm text-gray-400 font-semibold">
          Today
        </div>
        <div className="px-2 pb-4 max-h-96 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No chats found.
            </div>
          ) : (
            <ul className="space-y-1">
              {filtered.map((room) => (
                <li
                  key={room.id}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition-all"
                  onClick={() => onChatSelect(room.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select chatroom ${room.title}`}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onChatSelect(room.id); }}
                >
                  <FaRocketchat className="text-lg text-gray-400" />
                  <span className="truncate">{room.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
