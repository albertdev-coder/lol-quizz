'use client';

import { motion } from 'framer-motion';
import { CATEGORY_LIST } from '@/constants/quiz-categories';
import { CategoryCard } from './CategoryCard';

export function LandingPage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-10 h-48 w-48 rounded-full bg-violet-300/20 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-56 w-56 rounded-full bg-cyan-200/25 blur-3xl" />
      </div>

      <header className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700"
        >
          Desafía tu mente
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-slate-900 sm:text-5xl"
        >
          Tres categorías, un solo objetivo: superarte.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-base text-slate-600 sm:text-lg"
        >
          Elige Ciencia, Teología o Anime y empieza un reto rápido con niveles progresivos.
        </motion.p>
      </header>

      <section className="mt-12" aria-label="Categorías principales del quiz">
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {CATEGORY_LIST.map((category, index) => (
            <motion.li
              key={category.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.08 }}
            >
              <CategoryCard category={category} />
            </motion.li>
          ))}
        </ul>
      </section>
    </main>
  );
}
