import type { CustomProductInput } from './custom-product';
import type { CustomProduct } from '@/shared/db';
import { FALLBACK_CATEGORY, isCategoryId, isUnit } from '@/shared/lib';

export interface CustomDraft {
  name: string;
  category: string;
  unit: string;
  note: string;
}

export function emptyCustomDraft(): CustomDraft {
  return { name: '', category: FALLBACK_CATEGORY, unit: '', note: '' };
}

export function draftFromCustomProduct(product: CustomProduct): CustomDraft {
  return {
    name: product.name,
    category: product.category,
    unit: product.unit ?? '',
    note: product.note ?? '',
  };
}

export function draftToCustomProduct(draft: CustomDraft): CustomProductInput | null {
  const name = draft.name.trim();
  const note = draft.note.trim();

  if (!name || !isCategoryId(draft.category)) {
    return null;
  }

  return {
    name,
    category: draft.category,
    unit: isUnit(draft.unit) ? draft.unit : undefined,
    note: note || undefined,
  };
}
