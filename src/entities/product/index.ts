export type { ProductId } from './lib/catalog';
export {
  activeProducts,
  frequentProducts,
  matchesQuery,
  photoUrl,
  productById,
  products,
  searchProducts,
} from './lib/catalog';
export type { CustomDraft } from './lib/custom-draft';
export { draftFromCustomProduct, draftToCustomProduct, emptyCustomDraft } from './lib/custom-draft';
export type { CustomProductInput } from './lib/custom-product';
export {
  buildCustomProduct,
  createCustomProduct,
  listCustomProducts,
  loadCustomProduct,
  nextCustomProduct,
  removeCustomProduct,
  saveCustomProduct,
  toProduct,
} from './lib/custom-product';
export type { Product } from './lib/types';
export { useCustomProducts } from './lib/use-custom-products';
export { default as CustomProductFields } from './ui/CustomProductFields.vue';
