import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

const root = process.cwd();
const srcDir = join(root, "public/icons");

const mapping = {
  avatars: {
    "avatar-lion": "lion-of-judah",
    "avatar-broadsword": "david",
    "avatar-crown": "esther",
    "avatar-strong": "samson",
    "avatar-sail": "noah",
    "avatar-whale": "jonah",
    "avatar-dove": "dove",
    "avatar-lightning": "elijah",
  },
  badges: {
    "badge-sprout": "mustard-seed",
    "badge-droplets": "living-water",
    "badge-flame": "burning-bush",
    "badge-crossed-swords": "goliath-slayer",
    "avatar-dove": "pentecost",
    "avatar-sail": "ark-builder",
    "badge-book": "proverbs-sage",
    "avatar-crown": "faithful-servant",
    "badge-flame-spin": "tongues-of-fire",
    "badge-trophy": "overcomer",
    "badge-crossed-swords": "word-warrior",
    "badge-imperial-crown": "crown-of-life",
  },
  games: {
    "game-cards": "memory-bible",
    "game-running-shoe": "race-of-faith",
    "game-shield": "armor-of-god",
    "game-lightning": "trivia",
  },
  armor: {
    "armor-helmet": "helmet",
    "armor-breastplate": "breastplate",
    "armor-shield": "shield",
    "armor-sword": "sword",
    "armor-belt": "belt",
    "armor-boots": "boots",
  },
  landing: {
    "landing-book": "book",
    "landing-cross": "cross",
    "avatar-dove": "dove",
    "badge-flame-spin": "flame",
  },
};

for (const [folder, entries] of Object.entries(mapping)) {
  const outDir = join(root, `public/${folder}`);
  mkdirSync(outDir, { recursive: true });
  for (const [source, name] of Object.entries(entries)) {
    const src = readFileSync(join(srcDir, `${source}.svg`), "utf8");
    const cleaned = src
      .replace(/<path d="M0 0h512v512H0z"\/>/g, "")
      .replace(/fill="#fff"/g, 'fill="#FFFFFF"');
    writeFileSync(join(outDir, `${name}.svg`), cleaned);
  }
}

console.log("Iconos generados correctamente");
