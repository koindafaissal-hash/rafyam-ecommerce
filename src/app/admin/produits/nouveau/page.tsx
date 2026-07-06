import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([prisma.category.findMany(), prisma.brand.findMany()]);
  return (
    <div>
      <h1 className="font-display text-3xl">Nouveau produit</h1>
      <div className="mt-8">
        <ProductForm categories={categories} brands={brands} />
      </div>
    </div>
  );
}