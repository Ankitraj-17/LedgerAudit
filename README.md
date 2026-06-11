# LedgerAudit // Financial Forensic Dashboard

**LedgerAudit** is a certified financial Audit dashboard built to investigate, track, and audit high-risk ledger transactions. It provides a secure, intuitive, and highly responsive Single Page Application (SPA) designed for financial analysts and auditors to seamlessly sort risks, track money movement, and assign investigatory tasks.

---

##  Live Demo
**[Live Application Link] https://ledger-audit.vercel.app/

---

## 🛠 Tech Stack

- **Frontend:** React 19 (via Vite)
- **Routing:** React Router DOM v7 (HashRouter implementation for seamless Vercel deployment)
- **Styling:** Tailwind CSS v4 + Modular CSS Variables
- **Icons:** Lucide React
- **State Management:** Custom React Hooks (`useAppState.js`)
- **Code Quality:** ESLint

---

## ✨ Features

- **Dashboard Overview:** Real-time metrics on audited values, anomaly rates, and transaction streams.
- **Transaction History:** Filterable, sortable ledger of all financial activities with full undo/redo logging.
- **Flagged Queue:** A dedicated workspace for reviewing and investigating suspicious activities.
- **Risk Sorter:** Algorithmic identification of high-risk transactions based on volume and velocity.
- **Money Movement:** Visual pathing for tracing funds across multiple nodes and accounts.
- **Task Assignor:** Delegation dashboard for assigning specific transactions to specialized forensic auditors.

---

## 📸 Screenshots

*(To complete this section for your assignment, take screenshots of your website and drag them below!)*

### 1. Dashboard Overview
*(Add screenshot here)*

### 2. Transaction Ledger
*(Add screenshot here)*

### 3. Forensic Money Movement
*(Add screenshot here)*

---

## 💻 Setup Instructions

Follow these instructions to run the project locally. Any developer can get this running in less than 2 minutes.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Git

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ankitraj-17/LedgerAudit.git
   cd LedgerAudit
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **View the application:**
   Open your browser and navigate to the local server URL (typically `http://localhost:5173`).

### Building for Production
To create an optimized production build:
```bash
npm run build
```
The bundled files will be generated in the `dist` folder.

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
