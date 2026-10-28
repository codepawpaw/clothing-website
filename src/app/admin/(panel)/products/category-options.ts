import { buildCategoryTree } from "@/lib/catalog";
import type { Category } from "@/lib/types";

/** Categories in menu order, labelled "Parent › Child" for select inputs. */
export function categoryOptions(categories: Category[]) {
  return buildCategoryTree(categories).flatMap((c) => [
    { id: c.id, label: c.name },
    ...c.children.map((child) => ({ id: child.id, label: `${c.name} › ${child.name}` })),
  ]);
}
