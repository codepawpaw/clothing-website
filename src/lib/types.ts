export type Category = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string;
  image: string | null;
  order: number;
  createdAt: string;
};

export type ProductColor = { name: string; hex: string };

export type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  salePrice: number | null;
  description: string;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  badge: string | null;
  isNew: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Subscriber = { email: string; createdAt: string };

export type Database = {
  categories: Category[];
  products: Product[];
  subscribers: Subscriber[];
};

export type CategoryNode = Category & { children: Category[] };
