import { NavigationItem } from './navigation-types';

/**
 * Converts a flat array of NavigationItems into a nested tree structure.
 * Uses parent_id to build the relationships.
 */
export function buildNavigationTree(items: NavigationItem[]): NavigationItem[] {
  const itemMap = new Map<string, NavigationItem>();
  const rootItems: NavigationItem[] = [];

  // Initialize map and ensure children arrays exist
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Build the tree
  items.forEach((item) => {
    const mapItem = itemMap.get(item.id);
    if (!mapItem) return;

    if (item.parent_id) {
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        parent.children?.push(mapItem);
      } else {
        // Parent not found, could handle this by pushing to root or ignoring
        // For now, we'll push it to root so it's not lost if admin made a mistake
        rootItems.push(mapItem);
      }
    } else {
      // Top-level item
      rootItems.push(mapItem);
    }
  });

  return rootItems;
}
