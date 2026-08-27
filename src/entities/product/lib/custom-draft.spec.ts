import type { CustomProduct } from '@/shared/db';
import { draftFromCustomProduct, draftToCustomProduct, emptyCustomDraft } from './custom-draft';

function product(overrides: Partial<CustomProduct> = {}): CustomProduct {
  return {
    id: 'custom-foil',
    name: 'фольга',
    category: 'other',
    createdAt: 0,
    updatedAt: 0,
    ...overrides,
  };
}

describe('draftToCustomProduct', () => {
  it('should trim the name and the note', () => {
    const draft = { ...emptyCustomDraft(), name: '  фольга ', note: ' широкая ' };

    expect(draftToCustomProduct(draft)).toEqual({
      name: 'фольга',
      category: 'other',
      unit: undefined,
      note: 'широкая',
    });
  });

  it('should reject an empty name', () => {
    expect(draftToCustomProduct({ ...emptyCustomDraft(), name: '   ' })).toBeNull();
  });

  it('should reject a category outside the vocabulary', () => {
    expect(draftToCustomProduct({ ...emptyCustomDraft(), name: 'фольга', category: 'aisle-7' })).toBeNull();
  });

  it('should drop a unit it does not know instead of failing', () => {
    const draft = { ...emptyCustomDraft(), name: 'фольга', unit: 'метр' };

    expect(draftToCustomProduct(draft)?.unit).toBeUndefined();
  });

  it('should keep a known unit', () => {
    const draft = { ...emptyCustomDraft(), name: 'молоко', unit: 'мл' };

    expect(draftToCustomProduct(draft)?.unit).toBe('мл');
  });
});

describe('draftFromCustomProduct', () => {
  it('should turn absent unit and note into empty fields', () => {
    expect(draftFromCustomProduct(product())).toEqual({
      name: 'фольга',
      category: 'other',
      unit: '',
      note: '',
    });
  });

  it('should round-trip a filled product', () => {
    const filled = product({ name: 'молоко', category: 'dairy', unit: 'мл', note: 'безлактозное' });

    expect(draftToCustomProduct(draftFromCustomProduct(filled))).toEqual({
      name: 'молоко',
      category: 'dairy',
      unit: 'мл',
      note: 'безлактозное',
    });
  });
});
