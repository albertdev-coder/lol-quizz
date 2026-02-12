interface CategoryIconProps {
  iconId: string;
  className?: string;
}

export function CategoryIcon({ iconId, className = 'h-8 w-8' }: CategoryIconProps) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <use href={`/sprite.svg#${iconId}`} />
    </svg>
  );
}
