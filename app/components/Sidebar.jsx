"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useChatStore from "../store/chatStore";
import useAuthStore from "@/store/authStore";
import {
  FiPlus,
  FiSearch,
  FiUsers,
  FiTrash2,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { PiRobotLight } from "react-icons/pi";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaRobot } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import ChatSearchModal from "@/components/ChatSearchModal";
import ThemeToggle from "@/components/ThemeToggle";
import { RiLogoutBoxRLine } from "react-icons/ri";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isDesktop;
}

export default function Sidebar() {
  const chatrooms = useChatStore((state) => state.chatrooms);
  const createChatroom = useChatStore((state) => state.addChatroom);
  const deleteChatroom = useChatStore((state) => state.deleteChatroom);
  const loadChatrooms = useChatStore((state) => state.loadChatrooms);
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    loadChatrooms();
  }, [loadChatrooms]);

  const handleCreate = () => {
    const title = `New Chat ${chatrooms.length + 1}`;
    const id = createChatroom(title);
    if (id) {
      router.push(`/chatroom/${id}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menu = [
    { label: "New chat", icon: <FiPlus />, onClick: handleCreate },
    {
      label: "Search chats",
      icon: <FiSearch />,
      onClick: () => setSearchOpen(true),
    },
    { label: "Library", icon: <MdOutlineLibraryBooks />, onClick: () => {} },
    { label: "GPTs", icon: <FiUsers />, onClick: () => {} },
    {
      label: "Code Copilot",
      icon: <FaRobot className="text-purple-500" />,
      onClick: () => {},
    },
    {
      label: "Code Tutor",
      icon: <BsStars className="text-emerald-500" />,
      onClick: () => {},
    },
    {
      label: "Logout",
      icon: <RiLogoutBoxRLine/>,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-40 sm:hidden bg-white/80 p-2 rounded-full shadow border border-gray-200"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu className="text-2xl text-black" />
        </button>
      )}

      <ChatSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        chatrooms={chatrooms}
        onNewChat={handleCreate}
        onChatSelect={(id) => {
          setSearchOpen(false);
          router.push(`/chatroom/${id}`);
          setIsOpen(false);
        }}
      />
      <div
        className={`fixed inset-0 z-30 bg-black/30 dark:bg-black/60 transition-opacity sm:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {(isOpen || isDesktop) && (
        <aside
          className={`sidebar chat-scrollbar overflow-y-auto fixed sm:static top-0 left-0 z-40 h-screen flex flex-col shadow-xl backdrop-blur-md transition-all duration-300 w-72 sm:w-72 border-r
          ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
        >
          <div className="sticky top-0 z-50 bg-inherit">
            <div className="sm:hidden flex justify-end p-4 pb-0">
              <button
                className="p-2 rounded-full hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
                aria-label="Close sidebar"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 pb-2">
              <div className="flex items-center gap-2">
                <PiRobotLight className="text-3xl" />
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1 px-2 pb-2">
            {menu.map((item, idx) => (
              <button
                key={item.label}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-all font-medium text-base"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="border-b my-2 mx-2" />
          <div className="px-4 py-2 text-xs text-gray-400 font-semibold tracking-wide">
            Chats
          </div>
          <div className="flex-1 px-2 pb-4">
            {chatrooms.length === 0 ? (
              <div className="text-gray-400 text-center mt-8">
                No chatrooms yet.
              </div>
            ) : (
              <ul className="space-y-1">
                {chatrooms.map((room) => (
                  <li
                    key={room.id}
                    className="flex items-center group rounded-lg px-2 py-2 cursor-pointer hover:bg-blue-500 hover:text-white transition-all"
                    onClick={() => {
                      router.push(`/chatroom/${room.id}`);
                      setIsOpen(false);
                    }}
                  >
                    <span className="flex-1 truncate font-medium">
                      {room.title}
                    </span>
                    <button
                      className="ml-2 p-1 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this chatroom?")) {
                          deleteChatroom(room.id);
                          toast.success("Chat deleted successfully!");
                          const currentId = pathname.startsWith("/chatroom/")
                            ? pathname.split("/chatroom/")[1]
                            : null;
                          if (currentId === room.id) {
                            router.push("/");
                          }
                          setIsOpen(false);
                        }
                      }}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
