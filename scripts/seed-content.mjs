import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import path from "path";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const IMAGES_DIR = "C:/Users/user/Downloads/Landscaping images";

// --- 1. Categories -----------------------------------------------------
const CATEGORIES = [
  { key: "hardscaping", name: "Hardscaping & Paving", slug: "hardscaping-paving", sort_order: 1 },
  { key: "turf", name: "Turf & Lawn Care", slug: "turf-lawn-care", sort_order: 2 },
  { key: "water", name: "Water Features & Pools", slug: "water-features-pools", sort_order: 3 },
  { key: "security", name: "Security & Automation", slug: "security-automation", sort_order: 4 },
  { key: "leisure", name: "Outdoor Living & Leisure", slug: "outdoor-living-leisure", sort_order: 5 },
  { key: "walls", name: "Wall Finishes & Cladding", slug: "wall-finishes-cladding", sort_order: 6 },
];

// --- 2. Services (one representative photo each) ------------------------
// `file` picks the hero image for the service card/detail page.
const SERVICES = [
  { key: "cabro", category: "hardscaping", name: "Cabro Paving & Walkways", icon: "BrickWall", file: "Cabro and slab pedestrian walk-way.jpeg", summary: "Interlocking cabro driveways, walkways, and compounds laid for lasting, low-maintenance surfaces.", sort_order: 1, featured: true },
  { key: "cobblestone", category: "hardscaping", name: "Cobblestone Paving", icon: "Square", file: "Cobble stones.jpeg", summary: "Decorative cobblestone paving for driveways, patios, and garden paths.", sort_order: 2 },
  { key: "turf", category: "turf", name: "Artificial Turf Installation", icon: "Layers", file: "Artificial turf.jpeg", summary: "Low-maintenance artificial turf for lawns, play areas, and pool surrounds.", sort_order: 1, featured: true },
  { key: "lawn", category: "turf", name: "Natural Lawn Care & Landscaping", icon: "Sprout", file: "Green lawns.jpeg", summary: "Lawn establishment, planting, and upkeep for lush, healthy green spaces.", sort_order: 2 },
  { key: "grass-slabs", category: "turf", name: "Grass Paving Slabs", icon: "Grid2x2", file: "Grass slabs.jpeg", summary: "Grass paver slabs that combine a drivable surface with natural greenery.", sort_order: 3 },
  { key: "pool", category: "water", name: "Swimming Pool Construction", icon: "Waves", file: "Swimming pool.jpeg", summary: "Custom swimming pool construction from excavation to finished deck.", sort_order: 1, featured: true },
  { key: "koi-pond", category: "water", name: "Koi Ponds & Waterfalls", icon: "Fish", file: "Koi pond.jpeg", summary: "Ornamental koi ponds and cascading waterfalls built as garden centerpieces.", sort_order: 2 },
  { key: "fountain", category: "water", name: "Water Fountains", icon: "Droplets", file: "Water fountain.jpeg", summary: "Custom water fountains designed as a focal point for gardens and courtyards.", sort_order: 3 },
  { key: "electric-fence", category: "security", name: "Electric Fencing", icon: "Zap", file: "Electric fence.jpeg", summary: "Perimeter electric fencing installed to professional security standards.", sort_order: 1 },
  { key: "gate-automation", category: "security", name: "Gate Automation", icon: "DoorOpen", file: "Gate automation tumia hii.jpeg", summary: "Automated sliding and swing gate systems for homes and commercial properties.", sort_order: 2, featured: true },
  { key: "pergola", category: "leisure", name: "Pergolas", icon: "Trees", file: "Pargolas and artificial grass.jpeg", summary: "Custom pergolas that create shaded, defined outdoor living areas.", sort_order: 1, featured: true },
  { key: "sauna", category: "leisure", name: "Outdoor Saunas", icon: "Flame", file: "Sauna.jpeg", summary: "Outdoor sauna installations built for relaxation and everyday wellness.", sort_order: 2 },
  { key: "zen-garden", category: "leisure", name: "Zen Garden Design", icon: "Leaf", file: "Zen gardens.jpeg", summary: "Tranquil zen garden landscaping with lighting, stone, and curated planting.", sort_order: 3 },
  { key: "car-shade", category: "leisure", name: "Car Shades & Carports", icon: "Car", file: "Car shades.jpeg", summary: "Durable car shade structures that protect vehicles year-round.", sort_order: 4 },
  { key: "raised-beds", category: "leisure", name: "Raised Garden Beds", icon: "Sprout", file: "Raised beds with greenery.jpeg", summary: "Raised planting beds for kitchen gardens, herbs, and ornamental greenery.", sort_order: 5 },
  { key: "helipad", category: "leisure", name: "Helipad Construction", icon: "CircleDot", file: "Helipad.jpeg", summary: "Purpose-built helipad surfaces engineered to aviation ground standards.", sort_order: 6 },
  { key: "wall-cladding", category: "walls", name: "Wall Cladding", icon: "Layers", file: "Wall cladding.jpeg", summary: "Natural stone and decorative wall cladding for exteriors and boundary walls.", sort_order: 1 },
  { key: "wall-murals", category: "walls", name: "Wall Murals", icon: "Image", file: "Wall murals.jpeg", summary: "Hand-painted wall murals that turn boundary walls into a design feature.", sort_order: 2 },
];

// --- 3. Portfolio items (every photo, linked back to its service) ------
const PORTFOLIO = [
  { file: "Cabro.jpeg", title: "Cabro Paving", service: "cabro" },
  { file: "Cabro (2).jpeg", title: "Cabro Paving", service: "cabro" },
  { file: "Cabro (3).jpeg", title: "Cabro Paving", service: "cabro" },
  { file: "Cabro and slab pedestrian walk-way.jpeg", title: "Cabro & Slab Pedestrian Walkway", service: "cabro" },
  { file: "Cobble stones.jpeg", title: "Cobblestone Paving", service: "cobblestone" },
  { file: "Slabs installation on swimming pool.jpeg", title: "Pool Deck Slab Installation", service: "pool" },
  { file: "Artificial turf.jpeg", title: "Artificial Turf Installation", service: "turf" },
  { file: "Artificial turf .jpeg", title: "Artificial Turf Installation", service: "turf" },
  { file: "Green lawns.jpeg", title: "Manicured Lawn", service: "lawn" },
  { file: "Green lawn with periphery tropical planting.jpeg", title: "Lawn with Tropical Border Planting", service: "lawn" },
  { file: "Grass slabs.jpeg", title: "Grass Paving Slabs", service: "grass-slabs" },
  { file: "Swimming pool.jpeg", title: "Swimming Pool", service: "pool" },
  { file: "Swimming pool under construction.jpeg", title: "Swimming Pool — Under Construction", service: "pool" },
  { file: "Swimming pool and turf.jpeg", title: "Swimming Pool with Turf Surround", service: "pool" },
  { file: "Koi pond.jpeg", title: "Koi Pond Construction", service: "koi-pond" },
  { file: "Waterfall leading to a koi pond.jpeg", title: "Waterfall & Koi Pond", service: "koi-pond" },
  { file: "Water fountain.jpeg", title: "Water Fountain", service: "fountain" },
  { file: "Water fountain (2).jpeg", title: "Water Fountain", service: "fountain" },
  { file: "Electric fence.jpeg", title: "Electric Fence Installation", service: "electric-fence" },
  { file: "Gate automation tumia hii.jpeg", title: "Automated Gate System", service: "gate-automation" },
  { file: "Gate automation for both sliding and swing gates.jpeg", title: "Gate Automation — Sliding & Swing Gates", service: "gate-automation" },
  { file: "Pargolas and artificial grass.jpeg", title: "Pergola & Artificial Grass", service: "pergola" },
  { file: "Sauna.jpeg", title: "Outdoor Sauna", service: "sauna" },
  { file: "Sauna 2.jpeg", title: "Outdoor Sauna", service: "sauna" },
  { file: "Zen gardens.jpeg", title: "Zen Garden Design", service: "zen-garden" },
  { file: "Car shades.jpeg", title: "Car Shade Structure", service: "car-shade" },
  { file: "Raised beds with greenery.jpeg", title: "Raised Garden Beds", service: "raised-beds" },
  { file: "Helipad.jpeg", title: "Helipad Construction", service: "helipad" },
  { file: "Wall cladding.jpeg", title: "Wall Cladding", service: "wall-cladding" },
  { file: "Wall cladding 2.jpeg", title: "Wall Cladding", service: "wall-cladding" },
  { file: "Wall murals.jpeg", title: "Wall Mural Art", service: "wall-murals" },
  { file: "Wall murals (2).jpeg", title: "Wall Mural Art", service: "wall-murals" },
];

function slugifyFile(file, index) {
  const base = path
    .parse(file)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${String(index).padStart(2, "0")}-${base}.jpg`;
}

function slugify(input) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  console.log(`Reading images from ${IMAGES_DIR}`);
  const files = readdirSync(IMAGES_DIR);
  console.log(`Found ${files.length} files`);

  // Upload every unique file once, build filename -> public URL map
  const urlByFile = {};
  let i = 0;
  for (const file of files) {
    i += 1;
    const storagePath = `portfolio/${slugifyFile(file, i)}`;
    const bytes = readFileSync(path.join(IMAGES_DIR, file));
    const { error } = await supabase.storage
      .from("media")
      .upload(storagePath, bytes, { contentType: "image/jpeg", upsert: true });
    if (error) {
      console.error(`Upload failed for ${file}:`, error.message);
      continue;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(storagePath);
    urlByFile[file] = data.publicUrl;
    console.log(`Uploaded (${i}/${files.length}): ${file}`);
  }

  // Insert categories
  const categoryRows = CATEGORIES.map(({ key, ...rest }) => rest);
  const { data: insertedCategories, error: catError } = await supabase
    .from("service_categories")
    .insert(categoryRows)
    .select();
  if (catError) throw new Error(`Category insert failed: ${catError.message}`);
  const categoryIdByKey = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, insertedCategories.find((r) => r.slug === c.slug).id])
  );
  console.log(`Inserted ${insertedCategories.length} categories`);

  // Insert services
  const serviceRows = SERVICES.map((s) => ({
    name: s.name,
    slug: slugify(s.name),
    category_id: categoryIdByKey[s.category],
    summary: s.summary,
    description: s.summary,
    icon: s.icon,
    image_url: urlByFile[s.file] ?? null,
    featured: Boolean(s.featured),
    sort_order: s.sort_order,
  }));
  const { data: insertedServices, error: svcError } = await supabase
    .from("services")
    .insert(serviceRows)
    .select();
  if (svcError) throw new Error(`Service insert failed: ${svcError.message}`);
  const serviceIdByKey = Object.fromEntries(
    SERVICES.map((s) => [s.key, insertedServices.find((r) => r.slug === slugify(s.name)).id])
  );
  console.log(`Inserted ${insertedServices.length} services`);

  // Insert portfolio items
  const portfolioRows = PORTFOLIO.map((p, index) => {
    const serviceDef = SERVICES.find((s) => s.key === p.service);
    return {
      title: p.title,
      image_url: urlByFile[p.file] ?? null,
      service_id: serviceIdByKey[p.service] ?? null,
      category_id: categoryIdByKey[serviceDef.category],
      description: null,
      sort_order: index + 1,
    };
  }).filter((p) => p.image_url);

  const { data: insertedPortfolio, error: pfError } = await supabase
    .from("portfolio_items")
    .insert(portfolioRows)
    .select();
  if (pfError) throw new Error(`Portfolio insert failed: ${pfError.message}`);
  console.log(`Inserted ${insertedPortfolio.length} portfolio items`);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
