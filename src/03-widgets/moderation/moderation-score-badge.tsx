type ModerationScoreBadgeProps = {
  score: number | undefined;
  compact?: boolean;
};

function scoreTone(score: number): 'low' | 'mid' | 'high' {
  if (score <= 40) return 'low';
  if (score <= 70) return 'mid';
  return 'high';
}

export function ModerationScoreBadge({ score, compact = false }: ModerationScoreBadgeProps) {
  if (score === undefined) {
    return (
      <span className={`moderation-score moderation-score--none${compact ? ' moderation-score--compact' : ''}`}>
        {compact ? '—' : 'Sem score IA'}
      </span>
    );
  }

  const tone = scoreTone(score);

  return (
    <span
      className={`moderation-score moderation-score--${tone}${compact ? ' moderation-score--compact' : ''}`}
      title="Score de validação IA (0–100)"
    >
      {compact ? `${score}` : `Score IA ${score}`}
    </span>
  );
}
