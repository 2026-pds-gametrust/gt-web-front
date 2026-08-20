import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui/button/button';
import { StatusScene } from '@shared/ui/status-scene/status-scene';

type ServerErrorLocationState = {
  from?: string;
};

export function ServerErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as ServerErrorLocationState | null)?.from ?? '/';

  return (
    <StatusScene
      full
      variant="down"
      code="500"
      meme="CONNECTION TIMED OUT"
      title="O servidor deu um frame drop"
      message="Sem conexão estável com o GamerTrust agora. Nada foi publicado nem marcado como verificado neste meio-tempo. Tente de novo quando a rede voltar."
      actions={
        <Button type="button" onClick={() => navigate(from, { replace: true })}>
          Tentar de novo
        </Button>
      }
    />
  );
}
