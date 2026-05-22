# Sarisaritech

A modern full-stack application built with React and Python, featuring a responsive frontend with real-time data visualization and a robust backend API.

## 📋 Project Structure

- **Frontend**: React 19 application with Tailwind CSS, built with Create React App
- **Backend**: Python Flask/FastAPI application with modern API architecture
- **Build**: Production-ready build artifacts

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS** - Utility-first styling
- **React Router v7** - Client-side routing
- **Chart.js & Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Python** - Backend runtime
- **Dependencies**: See `backend/requirements.txt`

## 📦 Getting Started

### Prerequisites
- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server (opens http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

## 🚀 Available Scripts

### Frontend

- `npm start` - Run development server with hot reload
- `npm build` - Create optimized production build
- `npm test` - Launch test runner in watch mode
- `npm eject` - Eject from Create React App (one-way operation)

## 📁 Directory Layout

```
sarisaritech/
├── src/                    # Frontend React components
│   ├── component/         # Reusable UI components
│   ├── pages/            # Page components
│   ├── layouts/          # Layout components
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── styles/           # CSS/styling
│   └── App.jsx           # Main app component
├── backend/               # Backend Python application
│   ├── app/              # Application modules
│   ├── data/             # Data files
│   ├── scripts/          # Utility scripts
│   ├── main.py           # Entry point
│   ├── requirements.txt   # Python dependencies
│   └── .env.example      # Environment variables template
├── public/               # Static files
├── package.json          # Frontend dependencies
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🔧 Configuration

- **Tailwind CSS**: Configured in `tailwind.config.js`
- **PostCSS**: Configured in `postcss.config.js`
- **Code Formatting**: Prettier configured in `.prettierrc`
- **Environment Variables**: Copy `.env.example` to `.env` and configure as needed

## 🧪 Testing

Run frontend tests in watch mode:
```bash
npm test
```

## 📝 License

This project is private. All rights reserved.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/YourFeature`)
2. Commit your changes (`git commit -m 'Add YourFeature'`)
3. Push to the branch (`git push origin feature/YourFeature`)
4. Open a Pull Request

## 📚 Learn More

- [React Documentation](https://reactjs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
