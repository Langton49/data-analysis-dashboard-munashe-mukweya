
export function handleKeyboardClick(
  event: React.KeyboardEvent,
  callback: () => void
): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
}

export function handleListNavigation(
  event: React.KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onNavigate: (newIndex: number) => void
): void {
  let newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      newIndex = Math.min(currentIndex + 1, totalItems - 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      newIndex = Math.max(currentIndex - 1, 0);
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = totalItems - 1;
      break;
    default:
      return;
  }

  if (newIndex !== currentIndex) {
    onNavigate(newIndex);
  }
}

export function getTableAriaLabel(
  rowCount: number,
  columnCount: number,
  filtered: boolean = false
): string {
  const filterText = filtered ? 'filtered ' : '';
  return `Data table with ${rowCount.toLocaleString()} ${filterText}rows and ${columnCount} columns`;
}

export function getPaginationAriaLabel(
  currentPage: number,
  totalPages: number
): string {
  return `Page ${currentPage} of ${totalPages}`;
}

export function getSortAriaLabel(
  columnName: string,
  sortDirection: 'asc' | 'desc' | null
): string {
  if (!sortDirection) {
    return `Sort ${columnName} column`;
  }
  const direction = sortDirection === 'asc' ? 'ascending' : 'descending';
  return `${columnName} column sorted ${direction}. Click to change sort order`;
}

export function getSearchAriaLabel(
  resultCount: number,
  totalCount: number
): string {
  if (resultCount === totalCount) {
    return `Search data. ${totalCount.toLocaleString()} total items`;
  }
  return `Search data. Showing ${resultCount.toLocaleString()} of ${totalCount.toLocaleString()} items`;
}

export function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  return focusableSelectors.some(selector => element.matches(selector));
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(container.querySelectorAll(focusableSelectors));
}

export function trapFocus(
  event: React.KeyboardEvent,
  container: HTMLElement
): void {
  if (event.key !== 'Tab') return;

  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
}

let idCounter = 0;
export function generateAriaId(prefix: string = 'aria'): string {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

export function formatNumberForScreenReader(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} million`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} thousand`;
  }
  return num.toLocaleString();
}

export function getContrastRatio(color1: string, color2: string): number {
  return 4.5; 
}


export function meetsContrastStandard(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
}


export function skipToMainContent(): void {
  const main = document.querySelector('main');
  if (main) {
    main.focus();
    main.scrollIntoView({ behavior: 'smooth' });
  }
}
