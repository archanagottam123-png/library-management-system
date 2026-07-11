# Library Management System (MERN Stack)

A full-stack Library Management System built with **MongoDB, Express.js, React, and Node.js**. Designed to be clean, beginner-friendly, and suitable for software engineering placement interviews.

## Tech Stack

| Layer    | Technology         |
|----------|--------------------|
| Frontend | React 18 + Vite    |
| Styling  | Plain CSS          |
| Backend  | Node.js + Express  |
| Database | MongoDB (Mongoose) |
| Auth    | Simple token-based (no JWT library) |

> No Tailwind, TypeScript, Redux, React Router, Axios, or advanced libraries — just the basics.

## Features

- **Admin Login** — secure authentication with protected routes
- **Dashboard** — stat cards (total books, available, issued, students) + recent activity
- **Book Management (CRUD)** — add, view, update, delete, search, and filter books
- **Student Management (CRUD)** — add, view, update, delete, and search students
- **Issue Book** — select student & book, set issue/return dates, prevent issuing unavailable books
- **Return Book** — process returns with automatic fine calculation (Rs. 10/day for late returns)
- **Search & Filter** — by book name, author, category, and availability
- **Confirmation Dialog** — before any delete action
- **Toast Notifications** — success and error messages
- **Responsive Design** — works on mobile, tablet, and desktop
- **Sample Data** — preloaded so you can explore the UI immediately

## Folder Structure

```
library-management-system/
├── index.html
├── package.json            # Frontend dependencies
├── vite.config.js
├── src/                    # Frontend source
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css           # All styles (plain CSS)
│   ├── components/         # Reusable UI components
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── Modal.jsx
│   │   ├── Spinner.jsx
│   │   └── ConfirmDialog.jsx
│   ├── context/            # React context (auth, toasts)
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── pages/              # App pages
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── BooksPage.jsx
│   │   ├── StudentsPage.jsx
│   │   ├── IssueBookPage.jsx
│   │   └── ReturnBookPage.jsx
│   ├── services/           # API layer
│   │   ├── api.js
│   │   └── sampleData.js
│   └── utils/              # Helpers
│       └── validation.js
└── server/                 # Backend source (Express + MongoDB)
    ├── package.json        # Backend dependencies
    ├── server.js           # Entry point
    ├── app.js              # Express app setup
    ├── seed.js             # Sample data seeder
    ├── config/
    │   └── db.js           # MongoDB connection
    ├── models/             # Mongoose models
    │   ├── User.js
    │   ├── Book.js
    │   ├── Student.js
    │   └── Issue.js
    ├── controllers/        # Route handlers
    │   ├── authController.js
    │   ├── bookController.js
    │   ├── studentController.js
    │   └── issueController.js
    ├── routes/             # Express routes
    │   ├── authRoutes.js
    │   ├── bookRoutes.js
    │   ├── studentRoutes.js
    │   └── issueRoutes.js
    ├── middleware/
    │   └── errorHandler.js
    └── .env.example
```

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — either installed locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/library-management-system.git
cd library-management-system
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure environment variables

Create a `.env` file in the `server/` folder (copy from `.env.example`):

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and set your MongoDB connection string:

```
MONGO_URI=mongodb://127.0.0.1:27017/library_db
PORT=5000
```

### 5. Seed the database (optional but recommended)

This populates MongoDB with sample books, students, and issues:

```bash
cd server
npm run seed
cd ..
```

### 6. Run the backend

```bash
cd server
npm run dev
```

The API server starts on `http://localhost:5000`.

### 7. Run the frontend (in a separate terminal)

```bash
npm run dev
```

The app opens at `http://localhost:5173`.

## Demo Credentials

| Field   | Value                |
|---------|----------------------|
| Email   | `admin@library.com`  |
| Password| `admin123`           |

> If the backend is not running, the frontend automatically falls back to built-in sample data so you can still explore the UI.

## API Endpoints

### Auth
| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| POST   | `/api/auth/login`   | Admin login          |
| POST   | `/api/auth/register`| Admin registration   |

### Books
| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | `/api/books`        | Get all books        |
| GET    | `/api/books/:id`    | Get a single book    |
| POST   | `/api/books`        | Add a new book       |
| PUT    | `/api/books/:id`    | Update a book        |
| DELETE | `/api/books/:id`    | Delete a book        |

### Students
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | `/api/students`        | Get all students     |
| GET    | `/api/students/:id`   | Get a single student |
| POST   | `/api/students`       | Add a new student    |
| PUT    | `/api/students/:id`   | Update a student     |
| DELETE | `/api/students/:id`   | Delete a student     |

### Issues
| Method | Endpoint                  | Description            |
|--------|---------------------------|------------------------|
| GET    | `/api/issues`             | Get all issues         |
| POST   | `/api/issues`             | Issue a book           |
| PUT    | `/api/issues/:id/return`  | Return a book + fine   |

## Database Collections

- **users** — admin accounts (name, email, password)
- **books** — book records (bookId, name, author, category, quantity, available)
- **students** — student records (studentId, name, department, phone)
- **issues** — issue/return records (bookId, studentId, dates, returned, fine)

## How It Works

1. The admin logs in with email/password (authenticated against MongoDB).
2. The dashboard shows live counts from the database.
3. Books and students can be added, edited, searched, and deleted.
4. When a book is issued, available copies decrease by 1.
5. When a book is returned, available copies increase by 1, and a fine is calculated if the return is late (Rs. 10/day).
6. All data persists in MongoDB.

## Building for Production

```bash
npm run build      # Builds the frontend to dist/
```

## Tech Notes

- **Routing**: Simple state-based page switching (no React Router, per requirements).
- **API calls**: Uses the native `fetch` API (no Axios, per requirements).
- **Styling**: Hand-written CSS in `src/index.css` (no Tailwind, per requirements).
- **Auth**: Simple base64 token — no JWT library, per requirements.

## License

This project is open source and free to use for learning and portfolio purposes.
