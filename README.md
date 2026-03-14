# 🧪 Quiz Ciencia - Science Quiz Application

[![CI/CD](https://github.com/albertdev-coder/lol-quizz/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/albertdev-coder/lol-quizz/actions/workflows/ci-cd.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-0ea5e9)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

An interactive science quiz web application to test knowledge in astronomy, biology, physics, and chemistry. Built with modern technologies for a fast, accessible, and professional user experience.

## 🌟 Features

- 🧪 **100 Science Questions**: Topics include astronomy, biology, physics, and chemistry
- 🎯 **Three Difficulty Levels**: Niño, Joven, Adulto + Mixto mode
- 💡 **Detailed Explanations**: Every answer includes an explanation
- 📱 **Fully Responsive**: Works on mobile, tablet, and desktop
- 🌙 **Dark Mode**: Automatic theme switching
- ⚡ **Fast Performance**: Built with Next.js Server Components
- 🔒 **Input Validation**: All API inputs validated with Zod
- ☁️ **Cloud Database**: PostgreSQL hosted on Neon

## 🛠️ Tech Stack

| Category       | Technology              |
| -------------- | ----------------------- |
| **Framework**  | Next.js 16 (App Router) |
| **Language**   | TypeScript              |
| **Database**   | PostgreSQL (Neon)       |
| **ORM**        | Drizzle ORM             |
| **UI**         | React 19, Radix UI      |
| **Styling**    | Tailwind CSS 4          |
| **Animations** | Framer Motion           |
| **Validation** | Zod                     |
| **Deployment** | Railway                 |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lol-quizz.git
cd lol-quizz

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push database schema
pnpm db:push

# Run development server
pnpm dev
```

## 🔧 Available Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start development server |
| `pnpm build`     | Build for production     |
| `pnpm start`     | Start production server  |
| `pnpm lint`      | Run ESLint               |
| `pnpm db:push`   | Push schema to database  |
| `pnpm db:studio` | Open Drizzle Studio      |

## 📁 Project Structure

```
lol-quizz/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   │   ├── health/
│   │   │   ├── questions/
│   │   │   └── results/
│   │   ├── quiz/         # Quiz page
│   │   └── page.tsx      # Home page
│   ├── components/       # React components
│   │   └── quiz/         # Quiz-specific components
│   ├── lib/              # Utility functions
│   │   ├── db.ts         # Database operations
│   │   ├── db-singleton.ts
│   │   └── validation/   # Zod schemas
│   ├── db/               # Database schema (Drizzle)
│   └── types/            # TypeScript types
├── .github/              # GitHub Actions workflows
│   └── workflows/
│       └── ci-cd.yml
├── public/               # Static assets
├── drizzle.config.ts     # Drizzle configuration
└── package.json
```

## 🔌 API Endpoints

| Endpoint                  | Method | Description                 |
| ------------------------- | ------ | --------------------------- |
| `/api/questions`          | GET    | Get quiz questions          |
| `/api/questions/[id]`     | GET    | Get single question         |
| `/api/questions/validate` | GET    | Validate question integrity |
| `/api/results`            | GET    | Get quiz results            |
| `/api/results`            | POST   | Save quiz result            |
| `/api/metadata`           | GET    | Get app metadata            |
| `/api/health`             | GET    | Health check                |

### Example: Get Questions

```bash
GET /api/questions?level=niño&count=10
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "q-001",
      "text": "¿Cuál es el planeta más grande?",
      "choices": ["Marte", "Júpiter", "Saturno", "Tierra"],
      "correctIndex": 1,
      "explanation": "Júpiter es el planeta más grande..."
    }
  ]
}
```

## 🌍 Environment Variables

| Variable       | Description                  |
| -------------- | ---------------------------- |
| `DATABASE_URL` | PostgreSQL connection string |

## ⚙️ CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

1. **Lint & Type Check** - ESLint + TypeScript validation
2. **Build** - Production build verification
3. **Deploy** - Automatic deployment to Railway (on main branch)

## 📝 Question System

### Difficulty Levels

- **Niño**: Basic questions with simple language
- **Joven**: Intermediate questions requiring reasoning
- **Adulto**: Advanced questions with complex concepts
- **Mixto**: Random combination of all levels

### Question Schema

```typescript
interface Question {
  id: string; // e.g., "q-001"
  text: string; // Question text
  choices: string[]; // 4 options
  correctIndex: number; // 0-3
  level: 'niño' | 'joven' | 'adulto';
  explanation: string; // Detailed explanation
}
```

## 🧪 Testing

```bash
# Run linter
pnpm lint

# Type check
npx tsc --noEmit

# Build
pnpm build
```

## 🚀 Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is MIT licensed.

## 👤 Author

Albert - Full Stack Developer

---

Built with ❤️ for learning science in a fun way
