import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CategoryConfig } from '@/constants/quiz-categories';
import { CategoryIcon } from './CategoryIcon';

interface CategoryCardProps {
  category: CategoryConfig;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article>
      <Link
        href={`/quiz?category=${category.id}`}
        className="group flex h-full flex-col rounded-3xl border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        aria-label={`Entrar a la categoría ${category.title}`}
      >
        <div
          className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.accentClass} text-white shadow-md transition-transform duration-200 group-hover:scale-105`}
        >
          <CategoryIcon iconId={category.iconId} className="h-7 w-7" />
        </div>

        <h3 className="text-2xl font-semibold text-slate-900">{category.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{category.description}</p>

        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-800">
          Explorar niveles
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </Link>
    </article>
  );
}
