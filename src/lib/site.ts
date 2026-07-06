export const SITE = {
  name: "RAF'YAM",
  tagline: 'L\'excellence de la chaussure de luxe pour homme',
  description: 'RAF\'YAM — Maison de chaussures de luxe pour homme à Ouagadougou. Richelieus, mocassins, derbies, bottines et sneakers premium, sélectionnés avec passion.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://rafyam.vercel.app',
  phone: process.env.CONTACT_PHONE || '+226 57 95 50 90',
  phoneRaw: '+22657955090',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+22657955090',
  email: process.env.CONTACT_EMAIL || 'contact@rafyam.bf',
  address: process.env.CONTACT_ADDRESS || 'Boutique située derrière le siège de SIDWAYA, Ouagadougou, Burkina Faso',
  city: 'Ouagadougou',
  country: 'Burkina Faso',
  hours: 'Lun – Sam : 9h00 – 19h00  ·  Dim : 10h00 – 17h00',
  social: {
    facebook: 'https://facebook.com/rafyam',
    instagram: 'https://instagram.com/rafyam',
    tiktok: 'https://tiktok.com/@rafyam',
  },
};

export function formatPhoneDisplay(raw: string) {
  // +22657955090 -> +226 57 95 50 90
  if (raw.startsWith('+226') && raw.length === 13) {
    return raw.slice(0, 4) + ' ' + raw.slice(4, 6) + ' ' + raw.slice(6, 8) + ' ' + raw.slice(8, 10) + ' ' + raw.slice(10, 12);
  }
  return raw;
}