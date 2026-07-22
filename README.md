# Musk Capital 🚀

> An educational premium investment platform — Phase 1

**Disclaimer:** This is a fictional educational project. Not affiliated with Elon Musk or any of his companies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Python Flask + SQLAlchemy |
| Auth | Flask-JWT-Extended |
| Database | PostgreSQL 16 |

---

## Getting Started

### 1. Frontend

```bash
cd musk-capital
npm install
npm run dev
# → http://localhost:5173
```

### 2. Backend

```bash
cd musk-capital/backend

# Windows
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up .env (already created)
# Edit backend/.env with your PostgreSQL credentials

# Run the server
python run.py
# → http://localhost:5000
```

### 3. PostgreSQL Setup (Portable)

```bash
# Initialize the database cluster
C:\PostgreSQL\pgsql\bin\initdb.exe -D "C:\PostgreSQL\data" -U postgres --pwprompt

# Start PostgreSQL
C:\PostgreSQL\pgsql\bin\pg_ctl.exe -D "C:\PostgreSQL\data" start

# Create the database
C:\PostgreSQL\pgsql\bin\createdb.exe -U postgres muskcapital
```

---

## Project Structure

```
musk-capital/
├── src/
│   ├── components/layout/   Navbar, Footer, Sidebar, AdminSidebar, TickerBar
│   ├── components/ui/       MarketCard, CompanyCard, NewsCard, StatCard
│   ├── pages/public/        Home, Companies, CompanyDetail, Markets, News, About, Contact, NotFound
│   ├── pages/auth/          Login, Register, ForgotPassword
│   ├── pages/user/          Dashboard
│   ├── pages/admin/         AdminDashboard
│   ├── context/             AuthContext (JWT)
│   └── data/                mockData.js
├── backend/
│   ├── app/
│   │   ├── models/          User, Company, Stock, NewsArticle, Portfolio, Transaction, Plan
│   │   └── routes/          auth, companies, markets, news, portfolio, admin
│   ├── requirements.txt
│   └── run.py
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | JWT | Get current user |
| GET | /api/companies/ | — | List all companies |
| GET | /api/companies/:slug | — | Company detail |
| GET | /api/markets/ | — | All market assets |
| GET | /api/markets/ticker | — | Ticker data |
| GET | /api/news/ | — | News articles (paginated) |
| GET | /api/news/:id | — | Single article |
| GET | /api/portfolio/ | JWT | User portfolio |
| GET | /api/portfolio/transactions | JWT | Transaction history |
| GET | /api/admin/stats | JWT+Admin | Platform stats |
| GET | /api/admin/users | JWT+Admin | All users |

---

*© 2024 Musk Capital — Educational Demo Project*
