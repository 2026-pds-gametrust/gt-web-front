import { Link } from 'react-router-dom';
import type { ICategoryShortcut } from '@features/search/model/search-types';

type CategoryShortcutsProps = {
  categories: ICategoryShortcut[];
};

export function CategoryShortcuts({ categories }: CategoryShortcutsProps) {
  if (categories.length === 0) return null;

  return (
    <nav className="category-shortcuts" aria-label="Departamentos">
      <ul className="category-shortcuts__list">
        {categories.map((category) => (
          <li key={category.id}>
            <Link className="category-shortcuts__chip" to={category.href}>
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
