import { pluralize } from '@/shared/lib';

export function formatServings(servings: number): string {
  return `${servings} ${pluralize(servings, ['порция', 'порции', 'порций'])}`;
}
