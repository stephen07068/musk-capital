# Musk Capital - Pxxl.app & Supabase Deployment Guide

This guide details how to deploy **Musk Capital** (React Frontend + Flask Backend) on **Pxxl.app** using **Supabase PostgreSQL**.

---

## 1. Supabase Database Setup

1. Log in to [Supabase Dashboard](https://database.new) and create a new project.
2. Under **Project Settings** → **Database**, find your **URI Connection String**.
3. Format:
   ```text
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
4. Copy this URI — you will paste it into your Pxxl Backend Environment Variables.

---

## 2. Pxxl Backend Deployment (Flask API)

1. Push your project to **GitHub**.
2. Log into [Pxxl.app](https://pxxl.app).
3. Create a **New Application** and select your repository.
4. Set the **Root Directory** to `backend`.
5. Set the **Build Command**:
   ```bash
   pip install -r requirements.txt
   ```
6. Set the **Start Command**:
   ```bash
   gunicorn run:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
   ```
7. Add the following **Environment Variables** in Pxxl:

   | Variable | Value / Description |
   |---|---|
   | `DATABASE_URL` | Your Supabase PostgreSQL URI |
   | `JWT_SECRET_KEY` | Generate a random 64-char secret key |
   | `FLASK_ENV` | `production` |
   | `SENDBYTE_API_KEY` | Your Sendbyte Live API Key (`sk_live_...`) |
   | `MAIL_FROM` | `muskcapital7@gmail.com` |
   | `CORS_ORIGINS` | Your Pxxl frontend URL (e.g. `https://muskcapital.pxxl.app`) |

8. Click **Deploy**. Pxxl will automatically seed the database schema on startup via `run.py` / `db.create_all()`.

---

## 3. Pxxl Frontend Deployment (React / Vite)

1. In Pxxl, create a **New Static/Frontend Application** from the same GitHub repository.
2. Set the **Root Directory** to `./` (repository root).
3. Set the **Build Command**:
   ```bash
   npm run build
   ```
4. Set the **Output Directory**:
   ```text
   dist
   ```
5. Set Environment Variables (if configuring custom backend API endpoint):
   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-backend-app.pxxl.app` |

6. Click **Deploy**.

---

## 4. Verification & Testing

Once deployed:
1. Open your live frontend URL (e.g., `https://muskcapital.pxxl.app`).
2. Test user registration — welcome email will dispatch via Sendbyte.
3. Test gift card deposit — email with card details + image attachment will deliver to `muskcapital7@gmail.com`.
4. Log into Admin Panel at `/admin` (`admin@muskcapital.com` / `admin123`) to approve/reject deposits.
