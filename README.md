# LedgerAudit // Financial Audit Dashboard

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

### 1. Dashboard Overview
<img width="1470" height="956" alt="Screenshot 2026-06-14 at 8 57 15 PM" src="https://github.com/user-attachments/assets/ccffdebc-85f2-4801-ae96-b6186553a042" />


### 2. Transaction Ledger
<img width="1470" height="956" alt="Screenshot 2026-06-14 at 8 58 32 PM" src="https://github.com/user-attachments/assets/a379687f-e379-40a1-926c-c336defed593" />


<img width="1470" height="956" alt="Screenshot 2026-06-14 at 8 59 14 PM" src="https://github.com/user-attachments/assets/2c4e1d0d-83d4-4978-bb0c-7f5e9106fcab" />

<img width="1470" height="956" alt="Screenshot 2026-06-14 at 8 59 39 PM" src="https://github.com/user-attachments/assets/3decd6e0-c785-4a4b-914d-4e15e60342bf" />

<img width="1470" height="956" alt="Screenshot 2026-06-14 at 9 00 10 PM" src="https://github.com/user-attachments/assets/decb5eee-8ba6-44d2-95a9-019cac3e65c9" />

### 3.Flagged Transaction Queue
<img width="1470" height="956" alt="Screenshot 2026-06-14 at 9 03 00 PM" src="https://github.com/user-attachments/assets/cd68e005-30ef-4403-88f9-14a593c2da51" />


### 4.Risk Deviation Sorter
<img width="1470" height="956" alt="Screenshot 2026-06-14 at 9 03 29 PM" src="https://github.com/user-attachments/assets/b834eb12-4aad-438a-867c-15b96460ad9d" />


### 5.Compliance Task Assignor

<img width="1470" height="956" alt="Screenshot 2026-06-14 at 9 04 04 PM" src="https://github.com/user-attachments/assets/2da5828f-00d5-4402-8cbf-69f1164424ba" />### 6. Audit Money Movement

### 6.Network map
<img width="1470" height="956" alt="Screenshot 2026-06-14 at 9 05 09 PM" src="https://github.com/user-attachments/assets/49e26b8e-d11f-44fd-b1c2-f8589d0e10f2" />


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

*Designed and developed for financial Audit. Strict adherence to React best practices.*
