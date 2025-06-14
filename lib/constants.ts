export const CATEGORIES = [
  'Appetizers',
  'Soups',
  'Salads',
  'Main Course',
  'Breads',
  'Rice & Noodles',
  'Desserts',
  'Beverages',
  'Sides',
  'Specials'
] as const;

export type CategoryType = typeof CATEGORIES[number]; 