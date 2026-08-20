import { useCallback, useEffect, useState } from 'react';
import { AppShell } from '@widgets/app-shell/app-shell';
import { Button } from '@shared/ui/button/button';
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
      <section className="page-hero" aria-labelledby="catalog-admin-heading">
        <h1 id="catalog-admin-heading">Catálogo</h1>
        <p className="lead">
          Categorias, serviços e produtos. Produto ≠ oferta: aqui é o modelo, não o anúncio.
        </p>
      </section>

      <div className="toolbar" role="group" aria-label="Seções do catálogo">
        {TABS.map((item) => (
          <Button
            key={item.id}
            className={tab === item.id ? '' : 'gt-button--ghost'}
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

      {error ? <p role="alert">{error}</p> : null}
      {message ? <p className="offer-card__meta">{message}</p> : null}
      {loading ? <p>Carregando…</p> : null}

      {!loading && tab !== 'products' ? (
        <>
          <div className="wizard-panel">
            <h2>{editingId ? 'Editar' : 'Criar'}</h2>
            <div className="form-field">
              <label htmlFor="tax-name">Nome</label>
              <input id="tax-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="tax-synonyms">Sinônimos (separados por vírgula)</label>
              <input
                id="tax-synonyms"
                value={synonyms}
                onChange={(e) => setSynonyms(e.target.value)}
              />
            </div>
            <div className="wizard-actions">
              {editingId ? (
                <Button className="gt-button--ghost" onClick={resetForms}>
                  Cancelar
                </Button>
              ) : null}
              <Button disabled={busy} onClick={saveTaxonomy}>
                {editingId ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>

          <ul className="bullet-list" aria-label={tab === 'categories' ? 'Categorias' : 'Serviços'}>
            {taxonomyRows.map((row) => (
              <li key={row.id}>
                <strong>{row.name}</strong> · {row.slug} · {row.status}
                <button
                  type="button"
                  className="gt-button gt-button--ghost"
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
          <div className="wizard-panel">
            <h2>{editingId ? 'Editar produto' : 'Criar produto'}</h2>
            {!editingId ? (
              <div className="form-field">
                <label htmlFor="prod-category">Categoria</label>
                <select
                  id="prod-category"
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
            <div className="form-field">
              <label htmlFor="prod-brand">Marca</label>
              <input id="prod-brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="prod-model">Modelo</label>
              <input id="prod-model" value={model} onChange={(e) => setModel(e.target.value)} />
            </div>
            <div className="wizard-actions">
              {editingId ? (
                <Button className="gt-button--ghost" onClick={resetForms}>
                  Cancelar
                </Button>
              ) : null}
              <Button disabled={busy} onClick={saveProduct}>
                {editingId ? 'Salvar' : 'Criar'}
              </Button>
            </div>
          </div>

          <ul className="bullet-list" aria-label="Produtos">
            {products.map((product) => (
              <li key={product.id}>
                <strong>
                  {product.brand} {product.model}
                </strong>{' '}
                · {product.slug} · {product.status}
                <button
                  type="button"
                  className="gt-button gt-button--ghost"
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
