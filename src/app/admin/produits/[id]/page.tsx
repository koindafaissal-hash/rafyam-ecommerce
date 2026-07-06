import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: true, variants: true } }),
    prisma.category.findMany(), prisma.brand.findMany(),
  ]);
  if (!product) notFound();
  return (
    <div>
      <h1 className="font-display text-3xl">Éditer : {product.name}</h1>
      <div className="mt-8">
        <ProductForm product={product} categories={categories} brands={brands} />
      </div>
    </div>
  );
}