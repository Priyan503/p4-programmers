# Fintech Decision Engine

A full-stack, AI-powered financial decision engine designed to help businesses manage cash flow, prioritize obligations, and simulate financial scenarios smartly.

This monorepo contains both the **FastAPI Backend** and the **Next.js Frontend**.

---

##  Features

- **Smart Data Ingestion**: Upload bank CSVs or receipt images — OCR extracts and auto-categorizes everything.
- **Live Financial Dashboard**: See your real-time balance, runway days, and month-by-month cash flow chart.
- **Decision Engine**: AI scores every obligation by urgency, penalty, and relationship to determine who to pay first.
- **What-If Simulator**: Safely simulate payment delays without changing any real data. See the impact instantly.
- **Email Generator**: Auto-draft professional payment-delay emails in formal or friendly tones.
- **Reports & Insights**: Filter transactions by date, category, and type to understand spending patterns.

---

##  Tech Stack

**Frontend:**
- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/) + react-chartjs-2
- Axios for API requests

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/) (Python)
- SQLite database (via SQLAlchemy ORM)
- Tesseract OCR (via `pytesseract`)
- Pandas for CSV ingestion
- Passlib + Bcrypt + JWT (Authentication)

---

##  Getting Started

### 1. Start the Backend API

Make sure you have Python 3.9+ installed.

```bash
cd fintech-backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with demo data (run this once)
python -m app.seed

# Start the FastAPI development server
uvicorn app.main:app --reload --port 8000
```
*The backend API will run at http://localhost:8000. Interactive swagger docs are available at `http://localhost:8000/docs`.*

### 2. Start the Frontend UI

Open a new terminal window.

```bash
cd fintech-frontend

# Install node dependencies
npm install

# Start the Next.js development server
npm run dev
```
*The frontend application will securely run at http://localhost:3000.*

---

##  Demo Login

Use these credentials to log in and test the application with the seeded mock data:
- **Email:** `demo@fintech.com`
- **Password:** `password123`

---

##  Repository Structure

```
.
├── fintech-backend/              # Python FastAPI server
│   ├── app/                      # Application code (routes, services, models)
│   ├── main.py                   # FastAPI entry point
│   ├── seed.py                   # Generates mock transactions/obligations
│   └── requirements.txt          # Python dependencies
│
└── fintech-frontend/             # Next.js UI Application
    ├── app/                      # Next.js app router pages
    ├── components/               # Reusable React components
    ├── lib/                      # API Axios setup & Auth context
    └── ...                       # Standard Next.js config files
```
