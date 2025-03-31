# 🗂️ Kanban Task Management

A feature-rich **Kanban board application** built with **React**, enabling users to organize tasks across multiple boards and columns with full CRUD functionality, drag-and-drop reordering, dark mode, and accessibility support.

![Kanban Preview](https://raw.githubusercontent.com/noamguterman/kanban/refs/heads/main/public/kanban-preview.png)

## 🚀 Live Demo  
🔗 [Open the App](https://noamguterman.github.io/kanban/)

---

## ✨ Features

✅ **Multi-board architecture** – Create and manage multiple boards, each with its own columns and tasks.  
✅ **Task management** – Add, edit, delete tasks and subtasks with real-time updates.  
✅ **Drag & drop** – Rearrange tasks across columns with precision using `react-dnd`.  
✅ **Dynamic modals** – Accessible and keyboard-navigable modals for task and board editing.  
✅ **Dark mode** – Toggle light and dark themes for optimal visual comfort.  
✅ **Persistent data** – All data is stored in `localStorage` to maintain state across sessions.  
✅ **Fully responsive UI** – Optimized for desktop and mobile use.  

---

## 🛠️ Tech Stack

- **Framework:** React (Vite)
- **Styling:** CSS Modules  
- **State Management:** React Context API  
- **Drag & Drop:** react-dnd  
- **Forms & Modals:** Custom components with accessibility and focus trapping  
- **Deployment:** GitHub Pages  

---

## 📁 Project Structure
```
/
├── public/                 # Static assets (icons, preview banner, etc.)
├── src/
│   ├── components/         # UI components (Task, Column, Sidebar, etc.)
│   ├── modals/             # Modal components (AddTask, EditBoard, etc.)
│   ├── utils/              # Helper functions (e.g., getCustomStyles)
│   ├── hooks/              # Custom hooks (e.g., useFocusTrap)
│   ├── data.json           # Initial board/task data
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
```

---

## 🧠 Key Concepts

- **Task & subtask logic** – Tasks support multiple subtasks with progress tracking.
- **Context-aware modals** – Reusable modals handle both editing and deletion across boards and tasks.
- **Custom keyboard navigation** – Accessibility is baked into all interactive components.
- **Scoped styles** – Uses CSS Modules for maintainable and conflict-free styling.

---

## 🔒 License
This project is for personal use and is not licensed for redistribution or modification.
