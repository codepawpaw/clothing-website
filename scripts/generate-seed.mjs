// Generates the demo catalogue (seed/*.json) and placeholder product images (public/placeholder/*.svg).
// Banner photos live in public/images (see public/images/CREDITS.md).
// Run with: npm run generate-seed
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const imgDir = path.join(root, "public", "placeholder");
const seedDir = path.join(root, "seed");
mkdirSync(imgDir, { recursive: true });
mkdirSync(seedDir, { recursive: true });

const TILE = "#f6f6f6";

const SHAPES = {
  polo: (c) => `
    <path d="M300 180 L250 200 L150 260 L190 360 L245 335 L245 640 L555 640 L555 335 L610 360 L650 260 L550 200 L500 180 Q400 230 300 180 Z" fill="${c}" stroke="rgba(0,0,0,.08)" stroke-width="3"/>
    <path d="M300 180 L330 250 L400 215 Z M500 180 L470 250 L400 215 Z" fill="${c}" stroke="rgba(0,0,0,.15)" stroke-width="3"/>
    <path d="M400 215 L400 330" stroke="rgba(0,0,0,.15)" stroke-width="3"/>
    <circle cx="400" cy="260" r="5" fill="rgba(0,0,0,.2)"/><circle cx="400" cy="300" r="5" fill="rgba(0,0,0,.2)"/>
    <rect x="470" y="300" width="34" height="14" rx="7" fill="rgba(0,0,0,.18)"/>`,
  tee: (c) => `
    <path d="M320 180 L250 200 L150 260 L190 360 L245 335 L245 640 L555 640 L555 335 L610 360 L650 260 L550 200 L480 180 Q400 240 320 180 Z" fill="${c}" stroke="rgba(0,0,0,.08)" stroke-width="3"/>
    <path d="M320 180 Q400 240 480 180" fill="none" stroke="rgba(0,0,0,.15)" stroke-width="4"/>
    <rect x="470" y="290" width="34" height="14" rx="7" fill="rgba(0,0,0,.18)"/>`,
  dress: (c) => `
    <path d="M330 150 L300 300 Q330 330 320 360 L240 660 L560 660 L480 360 Q470 330 500 300 L470 150 Q400 195 330 150 Z" fill="${c}" stroke="rgba(0,0,0,.08)" stroke-width="3"/>
    <path d="M320 360 L480 360" stroke="rgba(0,0,0,.12)" stroke-width="3"/>
    <path d="M300 400 L280 650 M340 400 L330 655 M380 400 L375 658 M420 400 L425 658 M460 400 L470 655 M500 400 L520 650" stroke="rgba(0,0,0,.07)" stroke-width="3"/>
    <rect x="430" y="235" width="30" height="12" rx="6" fill="rgba(0,0,0,.18)"/>`,
  jacket: (c) => `
    <path d="M300 170 L240 195 L170 250 L130 600 L200 610 L240 340 L245 640 L555 640 L560 340 L600 610 L670 600 L630 250 L560 195 L500 170 L400 230 Z" fill="${c}" stroke="rgba(0,0,0,.08)" stroke-width="3"/>
    <path d="M300 170 L340 250 L400 230 L460 250 L500 170" fill="${c}" stroke="rgba(0,0,0,.18)" stroke-width="3"/>
    <path d="M400 230 L400 640" stroke="rgba(0,0,0,.2)" stroke-width="4"/>
    <rect x="455" y="300" width="30" height="12" rx="6" fill="rgba(0,0,0,.18)"/>`,
  pants: (c) => `
    <path d="M290 150 L510 150 L545 650 L420 650 L400 330 L380 650 L255 650 Z" fill="${c}" stroke="rgba(0,0,0,.08)" stroke-width="3"/>
    <path d="M290 185 L510 185" stroke="rgba(0,0,0,.15)" stroke-width="3"/>
    <path d="M400 185 L400 330" stroke="rgba(0,0,0,.12)" stroke-width="3"/>`,
  bag: (c) => `
    <path d="M300 340 Q300 170 400 170 Q500 170 500 340" fill="none" stroke="${c}" stroke-width="16"/>
    <path d="M300 340 Q300 170 400 170 Q500 170 500 340" fill="none" stroke="rgba(0,0,0,.1)" stroke-width="16"/>
    <path d="M210 330 L590 330 L620 630 L180 630 Z" fill="${c}" stroke="rgba(0,0,0,.08)" stroke-width="3"/>
    <rect x="380" y="380" width="40" height="16" rx="8" fill="rgba(0,0,0,.18)"/>`,
  sneaker: (c) => `
    <path d="M150 520 Q150 420 250 410 L380 360 Q440 345 480 395 L610 440 Q665 458 665 520 L665 545 L150 545 Z" fill="${c}" stroke="rgba(0,0,0,.1)" stroke-width="3"/>
    <rect x="140" y="540" width="535" height="40" rx="18" fill="#ffffff" stroke="rgba(0,0,0,.12)" stroke-width="3"/>
    <path d="M330 395 L360 450 M370 380 L400 435 M410 372 L440 425" stroke="rgba(0,0,0,.2)" stroke-width="5"/>
    <rect x="520" y="470" width="34" height="14" rx="7" fill="rgba(0,0,0,.18)"/>`,
  cap: (c) => `
    <path d="M220 470 Q220 260 400 260 Q580 260 580 470 Z" fill="${c}" stroke="rgba(0,0,0,.08)" stroke-width="3"/>
    <path d="M220 470 Q400 440 700 500 Q560 540 220 500 Z" fill="${c}" stroke="rgba(0,0,0,.15)" stroke-width="3"/>
    <circle cx="400" cy="262" r="10" fill="rgba(0,0,0,.18)"/>
    <rect x="380" y="360" width="40" height="16" rx="8" fill="rgba(0,0,0,.18)"/>`,
};

function productSvg(shape, hex) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800"><rect width="800" height="800" fill="${TILE}"/>${SHAPES[shape](hex)}<ellipse cx="400" cy="700" rx="230" ry="18" fill="rgba(0,0,0,.05)"/></svg>`;
}


const hexName = (hex) => hex.replace("#", "").toLowerCase();
const image = (shape, hex) => {
  const file = `${shape}-${hexName(hex)}.svg`;
  writeFileSync(path.join(imgDir, file), productSvg(shape, hex));
  return `/placeholder/${file}`;
};


const created = (daysAgo) => new Date(Date.UTC(2026, 9, 27) - daysAgo * 86400000).toISOString();

const cat = (id, name, slug, parentId, order, description, image = null) => ({
  id, name, slug, parentId, description, image, order, createdAt: created(30),
});

const categories = [
  cat("c_men", "Men", "men", null, 1, "Polos, shirts and outerwear cut for everyday elegance.", "/images/men.jpg"),
  cat("c_women", "Women", "women", null, 2, "Dresses, polos and leather goods with a sporting spirit.", "/images/women.jpg"),
  cat("c_kids", "Kids", "kids", null, 3, "Comfortable essentials for the next generation.", "/images/kids.jpg"),
  cat("c_sneakers", "Sneakers", "sneakers", null, 4, "Court-inspired sneakers for every day.", "/images/sneakers.jpg"),
  cat("c_men_polo", "Polo", "men-polo", "c_men", 1, "The iconic piqué polo, in every colour."),
  cat("c_men_tshirts", "T-Shirts", "men-t-shirts", "c_men", 2, "Soft cotton tees for every day."),
  cat("c_men_jackets", "Jackets", "men-jackets", "c_men", 3, "Lightweight layers and outerwear."),
  cat("c_men_trousers", "Trousers", "men-trousers", "c_men", 4, "Chinos and tailored trousers."),
  cat("c_women_dresses", "Dresses", "women-dresses", "c_women", 1, "Polo dresses and tennis dresses."),
  cat("c_women_polo", "Polo", "women-polo", "c_women", 2, "Slim-fit polos for women."),
  cat("c_women_bags", "Bags", "women-bags", "c_women", 3, "Totes and shoulder bags."),
  cat("c_women_caps", "Caps", "women-caps", "c_women", 4, "Caps and accessories."),
  cat("c_kids_tshirts", "T-Shirts", "kids-t-shirts", "c_kids", 1, "Tees and polos for kids."),
];

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];
let n = 0;
const product = ({ name, slug, categoryId, price, salePrice = null, shape, colors, sizes = APPAREL, badge = null, isNew = false, days, description }) => {
  n += 1;
  const images = colors.slice(0, 3).map((c) => image(shape, c.hex));
  return {
    id: `p_${String(n).padStart(3, "0")}`,
    name, slug, categoryId, price, salePrice, description,
    colors, sizes, images, badge, isNew, isActive: true,
    createdAt: created(days), updatedAt: created(days),
  };
};

const C = {
  navy: { name: "Navy Blue", hex: "#1c2541" },
  white: { name: "White", hex: "#ffffff" },
  black: { name: "Black", hex: "#1f1f1f" },
  green: { name: "Green", hex: "#225431" },
  khaki: { name: "Khaki", hex: "#7d7a5c" },
  sky: { name: "Sky Blue", hex: "#7fa1c3" },
  grey: { name: "Grey Chine", hex: "#a8a8a8" },
  pink: { name: "Pink", hex: "#f2cfd3" },
  berry: { name: "Berry", hex: "#9c2a5a" },
  beige: { name: "Beige", hex: "#d9c7ab" },
  red: { name: "Red", hex: "#b3262e" },
  brown: { name: "Brown", hex: "#5b4636" },
  ice: { name: "Ice Blue", hex: "#b8d4ea" },
};

const products = [
  product({ name: "Regular Fit Paris Stretch Piqué Polo Shirt", slug: "regular-fit-paris-stretch-pique-polo-shirt", categoryId: "c_men_polo", price: 1999000, shape: "polo", colors: [C.khaki, C.sky, C.grey, C.navy, C.green], isNew: true, days: 1, description: "A modern take on the classic polo. Stretch piqué cotton for comfort and freedom of movement, with a refined two-button placket and ribbed collar." }),
  product({ name: "Classic Fit Piqué Polo Shirt", slug: "classic-fit-pique-polo-shirt", categoryId: "c_men_polo", price: 1799000, shape: "polo", colors: [C.white, C.navy, C.red, C.green], badge: "Any 2 extra 10% off", isNew: true, days: 2, description: "The original polo in breathable cotton piqué. A timeless silhouette with ribbed cuffs and a split hem." }),
  product({ name: "Cotton Jersey Crew Neck T-Shirt", slug: "cotton-jersey-crew-neck-t-shirt", categoryId: "c_men_tshirts", price: 999000, salePrice: 699000, shape: "tee", colors: [C.white, C.black, C.navy], days: 6, description: "Soft cotton jersey crew neck tee with an embroidered emblem on the chest." }),
  product({ name: "Water-Repellent Zip Jacket", slug: "water-repellent-zip-jacket", categoryId: "c_men_jackets", price: 3999000, shape: "jacket", colors: [C.black, C.navy, C.khaki], isNew: true, days: 3, description: "A lightweight water-repellent jacket with a clean zip front and point collar. Easy to layer through the seasons." }),
  product({ name: "Slim Fit Stretch Chino Trousers", slug: "slim-fit-stretch-chino-trousers", categoryId: "c_men_trousers", price: 2299000, salePrice: 1609300, shape: "pants", colors: [C.beige, C.navy, C.black], sizes: ["28", "30", "32", "34", "36"], days: 10, description: "Slim chinos in stretch cotton twill. Tailored enough for the office, relaxed enough for the weekend." }),
  product({ name: "Ultra Dry Stretch Tennis Dress with Liner", slug: "ultra-dry-stretch-tennis-dress-with-liner", categoryId: "c_women_dresses", price: 3299000, salePrice: 1979400, shape: "dress", colors: [C.white], badge: "Any 2 extra 10% off", days: 8, description: "Engineered for the court: a breathable, quick-drying stretch dress with a pleated skirt and built-in liner shorts." }),
  product({ name: "Stretch Piqué Polo Dress", slug: "stretch-pique-polo-dress", categoryId: "c_women_dresses", price: 2799000, shape: "dress", colors: [C.navy, C.white, C.berry], isNew: true, days: 2, description: "A polo dress in stretch piqué with a feminine, fitted silhouette." }),
  product({ name: "Slim Fit Piqué Polo Shirt", slug: "women-slim-fit-pique-polo-shirt", categoryId: "c_women_polo", price: 1799000, shape: "polo", colors: [C.pink, C.white, C.ice, C.navy], isNew: true, days: 4, description: "A slim fit polo in soft cotton piqué with mother-of-pearl buttons." }),
  product({ name: "Anna Zipped Tote", slug: "anna-zipped-tote", categoryId: "c_women_bags", price: 2499000, shape: "bag", colors: [C.pink, C.berry, C.black, C.beige], sizes: ["One Size"], badge: "Any 2 extra 10% off", isNew: true, days: 1, description: "A roomy coated canvas tote with a zip closure, leather-look handles and an interior pocket." }),
  product({ name: "Everyday Club Flap Close Shoulder Bag", slug: "everyday-club-flap-close-shoulder-bag", categoryId: "c_women_bags", price: 2799000, shape: "bag", colors: [C.black, C.brown], sizes: ["One Size"], badge: "Any 2 extra 10% off", days: 5, description: "A structured shoulder bag with a flap closure and adjustable strap." }),
  product({ name: "Women's Anna Reversible Bicolour Tote Bag", slug: "womens-anna-reversible-bicolour-tote-bag", categoryId: "c_women_bags", price: 2499000, salePrice: 1749300, shape: "bag", colors: [C.ice, C.navy, C.berry], sizes: ["One Size"], days: 12, description: "Two looks in one: a reversible tote with a contrasting interior and a removable pouch." }),
  product({ name: "Embroidered Cotton Twill Cap", slug: "embroidered-cotton-twill-cap", categoryId: "c_women_caps", price: 799000, shape: "cap", colors: [C.white, C.navy, C.green], sizes: ["One Size"], days: 9, description: "A six-panel cotton twill cap with an adjustable strap and embroidered emblem." }),
  product({ name: "Kids' Cotton Jersey T-Shirt", slug: "kids-cotton-jersey-t-shirt", categoryId: "c_kids_tshirts", price: 599000, shape: "tee", colors: [C.sky, C.red, C.white], sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"], isNew: true, days: 3, description: "Everyday cotton jersey tee for kids, soft and easy to wash." }),
  product({ name: "Kids' Piqué Polo Shirt", slug: "kids-pique-polo-shirt", categoryId: "c_kids_tshirts", price: 799000, salePrice: 559300, shape: "polo", colors: [C.navy, C.green, C.pink], sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"], days: 14, description: "The classic polo, sized for kids." }),
  product({ name: "Carnaby Leather Sneakers", slug: "carnaby-leather-sneakers", categoryId: "c_sneakers", price: 2599000, shape: "sneaker", colors: [C.white, C.black, C.green], sizes: ["39", "40", "41", "42", "43", "44"], isNew: true, days: 2, description: "Clean leather court sneakers with a cushioned insole and rubber cupsole." }),
  product({ name: "Lineshot Suede Sneakers", slug: "lineshot-suede-sneakers", categoryId: "c_sneakers", price: 2899000, salePrice: 2029300, shape: "sneaker", colors: [C.beige, C.navy], sizes: ["39", "40", "41", "42", "43", "44"], days: 11, description: "Retro-inspired suede sneakers with tonal laces and a gum sole." }),
];

writeFileSync(path.join(seedDir, "categories.json"), JSON.stringify(categories, null, 2) + "\n");
writeFileSync(path.join(seedDir, "products.json"), JSON.stringify(products, null, 2) + "\n");
writeFileSync(path.join(seedDir, "subscribers.json"), "[]\n");
console.log(`Seed written: ${categories.length} categories, ${products.length} products.`);
