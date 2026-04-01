import { useEffect, useMemo, useRef, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt?: Timestamp;
};

export default function ChatPage() {
  // Mock users for testing (switchable per tab via ?me=user1|user2)
  const [currentUser, setCurrentUser] = useState<"user1" | "user2">(() => {
    const me = new URLSearchParams(window.location.search).get("me");
    return me === "user2" ? "user2" : "user1";
  });
  const otherUser = currentUser === "user1" ? "user2" : "user1";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const messagesQuery = useMemo(() => {
    return query(collection(db, "messages"), orderBy("createdAt", "asc"));
  }, []);

  useEffect(() => {
    setError(null);
    setLoading(true);
    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const all: ChatMessage[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            senderId: String(data.senderId ?? ""),
            receiverId: String(data.receiverId ?? ""),
            text: String(data.text ?? ""),
            createdAt: data.createdAt as Timestamp | undefined,
          };
        });

        const betweenUsers = all.filter((m) => {
          const aToB = m.senderId === currentUser && m.receiverId === otherUser;
          const bToA = m.senderId === otherUser && m.receiverId === currentUser;
          return (aToB || bToA) && m.text.length > 0;
        });

        setMessages(betweenUsers);
        setLoading(false);
      },
      (err) => {
        setError(err.message ?? "Failed to load messages.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [messagesQuery, currentUser, otherUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend() {
    const trimmed = message.trim();
    if (!trimmed) return;

    setError(null);
    setMessage("");

    try {
      await addDoc(collection(db, "messages"), {
        senderId: currentUser,
        receiverId: otherUser,
        text: trimmed,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
      setMessage(trimmed);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg-top text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-white/80">
              Chat (mock): <span className="font-semibold">{currentUser}</span>{" "}
              ↔ <span className="font-semibold">{otherUser}</span>
            </div>
            <Button
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() =>
                setCurrentUser((u) => (u === "user1" ? "user2" : "user1"))
              }
            >
              Switch user
            </Button>
          </div>
          {error ? (
            <div className="mt-2 text-sm text-red-300">{error}</div>
          ) : null}
        </div>

        <div className="flex h-[65vh] flex-col gap-2 overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-4">
          {loading ? <div className="text-sm text-white/60">Loading…</div> : null}
          {!loading && messages.length === 0 ? (
            <div className="text-sm text-white/60">No messages yet.</div>
          ) : null}

          {messages.map((m) => {
            const isMine = m.senderId === currentUser;
            return (
              <div
                key={m.id}
                className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    isMine
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="bg-white text-black placeholder:text-black/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleSend();
            }}
          />
          <Button onClick={handleSend} disabled={!message.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

