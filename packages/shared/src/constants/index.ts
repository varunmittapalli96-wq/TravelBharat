export const REGIONS = ['NORTH', 'SOUTH', 'EAST', 'WEST', 'CENTRAL', 'NORTHEAST'] as const;
export type Region = typeof REGIONS[number];

export const STATE_TYPES = ['STATE', 'UT'] as const;
export type StateType = typeof STATE_TYPES[number];

export const CATEGORIES = ['HERITAGE', 'NATURE', 'RELIGIOUS', 'ADVENTURE'] as const;
export type CategoryType = typeof CATEGORIES[number];

export const TAGS = ['BEACH', 'HILL_STATION', 'WILDLIFE', 'CULTURAL', 'HIDDEN_GEM'] as const;
export type TagType = typeof TAGS[number];

export const PLACE_STATUSES = ['DRAFT', 'IN_REVIEW', 'VERIFIED'] as const;
export type PlaceStatus = typeof PLACE_STATUSES[number];

export const ADMIN_ROLES = ['ADMIN', 'EDITOR'] as const;
export type AdminRole = typeof ADMIN_ROLES[number];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const REGION_LABELS: Record<Region, string> = {
  NORTH: 'North India',
  SOUTH: 'South India',
  EAST: 'East India',
  WEST: 'West India',
  CENTRAL: 'Central India',
  NORTHEAST: 'Northeast India',
};

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  HERITAGE: 'Heritage & History',
  NATURE: 'Nature & Scenic',
  RELIGIOUS: 'Religious & Spiritual',
  ADVENTURE: 'Adventure & Sport',
};

export const TAG_LABELS: Record<TagType, string> = {
  BEACH: 'Beach',
  HILL_STATION: 'Hill Station',
  WILDLIFE: 'Wildlife',
  CULTURAL: 'Cultural',
  HIDDEN_GEM: 'Hidden Gem',
};
