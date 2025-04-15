# Progress Tracker Frontend

A modern web application built with React and Vite for tracking personal or professional progress.

## Features

- User Authentication (Login/Register)
- Activity Tracking
- Progress History
- User Profile Management
- Responsive Design with Tailwind CSS
- Modern UI with Framer Motion animations

## Tech Stack

- React 18
- Vite
- JavaScript
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios for API calls
- React Hook Form with Yup validation
- React Toastify for notifications

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/devrajoshi/ProgressTracker-Backend
```

2. Navigate to the project directory:
```bash
cd progress-tracker-frontend
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory and add:
```env
VITE_API_URL=http://localhost:5000
```

## Development

To start the development server:

```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

## Project Structure

```
src/
├── components/     # React components
├── utils/         # Utility functions and helpers
├── assets/        # Static assets
└── App.jsx        # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

