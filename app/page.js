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
  Image as ImageIcon,
  Send,
  Square,
  Moon,
  Sun,
  LogOut,
  Check,
} from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("dark");

  // New Feature States
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

  // Auto Scroll to Bottom
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  // Auth & Initial Fetch
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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

  // Chat Actions (Rename, Pin, Delete, Export)
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
      exportContent += `### ${m.role === "user" ? "User" : "AI"}:\n${m.content}\n\n`;
    });

    const blob = new Blob([exportContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${chat.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    a.click();
  };

  // Copy Message to Clipboard
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // File Handler
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
          fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
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

  // Send Message Logic
  async function sendMessage(e, customPrompt = null) {
    e?.preventDefault();

    let text = customPrompt || input.trim();
    if ((!text && !selectedFile) || loading || imageLoading || readingFile) return;

    let systemInstructionPrefix = "";
    if (systemPersona === "developer") {
      systemInstructionPrefix = "[System Prompt: Respond as a Senior Full-Stack Engineer with clean code examples.]\n\n";
    } else if (systemPersona === "writer") {
      systemInstructionPrefix = "[System Prompt: Respond as a Professional Content Writer and Editor.]\n\n";
    }

    const displayUserContent = selectedFile
      ? `📎 [File: ${selectedFile.name}]\n${text}`
      : text;

    const payloadPrompt = `${systemInstructionPrefix}${
      selectedFile
        ? `[Attached File: ${selectedFile.name}]\n\nFile Content:\n${fileContent}\n\nUser Question: ${text || "Please review and analyze this file."}`
        : text
    }`;

    let currentChatId = activeChat;

    if (!currentChatId) {
      const titleText = selectedFile ? `📎 ${selectedFile.name}` : text.slice(0, 30);
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
      const apiMessages = messages.map((m) => ({ role: m.role, content: m.content }));
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

      setMessages([...next, { role: "assistant", content: assistantResponse, type: "text" }]);

      await supabase.from("messages").insert({
        conversation_id: currentChatId,
        role: "assistant",
        content: assistantResponse,
        type: "text",
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages([...next, { role: "assistant", content: "Error: " + err.message }]);
      }
    } finally {
      setLoading(false);
    }
  }

  // Regenerate Response
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
    <main className="shell">
      <aside className="sidebar">
        <div className="sidebarHeader">
          <div className="brand">MY AI</div>
          <button className="themeToggle" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <button className="newChat" onClick={() => { setActiveChat(null); setMessages([]); }}>
          <Plus size={18} /> New chat
        </button>

        {/* Search Bar */}
        <div style={{ padding: "8px 12px", position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "22px", top: "18px", opacity: 0.5 }} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 34px",
              borderRadius: "8px",
              border: "1px solid var(--border-color, #333)",
              background: "transparent",
              color: "inherit",
              fontSize: "13px",
            }}
          />
        </div>

        {/* Conversations List */}
        <div className="conversationsList">
          {filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`chatItem ${activeChat === chat.id ? "active" : ""}`}
            >
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={(e) => saveTitle(e, chat.id)}
                  onKeyDown={(e) => e.key === "Enter" && saveTitle(e, chat.id)}
                  autoFocus
                  style={{ background: "transparent", border: "none", color: "inherit", width: "100%" }}
                />
              ) : (
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {chat.is_pinned && "📌 "}💬 {chat.title}
                </span>
              )}

              <div style={{ display: "flex", gap: "4px" }}>
                <button onClick={(e) => togglePin(e, chat.id, chat.is_pinned)} title="Pin Chat">
                  <Pin size={14} style={{ opacity: chat.is_pinned ? 1 : 0.4 }} />
                </button>
                <button onClick={(e) => startRenaming(e, chat)} title="Rename Chat">
                  <Edit2 size={14} style={{ opacity: 0.6 }} />
                </button>
                {activeChat === chat.id && (
                  <button onClick={(e) => exportChat(e, chat)} title="Export Chat">
                    <Download size={14} style={{ opacity: 0.6 }} />
                  </button>
                )}
                <button onClick={(e) => deleteConversation(e, chat.id)} title="Delete Chat">
                  <Trash2 size={14} style={{ opacity: 0.6 }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebarFooter">
          <div className="userProfile">
            <div className="userAvatar">{user?.email?.charAt(0).toUpperCase() || "U"}</div>
            <span className="userName">{user?.email?.split("@")[0] || "User"}</span>
          </div>
          <button className="logoutBtn" onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <section className="chat">
        <header className="topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>My AI</strong>
            <span style={{ marginLeft: "8px", opacity: 0.6 }}>GPT-4o Mini</span>
          </div>

          {/* Persona Selector */}
          <select
            value={systemPersona}
            onChange={(e) => setSystemPersona(e.target.value)}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "var(--bg-secondary, #222)",
              color: "inherit",
              fontSize: "12px",
            }}
          >
            <option value="general">🤖 General Assistant</option>
            <option value="developer">💻 Senior Developer</option>
            <option value="writer">✍️ Content Writer</option>
          </select>
        </header>

        <div className="messages">
          {messages.length === 0 ? (
            <div className="welcome">
              <h1>How can I help?</h1>
              <p>Ask anything, upload a file to analyze, or generate code and images.</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div className={"row " + m.role} key={i}>
                <div className="bubble" style={{ position: "relative" }}>
                  {m.type === "image" ? (
                    <img src={m.content} alt="Generated image" style={{ maxWidth: "100%", width: "600px", borderRadius: "14px" }} />
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <div style={{ borderRadius: "8px", overflow: "hidden", margin: "10px 0" }}>
                              <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  )}

                  {/* Quick Copy / Action Bar */}
                  {m.role === "assistant" && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px", opacity: 0.7 }}>
                      <button
                        onClick={() => copyToClipboard(m.content, i)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        {copiedIndex === i ? <Check size={14} /> : <Copy size={14} />} {copiedIndex === i ? "Copied" : "Copy"}
                      </button>

                      {i === messages.length - 1 && (
                        <button
                          onClick={regenerateLastMessage}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          <RotateCcw size={14} /> Regenerate
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="row assistant">
              <div className="bubble">Analyzing & Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer Input Box */}
        <div className="composerContainer">
          {selectedFile && (
            <div style={{ padding: "8px 16px", background: "var(--hover-bg, #2a2a2a)", borderRadius: "8px", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px" }}>📎 {selectedFile.name} {readingFile && "(Reading...)"}</span>
              <button onClick={removeFile} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer" }}>✕</button>
            </div>
          )}

          <form className="composer" onSubmit={(e) => sendMessage(e)}>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: "none" }} accept=".pdf,.txt,.js,.jsx,.ts,.tsx,.json,.csv,.md,.css,.html" />

            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={loading}>
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
              style={{ flex: 1, resize: "none", background: "transparent", border: "none", color: "inherit", outline: "none", padding: "8px" }}
            />

            {loading ? (
              <button type="button" onClick={() => abortControllerRef.current?.abort()} style={{ background: "#ff4d4d", color: "#fff", borderRadius: "50%", padding: "6px" }}>
                <Square size={16} />
              </button>
            ) : (
              <button type="submit" disabled={!input.trim() && !selectedFile}>
                <Send size={18} />
              </button>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}