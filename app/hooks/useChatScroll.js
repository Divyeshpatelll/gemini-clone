import { useRef, useState, useEffect } from "react";

export default function useChatScroll({ roomMessages, PAGE_SIZE }) {
  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const atBottomRef = useRef(true);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    const atBottom =
      Math.abs(
        container.scrollHeight - container.scrollTop - container.clientHeight
      ) < 10;
    atBottomRef.current = atBottom;
    if (container.scrollTop === 0 && hasMore && !loadingOlder) {
      const prevScrollHeight = container.scrollHeight;
      setLoadingOlder(true);
      setTimeout(() => {
        setPage((prev) => {
          const nextPage = prev + 1;
          if (roomMessages.length <= PAGE_SIZE * (nextPage + 1))
            setHasMore(false);
          return nextPage;
        });
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        }, 10);
        setLoadingOlder(false);
      }, 800);
    }
  };

  useEffect(() => {
    if (loadingOlder) return;
    if (atBottomRef.current || page === 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [roomMessages, loadingOlder, page]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }, 0);
  }, [roomMessages, PAGE_SIZE]);

  return {
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
  };
}
