import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button, buttonClassName } from '@shared/ui/button/button';
import { PageHero } from '@shared/ui/page-hero/page-hero';
import { FeedbackBanner } from '@shared/ui/feedback-banner/feedback-banner';
import { Skeleton } from '@shared/ui/skeleton/skeleton';
import { catalogApi } from '@features/catalog/api/catalog-api';
import type { ICategory } from '@entities/category/model';
import type { IServiceTaxonomy } from '@entities/service/model';
import type { IProduct } from '@entities/product/model';

type Tab = 'categories' | 'services' | 'products';

const TABS: { id: Tab; label: string }[] = [
  { id: 'categories', label: 'Categorias' },
  { id: 'services', label: 'Serviços' },
  { id: 'products', label: 'Produtos' },
];

/** Slug and id share the same value: both must be unique and the backend answers 409. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseSynonyms(raw: string): string[] {
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function CatalogAdminPage() {
  const [tab, setTab] = useState<Tab>('categories');
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [services, setServices] = useState<IServiceTaxonomy[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // taxonomy form (categories and services share the same shape)
  const [name, setName] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // product form
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cats, svcs, prods] = await Promise.all([
        catalogApi.listCategories(),
        catalogApi.listServices(),
        catalogApi.listProducts(),
      ]);
      setCategories(cats);
      setServices(svcs);
      setProducts(prods);
    } catch {
      setError('Não foi possível carregar o catálogo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForms() {
    setName('');
    setSynonyms('');
    setEditingId(null);
    setBrand('');
    setModel('');
  }

  async function run(action: () => Promise<unknown>, successMessage: string) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load();
      resetForms();
      setMessage(successMessage);
    } catch (actionError) {
      // 409 is the common one here: slug, name or synonym already taken.
      setError(
        actionError instanceof Error && actionError.message
          ? actionError.message
          : 'A operação falhou. Verifique se o nome ou o slug já existe.',
      );
    } finally {
      setBusy(false);
    }
  }

  function saveTaxonomy() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Informe um nome.');
      return;
    }
    const list = parseSynonyms(synonyms);

    if (editingId) {
      const patch = { name: trimmed, synonyms: list };
      void run(
        () =>
          tab === 'categories'
            ? catalogApi.updateCategory(editingId, patch)
            : catalogApi.updateService(editingId, patch),
        'Atualizado.',
      );
      return;
    }

    const slug = `${slugify(trimmed)}-${Date.now()}`;
    const input = { id: slug, slug, name: trimmed, synonyms: list };
    void run(
      () =>
        tab === 'categories'
          ? catalogApi.createCategory(input)
          : catalogApi.createService(input),
      'Criado.',
    );
  }

  function saveProduct() {
    const trimmedBrand = brand.trim();
    const trimmedModel = model.trim();
    if (!trimmedBrand || !trimmedModel) {
      setError('Informe marca e modelo.');
      return;
    }
    if (editingId) {
      void run(
        () =>
          catalogApi.updateProduct(editingId, {
            brand: trimmedBrand,
            model: trimmedModel,
          }),
        'Produto atualizado.',
      );
      return;
    }
    if (!categoryId) {
      setError('Escolha uma categoria.');
      return;
    }
    const slug = `${slugify(`${trimmedBrand}-${trimmedModel}`)}-${Date.now()}`;
    void run(
      () =>
        catalogApi.createProduct({
          id: slug,
          slug,
          categoryId,
          brand: trimmedBrand,
          model: trimmedModel,
        }),
      'Produto criado.',
    );
  }

  const taxonomyRows = tab === 'categories' ? categories : services;

  return (
    <AppShell>
      <PageHero titleId="catalog-admin-heading" title="Catálogo">
        <p className="lead">
          Categorias, serviços e produtos. Produto ≠ oferta: aqui é o modelo, não o anúncio.
        </p>
      </PageHero>

      <div className="mb-4 flex flex-wrap items-center gap-3" role="group" aria-label="Seções do catálogo">
        {TABS.map((item) => (
          <Button
            key={item.id}
            variant={tab === item.id ? 'primary' : 'ghost'}
            onClick={() => {
              setTab(item.id);
              resetForms();
              setMessage(null);
              setError(null);
            }}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {error ? (
        <FeedbackBanner variant="error" title="Não foi possível concluir" message={error} />
      ) : null}
      {message ? (
        <FeedbackBanner variant="success" title="Salvo" message={message} />
      ) : null}
      {loading ? <Skeleton label="Carregando catálogo…" /> : null}

      {!loading && tab !== 'products' ? (
        <>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2>{editingId ? 'Editar' : 'Criar'}</h2>
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="tax-name">Nome</label>
              <input id="tax-name" className="min-h-11 rounded border border-border-strong bg-surface px-3 py-2 focus-ring" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="tax-synonyms">Sinônimos (separados por vírgula)</label>
              <input
                id="tax-synonyms"
                className="min-h-11 rounded border border-border-strong bg-surface px-3 py-2 focus-ring"
                value={synonyms}
                onChange={(e) => setSynonyms(e.target.value)}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {editingId ? (
                <Button variant="ghost" onClick={resetForms}>
                  Cancelar
                </Button>
              ) : null}
              <Button disabled={busy} onClick={saveTaxonomy}>
                {editingId ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>

          <ul className="m-0 pl-[1.1rem] [&_li]:mb-1" aria-label={tab === 'categories' ? 'Categorias' : 'Serviços'}>
            {taxonomyRows.map((row) => (
              <li key={row.id}>
                <strong>{row.name}</strong> · {row.slug} · {row.status}
                <button
                  type="button"
                  className={buttonClassName({ variant: 'ghost' })}
                  onClick={() => {
                    setEditingId(row.id);
                    setName(row.name);
                    setSynonyms((row.synonyms ?? []).join(', '));
                  }}
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {!loading && tab === 'products' ? (
        <>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2>{editingId ? 'Editar produto' : 'Criar produto'}</h2>
            {!editingId ? (
              <div className="mb-4 flex flex-col gap-2">
                <label htmlFor="prod-category">Categoria</label>
                <select
                  id="prod-category"
                  className="min-h-11 rounded border border-border-strong bg-surface px-3 py-2 focus-ring"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Selecione…</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="prod-brand">Marca</label>
              <input id="prod-brand" className="min-h-11 rounded border border-border-strong bg-surface px-3 py-2 focus-ring" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="prod-model">Modelo</label>
              <input id="prod-model" className="min-h-11 rounded border border-border-strong bg-surface px-3 py-2 focus-ring" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {editingId ? (
                <Button variant="ghost" onClick={resetForms}>
                  Cancelar
                </Button>
              ) : null}
              <Button disabled={busy} onClick={saveProduct}>
                {editingId ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>

          <ul className="m-0 pl-[1.1rem] [&_li]:mb-1" aria-label="Produtos">
            {products.map((product) => (
              <li key={product.id}>
                <strong>
                  {product.brand} {product.model}
                </strong>{' '}
                · {product.slug} · {product.status}
                <button
                  type="button"
                  className={buttonClassName({ variant: 'ghost' })}
                  onClick={() => {
                    setEditingId(product.id);
                    setBrand(product.brand);
                    setModel(product.model);
                  }}
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </AppShell>
  );
}
