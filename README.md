# LedgerAudit // Financial Forensic Dashboard

![LedgerAudit Preview](./src/assets/hero.png)

**LedgerAudit** is a certified financial forensic dashboard built to investigate, track, and audit high-risk ledger transactions. It provides a secure, intuitive, and highly responsive interface designed for financial analysts and auditors to seamlessly sort risks, track money movement, and assign investigatory tasks.

---

## 🚀 Live Demo
**[View Live Application Here](https://ledgeraudit.vercel.app)** *(Note: Update this link once deployed to Vercel/Netlify)*

---

## 🛠 Tech Stack

- **Frontend Framework:** React 19 (via Vite)
- **Routing:** React Router DOM v7 (HashRouter for seamless SPA deployment)
- **Styling:** Tailwind CSS v4 + Vanilla CSS Modules
- **Icons:** Lucide React
- **State Management:** Custom React Hooks Context (`useAppState.js`)
- **Build Tool:** Vite

---

## ✨ Features

- **Dashboard Overview:** Real-time metrics on audited values, anomaly rates, and transaction streams.
- **Transaction History:** Filterable, sortable ledger of all financial activities with full undo/redo logging.
- **Flagged Queue:** A dedicated workspace for reviewing and investigating suspicious activities.
- **Risk Sorter:** Algorithmic identification of high-risk transactions based on volume and velocity.
- **Money Movement:** Visual pathing for tracing funds across multiple nodes and accounts.
- **Task Assignor:** Delegation dashboard for assigning specific transactions to specialized forensic auditors.
- **Secure Architecture:** Built with strict adherence to clean architecture principles (Zero logic in `App.jsx`, dedicated Routing layer).

---

## 📸 Screenshots

*(Replace these with actual links to your screenshots)*
- **Dashboard:** `![Dashboard Screenshot](link)`
- **Transaction History:** `![Transactions Screenshot](link)`
- **Money Movement Trace:** `![Tracing Screenshot](link)`

---

## 💻 Setup Instructions

Follow these instructions to run the project locally. Another developer should be able to get this running in less than 2 minutes.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ankitraj-17/LedgerAudit.git
   cd LedgerAudit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **View the application:**
   Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create an optimized production build:
```bash
npm run build
```
The bundled files will be generated in the `dist` folder, ready to be deployed to Vercel, Netlify, or GitHub Pages.

---

## 🏗 Component Architecture

The application strictly enforces separation of concerns:
- `src/main.jsx`: Application entry point.
- `src/routes/AppRoutes.jsx`: Centralized routing and layout wrappers.
- `src/hooks/useAppState.js`: Consolidated state management and business logic.
- `src/pages/`: Top-level route components.
- `src/components/`: Reusable UI building blocks.

---

*Designed and developed for financial forensics. Strict adherence to React best practices.*
