import { Link } from 'react-router-dom';

export function TrustStrip() {
  return (
    <section className="trust-strip trust-strip--compact gt-fade-up" aria-labelledby="trust-strip-heading">
      <h2 id="trust-strip-heading">Confiança com evidência</h2>
      <ul className="trust-strip__list">
        <li>
          <strong>Selos pós-processo</strong>
          <span>Só após análise — nunca decoração.</span>
        </li>
        <li>
          <strong>TrustScore + motivos</strong>
          <span>Nível explicável, sem nota isolada.</span>
        </li>
        <li>
          <strong>Patrocinado ≠ verificado</strong>
          <span>Pago não compra selo.</span>
        </li>
      </ul>
      <p className="trust-strip__link">
        <Link to="/em-breve/como-funciona">Como funciona a verificação</Link>
      </p>
    </section>
  );
}
