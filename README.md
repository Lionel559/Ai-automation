# AIFLOW 🚀

AIFlow is a modern AI-powered SaaS platform built for small business owners to automate daily business tasks using AI.

It helps businesses generate:

* Social media captions
* Customer replies
* Professional invoices
* FAQ responses
* Product descriptions

with a clean and professional dashboard experience.

---

# ✨ Features

## 🔐 Authentication

* Email & Password Authentication
* Google Authentication
* Forgot Password / Reset Password
* Protected Dashboard Routes
* JWT + NextAuth Authentication

---

## 🤖 AI Tools

### AI Caption Generator

Generate social media captions for:

* Instagram
* WhatsApp
* Facebook
* LinkedIn

Features:

* Tone selection
* Platform selection
* Copy & regenerate options

---

### Customer Reply Assistant

Generate smart customer responses instantly.

Features:

* Professional reply generation
* Tone selection
* WhatsApp-style responses
* Copy button

---

### Invoice Generator

Create professional invoices and receipts.

Features:

* Multiple products/services
* Currency selection
* Payment methods
* Logo upload
* Watermark logo support
* PNG invoice export
* Dynamic invoice number generation

---

### AI FAQ Assistant

Generate customer FAQ responses using AI.

Features:

* Business context input
* Smart AI answers
* FAQ preview panel
* Copy & regenerate actions

---

### Product Description Generator

Generate ecommerce product descriptions.

Features:

* Platform targeting
* SEO keywords
* Tone customization
* Product categories
* Marketing-focused copy

---

# 📊 Dashboard Features

* Responsive SaaS dashboard
* Notification system
* User settings page
* Generation history
* Daily usage limit system
* Modern UI/UX

---

# 🛠 Tech Stack

## Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* Lucide React

## Backend

* Next.js App Router APIs
* MongoDB Atlas
* Mongoose

## Authentication

* NextAuth
* JWT
* Google OAuth

## AI

* Google Gemini API

---

# 📂 Project Structure

```bash
app/
 ├── api/
 ├── dashboard/
 ├── login/
 ├── register/
 ├── forgot-password/
 ├── reset-password/

components/
lib/
models/
hooks/
public/
```

---

# ⚙️ Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=

JWT_SECRET=

NEXTAUTH_SECRET=

NEXTAUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GEMINI_API_KEY=
```

---

# 🚀 Getting Started

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

# 🔒 Daily Usage Limit

Free users get:

```text
10 AI generations per day
```

---

# 📦 Deployment

Deploy easily using:

* Vercel
* MongoDB Atlas

---

# 📱 Responsive Design

AIFLOW is fully responsive across:

* Mobile
* Tablet
* Desktop

---

# 🎯 Future Improvements

* Stripe subscriptions
* Team accounts
* AI workflow automation builder
* Export history
* Email integrations
* WhatsApp integrations
* Analytics dashboard

---

# 👨‍💻 Author

Built by Amao Elijah

---

# 📄 License

MIT License
