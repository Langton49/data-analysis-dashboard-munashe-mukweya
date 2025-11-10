import { useSkipLink } from '@/hooks/useAccessibility';

export function SkipLink() {
  const { skipToContent } = useSkipLink();

  return (
    <a
      href="#main-content"
      className="skip-link"
      onClick={(e) => {
        e.preventDefault();
        skipToContent();
      }}
    >
      Skip to main content
    </a>
  );
}
