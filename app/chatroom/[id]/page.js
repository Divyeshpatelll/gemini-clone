"use client";

import { useParams } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";

export default function ChatroomPage() {
  const { id } = useParams();
  return <ChatWindow chatId={id} />;
}

