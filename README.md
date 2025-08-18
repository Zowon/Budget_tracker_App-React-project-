# Budget Tracker App

A modern budget tracking application built with React, Redux Toolkit, and Recharts for data visualization.

## Features

- **User Authentication**: Sign up, login, and forgot password functionality
- **Expense Management**: Add, edit, and delete expenses with date tracking
- **Budget Tracking**: Monthly budget limits with over-budget indicators
- **Reports & Analytics**: Visual charts showing spending trends over time
- **Data Persistence**: All data stored locally using redux-persist
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React 18 + Vite
- **State Management**: Redux Toolkit + redux-persist
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Styling**: Plain CSS with CSS Variables
- **Date Handling**: date-fns
- **Utilities**: nanoid for unique IDs

## Project Structure

```
src/
├── app/                    # Redux store configuration
│   └── store.js           # Store setup with redux-persist
├── features/              # Redux slices
│   ├── auth/             # Authentication state
│   ├── expenses/         # Expenses management
│   └── ui/               # UI state (dates, toasts, etc.)
├── pages/                # Page components
│   ├── Signup.js         # User registration
│   ├── Login.js          # User login
│   ├── ForgotPassword.js # Password reset
│   ├── Expenses.js       # Main expenses page
│   └── Reports.js        # Analytics and charts
├── components/           # Reusable components
│   ├── forms/           # Form components
│   ├── inputs/          # Input components
│   ├── modals/          # Modal components
│   ├── charts/          # Chart components
│   └── layout/          # Layout components
├── routes/              # Routing configuration
│   ├── AppRoutes.js     # Main routing setup
│   └── ProtectedRoute.js # Route protection
├── styles/              # Global styles
│   └── globals.css      # CSS variables and reset
├── utils/               # Utility functions
│   ├── crypto.js        # Password hashing
│   └── date.js          # Date formatting
└── App.js               # Main app component
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd budget_tracker_app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features Implementation

### Authentication
- Mock authentication with hashed passwords using Web Crypto API
- User data stored in Redux with localStorage persistence
- Protected routes for authenticated users

### Expense Management
- Add expenses with date, name, and amount
- Edit and delete existing expenses
- Filter expenses by month
- Search functionality for expense names

### Budget Tracking
- Monthly budget limits per user
- Visual indicators when spending exceeds budget
- Real-time calculations and updates

### Reports & Analytics
- Trend charts for 1, 6, and 12-month periods
- Budget limit overlay on charts
- Monthly spending comparisons

## State Management

The app uses Redux Toolkit with the following slices:

- **auth**: User authentication state
- **expenses**: Expense data and CRUD operations
- **ui**: UI state (selected dates, report ranges, toasts)

## CSS Architecture

- Global CSS variables for consistent theming
- Each page has its own CSS file for specific styling
- Responsive design with mobile-first approach
- Utility classes for common styling patterns

## Security

- Passwords are hashed using SHA-256 before storage
- No plaintext passwords stored in localStorage
- Protected routes prevent unauthorized access

## Browser Support

- Modern browsers with ES6+ support
- Web Crypto API for password hashing
- LocalStorage for data persistence

## Development Decisions

1. **No TypeScript**: Using JavaScript for simplicity and faster development
2. **Plain CSS**: Avoiding Tailwind for more control and smaller bundle size
3. **Redux Persist**: Local storage for data persistence without backend
4. **Mock Authentication**: Simulated auth flow for demonstration
5. **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox

## Future Enhancements

- Export functionality for expense data
- Category-based expense tracking
- Budget alerts and notifications
- Dark mode theme
- Offline support with Service Workers
- Data backup and sync capabilities
