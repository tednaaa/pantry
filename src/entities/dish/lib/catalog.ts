import type { Dish, Tag } from './types';

export const dishes: Dish[] = [
  {
    id: 'spaghetti-meat',
    name: 'спагетти с мясом',
    photo: 'spaghetti-meat.webp',
    tags: ['ужин', 'быстро'],
    servings: 2,
    ingredients: [
      { product: 'spaghetti', amount: 200 },
      { product: 'chicken-fillet', amount: 1 },
      { product: 'tomato-paste', amount: 30 },
      { product: 'garlic', amount: 2 },
      { product: 'black-pepper' },
    ],
    steps: [
      'Поставить воду на спагетти, посолить.',
      'Филе нарезать полосками, обжарить до корочки на сильном огне.',
      'Добавить давленый чеснок, через полминуты — томатную пасту и половник воды из-под спагетти.',
      'Откинуть спагетти чуть недоваренными и домешать их в соус прямо на сковороде.',
    ],
  },
  {
    id: 'plov',
    name: 'плов',
    photo: 'plov.webp',
    tags: ['обед', 'мясо'],
    servings: 6,
    ingredients: [
      { product: 'rice', amount: 500 },
      { product: 'beef', amount: 600 },
      { product: 'carrot', amount: 400 },
      { product: 'onion', amount: 200 },
      { product: 'garlic', amount: 4 },
      { product: 'vegetable-oil', amount: 100 },
      { product: 'cumin' },
    ],
    steps: [
      'Рис промыть до прозрачной воды и залить тёплой водой.',
      'В казане раскалить масло, обжарить мясо крупными кусками, следом лук, следом морковь соломкой.',
      'Залить кипятком на два пальца выше зирвака, бросить зиру и целые головки чеснока, тушить полчаса.',
      'Выложить рис ровным слоем, долить кипяток на палец выше риса, выпарить воду на сильном огне.',
      'Собрать рис горкой, накрыть и оставить на самом слабом огне на двадцать минут.',
    ],
  },
  {
    id: 'borsch',
    name: 'борщ',
    photo: 'borsch.webp',
    tags: ['обед', 'мясо'],
    servings: 6,
    ingredients: [
      { product: 'beef', amount: 500 },
      { product: 'beetroot', amount: 300 },
      { product: 'cabbage', amount: 300 },
      { product: 'potato', amount: 400 },
      { product: 'carrot', amount: 150 },
      { product: 'onion', amount: 150 },
      { product: 'tomato-paste', amount: 50 },
      { product: 'sour-cream', amount: 200 },
      { product: 'bay-leaf' },
    ],
    steps: [
      'Сварить бульон на говядине, снимая пену, полтора часа.',
      'Свёклу натереть и потушить отдельно с томатной пастой — так борщ остаётся красным.',
      'В бульон заложить картофель, через десять минут капусту, следом зажарку из лука и моркови.',
      'Добавить свёклу и лавровый лист, дать закипеть и сразу выключить.',
      'Настоять под крышкой полчаса, подавать со сметаной.',
    ],
  },
  {
    id: 'greek-salad',
    name: 'греческий салат',
    photo: 'greek-salad.webp',
    tags: ['салат', 'быстро'],
    servings: 4,
    ingredients: [
      { product: 'tomato', amount: 300 },
      { product: 'cucumber', amount: 200 },
      { product: 'feta', amount: 200 },
      { product: 'olives', amount: 100 },
      { product: 'onion', amount: 100 },
      { product: 'olive-oil', amount: 50 },
      { product: 'oregano' },
    ],
    steps: [
      'Помидоры и огурцы нарезать крупно, лук — тонкими кольцами.',
      'Смешать овощи с маслинами, полить оливковым маслом, посыпать орегано.',
      'Фету положить сверху куском, не перемешивая.',
    ],
  },
  {
    id: 'syrniki',
    name: 'сырники',
    photo: 'syrniki.webp',
    tags: ['завтрак'],
    servings: 4,
    ingredients: [
      { product: 'curd', amount: 500 },
      { product: 'eggs', amount: 2 },
      { product: 'flour', amount: 100 },
      { product: 'sugar', amount: 50 },
      { product: 'sour-cream', amount: 200 },
    ],
    steps: [
      'Творог размять с яйцами и сахаром, вмешать муку — тесто должно лепиться, но остаться мягким.',
      'Сформировать шайбы, обвалять в муке.',
      'Жарить на среднем огне под крышкой, по три минуты на сторону.',
      'Подавать со сметаной.',
    ],
  },
];

const byId = new Map(dishes.map(dish => [dish.id, dish]));

export function dishById(id: string): Dish | undefined {
  return byId.get(id);
}

export function photoUrl(dish: Dish): string | undefined {
  return dish.photo && `/dishes/${dish.photo}`;
}

export const activeDishes: Dish[] = dishes.filter(dish => !dish.archived);

export function matchesQuery(dish: Dish, query: string): boolean {
  const needle = query.trim().toLowerCase();

  return !needle
    || dish.name.toLowerCase().includes(needle)
    || dish.tags.some(tag => tag.toLowerCase().includes(needle));
}

export function searchDishes(query: string, tag?: Tag): Dish[] {
  return activeDishes.filter(dish => (
    (!tag || dish.tags.includes(tag)) && matchesQuery(dish, query)
  ));
}
