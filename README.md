# FinFlow — Personal Finance Dashboard Web App

A clean, minimal, responsive personal finance dashboard built with pure HTML5, CSS3, and modern Vanilla JavaScript (no external runtime, node, or build setup required).

---

## 🌟 Key Features

### 1. Income & Expense Management
- **Intuitive Entry Form**: Record income or expenses with a single click.
- **Categorization**: 
  - **Expenses**: Food & Dining, Travel & Transport, Bills & Utilities, Shopping, Entertainment, Health & Medical, Education, Other Expense.
  - **Income**: Salary, Freelance & Contract, Investments & Dividends, Business, Gifts & Allowance, Other Income.
- **Form Validation**: Clean inline validation for amounts (>0), titles, dates, and categories.
- **Payment Notes**: Optional tag or note for payment method (e.g., Credit Card, UPI, Bank Transfer).

### 2. Financial Summary & Metrics
- **Total Balance**: Live net balance (Inflows minus Outflows) with clear deficit/positive indicators.
- **Total Income**: Cash inflow count and formatted sum.
- **Total Expenses**: Cash outflow count and formatted sum.
- **Savings Rate & Budget Health**: Dynamic ratio meter visualizing expense-to-income burn rate.

### 3. Interactive Transactions Feed
- **Search & Filter**: Real-time filtering by description, category, or notes.
- **Type Toggle**: Quickly view "All", "Income", or "Expenses".
- **Category Filter Dropdown**: Drill down into specific expense or income categories.
- **Flexible Sorting**: Sort by Newest First, Oldest First, Highest Amount, or Lowest Amount.
- **Safe Deletion & Undo**: Delete entries with a 4-second "Undo" toast.
- **Empty States**: Helpful prompt to add entries or restore demo data.

### 4. Visual Expense Breakdown
- **Pure SVG Donut Chart**: Lightweight, offline-ready donut chart showing expense distributions.
- **Category Meter Bars**: Top 5 expense categories with percentage badges and visual meters.

### 5. Extra Utilities
- **Multi-Currency Switcher**: Supports `$` (USD), `₹` (INR), `€` (EUR), `£` (GBP), `¥` (JPY), `A$` (AUD), `C$` (CAD).
- **Dark & Light Modes**: System preference auto-detection + persistent toggle switch.
- **CSV Export**: Export your complete transaction history to a CSV file.
- **Local Persistence**: All records persist in your browser's `localStorage`.
- **Preloaded Demo Data**: Includes realistic starter transactions that can be restored or wiped at any time.

---

## 🚀 How to Run the App

Because FinFlow is 100% self-contained, no installation or command-line servers are needed:

1. **Direct Double-Click**:
   - Double-click `index.html` in your file explorer to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

2. **Via Any Local Server** (Optional):
   - If you have VS Code, use the "Live Server" extension.
   - Or with Python: `python -m http.server 8000` and open `http://localhost:8000`.

---

## 📁 Project Structure

```text
├── index.html       # Clean semantic layout (Summary cards, Input Form, Breakdown, Transactions)
├── style.css        # Responsive CSS grid, dark/light theme variables, micro-animations
├── app.js           # State management, local storage, calculations, SVG chart, filters
└── README.md        # Documentation and feature guide
```
