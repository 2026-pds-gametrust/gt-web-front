import { Link } from 'react-router-dom';
import type { ICategoryShortcut } from '@features/search/model/search-types';

type CategoryShortcutsProps = {
  categories: ICategoryShortcut[];
};

export function CategoryShortcuts({ categories }: CategoryShortcutsProps) {
  if (categories.length === 0) return null;

  return (
    <nav className="mb-5 animate-fade-up" aria-label="Departamentos">
      <ul className="m-0 flex list-none gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              className="inline-flex min-h-11 items-center rounded border border-border-strong bg-surface px-4 font-semibold whitespace-nowrap transition-[border-color,color,transform] duration-150 hover:-translate-y-px hover:border-accent hover:text-accent"
              to={category.href}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
