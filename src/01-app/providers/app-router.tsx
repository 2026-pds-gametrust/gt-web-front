import { Route, Routes } from 'react-router-dom';
import { HomePage } from '@pages/home/home-page';
import { SearchPage } from '@pages/search/search-page';
import { ProductPage } from '@pages/product/product-page';
import { ListingPage } from '@pages/listing/listing-page';
import { SellPage } from '@pages/sell/sell-page';
import { ListingEvidencePage } from '@pages/listing-evidence/listing-evidence-page';
import { ReviseListingPage } from '@pages/revise-listing/revise-listing-page';
import { MyListingsPage } from '@pages/my-listings/my-listings-page';
import { FavoritesPage } from '@pages/favorites/favorites-page';
import { ProfilePage } from '@pages/profile/profile-page';
import { ModerationPage } from '@pages/moderation/moderation-page';
import { CatalogAdminPage } from '@pages/admin/catalog-admin-page';
import { UsersAdminPage } from '@pages/admin/users-admin-page';
import { EmBrevePage } from '@pages/em-breve/em-breve-page';
import { LoginPage } from '@pages/auth/login-page';
import { RegisterPage } from '@pages/auth/register-page';
import { RegisterSuccessPage } from '@pages/auth/register-success-page';
import { NotFoundPage } from '@pages/error/not-found-page';
import { ServerErrorPage } from '@pages/error/server-error-page';
import { RequireAuth } from '@app/providers/require-auth';

export function AppRouter() {
  return (
    <Routes>
      {/* Discovery is public: Lucas browses and searches without an account. */}
      <Route path="/" element={<HomePage />} />
      <Route path="/buscar" element={<SearchPage />} />
      <Route path="/produto/:productId" element={<ProductPage />} />
      <Route path="/anuncio/:listingId" element={<ListingPage />} />
      <Route path="/em-breve/:section" element={<EmBrevePage />} />
      <Route path="/entrar" element={<LoginPage />} />
      <Route path="/criar-conta" element={<RegisterPage />} />
      <Route path="/criar-conta/sucesso" element={<RegisterSuccessPage />} />

      <Route
        path="/vender"
        element={
          <RequireAuth>
            <SellPage />
          </RequireAuth>
        }
      />
      <Route
        path="/meus-anuncios/:listingId/evidencias"
        element={
          <RequireAuth>
            <ListingEvidencePage />
          </RequireAuth>
        }
      />
      <Route
        path="/meus-anuncios/:listingId/corrigir"
        element={
          <RequireAuth>
            <ReviseListingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/meus-anuncios"
        element={
          <RequireAuth>
            <MyListingsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/favoritos"
        element={
          <RequireAuth>
            <FavoritesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/perfil"
        element={
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/catalogo"
        element={
          <RequireAuth requireOperator>
            <CatalogAdminPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/usuarios"
        element={
          <RequireAuth requireOperator>
            <UsersAdminPage />
          </RequireAuth>
        }
      />
      <Route
        path="/moderacao"
        element={
          <RequireAuth requireOperator>
            <ModerationPage />
          </RequireAuth>
        }
      />
      <Route path="/erro" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
