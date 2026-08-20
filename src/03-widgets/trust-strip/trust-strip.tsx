import { Link } from 'react-router-dom';

export function TrustStrip() {
  return (
    <section
      className="mb-6 animate-fade-up rounded border border-ink border-l-4 border-l-accent bg-surface px-5 py-4"
      aria-labelledby="trust-strip-heading"
    >
      <h2
        id="trust-strip-heading"
        className="mt-0 mb-3 font-display text-[1.1rem] font-extrabold tracking-[-0.02em] uppercase italic"
      >
        Confiança com evidência
      </h2>
      <ul className="m-0 grid list-none grid-cols-3 gap-4 p-0 max-split:grid-cols-1">
        <li className="flex flex-col gap-1">
          <strong className="font-display text-base text-accent">Selos pós-processo</strong>
          <span className="text-[0.92rem] text-muted">Só após análise — nunca decoração.</span>
        </li>
        <li className="flex flex-col gap-1">
          <strong className="font-display text-base text-accent">TrustScore + motivos</strong>
          <span className="text-[0.92rem] text-muted">Nível explicável, sem nota isolada.</span>
        </li>
        <li className="flex flex-col gap-1">
          <strong className="font-display text-base text-accent">Patrocinado ≠ verificado</strong>
          <span className="text-[0.92rem] text-muted">Pago não compra selo.</span>
        </li>
      </ul>
      <p className="mt-3 mb-0">
        <Link className="font-semibold text-accent underline" to="/em-breve/como-funciona">
          Como funciona a verificação
        </Link>
      </p>
    </section>
  );
}
