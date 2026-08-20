import { Link } from 'react-router-dom';
import { StatusScene } from '@shared/ui/status-scene/status-scene';

export function NotFoundPage() {
  return (
    <StatusScene
      className="status-scene--full"
      variant="lost"
      code="404"
      meme="NO SIGNAL"
      title="Essa página saiu do inventário"
      message="O endereço não existe, foi digitado errado ou a oferta saiu do ar. Nada aqui é anúncio verificado — volte e busque a unidade real."
      actions={
        <Link className="gt-button" to="/">
          Voltar ao início
        </Link>
      }
    />
  );
}
