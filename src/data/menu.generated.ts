import type { MenuGroup, MenuItem } from "@/data/menu.types";

export const menuGroups = [
  {
    "id": "pizza-classic",
    "category": "pizza",
    "title": {
      "en": "Classic",
      "vi": "Classic"
    },
    "note": {
      "en": "Pizza sizes: S 23 cm (8 in), M 30 cm (12 in).",
      "vi": "Size pizza: S 23 cm (8 inch), M 30 cm (12 inch)."
    },
    "displayOrder": 1
  },
  {
    "id": "pizza-specialty",
    "category": "pizza",
    "title": {
      "en": "Premium / Specialty",
      "vi": "Premium / Specialty"
    },
    "displayOrder": 2
  },
  {
    "id": "pizza-toppings-vegetables",
    "category": "pizza",
    "title": {
      "en": "Extra Toppings - Vegetables",
      "vi": "Topping thêm - Rau củ"
    },
    "layout": "compact",
    "displayOrder": 3
  },
  {
    "id": "pizza-toppings-meat",
    "category": "pizza",
    "title": {
      "en": "Extra Toppings - Meat",
      "vi": "Topping thêm - Thịt"
    },
    "layout": "compact",
    "displayOrder": 4
  },
  {
    "id": "pizza-toppings-cheese",
    "category": "pizza",
    "title": {
      "en": "Extra Toppings - Cheese",
      "vi": "Topping thêm - Phô mai"
    },
    "layout": "compact",
    "displayOrder": 5
  },
  {
    "id": "pasta-main",
    "category": "pasta",
    "title": {
      "en": "Pasta",
      "vi": "Pasta"
    },
    "note": {
      "en": "Pasta can be changed to Spaghetti or Rigatoni upon request.",
      "vi": "Có thể đổi sang Spaghetti hoặc Rigatoni theo yêu cầu."
    },
    "displayOrder": 10
  },
  {
    "id": "salad",
    "category": "salad-burger",
    "title": {
      "en": "Salad",
      "vi": "Salad"
    },
    "displayOrder": 20
  },
  {
    "id": "burger",
    "category": "salad-burger",
    "title": {
      "en": "Burger",
      "vi": "Burger"
    },
    "displayOrder": 21
  },
  {
    "id": "burger-extra",
    "category": "salad-burger",
    "title": {
      "en": "Burger Extras",
      "vi": "Thêm vào burger"
    },
    "layout": "compact",
    "displayOrder": 22
  },
  {
    "id": "grilled-fried",
    "category": "salad-burger",
    "title": {
      "en": "Grilled & Fried",
      "vi": "Món nướng & chiên"
    },
    "displayOrder": 23
  },
  {
    "id": "nachos",
    "category": "mexican",
    "title": {
      "en": "Nachos",
      "vi": "Nachos"
    },
    "displayOrder": 30
  },
  {
    "id": "tacos",
    "category": "mexican",
    "title": {
      "en": "Tacos (3 pcs)",
      "vi": "Tacos (3 miếng)"
    },
    "displayOrder": 31
  },
  {
    "id": "quesadilla",
    "category": "mexican",
    "title": {
      "en": "Quesadilla",
      "vi": "Quesadilla"
    },
    "displayOrder": 32
  },
  {
    "id": "wrap",
    "category": "mexican",
    "title": {
      "en": "Wrap",
      "vi": "Wrap"
    },
    "displayOrder": 33
  },
  {
    "id": "beer-steerman",
    "category": "drinks",
    "title": {
      "en": "Beer - Steerman",
      "vi": "Bia - Steerman"
    },
    "displayOrder": 40
  },
  {
    "id": "beer-7bridges",
    "category": "drinks",
    "title": {
      "en": "Beer - 7Bridges",
      "vi": "Bia - 7Bridges"
    },
    "displayOrder": 41
  },
  {
    "id": "beer-five-elements",
    "category": "drinks",
    "title": {
      "en": "Beer - Five Elements",
      "vi": "Bia - Five Elements"
    },
    "displayOrder": 42
  },
  {
    "id": "beer-tap",
    "category": "drinks",
    "title": {
      "en": "Beer on Tap",
      "vi": "Bia tươi"
    },
    "displayOrder": 43
  },
  {
    "id": "beer-other",
    "category": "drinks",
    "title": {
      "en": "Beer Specials",
      "vi": "Lựa chọn bia khác"
    },
    "displayOrder": 44
  },
  {
    "id": "wine",
    "category": "drinks",
    "title": {
      "en": "Wine",
      "vi": "Rượu vang"
    },
    "displayOrder": 45
  },
  {
    "id": "soft-drinks",
    "category": "drinks",
    "title": {
      "en": "Soft Drinks",
      "vi": "Nước ngọt"
    },
    "displayOrder": 46
  },
  {
    "id": "fizz-soda",
    "category": "drinks",
    "title": {
      "en": "Fizz Soda",
      "vi": "Fizz Soda"
    },
    "displayOrder": 47
  },
  {
    "id": "tea",
    "category": "drinks",
    "title": {
      "en": "Tea",
      "vi": "Trà"
    },
    "displayOrder": 48
  },
  {
    "id": "fresh-juice",
    "category": "drinks",
    "title": {
      "en": "Fresh Juice",
      "vi": "Nước ép tươi"
    },
    "displayOrder": 49
  }
] satisfies MenuGroup[];

export const menuItems = [
  {
    "id": "margherita-pizza",
    "category": "pizza",
    "groupId": "pizza-classic",
    "name": "Margherita Pizza",
    "serving": "S 23cm: 85; M 30cm: 135",
    "description": "Tomato sauce, mozzarella cheese, parmesan, basil, olive oil.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, phô mai parmesan, húng quế tây, dầu ô liu.",
    "prices": {
      "small": 85,
      "medium": 135
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      },
      {
        "en": "vegetarian",
        "vi": "dochay"
      }
    ],
    "kind": "dish",
    "displayOrder": 1
  },
  {
    "id": "caprese-pizza",
    "category": "pizza",
    "groupId": "pizza-classic",
    "name": "Caprese Pizza",
    "serving": "S 23cm: 95; M 30cm: 155",
    "description": "Pesto or tomato sauce, mozzarella, fresh tomato, basil, balsamic, parmesan cheese.",
    "descriptionVi": "Sốt húng quế tây hoặc sốt cà chua, phô mai mozzarella, cà chua tươi, húng quế tây, giấm balsamic, phô mai parmesan.",
    "prices": {
      "small": 95,
      "medium": 155
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      },
      {
        "en": "vegetarian",
        "vi": "dochay"
      }
    ],
    "kind": "dish",
    "displayOrder": 2
  },
  {
    "id": "spicy-pork-pizza",
    "category": "pizza",
    "groupId": "pizza-classic",
    "name": "Spicy Pork Pizza",
    "serving": "S 23cm: 105; M 30cm: 175",
    "description": "Tomato sauce, mozzarella cheese, spicy ground pork, basil, olive oil.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, thịt heo xay cay, húng quế tây, dầu ô liu.",
    "prices": {
      "small": 105,
      "medium": 175
    },
    "recommended": true,
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "porklover",
        "vi": "thitheo"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 3
  },
  {
    "id": "pepperoni-pizza",
    "category": "pizza",
    "groupId": "pizza-classic",
    "name": "Pepperoni Pizza",
    "serving": "S 23cm: 110; M 30cm: 180",
    "description": "Tomato sauce, mozzarella cheese, pepperoni, basil, olive oil.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, pepperoni, húng quế tây, dầu ô liu.",
    "prices": {
      "small": 110,
      "medium": 180
    },
    "recommended": true,
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "pepperoni",
        "vi": "pepperoni"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 4
  },
  {
    "id": "smoked-pork-parmigiano-pizza",
    "category": "pizza",
    "groupId": "pizza-classic",
    "name": "Smoked Pork & Parmigiano Pizza",
    "serving": "S 23cm: 105; M 30cm: 175",
    "description": "Carbonara sauce, mozzarella cheese, parmesan cheese, bacon, onion, pepper.",
    "descriptionVi": "Sốt carbonara, phô mai mozzarella, phô mai parmesan, thịt heo xông khói, hành, tiêu.",
    "prices": {
      "small": 105,
      "medium": 175
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "porklover",
        "vi": "thitheo"
      },
      {
        "en": "smoky",
        "vi": "xongkhoi"
      }
    ],
    "kind": "dish",
    "displayOrder": 5
  },
  {
    "id": "salami-pizza",
    "category": "pizza",
    "groupId": "pizza-classic",
    "name": "Salami Pizza",
    "serving": "S 23cm: 105; M 30cm: 180",
    "description": "Tomato sauce, mozzarella cheese, salami, basil, olive oil.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, salami, húng quế tây, dầu ô liu.",
    "prices": {
      "small": 105,
      "medium": 180
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 6
  },
  {
    "id": "prosciutto-pizza",
    "category": "pizza",
    "groupId": "pizza-classic",
    "name": "Prosciutto Pizza",
    "serving": "S 23cm: 130; M 30cm: 220",
    "description": "Tomato sauce, mozzarella cheese, arugula, cherry tomatoes, prosciutto, parmesan cheese, olive oil. Served with hot honey.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, rau arugula/rocket, cà chua bi, prosciutto, phô mai parmesan, dầu ô liu. Ăn kèm mật ong cay.",
    "prices": {
      "small": 130,
      "medium": 220
    },
    "recommended": true,
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      },
      {
        "en": "musttry",
        "vi": "nenthu"
      }
    ],
    "kind": "dish",
    "displayOrder": 7
  },
  {
    "id": "hawaii-pizza",
    "category": "pizza",
    "groupId": "pizza-classic",
    "name": "Hawaii Pizza",
    "serving": "S 23cm: 110; M 30cm: 180",
    "description": "Tomato base, mozzarella cheese, parmesan cheese, smoked ham, pineapple, basil, olive oil.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, phô mai parmesan, đùi heo xông khói, thơm/dứa, húng quế tây, dầu ô liu.",
    "prices": {
      "small": 110,
      "medium": 180
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      },
      {
        "en": "tropical",
        "vi": "nhietdoi"
      }
    ],
    "kind": "dish",
    "displayOrder": 8
  },
  {
    "id": "meat-lover-pizza",
    "category": "pizza",
    "groupId": "pizza-classic",
    "name": "Meat Lover Pizza",
    "serving": "S 23cm: 115; M 30cm: 195",
    "description": "Tomato base, mozzarella cheese, parmesan cheese, pepperoni, bacon, chicken, basil, olive oil.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, phô mai parmesan, pepperoni, ba chỉ heo xông khói, gà, húng quế tây, dầu ô liu.",
    "prices": {
      "small": 115,
      "medium": 195
    },
    "recommended": true,
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      },
      {
        "en": "smoky",
        "vi": "xongkhoi"
      }
    ],
    "kind": "dish",
    "displayOrder": 9
  },
  {
    "id": "four-cheese-pizza",
    "category": "pizza",
    "groupId": "pizza-classic",
    "name": "Four Cheese Pizza",
    "serving": "S 23cm: 115; M 30cm: 190",
    "description": "Cooking cream, mozzarella cheese, parmesan cheese, blue cheese, scamorza cheese.",
    "descriptionVi": "Kem nấu, phô mai mozzarella, phô mai parmesan, phô mai xanh, phô mai scamorza.",
    "prices": {
      "small": 115,
      "medium": 190
    },
    "recommended": true,
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      },
      {
        "en": "vegetarian",
        "vi": "dochay"
      },
      {
        "en": "musttry",
        "vi": "nenthu"
      }
    ],
    "kind": "dish",
    "displayOrder": 10
  },
  {
    "id": "mexican-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Mexican Pizza",
    "serving": "S 23cm: 105; M 30cm: 185",
    "description": "Tomato sauce, mozzarella cheese, stewed chicken, parmesan cheese, onion, jalapeño, basil.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, gà nấu chậm, phô mai parmesan, hành tây, ớt jalapeño, húng quế tây.",
    "prices": {
      "small": 105,
      "medium": 185
    },
    "recommended": true,
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 11
  },
  {
    "id": "smoked-salmon-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Smoked Salmon Pizza",
    "serving": "Menu displays one price only",
    "description": "Cooking cream, mozzarella cheese, parmesan cheese, purple onion, tomato, capers, black olive, smoked salmon, olive oil.",
    "descriptionVi": "Sốt kem, phô mai mozzarella, phô mai parmesan, hành tím, cà chua, nụ bạch hoa, ô liu đen, cá hồi xông khói, dầu ô liu.",
    "price": 225,
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "salmon",
        "vi": "cahoi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 12
  },
  {
    "id": "beef-steak-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Beef Steak Pizza",
    "serving": "Menu displays one price only",
    "description": "Tomato sauce, mozzarella cheese, parmesan cheese, beef steak, arugula, purple onion, olive oil.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, phô mai parmesan, bít tết, rau arugula/rocket, hành tím, dầu ô liu.",
    "price": 245,
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "beeflover",
        "vi": "thitbo"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 13
  },
  {
    "id": "truffle-mushroom-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Truffle & Mushroom Pizza",
    "serving": "S 23cm: 120; M 30cm: 205",
    "description": "Cooking cream, truffle pâté, mixed mushroom, mozzarella cheese, parmesan cheese, olive oil.",
    "descriptionVi": "Sốt kem, pâté nấm truffle, nấm, phô mai mozzarella, phô mai parmesan, dầu ô liu.",
    "prices": {
      "small": 120,
      "medium": 205
    },
    "recommended": true,
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "mushroom",
        "vi": "namtuoi"
      },
      {
        "en": "truffle",
        "vi": "namtruffle"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      },
      {
        "en": "vegetarian",
        "vi": "dochay"
      },
      {
        "en": "musttry",
        "vi": "nenthu"
      }
    ],
    "kind": "dish",
    "displayOrder": 14
  },
  {
    "id": "eggplant-blue-cheese-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Eggplant & Blue Cheese Pizza",
    "serving": "S 23cm: 105; M 30cm: 175",
    "description": "Tomato sauce, mozzarella cheese, parmesan cheese, blue cheese, basil, olive oil.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, phô mai parmesan, phô mai xanh, húng quế tây, dầu ô liu.",
    "prices": {
      "small": 105,
      "medium": 175
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      },
      {
        "en": "vegetarian",
        "vi": "dochay"
      }
    ],
    "kind": "dish",
    "displayOrder": 15
  },
  {
    "id": "green-vegetarian-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Green Vegetarian Pizza",
    "serving": "S 23cm: 105; M 30cm: 165",
    "description": "Homemade pesto sauce, mozzarella, parmesan, arugula, capers, green olive, balsamic, almond.",
    "descriptionVi": "Sốt húng quế tây nhà làm, phô mai mozzarella, phô mai parmesan, rau rocket, nụ bạch hoa, ô liu xanh, giấm balsamic, hạnh nhân.",
    "prices": {
      "small": 105,
      "medium": 165
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "vegetarian",
        "vi": "chay"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 16
  },
  {
    "id": "green-vegan-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Green Vegan Pizza",
    "serving": "S 23cm: 95; M 30cm: 150",
    "description": "Homemade pesto sauce, arugula, capers, green olive, balsamic cream, almond.",
    "descriptionVi": "Sốt húng quế tây nhà làm, rau rocket, nụ bạch hoa, ô liu xanh, giấm balsamic, hạnh nhân.",
    "prices": {
      "small": 95,
      "medium": 150
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "vegan",
        "vi": "thuanchay"
      },
      {
        "en": "nocheese",
        "vi": "khongphomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 17
  },
  {
    "id": "vegetarian-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Vegetarian Pizza",
    "serving": "S 23cm: 105; M 30cm: 165",
    "description": "Tomato sauce, mixed mushroom, onion, basil, cherry tomato, black olive, olive oil, mozzarella cheese.",
    "descriptionVi": "Sốt cà chua, nấm, hành tây, húng quế, cà chua bi, ô liu đen, dầu ô liu, phô mai mozzarella.",
    "prices": {
      "small": 105,
      "medium": 165
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "vegetarian",
        "vi": "chay"
      },
      {
        "en": "mushroom",
        "vi": "namtuoi"
      }
    ],
    "kind": "dish",
    "displayOrder": 18
  },
  {
    "id": "vegan-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Vegan Pizza",
    "serving": "S 23cm: 105; M 30cm: 150",
    "description": "Tomato sauce, mixed mushroom, onion, basil, cherry tomato, black olive, olive oil.",
    "descriptionVi": "Sốt cà chua, nấm, hành tây, húng quế, cà chua bi, ô liu đen, dầu ô liu.",
    "prices": {
      "small": 105,
      "medium": 150
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "mushroom",
        "vi": "namtuoi"
      },
      {
        "en": "vegan",
        "vi": "thuanchay"
      },
      {
        "en": "nocheese",
        "vi": "khongphomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 19
  },
  {
    "id": "grilled-sausage-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Grilled Sausage Pizza",
    "serving": "S 23cm: 115; M 30cm: 185",
    "description": "Tomato sauce, mozzarella cheese, grilled sausage, onion, garlic, basil, olive oil.",
    "descriptionVi": "Sốt cà chua, phô mai mozzarella, xúc xích nướng, hành, tỏi, húng quế tây, dầu ô liu.",
    "prices": {
      "small": 115,
      "medium": 185
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 20
  },
  {
    "id": "chicken-bbq-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Chicken BBQ Pizza",
    "serving": "S 23cm: 110; M 30cm: 180",
    "description": "Homemade BBQ sauce, mozzarella cheese, chicken, parmesan cheese, purple onion, parsley.",
    "descriptionVi": "Sốt BBQ tự làm, phô mai mozzarella, gà, phô mai parmesan, hành tím, mùi tây.",
    "prices": {
      "small": 110,
      "medium": 180
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 21
  },
  {
    "id": "chicken-mushroom-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Chicken & Mushroom Pizza",
    "serving": "S 23cm: 110; M 30cm: 180",
    "description": "Homemade pesto sauce, mozzarella cheese, chicken, basil, olive oil.",
    "descriptionVi": "Sốt húng quế tây tự làm, phô mai mozzarella, thịt gà, húng quế tây, dầu ô liu.",
    "prices": {
      "small": 110,
      "medium": 180
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "mushroom",
        "vi": "namtuoi"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "dish",
    "displayOrder": 22
  },
  {
    "id": "pesto-chicken-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Pesto Chicken Pizza",
    "serving": "S 23cm: 110; M 30cm: 180",
    "description": "Homemade pesto sauce, mozzarella cheese, parmesan cheese, chicken, bell pepper, basil, olive oil.",
    "descriptionVi": "Sốt húng quế tây tự làm, phô mai mozzarella, phô mai parmesan, thịt gà, ớt chuông, húng quế tây, dầu ô liu.",
    "prices": {
      "small": 110,
      "medium": 180
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 23
  },
  {
    "id": "seafood-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Seafood Pizza",
    "serving": "S 23cm: 115; M 30cm: 185",
    "description": "Tomato sauce or cream sauce, mozzarella cheese, shrimp, squid, basil, olive oil.",
    "descriptionVi": "Sốt cà chua hoặc sốt kem, phô mai mozzarella, tôm, mực, húng quế, dầu ô liu.",
    "prices": {
      "small": 115,
      "medium": 185
    },
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "seafood",
        "vi": "haisan"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 24
  },
  {
    "id": "ventaglio-pizza",
    "category": "pizza",
    "groupId": "pizza-specialty",
    "name": "Ventaglio Pizza",
    "serving": "Menu displays one price only",
    "description": "Ham, salami, mozzarella, parmesan, arugula, sliced tomato, balsamic, olive oil.",
    "descriptionVi": "Đùi heo muối, salami, phô mai mozzarella, phô mai parmesan, rau rocket, cà chua lát, giấm balsamic, dầu ô liu.",
    "price": 195,
    "tags": [
      {
        "en": "woodfired",
        "vi": "nướngcủi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 25
  },
  {
    "id": "jalapeno",
    "category": "pizza",
    "groupId": "pizza-toppings-vegetables",
    "name": "Jalapeño",
    "serving": "S: 15; M: 30",
    "description": "Extra jalapeño topping for pizza.",
    "descriptionVi": "Topping ớt jalapeño thêm cho pizza.",
    "prices": {
      "small": 15,
      "medium": 30
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 26
  },
  {
    "id": "green-olive",
    "category": "pizza",
    "groupId": "pizza-toppings-vegetables",
    "name": "Green Olive",
    "serving": "S: 15; M: 25",
    "description": "Extra green olive topping for pizza.",
    "descriptionVi": "Topping ô liu xanh thêm cho pizza.",
    "prices": {
      "small": 15,
      "medium": 25
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 27
  },
  {
    "id": "black-olive",
    "category": "pizza",
    "groupId": "pizza-toppings-vegetables",
    "name": "Black Olive",
    "serving": "S: 15; M: 25",
    "description": "Extra black olive topping for pizza.",
    "descriptionVi": "Topping ô liu đen thêm cho pizza.",
    "prices": {
      "small": 15,
      "medium": 25
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 28
  },
  {
    "id": "eggplant",
    "category": "pizza",
    "groupId": "pizza-toppings-vegetables",
    "name": "Eggplant",
    "serving": "S: 15; M: 25",
    "description": "Extra eggplant topping for pizza.",
    "descriptionVi": "Topping cà tím thêm cho pizza.",
    "prices": {
      "small": 15,
      "medium": 25
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 29
  },
  {
    "id": "bell-pepper",
    "category": "pizza",
    "groupId": "pizza-toppings-vegetables",
    "name": "Bell Pepper",
    "serving": "S: 15; M: 25",
    "description": "Extra bell pepper topping for pizza.",
    "descriptionVi": "Topping ớt chuông thêm cho pizza.",
    "prices": {
      "small": 15,
      "medium": 25
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 30
  },
  {
    "id": "arugula",
    "category": "pizza",
    "groupId": "pizza-toppings-vegetables",
    "name": "Arugula",
    "serving": "S: 15; M: 30",
    "description": "Extra arugula topping for pizza.",
    "descriptionVi": "Topping rau arugula/rocket thêm cho pizza.",
    "prices": {
      "small": 15,
      "medium": 30
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 31
  },
  {
    "id": "mushroom",
    "category": "pizza",
    "groupId": "pizza-toppings-vegetables",
    "name": "Mushroom",
    "serving": "S: 15; M: 30",
    "description": "Extra mushroom topping for pizza.",
    "descriptionVi": "Topping nấm thêm cho pizza.",
    "prices": {
      "small": 15,
      "medium": 30
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "mushroom",
        "vi": "namtuoi"
      }
    ],
    "kind": "addon",
    "displayOrder": 32
  },
  {
    "id": "smoked-ham",
    "category": "pizza",
    "groupId": "pizza-toppings-meat",
    "name": "Smoked Ham",
    "serving": "S: 20; M: 40",
    "description": "Extra smoked ham topping for pizza.",
    "descriptionVi": "Topping đùi heo xông khói thêm cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 33
  },
  {
    "id": "pepperoni",
    "category": "pizza",
    "groupId": "pizza-toppings-meat",
    "name": "Pepperoni",
    "serving": "S: 20; M: 40",
    "description": "Extra pepperoni topping for pizza.",
    "descriptionVi": "Topping pepperoni thêm cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "pepperoni",
        "vi": "pepperoni"
      }
    ],
    "kind": "addon",
    "displayOrder": 34
  },
  {
    "id": "salami",
    "category": "pizza",
    "groupId": "pizza-toppings-meat",
    "name": "Salami",
    "serving": "S: 20; M: 40",
    "description": "Extra salami topping for pizza.",
    "descriptionVi": "Topping salami thêm cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 35
  },
  {
    "id": "bacon",
    "category": "pizza",
    "groupId": "pizza-toppings-meat",
    "name": "Bacon",
    "serving": "S: 20; M: 40",
    "description": "Extra bacon topping for pizza.",
    "descriptionVi": "Topping thịt heo xông khói thêm cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "smoky",
        "vi": "xongkhoi"
      }
    ],
    "kind": "addon",
    "displayOrder": 36
  },
  {
    "id": "spicy-pork",
    "category": "pizza",
    "groupId": "pizza-toppings-meat",
    "name": "Spicy Pork",
    "serving": "S: 20; M: 40",
    "description": "Extra spicy pork topping for pizza.",
    "descriptionVi": "Topping thịt heo cay thêm cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "porklover",
        "vi": "thitheo"
      },
      {
        "en": "spicy",
        "vi": "caynong"
      }
    ],
    "kind": "addon",
    "displayOrder": 37
  },
  {
    "id": "chicken",
    "category": "pizza",
    "groupId": "pizza-toppings-meat",
    "name": "Chicken",
    "serving": "S: 20; M: 40",
    "description": "Extra chicken topping for pizza.",
    "descriptionVi": "Topping gà thêm cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "addon",
    "displayOrder": 38
  },
  {
    "id": "sausage",
    "category": "pizza",
    "groupId": "pizza-toppings-meat",
    "name": "Sausage",
    "serving": "S: 20; M: 35",
    "description": "Extra sausage topping for pizza.",
    "descriptionVi": "Topping xúc xích thêm cho pizza.",
    "prices": {
      "small": 20,
      "medium": 35
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 39
  },
  {
    "id": "prosciutto",
    "category": "pizza",
    "groupId": "pizza-toppings-meat",
    "name": "Prosciutto",
    "serving": "S: 20; M: 40",
    "description": "Extra prosciutto topping for pizza.",
    "descriptionVi": "Topping prosciutto thêm cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 40
  },
  {
    "id": "mozzarella",
    "category": "pizza",
    "groupId": "pizza-toppings-cheese",
    "name": "Mozzarella",
    "serving": "S: 20; M: 40",
    "description": "Extra mozzarella cheese for pizza.",
    "descriptionVi": "Thêm phô mai mozzarella cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "addon",
    "displayOrder": 41
  },
  {
    "id": "parmesan",
    "category": "pizza",
    "groupId": "pizza-toppings-cheese",
    "name": "Parmesan",
    "serving": "S: 20; M: 40",
    "description": "Extra parmesan cheese for pizza.",
    "descriptionVi": "Thêm phô mai parmesan cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "addon",
    "displayOrder": 42
  },
  {
    "id": "blue-cheese",
    "category": "pizza",
    "groupId": "pizza-toppings-cheese",
    "name": "Blue Cheese",
    "serving": "S: 20; M: 40",
    "description": "Extra blue cheese for pizza.",
    "descriptionVi": "Thêm phô mai xanh cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "addon",
    "displayOrder": 43
  },
  {
    "id": "feta",
    "category": "pizza",
    "groupId": "pizza-toppings-cheese",
    "name": "Feta",
    "serving": "S: 20; M: 40",
    "description": "Extra feta cheese for pizza.",
    "descriptionVi": "Thêm phô mai feta cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "addon",
    "displayOrder": 44
  },
  {
    "id": "scamorza",
    "category": "pizza",
    "groupId": "pizza-toppings-cheese",
    "name": "Scamorza",
    "serving": "S: 20; M: 40",
    "description": "Extra scamorza cheese for pizza.",
    "descriptionVi": "Thêm phô mai scamorza cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "addon",
    "displayOrder": 45
  },
  {
    "id": "cheddar",
    "category": "pizza",
    "groupId": "pizza-toppings-cheese",
    "name": "Cheddar",
    "serving": "S: 20; M: 40",
    "description": "Extra cheddar cheese for pizza.",
    "descriptionVi": "Thêm phô mai cheddar cho pizza.",
    "prices": {
      "small": 20,
      "medium": 40
    },
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "addon",
    "displayOrder": 46
  },
  {
    "id": "creamy-pesto-spaghetti-chicken",
    "category": "pasta",
    "groupId": "pasta-main",
    "name": "Creamy Pesto Spaghetti Chicken",
    "description": "Garlic, cooking cream, homemade pesto sauce, chicken, parmesan cheese, olive oil.",
    "descriptionVi": "Tỏi, sốt kem, sốt húng quế nhà làm, gà, phô mai parmesan, dầu ô liu.",
    "price": 125,
    "recommended": true,
    "tags": [
      {
        "en": "comfortfood",
        "vi": "mónănngon"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 47
  },
  {
    "id": "spaghetti-bolognese",
    "category": "pasta",
    "groupId": "pasta-main",
    "name": "Spaghetti Bolognese",
    "description": "Garlic, Bolognese sauce, parmesan cheese, basil, olive oil.",
    "descriptionVi": "Tỏi, sốt bò bằm, phô mai parmesan, húng quế tây, dầu ô liu.",
    "price": 125,
    "tags": [
      {
        "en": "comfortfood",
        "vi": "mónănngon"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 48
  },
  {
    "id": "rigatoni-carbonara",
    "category": "pasta",
    "groupId": "pasta-main",
    "name": "Rigatoni Carbonara",
    "description": "Cooking cream, egg yolk, bacon, garlic, parmesan cheese, olive oil.",
    "descriptionVi": "Sốt kem, lòng đỏ trứng, thịt heo xông khói, tỏi, phô mai parmesan, dầu ô liu.",
    "price": 125,
    "recommended": true,
    "tags": [
      {
        "en": "comfortfood",
        "vi": "mónănngon"
      },
      {
        "en": "smoky",
        "vi": "xongkhoi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 49
  },
  {
    "id": "pesto-spaghetti-seafood",
    "category": "pasta",
    "groupId": "pasta-main",
    "name": "Pesto Spaghetti Seafood",
    "description": "Garlic, homemade pesto sauce, shrimp, squid, clam, parmesan cheese, olive oil.",
    "descriptionVi": "Tỏi, sốt pesto nhà làm, tôm, mực, nghêu, phô mai parmesan, dầu ô liu.",
    "price": 135,
    "tags": [
      {
        "en": "comfortfood",
        "vi": "mónănngon"
      },
      {
        "en": "seafood",
        "vi": "haisan"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 50
  },
  {
    "id": "seafood-spaghetti",
    "category": "pasta",
    "groupId": "pasta-main",
    "name": "Seafood Spaghetti",
    "description": "Garlic, tomato sauce, shrimp, squid, clam, parmesan cheese, olive oil.",
    "descriptionVi": "Tỏi, sốt cà chua, tôm, mực, nghêu, phô mai parmesan, dầu ô liu.",
    "price": 135,
    "tags": [
      {
        "en": "comfortfood",
        "vi": "mónănngon"
      },
      {
        "en": "seafood",
        "vi": "haisan"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 51
  },
  {
    "id": "creamy-smoked-salmon-spaghetti",
    "category": "pasta",
    "groupId": "pasta-main",
    "name": "Creamy Smoked Salmon Spaghetti",
    "description": "Garlic, cooking cream, egg yolk, smoked salmon, parmesan cheese, olive oil.",
    "descriptionVi": "Tỏi, kem nấu ăn, lòng đỏ trứng, cá hồi xông khói, phô mai parmesan, dầu ô liu.",
    "price": 155,
    "tags": [
      {
        "en": "comfortfood",
        "vi": "mónănngon"
      },
      {
        "en": "salmon",
        "vi": "cahoi"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 52
  },
  {
    "id": "truffle-spaghetti",
    "category": "pasta",
    "groupId": "pasta-main",
    "name": "Truffle Spaghetti",
    "description": "Garlic, cooking cream, truffle pâté, mixed fresh mushroom, parmesan cheese, olive oil.",
    "descriptionVi": "Tỏi, sốt kem, pâté nấm truffle, hỗn hợp nấm tươi, phô mai parmesan, dầu ô liu.",
    "price": 155,
    "recommended": true,
    "tags": [
      {
        "en": "comfortfood",
        "vi": "mónănngon"
      },
      {
        "en": "mushroom",
        "vi": "namtuoi"
      },
      {
        "en": "truffle",
        "vi": "namtruffle"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      },
      {
        "en": "vegetarian",
        "vi": "dochay"
      },
      {
        "en": "musttry",
        "vi": "nenthu"
      }
    ],
    "kind": "dish",
    "displayOrder": 53
  },
  {
    "id": "greek-salad",
    "category": "salad-burger",
    "groupId": "salad",
    "name": "Greek Salad",
    "description": "Cherry tomato, black olive, purple onion, cucumber, feta cheese, balsamic cream, parmesan cheese.",
    "descriptionVi": "Cà chua bi, ô liu đen, hành đỏ, dưa chuột, phô mai feta, giấm balsamic, phô mai parmesan.",
    "price": 95,
    "tags": [
      {
        "en": "healthy",
        "vi": "lànhmạnh"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      },
      {
        "en": "vegetarian",
        "vi": "dochay"
      }
    ],
    "kind": "dish",
    "displayOrder": 54
  },
  {
    "id": "chicken-pasta-salad",
    "category": "salad-burger",
    "groupId": "salad",
    "name": "Chicken Pasta Salad",
    "description": "Homemade pesto sauce, arugula, parmesan cheese, black olive, balsamic cream, almond, rigatoni, cherry tomato.",
    "descriptionVi": "Sốt húng quế tây nhà làm, rau rocket, phô mai parmesan, ô liu đen, giấm balsamic, hạnh nhân, mì rigatoni, cà chua bi.",
    "price": 125,
    "tags": [
      {
        "en": "healthy",
        "vi": "lànhmạnh"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "dish",
    "displayOrder": 55
  },
  {
    "id": "beef-belly-salad",
    "category": "salad-burger",
    "groupId": "salad",
    "name": "Beef Belly Salad",
    "description": "Lettuce, rocket, purple onion, beef belly, almond.",
    "descriptionVi": "Xà lách, rau rocket, hành tây tím, ba chỉ bò, hạnh nhân.",
    "price": 105,
    "tags": [
      {
        "en": "healthy",
        "vi": "lànhmạnh"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "beeflover",
        "vi": "thitbo"
      }
    ],
    "kind": "dish",
    "displayOrder": 56
  },
  {
    "id": "cheese-burger",
    "category": "salad-burger",
    "groupId": "burger",
    "name": "Cheese Burger",
    "description": "Burger bun, lettuce, cucumber pickle, onion, tomato, burger sauce, 125g beef patty, cheddar cheese. Served with French fries on the side.",
    "descriptionVi": "Bánh burger, rau xà lách, dưa leo ngâm, hành tây, cà chua, sốt burger, 125g bò, phô mai cheddar. Phục vụ cùng khoai tây chiên.",
    "price": 115,
    "tags": [
      {
        "en": "juicy",
        "vi": "đậmvị"
      },
      {
        "en": "beeflover",
        "vi": "thitbo"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 57
  },
  {
    "id": "double-cheese-burger",
    "category": "salad-burger",
    "groupId": "burger",
    "name": "Double Cheese Burger",
    "description": "Burger bun, lettuce, cucumber pickle, tomato, onion, two 125g beef patties, two cheddar cheese slices, burger sauce. Served with French fries on the side.",
    "descriptionVi": "Bánh burger, rau xà lách, dưa leo ngâm, cà chua, hành tây, 2 miếng bò xay 125g, 2 lát phô mai cheddar, sốt burger. Phục vụ cùng khoai tây chiên.",
    "price": 145,
    "tags": [
      {
        "en": "juicy",
        "vi": "đậmvị"
      },
      {
        "en": "beeflover",
        "vi": "thitbo"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "dish",
    "displayOrder": 58
  },
  {
    "id": "egg",
    "category": "salad-burger",
    "groupId": "burger-extra",
    "name": "Egg",
    "serving": "Burger extra topping",
    "description": "Extra egg topping for burger.",
    "descriptionVi": "Thêm trứng cho burger.",
    "price": 15,
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      }
    ],
    "kind": "addon",
    "displayOrder": 59
  },
  {
    "id": "bacon",
    "category": "salad-burger",
    "groupId": "burger-extra",
    "name": "Bacon",
    "serving": "Burger extra topping",
    "description": "Extra bacon topping for burger.",
    "descriptionVi": "Thêm thịt heo xông khói cho burger.",
    "price": 15,
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "smoky",
        "vi": "xongkhoi"
      }
    ],
    "kind": "addon",
    "displayOrder": 60
  },
  {
    "id": "cheddar",
    "category": "salad-burger",
    "groupId": "burger-extra",
    "name": "Cheddar",
    "serving": "Burger extra topping",
    "description": "Extra cheddar cheese for burger.",
    "descriptionVi": "Thêm phô mai cheddar cho burger.",
    "price": 15,
    "tags": [
      {
        "en": "extratopping",
        "vi": "toppingthêm"
      },
      {
        "en": "cheeselover",
        "vi": "phomai"
      }
    ],
    "kind": "addon",
    "displayOrder": 61
  },
  {
    "id": "french-fries",
    "category": "salad-burger",
    "groupId": "grilled-fried",
    "name": "French Fries",
    "description": "Crispy French fries.",
    "descriptionVi": "Khoai tây chiên giòn.",
    "price": 50,
    "tags": [
      {
        "en": "grilled",
        "vi": "nướngthơm"
      }
    ],
    "kind": "dish",
    "displayOrder": 62
  },
  {
    "id": "potato-wedges",
    "category": "salad-burger",
    "groupId": "grilled-fried",
    "name": "Potato Wedges",
    "description": "Fried potato wedges.",
    "descriptionVi": "Khoai tây chiên múi cau.",
    "price": 75,
    "tags": [
      {
        "en": "crispy",
        "vi": "giònrụm"
      }
    ],
    "kind": "dish",
    "displayOrder": 63
  },
  {
    "id": "chicken-wings",
    "category": "salad-burger",
    "groupId": "grilled-fried",
    "name": "Chicken Wings",
    "serving": "5 pcs: 160; 8 pcs: 220",
    "description": "Chicken wings served in 5-piece or 8-piece portions.",
    "descriptionVi": "Cánh gà, phục vụ theo phần 5 cánh hoặc 8 cánh.",
    "prices": {
      "fivePcs": 160,
      "eightPcs": 220
    },
    "tags": [
      {
        "en": "grilled",
        "vi": "nướngthơm"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "dish",
    "displayOrder": 64
  },
  {
    "id": "grilled-beef-belly-nachos",
    "category": "mexican",
    "groupId": "nachos",
    "name": "Grilled Beef Belly Nachos",
    "description": "Homemade chips, salsa, bean, jalapeño, guacamole, sour cream, grilled beef belly, parmesan cheese.",
    "descriptionVi": "Bánh nhà làm, salsa, đậu, ớt jalapeño, bơ, kem chua, ba chỉ bò nướng, phô mai parmesan.",
    "price": 135,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "beeflover",
        "vi": "thitbo"
      }
    ],
    "kind": "dish",
    "displayOrder": 65
  },
  {
    "id": "vegetarian-nachos",
    "category": "mexican",
    "groupId": "nachos",
    "name": "Vegetarian Nachos",
    "description": "Homemade chips, salsa, corn, bean, jalapeño, guacamole, cherry tomato, sour cream, parmesan cheese.",
    "descriptionVi": "Bánh nhà làm, salsa, bắp mỹ, đậu, ớt jalapeño, bơ, cà chua bi, kem chua, phô mai parmesan.",
    "price": 105,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "vegetarian",
        "vi": "chay"
      }
    ],
    "kind": "dish",
    "displayOrder": 66
  },
  {
    "id": "grilled-chicken-nachos",
    "category": "mexican",
    "groupId": "nachos",
    "name": "Grilled Chicken Nachos",
    "description": "Homemade chips, salsa, bean, jalapeño, guacamole, sour cream, parmesan cheese, grilled chicken.",
    "descriptionVi": "Bánh nhà làm, salsa, đậu, ớt jalapeño, bơ, kem chua, phô mai parmesan, gà nướng.",
    "price": 125,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "dish",
    "displayOrder": 67
  },
  {
    "id": "grilled-chicken-tacos",
    "category": "mexican",
    "groupId": "tacos",
    "name": "Grilled Chicken Tacos",
    "serving": "3 pcs",
    "description": "Tortilla, lettuce, jalapeño salsa, grilled chicken, guacamole, sour cream.",
    "descriptionVi": "Tortilla, xà lách, salsa ớt jalapeño, gà nướng, bơ, kem chua.",
    "price": 115,
    "recommended": true,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "dish",
    "displayOrder": 68
  },
  {
    "id": "slow-cooked-chicken-tacos",
    "category": "mexican",
    "groupId": "tacos",
    "name": "Slow Cooked Chicken Tacos",
    "serving": "3 pcs",
    "description": "Tortilla, lettuce, jalapeño salsa, slow cooked chicken, guacamole, sour cream.",
    "descriptionVi": "Tortilla, xà lách, salsa ớt jalapeño, gà hầm/nấu chậm, bơ, kem chua.",
    "price": 125,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "dish",
    "displayOrder": 69
  },
  {
    "id": "stewed-pork-tacos",
    "category": "mexican",
    "groupId": "tacos",
    "name": "Stewed Pork Tacos",
    "serving": "3 pcs",
    "description": "Tortilla, lettuce, jalapeño salsa, stewed pork, guacamole, sour cream.",
    "descriptionVi": "Tortilla, xà lách, salsa ớt jalapeño, heo hầm, bơ, kem chua.",
    "price": 125,
    "recommended": true,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "porklover",
        "vi": "thitheo"
      }
    ],
    "kind": "dish",
    "displayOrder": 70
  },
  {
    "id": "grilled-beef-belly-tacos",
    "category": "mexican",
    "groupId": "tacos",
    "name": "Grilled Beef Belly Tacos",
    "serving": "3 pcs",
    "description": "Tortilla, lettuce, jalapeño salsa, grilled beef belly, guacamole, sour cream.",
    "descriptionVi": "Tortilla, xà lách, salsa ớt jalapeño, ba chỉ bò nướng, bơ, kem chua.",
    "price": 135,
    "recommended": true,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "beeflover",
        "vi": "thitbo"
      }
    ],
    "kind": "dish",
    "displayOrder": 71
  },
  {
    "id": "smoked-salmon-tacos",
    "category": "mexican",
    "groupId": "tacos",
    "name": "Smoked Salmon Tacos",
    "serving": "3 pcs",
    "description": "Tortilla, lettuce, jalapeño salsa, smoked salmon, guacamole, sour cream.",
    "descriptionVi": "Tortilla, xà lách, salsa ớt jalapeño, cá hồi xông khói, bơ, kem chua.",
    "price": 155,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "salmon",
        "vi": "cahoi"
      }
    ],
    "kind": "dish",
    "displayOrder": 72
  },
  {
    "id": "vegetarian-tacos",
    "category": "mexican",
    "groupId": "tacos",
    "name": "Vegetarian Tacos",
    "serving": "3 pcs",
    "description": "Tortilla, lettuce, salsa, corn, mushroom, cherry tomato, jalapeño, guacamole, sour cream.",
    "descriptionVi": "Tortilla, xà lách, salsa, bắp mỹ, nấm, cà chua bi, ớt jalapeño, bơ, kem chua.",
    "price": 105,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "vegetarian",
        "vi": "chay"
      }
    ],
    "kind": "dish",
    "displayOrder": 73
  },
  {
    "id": "tempura-shrimp-tacos",
    "category": "mexican",
    "groupId": "tacos",
    "name": "Tempura Shrimp Tacos",
    "serving": "3 pcs",
    "description": "Tortilla, lettuce, jalapeño salsa, tempura shrimp, guacamole, sour cream.",
    "descriptionVi": "Tortilla, xà lách, salsa ớt jalapeño, tôm chiên bột tempura, bơ, kem chua.",
    "price": 135,
    "recommended": true,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "seafood",
        "vi": "haisan"
      }
    ],
    "kind": "dish",
    "displayOrder": 74
  },
  {
    "id": "fried-fish-tacos",
    "category": "mexican",
    "groupId": "tacos",
    "name": "Fried Fish Tacos",
    "serving": "3 pcs",
    "description": "Tortilla, lettuce, jalapeño salsa, fried fish, guacamole, sour cream.",
    "descriptionVi": "Tortilla, xà lách, salsa ớt jalapeño, cá chiên, bơ, kem chua.",
    "price": 125,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "seafood",
        "vi": "haisan"
      }
    ],
    "kind": "dish",
    "displayOrder": 75
  },
  {
    "id": "ground-beef-quesadilla",
    "category": "mexican",
    "groupId": "quesadilla",
    "name": "Ground Beef Quesadilla",
    "description": "Homemade tortilla, mozzarella cheese, bean sauce, salsa, jalapeño, ground beef, quesadilla sauce.",
    "descriptionVi": "Tortilla nhà làm, phô mai mozzarella, sốt đậu, salsa, ớt jalapeño, thịt bò xay, sốt quesadilla.",
    "price": 135,
    "recommended": true,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "beeflover",
        "vi": "thitbo"
      }
    ],
    "kind": "dish",
    "displayOrder": 76
  },
  {
    "id": "tender-roasted-chicken-quesadilla",
    "category": "mexican",
    "groupId": "quesadilla",
    "name": "Tender Roasted Chicken Quesadilla",
    "description": "Homemade tortilla, mozzarella cheese, bean sauce, salsa, jalapeño, tender roasted chicken, quesadilla sauce.",
    "descriptionVi": "Tortilla nhà làm, phô mai mozzarella, sốt đậu, salsa, ớt jalapeño, gà nướng mềm, sốt quesadilla.",
    "price": 135,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "dish",
    "displayOrder": 77
  },
  {
    "id": "grilled-chicken-quesadilla",
    "category": "mexican",
    "groupId": "quesadilla",
    "name": "Grilled Chicken Quesadilla",
    "description": "Homemade tortilla, mozzarella cheese, bean sauce, salsa, jalapeño, grilled chicken, quesadilla sauce.",
    "descriptionVi": "Tortilla nhà làm, phô mai mozzarella, sốt đậu, salsa, ớt jalapeño, gà nướng, sốt quesadilla.",
    "price": 130,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "dish",
    "displayOrder": 78
  },
  {
    "id": "stewed-pork-quesadilla",
    "category": "mexican",
    "groupId": "quesadilla",
    "name": "Stewed Pork Quesadilla",
    "description": "Homemade tortilla, mozzarella cheese, bean sauce, salsa, jalapeño, stewed pork, quesadilla sauce.",
    "descriptionVi": "Tortilla nhà làm, phô mai mozzarella, sốt đậu, salsa, ớt jalapeño, heo hầm, sốt quesadilla.",
    "price": 125,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "porklover",
        "vi": "thitheo"
      }
    ],
    "kind": "dish",
    "displayOrder": 79
  },
  {
    "id": "vegetarian-quesadilla",
    "category": "mexican",
    "groupId": "quesadilla",
    "name": "Vegetarian Quesadilla",
    "description": "Homemade tortilla, mozzarella cheese, bean sauce, salsa, jalapeño, mushroom, quesadilla sauce.",
    "descriptionVi": "Tortilla nhà làm, phô mai mozzarella, sốt đậu, salsa, ớt jalapeño, nấm, sốt quesadilla.",
    "price": 125,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "vegetarian",
        "vi": "chay"
      }
    ],
    "kind": "dish",
    "displayOrder": 80
  },
  {
    "id": "ground-beef-wrap",
    "category": "mexican",
    "groupId": "wrap",
    "name": "Ground Beef Wrap",
    "description": "Homemade tortilla, ground beef, mozzarella cheese, lettuce, salsa, corn, jalapeño, sour cream, wrap sauce.",
    "descriptionVi": "Tortilla nhà làm, bò xay, phô mai mozzarella, xà lách, salsa, bắp mỹ, ớt jalapeño, kem chua, sốt wrap.",
    "price": 125,
    "recommended": true,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "beeflover",
        "vi": "thitbo"
      }
    ],
    "kind": "dish",
    "displayOrder": 81
  },
  {
    "id": "tender-roasted-chicken-wrap",
    "category": "mexican",
    "groupId": "wrap",
    "name": "Tender Roasted Chicken Wrap",
    "description": "Homemade tortilla, tender roasted chicken, mozzarella cheese, lettuce, salsa, corn, jalapeño, sour cream, wrap sauce.",
    "descriptionVi": "Tortilla nhà làm, gà nướng mềm, phô mai mozzarella, xà lách, salsa, bắp mỹ, ớt jalapeño, kem chua, sốt wrap.",
    "price": 125,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "dish",
    "displayOrder": 82
  },
  {
    "id": "grilled-chicken-wrap",
    "category": "mexican",
    "groupId": "wrap",
    "name": "Grilled Chicken Wrap",
    "description": "Homemade tortilla, grilled chicken, mozzarella cheese, lettuce, salsa, corn, jalapeño, sour cream, wrap sauce.",
    "descriptionVi": "Tortilla nhà làm, gà nướng, phô mai mozzarella, xà lách, salsa, bắp mỹ, ớt jalapeño, kem chua, sốt wrap.",
    "price": 120,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "chickenlover",
        "vi": "thitga"
      }
    ],
    "kind": "dish",
    "displayOrder": 83
  },
  {
    "id": "stewed-pork-wrap",
    "category": "mexican",
    "groupId": "wrap",
    "name": "Stewed Pork Wrap",
    "description": "Homemade tortilla, stewed pork, mozzarella cheese, lettuce, salsa, corn, jalapeño, sour cream, wrap sauce.",
    "descriptionVi": "Tortilla nhà làm, heo hầm, phô mai mozzarella, xà lách, salsa, bắp mỹ, ớt jalapeño, kem chua, sốt wrap.",
    "price": 115,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "porklover",
        "vi": "thitheo"
      }
    ],
    "kind": "dish",
    "displayOrder": 84
  },
  {
    "id": "vegetarian-wrap",
    "category": "mexican",
    "groupId": "wrap",
    "name": "Vegetarian Wrap",
    "description": "Homemade tortilla, mushroom, mozzarella cheese, salad, salsa, corn, jalapeño, sour cream, wrap sauce.",
    "descriptionVi": "Tortilla nhà làm, nấm, phô mai mozzarella, salad, salsa, bắp mỹ, ớt jalapeño, kem chua, sốt wrap.",
    "price": 105,
    "tags": [
      {
        "en": "mexicanfood",
        "vi": "ẩmthựcmexico"
      },
      {
        "en": "freshfood",
        "vi": "tươisạch"
      },
      {
        "en": "vegetarian",
        "vi": "chay"
      }
    ],
    "kind": "dish",
    "displayOrder": 85
  },
  {
    "id": "flying-bees",
    "category": "drinks",
    "groupId": "beer-steerman",
    "name": "Flying Bees",
    "serving": "Bottle",
    "description": "Steerman bottled beer, 4.9% ABV, IBU 13.",
    "descriptionVi": "Bia chai Steerman, độ cồn 4.9%, IBU 13.",
    "price": 75,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 86
  },
  {
    "id": "mango-hard-soda",
    "category": "drinks",
    "groupId": "beer-steerman",
    "name": "Mango Hard Soda",
    "serving": "Can",
    "description": "Steerman mango hard soda, 5% ABV.",
    "descriptionVi": "Hard soda Steerman vị xoài, độ cồn 5%.",
    "price": 70,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 87
  },
  {
    "id": "pink-guava-hard-soda",
    "category": "drinks",
    "groupId": "beer-steerman",
    "name": "Pink Guava Hard Soda",
    "serving": "Bottle",
    "description": "Steerman pink guava hard soda, 4.9% ABV, IBU 13.",
    "descriptionVi": "Hard soda Steerman vị ổi hồng, độ cồn 4.9%, IBU 13.",
    "price": 65,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 88
  },
  {
    "id": "dragon-3-coil",
    "category": "drinks",
    "groupId": "beer-7bridges",
    "name": "Dragon 3 Coil",
    "serving": "Can",
    "description": "7Bridges canned beer, 4.8% ABV, IBU 32.",
    "descriptionVi": "Bia lon 7Bridges, độ cồn 4.8%, IBU 32.",
    "price": 85,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 89
  },
  {
    "id": "sunset-tangerine-wheat",
    "category": "drinks",
    "groupId": "beer-7bridges",
    "name": "Sunset Tangerine Wheat",
    "serving": "Can",
    "description": "7Bridges canned wheat beer, 4.2% ABV, IBU 16.",
    "descriptionVi": "Bia lúa mì lon 7Bridges, độ cồn 4.2%, IBU 16.",
    "price": 85,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 90
  },
  {
    "id": "metal-weizen",
    "category": "drinks",
    "groupId": "beer-five-elements",
    "name": "Metal - Weizen",
    "serving": "Bottle",
    "description": "Five Elements bottled Weizen beer, 4.6% ABV, IBU 16.",
    "descriptionVi": "Bia Weizen chai Five Elements, độ cồn 4.6%, IBU 16.",
    "price": 70,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 91
  },
  {
    "id": "water-vierge-blonde",
    "category": "drinks",
    "groupId": "beer-five-elements",
    "name": "Water - Vierge Blonde",
    "serving": "Bottle",
    "description": "Five Elements bottled blonde beer, 4.6% ABV, IBU 20.",
    "descriptionVi": "Bia blonde chai Five Elements, độ cồn 4.6%, IBU 20.",
    "price": 75,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 92
  },
  {
    "id": "earth-black-forest-ale",
    "category": "drinks",
    "groupId": "beer-five-elements",
    "name": "Earth - Black Forest Ale",
    "serving": "Bottle",
    "description": "Five Elements bottled ale, 4.9% ABV, IBU 16.",
    "descriptionVi": "Bia ale chai Five Elements, độ cồn 4.9%, IBU 16.",
    "price": 70,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 93
  },
  {
    "id": "wood-pacific-pale-ale",
    "category": "drinks",
    "groupId": "beer-five-elements",
    "name": "Wood - Pacific Pale Ale",
    "serving": "Bottle",
    "description": "Five Elements bottled pale ale, 5.2% ABV, IBU 25.",
    "descriptionVi": "Bia pale ale chai Five Elements, độ cồn 5.2%, IBU 25.",
    "price": 70,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 94
  },
  {
    "id": "fire-fiery-red-ale",
    "category": "drinks",
    "groupId": "beer-five-elements",
    "name": "Fire - Fiery Red Ale",
    "serving": "Bottle",
    "description": "Five Elements bottled red ale, 6.8% ABV, IBU 23.",
    "descriptionVi": "Bia red ale chai Five Elements, độ cồn 6.8%, IBU 23.",
    "price": 85,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 95
  },
  {
    "id": "five-elements-bucket",
    "category": "drinks",
    "groupId": "beer-other",
    "name": "Five Elements Bucket",
    "serving": "5 bottles",
    "description": "Five Elements beer bucket with 5 bottles.",
    "descriptionVi": "Bucket bia Five Elements gồm 5 chai.",
    "price": 330,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 96
  },
  {
    "id": "pale-ale",
    "category": "drinks",
    "groupId": "beer-other",
    "name": "Pale Ale",
    "serving": "Bottle",
    "description": "East West bottled pale ale, 6% ABV, IBU 32.",
    "descriptionVi": "Bia pale ale chai East West, độ cồn 6%, IBU 32.",
    "price": 80,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 97
  },
  {
    "id": "east-west-ipa",
    "category": "drinks",
    "groupId": "beer-other",
    "name": "East West IPA",
    "serving": "Bottle",
    "description": "East West bottled IPA, 6.7% ABV, IBU 54.",
    "descriptionVi": "Bia IPA chai East West, độ cồn 6.7%, IBU 54.",
    "price": 90,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 98
  },
  {
    "id": "pineapple-cider",
    "category": "drinks",
    "groupId": "beer-other",
    "name": "Pineapple Cider",
    "serving": "Bottle",
    "description": "East West bottled pineapple cider, 4.6% ABV.",
    "descriptionVi": "Cider chai East West vị dứa/thơm, độ cồn 4.6%.",
    "price": 65,
    "tags": [
      {
        "en": "tropical",
        "vi": "nhietdoi"
      }
    ],
    "kind": "drink",
    "displayOrder": 99
  },
  {
    "id": "berries-cider",
    "category": "drinks",
    "groupId": "beer-other",
    "name": "Berries Cider",
    "serving": "Bottle",
    "description": "East West bottled berries cider, 4.6% ABV.",
    "descriptionVi": "Cider chai East West vị berry, độ cồn 4.6%.",
    "price": 65,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 100
  },
  {
    "id": "apple-cider",
    "category": "drinks",
    "groupId": "beer-other",
    "name": "Apple Cider",
    "serving": "Bottle",
    "description": "East West bottled apple cider, 4.6% ABV.",
    "descriptionVi": "Cider chai East West vị táo, độ cồn 4.6%.",
    "price": 70,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 101
  },
  {
    "id": "beach-style-blonde-ale",
    "category": "drinks",
    "groupId": "beer-tap",
    "name": "Beach Style - Blonde Ale",
    "serving": "Glass 330ml",
    "description": "Blonde ale on tap, 5% ABV, IBU 18.",
    "descriptionVi": "Bia tươi blonde ale, ly 330ml, độ cồn 5%, IBU 18.",
    "price": 75,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 102
  },
  {
    "id": "victorious-bastard-laurel-pale-ale",
    "category": "drinks",
    "groupId": "beer-tap",
    "name": "Victorious Bastard - Laurel Pale Ale",
    "serving": "Glass 330ml",
    "description": "Laurel pale ale on tap, 6% ABV, IBU 18.",
    "descriptionVi": "Bia tươi laurel pale ale, ly 330ml, độ cồn 6%, IBU 18.",
    "price": 85,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 103
  },
  {
    "id": "tester-set",
    "category": "drinks",
    "groupId": "beer-tap",
    "name": "Tester Set",
    "serving": "2 glasses x 160ml",
    "description": "Beer tasting set with 2 glasses, 160ml each.",
    "descriptionVi": "Bộ thử bia gồm 2 ly, mỗi ly 160ml.",
    "price": 85,
    "tags": [
      {
        "en": "craftbeer",
        "vi": "biathủcông"
      }
    ],
    "kind": "drink",
    "displayOrder": 104
  },
  {
    "id": "huda",
    "category": "drinks",
    "groupId": "beer-other",
    "name": "Huda",
    "serving": "Bottle",
    "description": "Bottled Huda beer, 4.7% ABV.",
    "descriptionVi": "Bia Huda chai, độ cồn 4.7%.",
    "price": 35,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 105
  },
  {
    "id": "tini-pinot-grigio",
    "category": "drinks",
    "groupId": "wine",
    "name": "TINI Pinot Grigio",
    "serving": "387ml bottle",
    "description": "TINI Pinot Grigio white wine.",
    "descriptionVi": "Rượu vang trắng TINI Pinot Grigio.",
    "price": 205,
    "tags": [
      {
        "en": "wine",
        "vi": "ruouvang"
      }
    ],
    "kind": "drink",
    "displayOrder": 106
  },
  {
    "id": "tini-sangiovese",
    "category": "drinks",
    "groupId": "wine",
    "name": "TINI Sangiovese",
    "serving": "387ml bottle",
    "description": "TINI Sangiovese red wine.",
    "descriptionVi": "Rượu vang đỏ TINI Sangiovese.",
    "price": 205,
    "tags": [
      {
        "en": "wine",
        "vi": "ruouvang"
      }
    ],
    "kind": "drink",
    "displayOrder": 107
  },
  {
    "id": "ginger-ale",
    "category": "drinks",
    "groupId": "soft-drinks",
    "name": "Ginger Ale",
    "description": "Ginger ale soft drink.",
    "descriptionVi": "Nước ngọt ginger ale.",
    "price": 25,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      },
      {
        "en": "warming",
        "vi": "amap"
      }
    ],
    "kind": "drink",
    "displayOrder": 108
  },
  {
    "id": "water",
    "category": "drinks",
    "groupId": "soft-drinks",
    "name": "Water",
    "description": "Bottled drinking water.",
    "descriptionVi": "Nước uống đóng chai.",
    "price": 25,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 109
  },
  {
    "id": "coca",
    "category": "drinks",
    "groupId": "soft-drinks",
    "name": "Coca",
    "description": "Coca-Cola soft drink.",
    "descriptionVi": "Nước ngọt Coca-Cola.",
    "price": 25,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 110
  },
  {
    "id": "coca-light",
    "category": "drinks",
    "groupId": "soft-drinks",
    "name": "Coca Light",
    "description": "Coca-Cola Light soft drink.",
    "descriptionVi": "Nước ngọt Coca-Cola Light.",
    "price": 25,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 111
  },
  {
    "id": "coca-zero",
    "category": "drinks",
    "groupId": "soft-drinks",
    "name": "Coca Zero",
    "description": "Coca-Cola Zero soft drink.",
    "descriptionVi": "Nước ngọt Coca-Cola Zero.",
    "price": 25,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 112
  },
  {
    "id": "sprite",
    "category": "drinks",
    "groupId": "soft-drinks",
    "name": "Sprite",
    "description": "Sprite lemon-lime soft drink.",
    "descriptionVi": "Nước ngọt Sprite vị chanh.",
    "price": 25,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      },
      {
        "en": "citrus",
        "vi": "camchanh"
      }
    ],
    "kind": "drink",
    "displayOrder": 113
  },
  {
    "id": "fanta",
    "category": "drinks",
    "groupId": "soft-drinks",
    "name": "Fanta",
    "description": "Fanta soft drink.",
    "descriptionVi": "Nước ngọt Fanta.",
    "price": 25,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 114
  },
  {
    "id": "soda-water",
    "category": "drinks",
    "groupId": "soft-drinks",
    "name": "Soda Water",
    "description": "Sparkling soda water.",
    "descriptionVi": "Soda water có ga.",
    "price": 25,
    "tags": [
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 115
  },
  {
    "id": "lemongrass-lemonade-fizz-soda",
    "category": "drinks",
    "groupId": "fizz-soda",
    "name": "Lemongrass & Lemonade Fizz Soda",
    "description": "Fizz soda with lemongrass and lemonade.",
    "descriptionVi": "Soda có ga vị sả và chanh.",
    "price": 45,
    "tags": [
      {
        "en": "fizzy",
        "vi": "cogas"
      },
      {
        "en": "refreshing",
        "vi": "giaikhat"
      },
      {
        "en": "citrus",
        "vi": "camchanh"
      }
    ],
    "kind": "drink",
    "displayOrder": 116
  },
  {
    "id": "passion-fruit-orange-fizz-soda",
    "category": "drinks",
    "groupId": "fizz-soda",
    "name": "Passion Fruit Orange Fizz Soda",
    "description": "Fizz soda with passion fruit and orange.",
    "descriptionVi": "Soda có ga vị chanh dây và cam.",
    "price": 45,
    "tags": [
      {
        "en": "fizzy",
        "vi": "cogas"
      },
      {
        "en": "refreshing",
        "vi": "giaikhat"
      },
      {
        "en": "citrus",
        "vi": "camchanh"
      }
    ],
    "kind": "drink",
    "displayOrder": 117
  },
  {
    "id": "tamarind-vanilla-fizz-soda",
    "category": "drinks",
    "groupId": "fizz-soda",
    "name": "Tamarind & Vanilla Fizz Soda",
    "description": "Fizz soda with tamarind and vanilla.",
    "descriptionVi": "Soda có ga vị me và vanilla.",
    "price": 45,
    "tags": [
      {
        "en": "fizzy",
        "vi": "cogas"
      },
      {
        "en": "refreshing",
        "vi": "giaikhat"
      }
    ],
    "kind": "drink",
    "displayOrder": 118
  },
  {
    "id": "very-berry-fizz-soda",
    "category": "drinks",
    "groupId": "fizz-soda",
    "name": "Very Berry Fizz Soda",
    "description": "Fizz soda with mixed berry flavor.",
    "descriptionVi": "Soda có ga vị berry.",
    "price": 45,
    "tags": [
      {
        "en": "fizzy",
        "vi": "cogas"
      },
      {
        "en": "refreshing",
        "vi": "giaikhat"
      },
      {
        "en": "berry",
        "vi": "traimong"
      }
    ],
    "kind": "drink",
    "displayOrder": 119
  },
  {
    "id": "ginger-tea",
    "category": "drinks",
    "groupId": "tea",
    "name": "Ginger Tea",
    "serving": "Glass: 20; Pot: 35",
    "description": "Ginger tea served by glass or pot.",
    "descriptionVi": "Trà gừng, phục vụ theo ly hoặc ấm.",
    "prices": {
      "glass": 20,
      "pot": 35
    },
    "tags": [
      {
        "en": "teatime",
        "vi": "thanhmat"
      },
      {
        "en": "warming",
        "vi": "amap"
      }
    ],
    "kind": "drink",
    "displayOrder": 120
  },
  {
    "id": "jasmine-tea",
    "category": "drinks",
    "groupId": "tea",
    "name": "Jasmine Tea",
    "serving": "Glass: 20; Pot: 35",
    "description": "Jasmine tea served by glass or pot.",
    "descriptionVi": "Trà nhài, phục vụ theo ly hoặc ấm.",
    "prices": {
      "glass": 20,
      "pot": 35
    },
    "tags": [
      {
        "en": "teatime",
        "vi": "thanhmat"
      }
    ],
    "kind": "drink",
    "displayOrder": 121
  },
  {
    "id": "green-tea",
    "category": "drinks",
    "groupId": "tea",
    "name": "Green Tea",
    "serving": "Glass: 20; Pot: 35",
    "description": "Green tea served by glass or pot.",
    "descriptionVi": "Trà xanh, phục vụ theo ly hoặc ấm.",
    "prices": {
      "glass": 20,
      "pot": 35
    },
    "tags": [
      {
        "en": "teatime",
        "vi": "thanhmat"
      },
      {
        "en": "antioxidant",
        "vi": "chongoxyhoa"
      }
    ],
    "kind": "drink",
    "displayOrder": 122
  },
  {
    "id": "rose-tea",
    "category": "drinks",
    "groupId": "tea",
    "name": "Rose Tea",
    "serving": "Glass: 20; Pot: 35",
    "description": "Rose tea served by glass or pot.",
    "descriptionVi": "Trà hoa hồng, phục vụ theo ly hoặc ấm.",
    "prices": {
      "glass": 20,
      "pot": 35
    },
    "tags": [
      {
        "en": "teatime",
        "vi": "thanhmat"
      }
    ],
    "kind": "drink",
    "displayOrder": 123
  },
  {
    "id": "butterfly-pea-flower-tea",
    "category": "drinks",
    "groupId": "tea",
    "name": "Butterfly Pea Flower Tea",
    "serving": "Glass: 20; Pot: 35",
    "description": "Butterfly pea flower tea served by glass or pot.",
    "descriptionVi": "Trà hoa đậu biếc, phục vụ theo ly hoặc ấm.",
    "prices": {
      "glass": 20,
      "pot": 35
    },
    "tags": [
      {
        "en": "teatime",
        "vi": "thanhmat"
      }
    ],
    "kind": "drink",
    "displayOrder": 124
  },
  {
    "id": "vietnamese-tea",
    "category": "drinks",
    "groupId": "tea",
    "name": "Vietnamese Tea",
    "serving": "Glass: 20; Pot: 35",
    "description": "Vietnamese tea served by glass or pot.",
    "descriptionVi": "Trà Việt Nam, phục vụ theo ly hoặc ấm.",
    "prices": {
      "glass": 20,
      "pot": 35
    },
    "tags": [
      {
        "en": "teatime",
        "vi": "thanhmat"
      }
    ],
    "kind": "drink",
    "displayOrder": 125
  },
  {
    "id": "watermelon-juice",
    "category": "drinks",
    "groupId": "fresh-juice",
    "name": "Watermelon Juice",
    "description": "Fresh watermelon juice.",
    "descriptionVi": "Nước ép dưa hấu tươi.",
    "price": 40,
    "tags": [
      {
        "en": "freshjuice",
        "vi": "nuocep"
      },
      {
        "en": "vitamin",
        "vi": "vitamin"
      }
    ],
    "kind": "drink",
    "displayOrder": 126
  },
  {
    "id": "pineapple-juice",
    "category": "drinks",
    "groupId": "fresh-juice",
    "name": "Pineapple Juice",
    "description": "Fresh pineapple juice.",
    "descriptionVi": "Nước ép dứa/thơm tươi.",
    "price": 45,
    "tags": [
      {
        "en": "freshjuice",
        "vi": "nuocep"
      },
      {
        "en": "vitamin",
        "vi": "vitamin"
      },
      {
        "en": "tropical",
        "vi": "nhietdoi"
      }
    ],
    "kind": "drink",
    "displayOrder": 127
  },
  {
    "id": "apple-juice",
    "category": "drinks",
    "groupId": "fresh-juice",
    "name": "Apple Juice",
    "description": "Fresh apple juice.",
    "descriptionVi": "Nước ép táo tươi.",
    "price": 45,
    "tags": [
      {
        "en": "freshjuice",
        "vi": "nuocep"
      },
      {
        "en": "vitamin",
        "vi": "vitamin"
      }
    ],
    "kind": "drink",
    "displayOrder": 128
  },
  {
    "id": "lime-juice",
    "category": "drinks",
    "groupId": "fresh-juice",
    "name": "Lime Juice",
    "description": "Fresh lime juice.",
    "descriptionVi": "Nước ép chanh tươi.",
    "price": 30,
    "tags": [
      {
        "en": "freshjuice",
        "vi": "nuocep"
      },
      {
        "en": "vitamin",
        "vi": "vitamin"
      }
    ],
    "kind": "drink",
    "displayOrder": 129
  },
  {
    "id": "orange-juice",
    "category": "drinks",
    "groupId": "fresh-juice",
    "name": "Orange Juice",
    "description": "Fresh orange juice.",
    "descriptionVi": "Nước ép cam tươi.",
    "price": 40,
    "tags": [
      {
        "en": "freshjuice",
        "vi": "nuocep"
      },
      {
        "en": "vitamin",
        "vi": "vitamin"
      },
      {
        "en": "citrus",
        "vi": "camchanh"
      }
    ],
    "kind": "drink",
    "displayOrder": 130
  },
  {
    "id": "mix-juice",
    "category": "drinks",
    "groupId": "fresh-juice",
    "name": "Mix Juice",
    "description": "Mixed fresh fruit juice.",
    "descriptionVi": "Nước ép trái cây hỗn hợp.",
    "price": 45,
    "tags": [
      {
        "en": "freshjuice",
        "vi": "nuocep"
      },
      {
        "en": "vitamin",
        "vi": "vitamin"
      }
    ],
    "kind": "drink",
    "displayOrder": 131
  },
  {
    "id": "coconut",
    "category": "drinks",
    "groupId": "fresh-juice",
    "name": "Coconut",
    "description": "Fresh coconut drink.",
    "descriptionVi": "Nước dừa tươi.",
    "price": 45,
    "tags": [
      {
        "en": "freshjuice",
        "vi": "nuocep"
      },
      {
        "en": "vitamin",
        "vi": "vitamin"
      }
    ],
    "kind": "drink",
    "displayOrder": 132
  }
] satisfies MenuItem[];
