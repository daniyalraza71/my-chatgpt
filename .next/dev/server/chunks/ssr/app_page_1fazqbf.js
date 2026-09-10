module.exports = [
"[project]/app/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/supabaseClient'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function Home() {
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeChat, setActiveChat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [imageLoading, setImageLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Auth check & User session load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const checkUser = async ()=>{
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
                fetchConversations(user.id);
            }
        };
        checkUser();
    }, [
        router
    ]);
    // Messages load jab active chat change ho
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (activeChat) {
            fetchMessages(activeChat);
        } else {
            setMessages([]);
        }
    }, [
        activeChat
    ]);
    const fetchConversations = async (userId)=>{
        const { data } = await supabase.from("conversations").select("*").eq("user_id", userId).order("created_at", {
            ascending: false
        });
        if (data) setConversations(data);
    };
    const fetchMessages = async (chatId)=>{
        const { data } = await supabase.from("messages").select("*").eq("conversation_id", chatId).order("created_at", {
            ascending: true
        });
        if (data) setMessages(data);
    };
    const createNewChat = async ()=>{
        if (!user) return;
        setActiveChat(null);
        setMessages([]);
    };
    const deleteConversation = async (e, id)=>{
        e.stopPropagation();
        await supabase.from("conversations").delete().eq("id", id);
        setConversations(conversations.filter((c)=>c.id !== id));
        if (activeChat === id) {
            setActiveChat(null);
            setMessages([]);
        }
    };
    const handleLogout = async ()=>{
        await supabase.auth.signOut();
        router.push("/login");
    };
    async function sendMessage(e) {
        e?.preventDefault();
        const text = input.trim();
        if (!text || loading || imageLoading) return;
        let chatId = activeChat;
        // Naya conversation create karein agar pehle se active chat na ho
        if (!chatId) {
            const { data } = await supabase.from("conversations").insert({
                user_id: user.id,
                title: text.slice(0, 30)
            }).select().single();
            if (data) {
                chatId = data.id;
                setActiveChat(data.id);
                setConversations([
                    data,
                    ...conversations
                ]);
            }
        }
        const next = [
            ...messages,
            {
                role: "user",
                content: text
            }
        ];
        setMessages(next);
        setInput("");
        setLoading(true);
        if (chatId) {
            await supabase.from("messages").insert({
                conversation_id: chatId,
                role: "user",
                content: text,
                type: "text"
            });
        }
        abortControllerRef.current = new AbortController();
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: text
                }),
                signal: abortControllerRef.current.signal
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Request failed");
            }
            if (!res.body) return;
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let assistantResponse = "";
            setMessages([
                ...next,
                {
                    role: "assistant",
                    content: ""
                }
            ]);
            while(true){
                const { value, done } = await reader.read();
                if (done) break;
                const textChunk = decoder.decode(value, {
                    stream: true
                });
                assistantResponse += textChunk;
                setMessages((prev)=>{
                    const updated = [
                        ...prev
                    ];
                    updated[updated.length - 1] = {
                        role: "assistant",
                        content: assistantResponse
                    };
                    return updated;
                });
            }
            if (chatId) {
                await supabase.from("messages").insert({
                    conversation_id: chatId,
                    role: "assistant",
                    content: assistantResponse,
                    type: "text"
                });
            }
        } catch (err) {
            if (err.name === "AbortError") {
                setMessages((prev)=>[
                        ...prev.slice(0, -1),
                        {
                            role: "assistant",
                            content: "Response stopped"
                        }
                    ]);
            } else {
                setMessages([
                    ...next,
                    {
                        role: "assistant",
                        content: "Error: " + err.message
                    }
                ]);
            }
        } finally{
            setLoading(false);
        }
    }
    async function generateImage(e) {
        e?.preventDefault();
        const text = input.trim();
        if (!text || loading || imageLoading) return;
        let chatId = activeChat;
        if (!chatId) {
            const { data } = await supabase.from("conversations").insert({
                user_id: user.id,
                title: "🖼️ " + text.slice(0, 25)
            }).select().single();
            if (data) {
                chatId = data.id;
                setActiveChat(data.id);
                setConversations([
                    data,
                    ...conversations
                ]);
            }
        }
        const next = [
            ...messages,
            {
                role: "user",
                content: "🖼️ Generate image: " + text
            }
        ];
        setMessages(next);
        setInput("");
        setImageLoading(true);
        if (chatId) {
            await supabase.from("messages").insert({
                conversation_id: chatId,
                role: "user",
                content: "🖼️ Generate image: " + text,
                type: "text"
            });
        }
        abortControllerRef.current = new AbortController();
        try {
            const res = await fetch("/api/image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: text
                }),
                signal: abortControllerRef.current.signal
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Image generation failed");
            }
            setMessages([
                ...next,
                {
                    role: "assistant",
                    type: "image",
                    content: data.url || data.image
                }
            ]);
            if (chatId) {
                await supabase.from("messages").insert({
                    conversation_id: chatId,
                    role: "assistant",
                    content: data.url || data.image,
                    type: "image"
                });
            }
        } catch (err) {
            if (err.name === "AbortError") {
                setMessages((prev)=>[
                        ...prev,
                        {
                            role: "assistant",
                            content: "Response stopped"
                        }
                    ]);
            } else {
                setMessages([
                    ...next,
                    {
                        role: "assistant",
                        content: "Image Error: " + err.message
                    }
                ]);
            }
        } finally{
            setImageLoading(false);
        }
    }
    const stopResponse = ()=>{
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setLoading(false);
            setImageLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "sidebar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "newChat",
                        onClick: createNewChat,
                        children: "＋ New chat"
                    }, void 0, false, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 298,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "brand",
                        children: "MY AI"
                    }, void 0, false, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "conversationsList",
                        style: {
                            flex: 1,
                            overflowY: "auto"
                        },
                        children: conversations.map((chat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>setActiveChat(chat.id),
                                className: `chatItem ${activeChat === chat.id ? "active" : ""}`,
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    borderRadius: "6px",
                                    marginBottom: "4px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        },
                                        children: chat.title
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 320,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>deleteConversation(e, chat.id),
                                        style: {
                                            background: "none",
                                            border: "none",
                                            color: "#ff4d4d",
                                            cursor: "pointer"
                                        },
                                        children: "✕"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 323,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, chat.id, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 306,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 304,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleLogout,
                        style: {
                            padding: "8px",
                            background: "#d9534f",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            marginTop: "10px"
                        },
                        children: "Logout"
                    }, void 0, false, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 333,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.js",
                lineNumber: 297,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "chat",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "topbar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "My AI"
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "GPT-4o Mini"
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 352,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 350,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "messages",
                        children: [
                            messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "welcome",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        children: "How can I help?"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 358,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Ask anything or generate an image."
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 359,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 357,
                                columnNumber: 13
                            }, this) : messages.map((m, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "row " + m.role,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bubble",
                                        children: m.type === "image" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: m.content,
                                            alt: "Generated image",
                                            style: {
                                                maxWidth: "100%",
                                                width: "700px",
                                                borderRadius: "14px",
                                                display: "block"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.js",
                                            lineNumber: 366,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                whiteSpace: "pre-wrap"
                                            },
                                            children: m.content
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.js",
                                            lineNumber: 377,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.js",
                                        lineNumber: 364,
                                        columnNumber: 17
                                    }, this)
                                }, i, false, {
                                    fileName: "[project]/app/page.js",
                                    lineNumber: 363,
                                    columnNumber: 15
                                }, this)),
                            (loading || imageLoading) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "row assistant",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bubble",
                                    children: imageLoading ? "Creating your image…" : "Thinking…"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.js",
                                    lineNumber: 386,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 385,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 355,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        className: "composer",
                        onSubmit: sendMessage,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                value: input,
                                onChange: (e)=>setInput(e.target.value),
                                placeholder: "Message My AI…",
                                disabled: loading || imageLoading
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 394,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: generateImage,
                                disabled: loading || imageLoading || !input.trim(),
                                title: "Generate image",
                                children: "🖼️"
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 401,
                                columnNumber: 11
                            }, this),
                            loading || imageLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: stopResponse,
                                title: "Stop response",
                                style: {
                                    background: "#ff4d4d",
                                    color: "#fff"
                                },
                                children: "🛑"
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 411,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: !input.trim(),
                                title: "Send message",
                                children: "↑"
                            }, void 0, false, {
                                fileName: "[project]/app/page.js",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "notice",
                        children: "AI can make mistakes. Check important information."
                    }, void 0, false, {
                        fileName: "[project]/app/page.js",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.js",
                lineNumber: 349,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.js",
        lineNumber: 296,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=app_page_1fazqbf.js.map