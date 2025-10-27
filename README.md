---

## 🧭 Overview
CyraExpenseApp is a **full-stack expense tracker** built using Node.js, Express, MongoDB, and vanilla JavaScript.  
It allows users to:
- Record income and expenses  
- Visualize spending through a live chart  
- Filter and search transactions  
- Edit or delete entries easily  
- View real-time balance summaries  

---

## ⚙️ Features
| Feature | Description |
|----------|--------------|
| 💵 **Add Transactions** | Add income or expense with category, description, and date |
| ✏️ **Edit Transactions** | Update amount and description directly |
| 🗑️ **Delete Transactions** | Remove items from your database easily |
| 📊 **Dashboard Summary** | Displays total income, total expenses, and current balance |
| 🔍 **Search & Filters** | Filter by transaction type or search keywords |
| 📈 **Chart Visualization** | Interactive doughnut chart (via Chart.js) |
| 🗓️ **Custom Date Input** | Assign specific dates to transactions |
| 🎨 **Responsive Design** | Mobile-friendly layout using CSS Flexbox & Grid |

---

## 🧠 Tech Stack

### 🔙 Backend
- **Node.js** – JavaScript runtime for backend logic  
- **Express.js** – Lightweight web framework for API routes  
- **Mongoose** – ODM for MongoDB (schema modeling)  
- **CORS** – Middleware for secure frontend-backend communication  

### 💾 Database
- **MongoDB** – NoSQL database for storing transaction data  
- **MongoDB Compass** – GUI for managing and visualizing local data  

### 🎨 Frontend
- **HTML5 / CSS3** – Page structure and modern styling  
- **Vanilla JavaScript** – Fetch API, DOM manipulation, dynamic updates  
- **Chart.js (CDN)** – Doughnut chart visualization for balance summary  

---

## 📁 Project Structure

CyraExpenseApp/
│
├── server.js # Main Express server file
├── db.js # MongoDB connection script
├── package.json # Project dependencies and start script
│
├── models/
│ └── Transaction.js # Mongoose schema for transactions
│
├── routes/
│ └── transactionRoutes.js # API endpoints for CRUD operations
│
└── public/
├── index.html # Frontend layout
├── script.js # Client-side logic
└── style.css # Styling and responsiveness


---

## 🧩 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/api/transactions` | Get all transactions |
| `POST` | `/api/transactions` | Add new transaction |
| `PUT` | `/api/transactions/:id` | Update an existing transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |
| `GET` (with query params) | `/api/transactions?type=income&search=food` | Filter/search transactions |

---

## ⚙️ Installation Guide

### 1️⃣ Prerequisites
Make sure the following are installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [MongoDB Compass](https://www.mongodb.com/products/compass)

---

### 2️⃣ Clone or Download
Download the ZIP:
CyraExpenseApp.zip

Extract it anywhere (e.g., Desktop or Documents).

---

### 3️⃣ Install Dependencies
Open the project folder in your terminal:
```bash
cd CyraExpenseApp
npm install
```
### 4️⃣ Start MongoDB

Make sure MongoDB service is running:
```bash
net start MongoDB
```
---

### Then verify via MongoDB Compass using this URI:
```
mongodb://localhost:27017

```

---

### 5️⃣ Run the Application

In the same terminal:
```
npm start
```
---
### You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000

```
---

```
✅ MongoDB Connected
🚀 Server running on port 5000
```

---

### 6️⃣ Open in Browser

Visit:
```
http://localhost:5000
```

---
Your Cyra Expense App should now be live! 🎉
---

🧭 Usage Guide

Select Income or Expense

Enter amount, category, description, and optional date

Click Add to save

Transactions appear below with options to:

✏️ Edit

🗑️ Delete

Use search or dropdown filter to find specific records

Dashboard and chart update automatically

---

📊 Dashboard Analytics

Green section (Income) → total earnings

Red section (Expense) → total spendings

Balance → Income - Expense

---

🛠️ Troubleshooting
Issue	Solution
❌ MongoDB not connecting	Ensure MongoDB service is running (net start MongoDB)
⚠️ Port already in use	Edit server.js → change const PORT = 5000
Blank page	Check that public/ folder is in same directory as server.js

---
🧾 License

This project is created for learning and demonstration purposes under MIT License.
---
👨‍💻 Author

Miles Garcia
Developer • Web & Software Engineer
📧 milesdev.codes@gmail.com

🌐 Stratix-I.T Company Portfolio (In Progress)

🌟 Credits

Developed using Node.js, Express, and MongoDB

UI inspired by modern minimalist dashboard designs

Visualization powered by Chart.js


