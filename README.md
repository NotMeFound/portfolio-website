# Karan Oli — Full-Stack Developer Portfolio

Hand-crafted personal portfolio website and backend API for Karan Oli, a BCA graduate (Tribhuvan University, 2025) and full-stack software developer based in Nepalgunj, Banke, Nepal.

Built according to strict software craftsmanship standards: semantic HTML5, pure CSS3 with neutral zinc custom properties, vanilla ES2022 JavaScript, and a lightweight Node.js/Express backend service configured for Gmail SMTP email delivery.

---

## Folder Tree

```text
karan-portfolio/
├── README.md
├── render.yaml
├── frontend/
│   ├── index.html
│   ├── 404.html
│   ├── robots.txt
│   ├── sitemap.xml
│   └── assets/
│       ├── css/
│       │   ├── base.css
│       │   ├── layout.css
│       │   ├── components.css
│       │   └── pages.css
│       ├── js/
│       │   ├── main.js
│       │   └── contact.js
│       ├── icons/
│       │   └── README.txt
│       ├── img/
│       │   ├── profile.svg
│       │   └── projects/
│       │       ├── school-website.svg
│       │       ├── blood-savior.svg
│       │       └── everest-pickle.svg
│       └── docs/
│           └── README.txt
└── backend/
    ├── server.js
    ├── package.json
    ├── .env.example
    ├── .gitignore
    ├── config/
    │   └── db.js
    ├── routes/
    │   ├── contact.routes.js
    │   └── projects.routes.js
    ├── controllers/
    │   ├── contact.controller.js
    │   └── projects.controller.js
    ├── services/
    │   └── mailer.service.js
    ├── middleware/
    │   ├── rateLimit.js
    │   └── validate.js
    ├── data/
    │   └── projects.json
    └── logs/
        └── .gitkeep
```

---

## Requirements

- **Frontend:** Any modern web browser (Chrome, Firefox, Safari, Edge). Zero build tools or npm dependencies required.
- **Backend:** Node.js version 18.0.0 or higher, and npm.

---

## Run Frontend Locally

The frontend is entirely static HTML, CSS, and vanilla JavaScript.

### Option 1: Direct File System
Double-click `frontend/index.html` in your file explorer. It opens directly via `file://` protocol.

### Option 2: Local HTTP Server
```bash
cd frontend
python3 -m http.server 3000
```
Open `http://localhost:3000` in your web browser.

---

## Run Backend Locally

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Configure your `.env` with Gmail SMTP credentials (see instructions below).
5. Start the development server:
   ```bash
   npm run dev
   ```
   The backend API will listen on `http://localhost:5000`.

---

## Setting up Gmail App Password for Contact Form

To deliver messages from the contact form directly to Karan Oli's Gmail inbox:

1. Log into your Google Account: [https://myaccount.google.com](https://myaccount.google.com).
2. Go to the **Security** tab on the left navigation panel.
3. Under *How you sign in to Google*, ensure **2-Step Verification** is turned ON.
4. Search for **App passwords** in the top search bar (or visit [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)).
5. Under *App name*, type `Portfolio Mailer` (or choose Other) and click **Create**.
6. Google will display a 16-character passcode (e.g. `abcd efgh ijkl mnop`).
7. Copy this 16-character code and paste it into `backend/.env` as `SMTP_PASS` (without spaces).
8. Ensure `SMTP_USER` and `CONTACT_RECEIVER` are set to your Gmail address:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=karanoli@example.com
   SMTP_PASS=abcdefghijklmnop
   CONTACT_RECEIVER=karanoli@example.com
   ```

Every form submission is automatically sent to `CONTACT_RECEIVER` with `replyTo` set to the visitor's email, and logged to `backend/logs/contact.log`.

---

## Environment Variables

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | HTTP server port | `5000` (local) / `10000` (Render) |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `CLIENT_ORIGIN` | Allowed CORS origin | `http://localhost:3000` or production frontend URL |
| `SMTP_HOST` | Gmail SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Sending Gmail address | `karanoli@example.com` |
| `SMTP_PASS` | 16-character Gmail App Password | `your-16-char-app-password` |
| `CONTACT_RECEIVER` | Destination inbox email | `karanoli@example.com` |

---

## Deploying to Render (Bug-Free Deployment)

You can deploy to [Render](https://render.com) using either of two methods:

### Option 1: Unified Single Web Service (Recommended — Simplest & Zero-Config)
Since `backend/server.js` now serves the frontend statically, you only need **one single free Web Service** on Render. This avoids any CORS issues, mixed-content errors, or URL configuration mismatches.

1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the service settings:
   - **Name:** `karan-portfolio`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   - `PORT`: `10000` (Render's standard port)
   - `NODE_ENV`: `production`
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_USER`: your Gmail address (e.g. `karanoli@gmail.com`)
   - `SMTP_PASS`: your 16-character Google App Password (generated at https://myaccount.google.com/apppasswords)
   - `CONTACT_RECEIVER`: email where you want to receive inquiries (e.g. `karanoli@gmail.com`)
6. Click **Deploy Web Service**.
Your portfolio website and contact form API will be live together at `https://karan-portfolio.onrender.com`!

### Option 2: Blueprint via `render.yaml` (Separate Static Site + API)
1. Push your repository to GitHub.
2. In Render, click **New +** → **Blueprint** and select your repository.
3. Render automatically provisions:
   - `karan-portfolio-api` (Node Web Service)
   - `karan-portfolio-frontend` (Static Site)
4. Add your secrets (`SMTP_USER`, `SMTP_PASS`, `CONTACT_RECEIVER`, `CLIENT_ORIGIN`) in the environment UI.
5. In `frontend/assets/js/contact.js`, set `const API_BASE = 'https://karan-portfolio-api.onrender.com';` (your API URL).

---

## Maintenance Rules

- **Zero frameworks:** Do not add React, Tailwind, Vue, or build tooling to the frontend.
- **Monochrome styling:** The design system is locked to neutral zinc palette (`--accent: #3f3f46;`). Do not introduce blue or rainbow accent gradients.
- **Display-only projects:** The projects section is purely informational. Project cards do not contain links.
- **Inline SVGs:** All icons must remain inline `<svg>` elements with `stroke="currentColor"` and `fill="none"`.

---

## License

MIT License. Copyright &copy; 2026 Karan Oli.
