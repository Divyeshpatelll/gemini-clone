## ✨ Features

- **OTP-based Login** with country code (API fetched, Zod validation)
- **Chatroom Management:** Create, delete, search, and list chatrooms
- **Conversational Chat UI:**  
  - User & AI messages  
  - Timestamps  
  - Typing indicator ("Gemini is typing...")  
  - Fake AI reply with realistic, context-aware responses  
  - Infinite scroll & pagination  
  - Image upload (base64 preview)  
  - Copy-to-clipboard on hover
- **Global UX:**  
  - Mobile responsive  
  - Dark mode toggle  
  - Debounced chatroom search  
  - Toast notifications  
  - Loading skeletons for chat  
  - Keyboard accessibility (Tab, Enter, Esc, etc.)
- **State Management:** Zustand
- **Form Validation:** React Hook Form + Zod
- **Data Persistence:** localStorage for auth & chat
- **Logout:** Secure session clear & redirect

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React, Tailwind CSS
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **API:** [restcountries.com](https://restcountries.com/) for country codes
- **Notifications:** react-toastify

## 🏁 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Divyeshpatelll/gemini-clone
cd gemini-clone
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run locally

```bash
npm run dev
# or
yarn dev
```

App will be running at [http://localhost:3000](http://localhost:3000)


## ⚙️ Project Details

### **Authentication**

- OTP login with country code (fetched from API)
- Zod schema validation for phone number

### **Chatroom & Messaging**

- Zustand for chatroom/message state
- Infinite scroll, pagination, and loading skeletons
- AI replies: context-aware, realistic, and random

### **UI/UX**

- Fully responsive (mobile, tablet, desktop)
- Dark/light mode with smooth toggle
- Keyboard accessible (Tab, Enter, Esc, etc.)
- Toast notifications for all key actions

### **Deployment**

- Vercel
- [link](https://gemini-clone-coral-tau.vercel.app/login)

---

## 📄 Assignment Requirements Coverage

- [x] OTP login, country code API, Zod validation
- [x] Chatroom CRUD, toast, search
- [x] Chat UI, AI, typing, scroll, pagination
- [x] Image upload, copy-to-clipboard
- [x] Responsive, dark mode, localStorage
- [x] Loading skeletons
- [x] Keyboard accessibility
- [x] Logout
