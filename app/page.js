"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import * as pdfjsLib from "pdfjs-dist";
import {
  Pin,
  Edit2,
  Trash2,
  Download,
  Copy,
  RotateCcw,
  Search,
  Plus,
  Paperclip,
  Send,
  Square,
  Moon,
  Sun,
  LogOut,
  Check,
  Menu,
  X,
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  // Mobile Responsive State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Feature States
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [systemPersona, setSystemPersona] = useState("general");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // File Upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [readingFile, setReadingFile] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);
  const router = useRouter();

  // Auto Scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Auto Resize Textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [input]);

  // Auth & Initial Fetch
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
        fetchConversations(user.id);
      }
    };
    checkUser();
  }, [router]);

  const fetchMessages = useCallback(async (chatId) => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", chatId)
      .order("created_at", { ascending: true });

    if (!error && data) setMessages(data);
  }, []);

  useEffect(() => {
    if (activeChat) fetchMessages(activeChat);
    else setMessages([]);
  }, [activeChat, fetchMessages]);

  const fetchConversations = async (userId) => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error && data) setConversations(data);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  // Actions
  const togglePin = async (e, id, currentPinned) => {
    e.stopPropagation();
    const { error } = await supabase
      .from("conversations")
      .update({ is_pinned: !currentPinned })
      .eq("id", id);

    if (!error && user) fetchConversations(user.id);
  };

  const startRenaming = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const saveTitle = async (e, id) => {
    e.stopPropagation();
    if (!editingTitle.trim()) return;

    await supabase
      .from("conversations")
      .update({ title: editingTitle.trim() })
      .eq("id", id);

    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: editingTitle.trim() } : c))
    );
    setEditingChatId(null);
  };

  const deleteConversation = async (e, id) => {
    e.stopPropagation();
    await supabase.from("conversations").delete().eq("id", id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeChat === id) {
      setActiveChat(null);
      setMessages([]);
    }
  };

  const exportChat = (e, chat) => {
    e.stopPropagation();
    let exportContent = `# ${chat.title}\n\n`;
    messages.forEach((m) => {
      exportContent += `### ${
        m.role === "user" ? "User" : "AI"
      }:\n${m.content}\n\n`;
    });

    const blob = new Blob([exportContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chat.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    a.click();
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setReadingFile(true);

    try {
      let extractedText = "";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText +=
            textContent.items.map((item) => item.str).join(" ") + "\n";
        }
        extractedText = fullText;
      } else {
        extractedText = await file.text();
      }
      setFileContent(extractedText.slice(0, 12000));
    } catch (err) {
      alert("Error reading file: " + err.message);
      removeFile();
    } finally {
      setReadingFile(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileContent("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function sendMessage(e, customPrompt = null) {
    e?.preventDefault();

    let text = customPrompt || input.trim();
    if ((!text && !selectedFile) || loading || readingFile) return;

    let systemInstructionPrefix = "";
    if (systemPersona === "developer") {
      systemInstructionPrefix =
        "[System Prompt: Respond as a Senior Full-Stack Engineer with clean code examples.]\n\n";
    } else if (systemPersona === "writer") {
      systemInstructionPrefix =
        "[System Prompt: Respond as a Professional Content Writer and Editor.]\n\n";
    }

    const displayUserContent = selectedFile
      ? `📎 [File: ${selectedFile.name}]\n${text}`
      : text;

    const payloadPrompt = `${systemInstructionPrefix}${
      selectedFile
        ? `[Attached File: ${selectedFile.name}]\n\nFile Content:\n${fileContent}\n\nUser Question: ${
            text || "Please review and analyze this file."
          }`
        : text
    }`;

    let currentChatId = activeChat;

    if (!currentChatId) {
      const titleText = selectedFile
        ? `📎 ${selectedFile.name}`
        : text.slice(0, 30);
      const { data } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, title: titleText })
        .select()
        .single();

      if (data) {
        currentChatId = data.id;
        setActiveChat(data.id);
        setConversations((prev) => [data, ...prev]);
      }
    }

    const next = [...messages, { role: "user", content: displayUserContent }];
    setMessages(next);
    setInput("");
    removeFile();
    setLoading(true);

    await supabase.from("messages").insert({
      conversation_id: currentChatId,
      role: "user",
      content: displayUserContent,
      type: "text",
    });

    abortControllerRef.current = new AbortController();

    try {
      const apiMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      apiMessages.push({ role: "user", content: payloadPrompt });

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      const assistantResponse = data.message || "No response content";

      setMessages([
        ...next,
        { role: "assistant", content: assistantResponse, type: "text" },
      ]);

      await supabase.from("messages").insert({
        conversation_id: currentChatId,
        role: "assistant",
        content: assistantResponse,
        type: "text",
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages([
          ...next,
          { role: "assistant", content: "Error: " + err.message },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  const regenerateLastMessage = () => {
    if (messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      sendMessage(null, lastUserMsg.content);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 relative">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar / Mobile Drawer */}
      <aside
        className={`fixed md:static z-50 top-0 bottom-0 left-0 w-72 h-full bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out shrink-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="font-bold text-lg tracking-wide text-white">MY AI</div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition text-sm shadow-md"
            onClick={() => {
              setActiveChat(null);
              setMessages([]);
              setIsSidebarOpen(false);
            }}
          >
            <Plus size={18} /> New chat
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChat(chat.id);
                setIsSidebarOpen(false);
              }}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer group transition ${
                activeChat === chat.id
                  ? "bg-slate-800 text-white font-medium"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={(e) => saveTitle(e, chat.id)}
                  onKeyDown={(e) => e.key === "Enter" && saveTitle(e, chat.id)}
                  autoFocus
                  className="bg-transparent border-none text-white outline-none w-full"
                />
              ) : (
                <span className="truncate flex-1 mr-2">
                  {chat.is_pinned && "📌 "}💬 {chat.title}
                </span>
              )}

              <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => togglePin(e, chat.id, chat.is_pinned)}
                  title="Pin Chat"
                  className="p-1 hover:text-white"
                >
                  <Pin size={13} className={chat.is_pinned ? "text-blue-400" : ""} />
                </button>
                <button
                  onClick={(e) => startRenaming(e, chat)}
                  title="Rename Chat"
                  className="p-1 hover:text-white"
                >
                  <Edit2 size={13} />
                </button>
                {activeChat === chat.id && (
                  <button
                    onClick={(e) => exportChat(e, chat)}
                    title="Export Chat"
                    className="p-1 hover:text-white"
                  >
                    <Download size={13} />
                  </button>
                )}
                <button
                  onClick={(e) => deleteConversation(e, chat.id)}
                  title="Delete Chat"
                  className="p-1 hover:text-red-400"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-xs text-slate-300 truncate">
              {user?.email?.split("@")[0] || "User"}
            </span>
          </div>
          <button
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col h-full min-w-0 bg-slate-900 relative">
        {/* Top Navbar */}
        <header className="h-14 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 bg-slate-900/50 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <strong className="text-white text-sm sm:text-base">My AI</strong>
              <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full hidden sm:inline-block">
                GPT-4o Mini
              </span>
            </div>
          </div>

          {/* Persona Selector */}
          <select
            value={systemPersona}
            onChange={(e) => setSystemPersona(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="general">🤖 General Assistant</option>
            <option value="developer">💻 Senior Developer</option>
            <option value="writer">✍️ Content Writer</option>
          </select>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 w-full max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                How can I help?
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                Ask anything, upload a file to analyze, or generate code.
              </p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 text-xs sm:text-sm break-words ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 border border-slate-700/50 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <div className="rounded-lg overflow-hidden my-2 text-xs sm:text-sm">
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          </div>
                        ) : (
                          <code
                            className="bg-slate-900/60 px-1 py-0.5 rounded text-blue-300 font-mono text-xs"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>

                  {/* Actions for Assistant Messages */}
                  {m.role === "assistant" && (
                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-700/50 text-slate-400 text-xs">
                      <button
                        onClick={() => copyToClipboard(m.content, i)}
                        className="flex items-center gap-1 hover:text-white transition"
                      >
                        {copiedIndex === i ? (
                          <Check size={13} className="text-green-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                        <span>{copiedIndex === i ? "Copied" : "Copy"}</span>
                      </button>

                      {i === messages.length - 1 && (
                        <button
                          onClick={regenerateLastMessage}
                          className="flex items-center gap-1 hover:text-white transition"
                        >
                          <RotateCcw size={13} />
                          <span>Regenerate</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-none p-3 text-xs sm:text-sm text-slate-400 animate-pulse">
                Analyzing & Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Section */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900 shrink-0 w-full">
          <div className="max-w-4xl mx-auto">
            {selectedFile && (
              <div className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg mb-2 flex items-center justify-between text-xs text-slate-300">
                <span className="truncate">
                  📎 {selectedFile.name}{" "}
                  {readingFile && "(Reading file...)"}
                </span>
                <button
                  onClick={removeFile}
                  className="text-red-400 hover:text-red-300 ml-2 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => sendMessage(e)}
              className="flex items-end gap-2 bg-slate-800 border border-slate-700 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500 transition"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.txt,.js,.jsx,.ts,.tsx,.json,.csv,.md,.css,.html"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="p-2 text-slate-400 hover:text-white transition disabled:opacity-50 shrink-0"
              >
                <Paperclip size={18} />
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
                placeholder="Message My AI..."
                className="flex-1 bg-transparent border-none text-white outline-none resize-none px-1 py-1 text-xs sm:text-sm max-h-40 placeholder-slate-500"
              />

              {loading ? (
                <button
                  type="button"
                  onClick={() => abortControllerRef.current?.abort()}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition shrink-0"
                >
                  <Square size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() && !selectedFile}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition shrink-0"
                >
                  <Send size={18} />
                </button>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}