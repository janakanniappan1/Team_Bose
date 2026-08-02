# 🚀 UniSwap Campus Marketplace — Instagram Direct Real-Time Chat System Documentation

Production-quality, 100% UUID-based, zero-refresh realtime messaging architecture built with **React 18**, **Vite**, and **Supabase Realtime**.

---

## 📌 Architecture Overview

- **100% UUID Authentication**: Every user is identified strictly via authenticated Supabase `auth.users` UUID (`auth.uid()`). Zero name/string matching.
- **Zero-Refresh Realtime Delivery**: Messages, typing indicators, presence, and thread updates stream live using Supabase `postgres_changes` websocket channels.
- **Instagram Direct UI/UX**:
  - Terracotta right-aligned bubbles for current user, White left-aligned bubbles for opponent.
  - Ticks for Sent (`✓`), Delivered (`✓✓`), and Seen (`Blue ✓✓`).
  - Online active dot (`#22C55E`) and human-readable last seen timestamp.
  - 3-dot bouncing typing indicator.
  - Unread notification badges and conversation reordering (newest on top).
  - Photo attachment uploads with preview modal.
  - Interactive Product Card sharing and Price Offer cards.

---

## 📁 File Structure

```
DB/
├── production_chat_schema.sql  # Complete SQL Schema, RLS & Realtime commands
└── CHAT_SYSTEM_DOCS.md         # Full setup & deployment documentation

src/
├── lib/
│   └── supabase.js             # Supabase client instance
├── services/
│   ├── threadService.js        # 1-on-1 Thread lookup & creation
│   ├── chatService.js          # Paginated messages, image upload, mark as seen
│   ├── presenceService.js      # Online/offline presence broadcasting
│   ├── typingService.js        # Debounced typing emitter & subscriber
│   └── notificationService.js  # Push notifications & unread alerts
├── hooks/
│   ├── useThreads.js           # Realtime chat_threads subscription
│   ├── useRealtimeMessages.js  # Realtime chat_messages subscription (zero-refresh)
│   ├── usePresence.js          # Live presence tracker
│   ├── useTyping.js            # Live typing status hook with 2s auto-clear
│   └── useChat.js              # Orchestrator custom hook
├── components/chat/
│   ├── ChatSidebar.jsx         # Conversation list, search, unread badge
│   ├── ConversationCard.jsx    # Sidebar conversation card item
│   ├── ChatHeader.jsx          # Contact top bar, avatar, online dot, call button
│   ├── ChatMessages.jsx        # Infinite scroll message stream & auto-scroll
│   ├── MessageBubble.jsx       # Terracotta vs White bubbles & checkmarks
│   ├── MessageInput.jsx        # Emoji button, photo upload, quick reply chips
│   ├── TypingIndicator.jsx     # Bouncing 3-dot animation
│   ├── OnlineIndicator.jsx     # Green online dot & formatted last seen
│   ├── UnreadBadge.jsx         # Notification counter pill
│   ├── SeenIndicator.jsx       # Checkmarks (✓, ✓✓, Blue ✓✓)
│   └── ImagePreview.jsx        # Attachment preview modal
└── pages/
    └── MessagesPage.jsx        # Responsive Instagram Direct workspace page
```

---

## 🛠️ Step-by-Step Supabase Setup Guide

### 1. Execute SQL Schema & RLS Policies
Copy and run the complete contents of `DB/production_chat_schema.sql` in your **Supabase SQL Editor**:
- Creates `profiles`, `chat_threads`, `chat_messages`, `user_presence`, and `typing_status` tables.
- Enables Row Level Security (RLS) on all tables to enforce user data privacy.
- Adds tables to `supabase_realtime` publication.

### 2. Enable Supabase Realtime
Navigate to **Supabase Dashboard → Database → Replication**:
- Ensure `chat_threads`, `chat_messages`, `typing_status`, and `user_presence` are toggled **ON** under the `supabase_realtime` publication.

### 3. Supabase Storage Setup (Image Attachments)
Navigate to **Supabase Dashboard → Storage**:
- Ensure a public storage bucket named **`imagies`** exists.
- Set bucket access policy to **Public Read**.

---

## 🧪 Testing Instructions

1. **Start Development Server**:
   ```bash
   npm run dev
   ```
2. **Realtime Dual-User Test**:
   - Open Browser Window 1: Log in as User A.
   - Open Incognito / Browser Window 2: Log in as User B.
   - User A sends "Hello". User B receives "Hello" **instantly** without refreshing.
   - When User A types, User B sees bouncing `Typing...` indicator.
   - When User B views conversation, User A sees blue double checkmarks `✓✓` (Seen).

---

## 📦 Production Deployment Instructions

1. **Verify Build Cleanliness**:
   ```bash
   npm run build
   ```
2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy production Instagram Direct realtime chat system"
   git push origin main
   ```
3. Vercel will automatically build and deploy the updated application live!
