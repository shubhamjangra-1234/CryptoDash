# CryptoDash - Cryptocurrency Dashboard

A modern, responsive cryptocurrency dashboard built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Real-time Data**: Live cryptocurrency prices and market data
- **Responsive Design**: Mobile-first approach with sidebar navigation
- **Dark Mode**: Toggle between light and dark themes
- **Modern UI**: Built with Shadcn UI components
- **Performance**: Optimized with React Query and lazy loading

## 🛠️ Tech Stack

- **Frontend**: React 18 with hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Edit .env with your API keys
```


```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── modules/           # Feature modules
│   ├── services/           # API services
│   └── styles/            # Global styles
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
└── package.json          # Dependencies and scripts
```

## 🚀 Deployment

### Build Process
```bash
# Build for production
npm run build

# Output in ./dist folder
# Ready for static hosting
```

### Environment Setup
1. **Development**: Use `.env` with your API key
2. **Production**: Use production API keys

### Hosting Options
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **GitHub Pages**: Free hosting for repos

### Quick Deploy Commands
```bash
# Deploy to Vercel
npm run deploy:vercel

# Deploy to Netlify
npm run deploy:netlify
```

## 🔒 Security

- **Environment Variables**: API keys stored in `.env` file only
- **Git Protection**: `.env` excluded from version control
- **API Security**: Uses secure CoinGecko API endpoints

## 🐛 Troubleshooting

### Common Issues
1. **API Key Errors**: 
   - Get free API key 
   - Add to `.env` file
   - Never commit API keys

2. **Build Failures**: Clear node_modules and reinstall

---

**Built with ❤️ using modern web technologies**
