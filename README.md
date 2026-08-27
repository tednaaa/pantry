# Pantry

План еды и список покупок. Офлайн PWA, ставится на телефон.

Техническое задание — в [spec/](spec/README.md).

## Разработка

```fish
pnpm install
pnpm dev          # http://127.0.0.1:5588
pnpm lint
pnpm test:unit
pnpm build
```

## Каталог

Блюда и продукты ведутся в коде — правила в [spec/03-catalog.md](spec/03-catalog.md).

```fish
# положить исходники в raw-photos/dishes и raw-photos/products, назвав файлы слагами
pnpm photos:optimize
pnpm icons
```
