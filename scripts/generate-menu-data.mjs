import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const contentDir = path.join(rootDir, "content", "menu");
const outputPath = path.join(rootDir, "src", "data", "menu.generated.ts");

const recommendedSchema = z.array(z.object({ section: z.string(), names: z.array(z.string().min(1)) }));

const categoryConfigs = [
  {
    file: "pizza.md",
    category: "pizza",
    sections: [
      { heading: "Pizzas", note: "Pizza sizes: S 23 cm (8 in), M 30 cm (12 in)." },
      { heading: "Extra Toppings & Extra Cheese" },
    ],
  },
  {
    file: "pasta.md",
    category: "pasta",
    sections: [{ heading: "Pasta", note: "Pasta can be changed to Spaghetti or Rigatoni upon request." }],
  },
  {
    file: "salad-burger.md",
    category: "salad-burger",
    sections: [{ heading: "Salad" }, { heading: "Burger & Burger Extra Toppings" }, { heading: "Grilled & Fried" }],
  },
  {
    file: "mexican.md",
    category: "mexican",
    sections: [{ heading: "Nachos" }, { heading: "Tacos" }, { heading: "Quesadilla" }, { heading: "Wrap" }],
  },
  {
    file: "drinks.md",
    category: "drinks",
    sections: [{ heading: "Beer Menu" }, { heading: "Wine, Soft Drinks, Tea & Juice" }],
  },
];

const groupDefinitions = [
  {
    id: "pizza-classic",
    category: "pizza",
    title: { en: "Classic", vi: "Classic" },
    note: { en: "Pizza sizes: S 23 cm (8 in), M 30 cm (12 in).", vi: "Size pizza: S 23 cm (8 inch), M 30 cm (12 inch)." },
    displayOrder: 1,
  },
  {
    id: "pizza-specialty",
    category: "pizza",
    title: { en: "Premium / Specialty", vi: "Premium / Specialty" },
    displayOrder: 2,
  },
  {
    id: "pizza-toppings-vegetables",
    category: "pizza",
    title: { en: "Extra Toppings - Vegetables", vi: "Topping thêm - Rau củ" },
    layout: "compact",
    displayOrder: 3,
  },
  {
    id: "pizza-toppings-meat",
    category: "pizza",
    title: { en: "Extra Toppings - Meat", vi: "Topping thêm - Thịt" },
    layout: "compact",
    displayOrder: 4,
  },
  {
    id: "pizza-toppings-cheese",
    category: "pizza",
    title: { en: "Extra Toppings - Cheese", vi: "Topping thêm - Phô mai" },
    layout: "compact",
    displayOrder: 5,
  },
  {
    id: "pasta-main",
    category: "pasta",
    title: { en: "Pasta", vi: "Pasta" },
    note: {
      en: "Pasta can be changed to Spaghetti or Rigatoni upon request.",
      vi: "Có thể đổi sang Spaghetti hoặc Rigatoni theo yêu cầu.",
    },
    displayOrder: 10,
  },
  {
    id: "salad",
    category: "salad-burger",
    title: { en: "Salad", vi: "Salad" },
    displayOrder: 20,
  },
  {
    id: "burger",
    category: "salad-burger",
    title: { en: "Burger", vi: "Burger" },
    displayOrder: 21,
  },
  {
    id: "burger-extra",
    category: "salad-burger",
    title: { en: "Burger Extras", vi: "Thêm vào burger" },
    layout: "compact",
    displayOrder: 22,
  },
  {
    id: "grilled-fried",
    category: "salad-burger",
    title: { en: "Grilled & Fried", vi: "Món nướng & chiên" },
    displayOrder: 23,
  },
  {
    id: "nachos",
    category: "mexican",
    title: { en: "Nachos", vi: "Nachos" },
    displayOrder: 30,
  },
  {
    id: "tacos",
    category: "mexican",
    title: { en: "Tacos (3 pcs)", vi: "Tacos (3 miếng)" },
    displayOrder: 31,
  },
  {
    id: "quesadilla",
    category: "mexican",
    title: { en: "Quesadilla", vi: "Quesadilla" },
    displayOrder: 32,
  },
  {
    id: "wrap",
    category: "mexican",
    title: { en: "Wrap", vi: "Wrap" },
    displayOrder: 33,
  },
  {
    id: "beer-steerman",
    category: "drinks",
    title: { en: "Beer - Steerman", vi: "Bia - Steerman" },
    displayOrder: 40,
  },
  {
    id: "beer-7bridges",
    category: "drinks",
    title: { en: "Beer - 7Bridges", vi: "Bia - 7Bridges" },
    displayOrder: 41,
  },
  {
    id: "beer-five-elements",
    category: "drinks",
    title: { en: "Beer - Five Elements", vi: "Bia - Five Elements" },
    displayOrder: 42,
  },
  {
    id: "beer-tap",
    category: "drinks",
    title: { en: "Beer on Tap", vi: "Bia tươi" },
    displayOrder: 43,
  },
  {
    id: "beer-other",
    category: "drinks",
    title: { en: "Beer Specials", vi: "Lựa chọn bia khác" },
    displayOrder: 44,
  },
  {
    id: "wine",
    category: "drinks",
    title: { en: "Wine", vi: "Rượu vang" },
    displayOrder: 45,
  },
  {
    id: "soft-drinks",
    category: "drinks",
    title: { en: "Soft Drinks", vi: "Nước ngọt" },
    displayOrder: 46,
  },
  {
    id: "fizz-soda",
    category: "drinks",
    title: { en: "Fizz Soda", vi: "Fizz Soda" },
    displayOrder: 47,
  },
  {
    id: "tea",
    category: "drinks",
    title: { en: "Tea", vi: "Trà" },
    displayOrder: 48,
  },
  {
    id: "fresh-juice",
    category: "drinks",
    title: { en: "Fresh Juice", vi: "Nước ép tươi" },
    displayOrder: 49,
  },
];

const pizzaClassicNames = new Set([
  "Margherita Pizza",
  "Caprese Pizza",
  "Spicy Pork Pizza",
  "Pepperoni Pizza",
  "Smoked Pork & Parmigiano Pizza",
  "Salami Pizza",
  "Prosciutto Pizza",
  "Hawaii Pizza",
  "Meat Lover Pizza",
  "Four Cheese Pizza",
]);

const pizzaVegetableAddonNames = new Set(["Jalapeño", "Green Olive", "Black Olive", "Eggplant", "Bell Pepper", "Arugula", "Mushroom"]);
const pizzaMeatAddonNames = new Set(["Smoked Ham", "Pepperoni", "Salami", "Bacon", "Spicy Pork", "Chicken", "Sausage", "Prosciutto"]);
const burgerExtraNames = new Set(["Egg", "Bacon", "Cheddar"]);
const drinksGroupByName = new Map([
  ["Flying Bees", "beer-steerman"],
  ["Mango Hard Soda", "beer-steerman"],
  ["Pink Guava Hard Soda", "beer-steerman"],
  ["Dragon 3 Coil", "beer-7bridges"],
  ["Sunset Tangerine Wheat", "beer-7bridges"],
  ["Metal - Weizen", "beer-five-elements"],
  ["Water - Vierge Blonde", "beer-five-elements"],
  ["Earth - Black Forest Ale", "beer-five-elements"],
  ["Wood - Pacific Pale Ale", "beer-five-elements"],
  ["Fire - Fiery Red Ale", "beer-five-elements"],
  ["Five Elements Bucket", "beer-other"],
  ["Pale Ale", "beer-other"],
  ["East West IPA", "beer-other"],
  ["Pineapple Cider", "beer-other"],
  ["Berries Cider", "beer-other"],
  ["Apple Cider", "beer-other"],
  ["Huda", "beer-other"],
  ["Beach Style - Blonde Ale", "beer-tap"],
  ["Victorious Bastard - Laurel Pale Ale", "beer-tap"],
  ["Tester Set", "beer-tap"],
  ["TINI Pinot Grigio", "wine"],
  ["TINI Sangiovese", "wine"],
  ["Ginger Ale", "soft-drinks"],
  ["Water", "soft-drinks"],
  ["Coca", "soft-drinks"],
  ["Coca Light", "soft-drinks"],
  ["Coca Zero", "soft-drinks"],
  ["Sprite", "soft-drinks"],
  ["Fanta", "soft-drinks"],
  ["Soda Water", "soft-drinks"],
  ["Lemongrass & Lemonade Fizz Soda", "fizz-soda"],
  ["Passion Fruit Orange Fizz Soda", "fizz-soda"],
  ["Tamarind & Vanilla Fizz Soda", "fizz-soda"],
  ["Very Berry Fizz Soda", "fizz-soda"],
  ["Ginger Tea", "tea"],
  ["Jasmine Tea", "tea"],
  ["Green Tea", "tea"],
  ["Rose Tea", "tea"],
  ["Butterfly Pea Flower Tea", "tea"],
  ["Vietnamese Tea", "tea"],
  ["Watermelon Juice", "fresh-juice"],
  ["Pineapple Juice", "fresh-juice"],
  ["Apple Juice", "fresh-juice"],
  ["Lime Juice", "fresh-juice"],
  ["Orange Juice", "fresh-juice"],
  ["Mix Juice", "fresh-juice"],
  ["Coconut", "fresh-juice"],
]);

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function normalizeCell(value) {
  return value.replace(/^\s+|\s+$/g, "");
}

function parseTableRow(line) {
  if (!line.startsWith("|")) return null;
  const parts = line
    .split("|")
    .slice(1, -1)
    .map((cell) => normalizeCell(cell));
  return parts.length ? parts : null;
}

function parseMarkdownTables(fileContents, sectionHeadings) {
  const lines = fileContents.split(/\r?\n/);
  const sections = [];
  let currentSection = null;
  let fallbackHeadingIndex = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith("## ")) {
      currentSection = {
        heading: line.slice(3).trim(),
        rows: [],
      };
      sections.push(currentSection);
      continue;
    }

    if (!line.startsWith("|")) continue;
    if (!currentSection) {
      currentSection = {
        heading: sectionHeadings[fallbackHeadingIndex],
        rows: [],
      };
      fallbackHeadingIndex += 1;
      sections.push(currentSection);
    }
    const header = parseTableRow(line);
    const divider = parseTableRow(lines[index + 1] ?? "");
    if (!header || !divider) continue;

    index += 2;
    while (index < lines.length && lines[index].startsWith("|")) {
      const row = parseTableRow(lines[index]);
      if (row && row.some(Boolean)) currentSection.rows.push(row);
      index += 1;
    }
    index -= 1;
  }

  for (const heading of sectionHeadings) {
    if (!sections.some((section) => section.heading === heading)) {
      throw new Error(`Missing section "${heading}" in markdown.`);
    }
  }

  return sections;
}

function parseRecommendedMarkdown(fileContents) {
  const lines = fileContents.split(/\r?\n/);
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      currentSection = { section: line.slice(3).trim(), names: [] };
      sections.push(currentSection);
      continue;
    }

    if (currentSection && line.startsWith("- ")) {
      currentSection.names.push(line.slice(2).trim());
    }
  }

  return recommendedSchema.parse(sections);
}

function parsePrices(serving, priceCell) {
  if (priceCell) return { price: Number(priceCell) };
  if (!serving) return {};

  const values = {};
  const pairs = [...serving.matchAll(/([A-Za-z0-9 ]+):\s*(\d+)/g)];
  for (const [, rawKey, rawValue] of pairs) {
    const key = rawKey.trim().toLowerCase();
    const value = Number(rawValue);
    if (key.startsWith("s")) values.small = value;
    else if (key.startsWith("m")) values.medium = value;
    else if (key.startsWith("5")) values.fivePcs = value;
    else if (key.startsWith("8")) values.eightPcs = value;
    else if (key.startsWith("glass")) values.glass = value;
    else if (key.startsWith("pot")) values.pot = value;
  }

  return Object.keys(values).length ? { prices: values } : {};
}

function inferGroupId(category, sectionHeading, name) {
  if (category === "pizza" && sectionHeading === "Pizzas") {
    return pizzaClassicNames.has(name) ? "pizza-classic" : "pizza-specialty";
  }

  if (category === "pizza" && sectionHeading === "Extra Toppings & Extra Cheese") {
    if (pizzaVegetableAddonNames.has(name)) return "pizza-toppings-vegetables";
    if (pizzaMeatAddonNames.has(name)) return "pizza-toppings-meat";
    return "pizza-toppings-cheese";
  }

  if (category === "pasta") return "pasta-main";
  if (category === "salad-burger" && sectionHeading === "Salad") return "salad";
  if (category === "salad-burger" && sectionHeading === "Grilled & Fried") return "grilled-fried";
  if (category === "salad-burger" && sectionHeading === "Burger & Burger Extra Toppings") {
    return burgerExtraNames.has(name) ? "burger-extra" : "burger";
  }
  if (category === "mexican") return slugify(sectionHeading);
  if (category === "drinks") {
    const groupId = drinksGroupByName.get(name);
    if (!groupId) throw new Error(`No drinks group configured for "${name}".`);
    return groupId;
  }

  throw new Error(`Could not infer group for "${name}" in ${category}/${sectionHeading}.`);
}

function inferKind(category, groupId) {
  if (category === "drinks") return "drink";
  if (groupId.startsWith("pizza-toppings") || groupId === "burger-extra") return "addon";
  return "dish";
}

async function buildMenuItems(categories, recommendedNames) {
  const items = [];
  let displayOrder = 1;

  for (const categoryConfig of categories) {
    const filePath = path.join(contentDir, categoryConfig.file);
    const fileContents = await readFile(filePath, "utf8");
    const sections = parseMarkdownTables(
      fileContents,
      categoryConfig.sections.map((section) => section.heading),
    );

    for (const section of sections) {
      for (const row of section.rows) {
        const [name, servingRaw, priceRaw, description, descriptionVi] = row;
        const serving = servingRaw || undefined;
        const priceData = parsePrices(servingRaw, priceRaw);
        const groupId = inferGroupId(categoryConfig.category, section.heading, name);
        const kind = inferKind(categoryConfig.category, groupId);
        const recommendedByList = recommendedNames.has(name);
        const item = {
          id: slugify(name),
          category: categoryConfig.category,
          groupId,
          name,
          ...(serving ? { serving } : {}),
          ...(description ? { description } : {}),
          ...(descriptionVi ? { descriptionVi } : {}),
          ...priceData,
          ...(recommendedByList ? { recommended: true, tags: [{ en: "signature", vi: "đặc trưng" }] } : {}),
          kind,
          displayOrder,
        };

        items.push(item);
        displayOrder += 1;
      }
    }
  }

  return items;
}

async function main() {
  const recommendedFile = await readFile(path.join(contentDir, "recommended.md"), "utf8");
  const recommendedSections = parseRecommendedMarkdown(recommendedFile);
  const recommendedNames = new Set(recommendedSections.flatMap((section) => section.names));
  const menuItems = await buildMenuItems(categoryConfigs, recommendedNames);

  for (const name of recommendedNames) {
    if (!menuItems.some((item) => item.name === name)) {
      throw new Error(`Recommended item "${name}" does not exist in menu markdown.`);
    }
  }

  const source = `import type { MenuGroup, MenuItem } from "@/data/menu.types";

export const menuGroups = ${JSON.stringify(groupDefinitions, null, 2)} satisfies MenuGroup[];

export const menuItems = ${JSON.stringify(menuItems, null, 2)} satisfies MenuItem[];
`;

  await writeFile(outputPath, source, "utf8");
  console.log(`Generated ${path.relative(rootDir, outputPath)} with ${menuItems.length} items.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

