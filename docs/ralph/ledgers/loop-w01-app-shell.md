# loop-w01-app-shell

status: DONE  
orchestrator: TECHNICAL_DESIGN → IN_DEVELOPMENT → APP_EXECUTION → DONE

## goal

Nav canônica (paridade), tokens CSS (KB-DEC-001), layout desktop/mobile.

## personas

Lucas / Beatriz (orientação no shell)

## AC

- [x] Rótulos: Início, Buscar, Categorias, Favoritos, Vender, Compras e vendas, Notificações, Perfil
- [x] Itens fora de escopo → placeholder “em breve”
- [x] Tokens em `06-shared` (cores, espaço, tipografia); sem hardcode em features
- [x] Layout responsivo; alvos ≥44px

## agents

agt-web-architecture, agt-web-react-developer, agt-ui-ux-auditor

## in / out / evidence

- in: system design W00, paridade-visual.md, logo brand
- out: AppShell + tokens (#F84000 / #181818) + logo em `public/brand/`
- evidence: specs `docs/specs/app-shell/`; `yarn dev`
