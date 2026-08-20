import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import { installScreenshotMocks } from './screenshot-catalog/mocks';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, '../artifacts/screenshots/2026-08-20');
const PHOTO = path.join(here, 'fixtures/listing-photo.jpg');
const VIDEO = path.join(here, 'fixtures/listing-video.mp4');
const VALID_CPF = '11144477735';
const LISTING_TITLE = 'ASUS Dual RTX 4060 8GB — com selo';

test.describe.configure({ mode: 'serial' });

test('catálogo visual de todas as telas e fluxos', async ({ page }) => {
  test.setTimeout(180_000);
  test.skip(!process.env.CAPTURE_SCREENSHOTS, 'Rode com CAPTURE_SCREENSHOTS=1');

  fs.mkdirSync(OUT, { recursive: true });
  await installScreenshotMocks(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  page.setDefaultTimeout(15_000);
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('gametrust.session'));

  const shot = async (name: string, fullPage = true) => {
    await page.waitForTimeout(280);
    await page.screenshot({
      path: path.join(OUT, `${name}.png`),
      fullPage,
      animations: 'disabled',
    });
  };

  const gotoReady = async (url: string, heading?: string | RegExp) => {
    await page.goto(url);
    if (heading) {
      await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible();
    }
  };

  async function signIn(email: string, password = 'senha-correta') {
    await page.evaluate(() => localStorage.removeItem('gametrust.session'));
    await page.goto('/entrar');
    await page.getByLabel('E-mail').fill(email);
    await page.getByLabel('Senha').fill(password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).not.toHaveURL(/\/entrar/);
  }

  // —— Público: descoberta (Lucas / Beatriz)
  await gotoReady('/', /Tecnologia usada/);
  await expect(page.getByText('Ofertas com verificação concluída')).toBeVisible();
  await shot('01-home');

  const heroSearch = page.locator('.search-bar--hero input[type="search"]');
  await heroSearch.fill('rtx');
  await expect(page.getByRole('listbox')).toBeVisible();
  await shot('02-home-sugestoes-busca');

  await page.locator('.search-bar--hero').getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('heading', { name: 'Buscar' })).toBeVisible();
  await expect(page.getByText(LISTING_TITLE)).toBeVisible();
  await shot('03-buscar-ofertas');

  await page.getByRole('button', { name: 'Agrupado por produto' }).click();
  await expect(page.getByText('Dual GeForce RTX 4060 8GB')).toBeVisible();
  await shot('04-buscar-agrupado-produto');

  await gotoReady('/buscar?q=rtx&selo=verificado', 'Ofertas verificadas');
  await shot('05-buscar-verificadas');

  await gotoReady('/buscar?q=zzzz-inexistente', 'Buscar');
  await expect(page.getByText(/Nenhum resultado/)).toBeVisible();
  await shot('06-buscar-vazio');

  await gotoReady('/produto/prod-rtx-4060', 'Dual GeForce RTX 4060 8GB');
  await shot('07-produto');

  await gotoReady('/anuncio/lst-4060-verified', LISTING_TITLE);
  await expect(page.getByText('Posse verificada').first()).toBeVisible();
  await shot('08-anuncio-com-selo');

  await page.getByRole('button', { name: 'Posse verificada' }).first().click();
  await expect(page.getByText(/Evidências compatíveis com posse/)).toBeVisible();
  await shot('09-anuncio-selo-expandido');

  await gotoReady('/anuncio/lst-4070-plain', /MSI Ventus RTX 4070/);
  await shot('10-anuncio-sem-selo');

  await gotoReady('/em-breve/categorias', 'Categorias');
  await shot('11-em-breve-categorias');
  await page.goto('/compras');
  await expect(page).toHaveURL(/\/entrar/);
  await shot('12-compras-guard-redirect');
  await gotoReady('/em-breve/notificacoes', 'Notificações');
  await shot('13-em-breve-notificacoes');

  await gotoReady('/pagina-que-nao-existe');
  await expect(page.getByText('Essa página saiu do inventário')).toBeVisible();
  await shot('14-erro-404');

  await gotoReady('/erro');
  await expect(page.getByText('O servidor deu um frame drop')).toBeVisible();
  await shot('15-erro-500');

  await page.goto('/favoritos');
  await expect(page).toHaveURL(/\/entrar/);
  await shot('16-guard-redirect-login');

  await gotoReady('/entrar', 'Entrar');
  await shot('17-login');

  await page.getByLabel('E-mail').click();
  await page.getByLabel('E-mail').blur();
  await page.getByLabel('Senha').click();
  await page.getByLabel('Senha').blur();
  await shot('18-login-validacao');

  await page.getByLabel('E-mail').fill('carlos@example.com');
  await page.getByLabel('Senha').fill('errada');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText('E-mail ou senha inválidos')).toBeVisible();
  await shot('19-login-credencial-invalida');

  await gotoReady('/criar-conta', 'Criar conta');
  await shot('20-criar-conta');

  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page.getByText('Informe seu nome completo.')).toBeVisible();
  await shot('21-criar-conta-validacao');

  await page.getByLabel('Nome completo').fill('Lucas Mendes');
  await page.getByLabel('E-mail').fill('lucas.prints@example.com');
  await page.getByLabel('Telefone').fill('11987654321');
  await page.getByLabel('CPF').fill(VALID_CPF);
  await page.getByLabel('Data de nascimento').fill('1998-03-14');
  await page.getByLabel('Senha').fill('uma-senha-forte');
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page.getByRole('heading', { name: /Conta criada/ })).toBeVisible();
  await shot('22-criar-conta-sucesso');

  // —— Membro (Carlos): vender, mensagens, perfil
  await signIn('carlos@example.com');
  await gotoReady('/', /Tecnologia usada/);
  await shot('23-home-autenticado');

  await page.getByRole('button', { name: /Olá/ }).click();
  await expect(page.getByRole('menu', { name: 'Conta' })).toBeVisible();
  await shot('24-menu-conta-membro', false);

  await gotoReady('/perfil', 'Perfil');
  await expect(page.getByLabel('Nome de exibição')).toBeVisible();
  await shot('25-perfil');

  await gotoReady('/favoritos', 'Favoritos');
  await expect(page.getByText(LISTING_TITLE)).toBeVisible();
  await shot('26-favoritos');

  await gotoReady('/meus-anuncios', 'Meus anúncios');
  await expect(page.getByText('RTX 4060 para corrigir')).toBeVisible();
  await shot('27-meus-anuncios');

  await gotoReady('/meus-anuncios/lst-mine-review/evidencias', 'Código de posse');
  await expect(page.getByText('GT-7K3M')).toBeVisible();
  await shot('28-codigo-posse');

  await gotoReady('/meus-anuncios/lst-mine-revise/corrigir', 'Corrigir anúncio');
  await expect(page.getByRole('heading', { name: 'Fotos e vídeo' })).toBeVisible();
  await shot('29-corrigir-anuncio');

  await page.goto('/vender');
  await expect(page.getByRole('heading', { name: 'Identificar o produto' })).toBeVisible();
  await expect.poll(() => page.locator('#sell-product option').count()).toBeGreaterThan(1);
  await shot('30-vender-identificar');

  await page.locator('#sell-product').selectOption('prod-rtx-4060');
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Descrever a unidade' })).toBeVisible();
  await page.locator('#sell-defects').fill('risco cosmético na tampa');
  await page.locator('#sell-accessories').fill('caixa e cabo');
  await shot('31-vender-descrever');

  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Fotos e vídeo' })).toBeVisible();
  await expect(page.getByText('GT-7K3M')).toBeVisible();
  await shot('32-vender-midia-vazia');

  const photoBuffer = fs.readFileSync(PHOTO);
  await page.locator('input[accept*="image"]').setInputFiles([
    { name: 'frente.jpg', mimeType: 'image/jpeg', buffer: photoBuffer },
    { name: 'lado.jpg', mimeType: 'image/jpeg', buffer: photoBuffer },
    { name: 'serial.jpg', mimeType: 'image/jpeg', buffer: photoBuffer },
  ]);
  await expect(page.getByText(/3 fotos na ordem do carrossel/)).toBeVisible({ timeout: 20_000 });
  await page.locator('input[accept*="video"]').setInputFiles({
    name: 'unidade.mp4',
    mimeType: 'video/mp4',
    buffer: fs.readFileSync(VIDEO),
  });
  await expect(page.getByRole('button', { name: 'Trocar vídeo' })).toBeVisible({ timeout: 20_000 });
  await page.getByRole('checkbox', { name: 'Retirada em mãos' }).check();
  await shot('33-vender-midia-preenchida');

  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Definir preço' })).toBeVisible();
  await page.locator('#sell-price').fill('1649');
  await shot('34-vender-preco');

  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Checklist de evidências' })).toBeVisible();
  const checks = page.locator('.checkbox-list input[type="checkbox"]');
  const total = await checks.count();
  for (let i = 0; i < total; i += 1) {
    await checks.nth(i).check();
  }
  await shot('35-vender-evidencias');

  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Revisar e enviar' })).toBeVisible();
  await shot('36-vender-revisao');

  await page.getByRole('button', { name: 'Enviar para revisão' }).click();
  await expect(page.getByText('Anúncio enviado para revisão')).toBeVisible();
  await shot('37-vender-enviado');

  await gotoReady('/mensagens', 'Mensagens');
  await expect(page.getByText(LISTING_TITLE)).toBeVisible();
  await shot('38-mensagens-inbox');

  await gotoReady('/mensagens/conv-1');
  await expect(page.locator('.chat-bubble__body').filter({ hasText: 'A placa liga e tem nota?' })).toBeVisible();
  await shot('39-conversa');

  await gotoReady('/anuncio/lst-4060-verified', LISTING_TITLE);
  await expect(page.getByRole('button', { name: 'Enviar mensagem' })).toBeVisible();
  await shot('40-anuncio-cta-chat');
  await page.getByRole('button', { name: 'Enviar mensagem' }).click();
  await expect(page).toHaveURL(/\/mensagens\/conv-1/);
  await shot('41-fluxo-anuncio-para-chat');

  await page.goto('/moderacao');
  await expect(page.getByRole('heading', { name: 'Sem permissão' })).toBeVisible();
  await shot('42-sem-permissao-operacao');

  // —— Operação (Camila)
  await signIn('camila@example.com');
  await gotoReady('/', /Tecnologia usada/);
  await page.getByRole('button', { name: /Olá/ }).click();
  await expect(page.getByRole('menuitem', { name: 'Moderação' })).toBeVisible();
  await shot('43-menu-conta-operadora', false);

  await gotoReady('/moderacao', 'Moderação');
  await expect(page.getByRole('heading', { name: 'Fila' })).toBeVisible();
  await page.getByRole('complementary', { name: 'Fila de casos' }).getByRole('button').first().click();
  await expect(page.getByRole('heading', { name: LISTING_TITLE }).first()).toBeVisible();
  await shot('44-moderacao');

  await gotoReady('/admin/catalogo', 'Catálogo');
  await shot('45-admin-catalogo-categorias');
  await page.getByRole('group', { name: 'Seções do catálogo' }).getByRole('button', { name: 'Serviços' }).click();
  await shot('46-admin-catalogo-servicos');
  await page.getByRole('group', { name: 'Seções do catálogo' }).getByRole('button', { name: 'Produtos' }).click();
  await shot('47-admin-catalogo-produtos');

  await gotoReady('/admin/usuarios', 'Usuários');
  await expect(page.getByText('Carlos Silva')).toBeVisible();
  await shot('48-admin-usuarios');
});
