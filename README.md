# 📝 Full-Stack To-Do App

A full-stack To-Do application that allows users to add, view, and manage tasks efficiently. Built with **Next.js (App Router)** on the frontend and **Node.js/Express + MongoDB** on the backend.

---

## 📂 Project Structure

```
/frontend       → Next.js frontend
/backend        → Express.js backend (Node.js + MongoDB)
```

---

## 🚀 Features

### ✅ To-Do Functionality

- Create, view, update, and delete tasks
- Responsive UI with Tailwind CSS
- JWT-based authentication (setup ready)

---

## 🧪 Tech Stack

### Frontend

- [Next.js 15 (App Router)](https://nextjs.org)
- React 19
- Tailwind CSS v4
- SWR for data fetching
- Axios for HTTP requests

### Backend

- Node.js
- Express v5
- MongoDB + Mongoose
- JWT (JSON Web Token)
- CORS, cookie-parser, body-parser

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/fullstack-todo-app.git
cd fullstack-todo-app
```

---

### 2. Setup the Backend

```bash
cd backend
npm install
```

#### ➕ Create `.env` File

Create a `.env` file inside the `backend` directory with the following content:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

#### 🚀 Start the Backend Server

```bash
npm run dev
```

Server will start on `http://localhost:5000` by default.

---

### 3. Setup the Frontend

```bash
cd frontend
npm install
```

#### 🚀 Start the Frontend Dev Server

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint     | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/todos`     | Get all To-Dos          |
| POST   | `/todos`     | Create a new To-Do      |
| PUT    | `/todos/:id` | Update a specific To-Do |
| DELETE | `/todos/:id` | Delete a specific To-Do |

---

## ✅ To-Do

- [ ] Complete Login/Register Functionality
- [ ] Add Pagination Controls
- [ ] Add Filters (Completed / Active)

---

## 👨‍💻 Author

**Anish Panja**

[LinkedIn](https://linkedin.com/in/anishpanja)

---
