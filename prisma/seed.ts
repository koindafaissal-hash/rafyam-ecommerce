import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { slug: 'chaussures-de-ville', name: 'Chaussures de ville', description: 'L\'élégance urbaine absolue, pour les rendez-vous qui comptent.', position: 1 },
  { slug: 'mocassins', name: 'Mocassins', description: 'Le confort d\'une pantoufle, l\'allure d\'un costume sur-mesure.', position: 2 },
  { slug: 'derbies', name: 'Derbies', description: 'Le classique indémodable, réinterprété avec passion.', position: 3 },
  { slug: 'richelieus', name: 'Richelieus', description: 'L\'Oxford dans sa plus pure expression, taillé pour les grandes occasions.', position: 4 },
  { slug: 'bottines', name: 'Bottines', description: 'La robustesse au service du style, pour affirmer chaque pas.', position: 5 },
  { slug: 'sneakers-luxe', name: 'Sneakers Luxe', description: 'L\'audace du sportswear habillée en cuir premium.', position: 6 },
  { slug: 'sandales-premium', name: 'Sandales Premium', description: 'La noblesse du cuir au service de l\'été africain.', position: 7 },
];

const brands = [
  { slug: 'rafyam-maison', name: 'RAF\'YAM Maison' },
  { slug: 'santoni', name: 'Santoni' },
  { slug: 'magnanni', name: 'Magnanni' },
  { slug: 'berluti', name: 'Berluti' },
  { slug: 'ferragamo', name: 'Salvatore Ferragamo' },
  { slug: 'gucci', name: 'Gucci' },
];

const sizeStocks: Record<string, number> = { '39': 6, '40': 8, '41': 12, '42': 14, '43': 12, '44': 8, '45': 6, '46': 3 };

function variantSku(base: string, size: string, color: string) {
  return `${base}-${size}-${color.replace(/\s+/g, '').toUpperCase()}`;
}

async function main() {
  console.log('🌱 Seed RAF\'YAM…');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin1234!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@rafyam.bf' },
    update: {},
    create: {
      email: 'admin@rafyam.bf',
      passwordHash: adminPassword,
      firstName: 'Administrateur',
      lastName: 'RAF\'YAM',
      phone: '+22657955090',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  // Customer demo
  const userPassword = await bcrypt.hash('Client1234!', 10);
  await prisma.user.upsert({
    where: { email: 'client@rafyam.bf' },
    update: {},
    create: {
      email: 'client@rafyam.bf',
      passwordHash: userPassword,
      firstName: 'Issouf',
      lastName: 'Compaoré',
      phone: '+22670123456',
      role: 'CUSTOMER',
      emailVerified: true,
    },
  });

  // Categories
  const catMap = new Map<string, string>();
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug }, update: {}, create: c,
    });
    catMap.set(c.slug, cat.id);
  }

  // Brands
  const brandMap = new Map<string, string>();
  for (const b of brands) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug }, update: {}, create: b,
    });
    brandMap.set(b.slug, brand.id);
  }

  // Products
  const products: Array<{
    slug: string; name: string; shortDescription: string; description: string;
    brand: string; category: string; priceXof: number;
    comparePriceXof?: number; isFeatured?: boolean; isNew?: boolean; isBestseller?: boolean;
    images: string[]; colors: string[]; metaTitle?: string; metaDescription?: string;
  }> = [
    {
      slug: 'richelieu-noir-couture', name: 'Richelieu Noir Couture',
      shortDescription: 'L\'Oxford dans sa plus pure expression, cousu Goodyear.',
      description: 'Véritablement pensé comme une pièce d\'horlogerie, ce richelieu noir est entièrement cousu Goodyear sur une semelle cuir. Le cuir de veau pleine fleur, sélectionné en Toscane, révèle une main soyeuse et un grain subtil. La cambrure italienne, signée à la main, accompagne le pied avec une précision chirurgicale. Chaque paire est finie dans nos ateliers par un maître bottier, garantissant une signature irréprochable.',
      brand: 'rafyam-maison', category: 'richelieus', priceXof: 320000, comparePriceXof: 380000,
      isFeatured: true, isBestseller: true,
      images: ['https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Noir'],
      metaTitle: 'Richelieu Noir Couture — RAF\'YAM',
      metaDescription: 'Richelieu cousu Goodyear en cuir de veau toscan, finition main. Édition limitée.',
    },
    {
      slug: 'mocassin-cognac-velluto', name: 'Mocassin Cognac Velluto',
      shortDescription: 'Le mocassin à pampilles, en cuir velours cognac.',
      description: 'Un hommage vibrant au mocassin florentin. Confectionné dans un cuir velours d\'une profondeur chromatique rare, il est monté sur une semelle gomme légère et confortable. La pampille métallique, finition or brossé, signe la pièce avec une délicatesse toute italienne. À porter avec un lin froissé, un chino sable ou un jean brut.',
      brand: 'santoni', category: 'mocassins', priceXof: 245000,
      isFeatured: true, isNew: true,
      images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Cognac', 'Noir'],
    },
    {
      slug: 'derby-chocolat-lisbon', name: 'Derby Chocolat Lisbon',
      shortDescription: 'Le derby cap-toe en cuir chocolat, allure décidée.',
      description: 'Pour celles et ceux qui veulent conjuguer caractère et raffinement. Ce derby à bout cap-toe, en cuir pleine fleur teinté dans la masse, présente un passant artisanal et une finition miroir obtenue après six heures de glaçage manuel. La forme Lisbon, légèrement bombée, flatte toutes les morphologies de pied.',
      brand: 'magnanni', category: 'derbies', priceXof: 210000,
      isFeatured: true,
      images: ['https://images.unsplash.com/photo-1582897085656-c636d006a246?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Chocolat', 'Noir'],
    },
    {
      slug: 'bottine-noire-aventurier', name: 'Bottine Noire Aventurier',
      shortDescription: 'La bottine à lacets, intemporelle et affirmée.',
      description: 'Une pièce qui traverse les saisons sans prendre une ride. Confectionnée en cuir de veau noir à grain fin, montée sur semelle cuir avec trépointes.Goodyear et renforcée par une doublure cuir intégrale. La forme du bout, légèrement carrée, dessine une silhouette contemporaine sans rien céder à l\'élégance.',
      brand: 'berluti', category: 'bottines', priceXof: 285000,
      isFeatured: true, isBestseller: true,
      images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Noir'],
    },
    {
      slug: 'sneaker-luxe-blanc-orsay', name: 'Sneaker Luxe Blanc Orsay',
      shortDescription: 'La sneaker habillée en cuir nappa blanc.',
      description: 'L\'audace du sportswear, l\'élégance du sur-mesure. Cette sneaker se compose d\'un cuir nappa blanc d\'une finesse extrême, contrasté par des empiècements or rose sur le talon et la languette. La semelle en gomme blanche, légère et amortissante, offre un confort de marche exceptionnel.',
      brand: 'gucci', category: 'sneakers-luxe', priceXof: 198000,
      isFeatured: true, isNew: true,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Blanc', 'Ivoire'],
    },
    {
      slug: 'sandale-cuir-ouaga', name: 'Sandale Cuir Ouaga',
      shortDescription: 'Sandale fermée premium en cuir tanné végétal.',
      description: 'Pensée pour le climat sahélien, cette sandale fermée conjugue protection et distinction. Le cuir, tanné aux écorces de mimosa selon un savoir-faire ancestral, se patine magnifiquement avec le temps. La semelle crantée assure une accroche parfaite, même sur les pavés mouillés.',
      brand: 'rafyam-maison', category: 'sandales-premium', priceXof: 95000,
      isNew: true, isBestseller: true,
      images: ['https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Brun', 'Noir'],
    },
    {
      slug: 'mocassin-noir-medina', name: 'Mocassin Noir Médina',
      shortDescription: 'Le mocassin à pampilles en cuir lisse noir.',
      description: 'Un classique absolu, réédité dans une version d\'une pureté extrême. Cuir de veau noir à grain fin, pampille chromée discrète, semelle cuir et gomme surmontée. À porter pieds nus en été ou en ville avec un costume clair.',
      brand: 'ferragamo', category: 'mocassins', priceXof: 225000,
      isFeatured: true,
      images: ['https://images.unsplash.com/photo-1614253429340-98120bd6d753?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Noir'],
    },
    {
      slug: 'derby-marron-oklahoma', name: 'Derby Marron Oklahoma',
      shortDescription: 'Derby brogue en cuir grainé marron.',
      description: 'Le brogue dans sa forme la plus aboutie. Cuir grainé pleine fleur, perforations main, finition cire d\'abeille pour un éclat naturel. La semelle Goodyear garantit longévité et ressemelage, pour une pièce qui vous accompagnera des décennies.',
      brand: 'rafyam-maison', category: 'derbies', priceXof: 178000,
      isNew: true,
      images: ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Marron', 'Cognac'],
    },
    {
      slug: 'richelieu-burgundy-stefano', name: 'Richelieu Bourgogne Stefano',
      shortDescription: 'Le richelieu bordeaux, pièce de caractère.',
      description: 'Un richelieu pensé pour les grandes occasions. Teinté en Bourgogne profond, en cuir de veau patiné main, ce modèle s\'accorde parfaitement aux smokings et costumes sombres. La forme Stefano, italianisante et galbée, est dessinée sur les codes de la grande bottellerie milanaise.',
      brand: 'santoni', category: 'richelieus', priceXof: 295000,
      isFeatured: true,
      images: ['https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Bourgogne'],
    },
    {
      slug: 'sneaker-noir-sahara', name: 'Sneaker Noir Sahara',
      shortDescription: 'Sneaker premium en cuir grainé noir.',
      description: 'Une sneaker minimaliste qui ne fait aucun compromis sur la matière. Cuir grainé noir, doublure cuir intégrale, semelle en gomme cousue. La coupe basse, près du pied, dessine une silhouette élancée.',
      brand: 'gucci', category: 'sneakers-luxe', priceXof: 175000,
      isBestseller: true,
      images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Noir'],
    },
    {
      slug: 'bottine-cognac-toundra', name: 'Bottine Cognac Toundra',
      shortDescription: 'Bottine à lacets en cuir cognac patiné.',
      description: 'Une bottine qui fait le pont entre élégance et aventure. Cuir pleine fleur cognac patiné main, semelle Vibram crantée, doublure cuir. Le col, légèrement matelassé, épouse la cheville avec un confort exceptionnel.',
      brand: 'rafyam-maison', category: 'bottines', priceXof: 232000,
      isNew: true,
      images: ['https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Cognac'],
    },
    {
      slug: 'chaussure-ville-marron-prado', name: 'Chaussure Marron Prado',
      shortDescription: 'Chaussure de ville à boucle, finition main.',
      description: 'Une chaussure de ville à boucle simple, d\'une rare élégance. Confectionnée en cuir de veau pleine fleur, finition main, boucle métallique dorée gravée. La semelle cuir, cousue Blake, garantit finesse et discrétion.',
      brand: 'berluti', category: 'chaussures-de-ville', priceXof: 268000,
      isFeatured: true,
      images: ['https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=1600&q=80&auto=format&fit=crop'],
      colors: ['Marron', 'Noir'],
    },
  ];

  for (const p of products) {
    const created = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        description: p.description,
        brandId: brandMap.get(p.brand),
        categoryId: catMap.get(p.category)!,
        priceCents: p.priceXof * 100,
        comparePriceCents: p.comparePriceXof ? p.comparePriceXof * 100 : null,
        isFeatured: !!p.isFeatured,
        isNew: !!p.isNew,
        isBestseller: !!p.isBestseller,
        sku: 'RFY-' + p.slug.toUpperCase().slice(0, 8),
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
      },
    });

    // Images
    for (let i = 0; i < p.images.length; i++) {
      await prisma.productImage.create({
        data: { productId: created.id, url: p.images[i], alt: p.name, position: i },
      });
    }

    // Variants
    for (const color of p.colors) {
      for (const [size, stock] of Object.entries(sizeStocks)) {
        await prisma.productVariant.create({
          data: {
            productId: created.id,
            size,
            color,
            stock,
            sku: variantSku(created.sku, size, color),
          },
        });
      }
    }
  }

  // Reviews
  const customer = await prisma.user.findUnique({ where: { email: 'client@rafyam.bf' } });
  const allProducts = await prisma.product.findMany();
  if (customer) {
    const reviewData = [
      { rating: 5, title: 'Une pièce d\'exception', comment: 'Qualité irréprochable, finition impeccable. J\'ai rarement vu ça en boutique physique, encore moins en ligne. La livraison à Ouaga a été soignée.' },
      { rating: 5, title: 'Au-delà de mes attentes', comment: 'Le cuir est somptueux, la forme parfaitement italienne. On sent la maison derrière chaque détail.' },
      { rating: 4, title: 'Très belle paire', comment: 'Magnifique, juste un demi-pointure en plus que ce que je pensais. Service client réactif, échange parfait.' },
      { rating: 5, title: 'Le chic absolu', comment: 'Portées à un mariage, elles ont fait sensation. Confortables dès le premier essayage, c\'est dire la qualité de la semelle.' },
      { rating: 5, title: 'Mon coup de cœur', comment: 'J\'ai hésité avec une grande marque italienne, j\'ai bien fait de choisir RAF\'YAM. Service WhatsApp au top.' },
    ];
    for (let i = 0; i < allProducts.length; i++) {
      const prod = allProducts[i];
      const r = reviewData[i % reviewData.length];
      await prisma.review.create({
        data: { productId: prod.id, userId: customer.id, rating: r.rating, title: r.title, comment: r.comment },
      });
      const avg = (await prisma.review.aggregate({
        where: { productId: prod.id }, _avg: { rating: true }, _count: true,
      }));
      await prisma.product.update({
        where: { id: prod.id },
        data: { ratingAvg: avg._avg.rating ?? 0, ratingCount: avg._count },
      });
    }
  }

  // Promo
  await prisma.promoCode.upsert({
    where: { code: 'BIENVENUE10' },
    update: {},
    create: {
      code: 'BIENVENUE10',
      type: 'PERCENT',
      value: 10,
      minSubtotalCents: 50000_00,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      usageLimit: 1000,
    },
  });

  // Blog
  const posts = [
    {
      slug: 'entretien-cuir-luxe', title: 'L\'art d\'entretenir vos chaussures en cuir',
      excerpt: 'Nos conseils de maître bottier pour faire vieillir vos paires avec éclat.',
      content: 'Le cuir est une matière vivante. Pour qu\'il conserve tout son lustre, il convient de le nourrir une à deux fois par mois avec une crème de qualité, puis de le lustrer à la brosse en poils de soie. Pour les cuirs grainés, privilégiez un cirage en pâte, qui pénétrera la matière sans lisser son grain. Pour les cuirs lisses, un cirage liquide apportera la brillance miroir attendue. Enfin, n\'oubliez pas les embauchoirs en cèdre : ils conservent la forme de la chaussure et absorbent l\'humidité.',
      coverImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1600&q=80&auto=format&fit=crop',
    },
    {
      slug: 'guide-tailles-homme', title: 'Guide complet des pointures homme',
      excerpt: 'Trouvez la pointure parfaite, en cinq mesures simples.',
      content: 'La pointure idéale dépend de trois mesures : la longueur du pied, la largeur et la cambrure. Mesurez votre pied en fin de journée, debout, en charge. Ajoutez 5 à 8 millimètres pour le confort. Pour les pieds larges, privilégiez une forme anglaise (largeur G). Pour les pieds fins, une forme italienne (largeur F) sera plus adaptée. Chez RAF\'YAM, nous vous accompagnons par WhatsApp pour valider votre choix avant expédition.',
      coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80&auto=format&fit=crop',
    },
    {
      slug: 'art-couture-goodyear', title: 'Le cousu Goodyear, signature de l\'excellence',
      excerpt: 'Pourquoi ce montage reste l\'étalon-or de la bottellerie.',
      content: 'Le cousu Goodyear, inventé en 1872 par Charles Goodyear Jr., consiste à coudre la tige à la semelle sur deux rangées parallèles, grâce à une trépointe en cuir. Ce montage offre trois avantages inégalés : une étanchéité totale, une possibilité de ressemelage multiple, et un confort qui s\'améliore avec le temps. C\'est la signature des grandes maisons italiennes, et la nôtre.',
      coverImage: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1600&q=80&auto=format&fit=crop',
    },
  ];
  for (const p of posts) {
    await prisma.blogPost.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  console.log('✅ Seed terminé.');
  console.log('   Admin  : admin@rafyam.bf  / Admin1234!');
  console.log('   Client : client@rafyam.bf / Client1234!');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });