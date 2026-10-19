# Архив старого сайта digital-event.ru

Все картинки и видеофайлы со старого сайта на Tilda (https://digital-event.ru/), разложенные по смыслу. Это исходники для нового сайта, не для публикации как есть.

## Итого

- Страниц скачано (HTML через curl): **54** (sitemap.xml + sitemap-store.xml + внутренние ссылки рекурсивно)
- Услуг: **12**, подуслуг: **31** (+ 13 карточек внутри Voice/Move Games)
- Файлов медиа после дедупа: **702** (из 922 уникальных ссылок; дубли по SHA-1 удалены)
- Не скачалось: **0**

## Структура

```
old-site/
├─ services/<услуга>/                 — картинки страницы услуги + description.md
│  └─ <подуслуга>/                     — картинки карточки/попапа или подстраницы + description.md (текст с сайта)
├─ logos/clients/                      — логотипы клиентов (блок «Компании, с которыми мы работаем»)
├─ logos/digital-events/               — наш логотип: варианты, favicon
├─ product/                            — товар «Беги, дед, беги» (Tilda Store): фото, product.json, description.md
├─ common/<страница>/                  — главная, о нас, портфолио, контакты и др. + texts.md
├─ common/shared/, common/icons/       — фоны и иконки, которые повторяются на многих страницах
└─ manifest.json                       — файл → исходные URL, SHA-1, страницы, где встречается
```

Имена файлов: `<карточка/раздел>--<исходное имя>.ext`. Оригиналы без `/-/resize/` и `/-/format/`.

## Услуги и подуслуги

| Папка | Название | Картинок | Источник |
|---|---|---|---|
| `services/3d-mapping/` | **3D-mapping** | 1 | [https://digital-event.ru/3dmapping](https://digital-event.ru/3dmapping); [https://digital-event.ru/page32523299.html](https://digital-event.ru/page32523299.html) |
| `└ 3d-mapping-na-avto/` | 3D MAPPING НА АВТО | 4 | [https://digital-event.ru/3dmapping](https://digital-event.ru/3dmapping) → попап `#popup:auto`; [https://digital-event.ru/page32523299.html](https://digital-event.ru/page32523299.html) → попап `#popup:auto` |
| `└ 3d-mapping-na-stoly/` | 3D MAPPING НА СТОЛЫ | 11 | [https://digital-event.ru/3dmapping](https://digital-event.ru/3dmapping) → попап `#popup:3dstol`; [https://digital-event.ru/page32523299.html](https://digital-event.ru/page32523299.html) → попап `#popup:3dstol` |
| `└ 3d-mapping-na-tort/` | 3D MAPPING НА ТОРТ | 14 | [https://digital-event.ru/3dmapping](https://digital-event.ru/3dmapping) → попап `#popup:3dtort`; [https://digital-event.ru/page32523299.html](https://digital-event.ru/page32523299.html) → попап `#popup:3dtort` |
| `services/ar/` | **AR (дополненная реальность)** | 2 | [https://digital-event.ru/arvr](https://digital-event.ru/arvr) |
| `└ ar-for-business/` | AR для бизнеса | 28 | [https://digital-event.ru/arforbusiness](https://digital-event.ru/arforbusiness) |
| `└ ar-for-events/` | AR для событий | 19 | [https://digital-event.ru/arforevents](https://digital-event.ru/arforevents) |
| `services/by-event-format/` | **По формату события** | 4 | [https://digital-event.ru/format](https://digital-event.ru/format) |
| `└ new-year/` | Новогоднее предложение | 43 | [https://digital-event.ru/newyear](https://digital-event.ru/newyear) |
| `services/design/` | **Дизайн «огонь» (визуал, сайты, маркетплейсы)** | 14 | [https://digital-event.ru/firedesign](https://digital-event.ru/firedesign); [https://digital-event.ru/page31620653.html](https://digital-event.ru/page31620653.html) |
| `└ logo/` | logo | 14 | [https://digital-event.ru/firedesign](https://digital-event.ru/firedesign) → попап `#popup:logo`; [https://digital-event.ru/page31620653.html](https://digital-event.ru/page31620653.html) → попап `#popup:logo` |
| `└ marketplaces/` | Дизайн для маркетплейсов | 20 | [https://digital-event.ru/marketplace](https://digital-event.ru/marketplace) |
| `└ websites/` | Создание сайтов (+ бриф) | 48 | [https://digital-event.ru/brif](https://digital-event.ru/brif); [https://digital-event.ru/firedesignweb](https://digital-event.ru/firedesignweb) |
| `services/digital-decor/` | **Digital Decor** | 9 | [https://digital-event.ru/digitaldecor](https://digital-event.ru/digitaldecor); [https://digital-event.ru/page32165794.html](https://digital-event.ru/page32165794.html) |
| `services/digital-marketing/` | **Digital Marketing (не переносим на новый сайт)** | 53 | [https://digital-event.ru/digitalmarketing](https://digital-event.ru/digitalmarketing) |
| `└ logo/` | #logo | 0 | [https://digital-event.ru/digitalmarketing](https://digital-event.ru/digitalmarketing) → попап `#logo`; [https://digital-event.ru/digitalmarketing](https://digital-event.ru/digitalmarketing) → попап `#popup:logo` |
| `└ zeropopup/` | #zeropopup | 0 | [https://digital-event.ru/digitalmarketing](https://digital-event.ru/digitalmarketing) → попап `#zeropopup` |
| `services/installations/` | **Инсталляции** | 1 | [https://digital-event.ru/instalacii](https://digital-event.ru/instalacii); [https://digital-event.ru/instalationnew](https://digital-event.ru/instalationnew) |
| `└ lyubov-permi/` | Инсталляция «Любовь Перми» | 10 | [https://digital-event.ru/artinstalperm](https://digital-event.ru/artinstalperm) |
| `services/interactives/` | **Интерактивы** | 14 | [https://digital-event.ru/interactiv](https://digital-event.ru/interactiv); [https://digital-event.ru/page32168274.html](https://digital-event.ru/page32168274.html) |
| `└ headtalk/` | HEADTALK | 13 | [https://digital-event.ru/interactiv](https://digital-event.ru/interactiv) → попап `#popup:headtalk`; [https://digital-event.ru/page32168274.html](https://digital-event.ru/page32168274.html) → попап `#popup:headtalk` |
| `└ live-paint/` | LIVE PAINT | 13 | [https://digital-event.ru/interactiv](https://digital-event.ru/interactiv) → попап `#popup:paint`; [https://digital-event.ru/page32168274.html](https://digital-event.ru/page32168274.html) → попап `#popup:paint` |
| `└ multiface/` | MULTIFACE | 15 | [https://digital-event.ru/interactiv](https://digital-event.ru/interactiv) → попап `#popup:multiface`; [https://digital-event.ru/page32168274.html](https://digital-event.ru/page32168274.html) → попап `#popup:multiface` |
| `└ playtronica/` | PLAYTRONICA | 5 | [https://digital-event.ru/interactiv](https://digital-event.ru/interactiv) → попап `#popup:playtronica`; [https://digital-event.ru/page32168274.html](https://digital-event.ru/page32168274.html) → попап `#popup:playtronica` |
| `└ randomizer/` | RANDOMIZER | 3 | [https://digital-event.ru/interactiv](https://digital-event.ru/interactiv) → попап `#popup:randomizer`; [https://digital-event.ru/page32168274.html](https://digital-event.ru/page32168274.html) → попап `#popup:randomizer` |
| `└ videograffiti/` | ВИДЕОГРАФФИТИ | 10 | [https://digital-event.ru/interactiv](https://digital-event.ru/interactiv) → попап `#popup:grafity`; [https://digital-event.ru/page32168274.html](https://digital-event.ru/page32168274.html) → попап `#popup:grafity` |
| `services/online-events/` | **Онлайн-мероприятия** | 1 | [https://digital-event.ru/online](https://digital-event.ru/online); [https://digital-event.ru/onlinemeropriatia](https://digital-event.ru/onlinemeropriatia); [https://digital-event.ru/onlinenew](https://digital-event.ru/onlinenew); [https://digital-event.ru/page32168230.html](https://digital-event.ru/page32168230.html) |
| `services/video-production/` | **Video Production** | 1 | [https://digital-event.ru/videoproduct](https://digital-event.ru/videoproduct); [https://digital-event.ru/videoproductnew](https://digital-event.ru/videoproductnew) |
| `services/videogames/` | **Видеоигры** | 5 | [https://digital-event.ru/page32172246.html](https://digital-event.ru/page32172246.html); [https://digital-event.ru/videogames](https://digital-event.ru/videogames) |
| `└ game-adaptation/` | Game Adaptation — адаптация игр под событие | 6 | [https://digital-event.ru/gameadaptation](https://digital-event.ru/gameadaptation) |
| `└ move-games/` | Move Games — подвижные видеоигры | 4 | [https://digital-event.ru/moviegames](https://digital-event.ru/moviegames); [https://digital-event.ru/page32504222.html](https://digital-event.ru/page32504222.html) |
| `&nbsp;&nbsp;└ begi-ded-begi/` | БЕГИ ДЕД, БЕГИ! | 4 | [https://digital-event.ru/moviegames](https://digital-event.ru/moviegames) → попап `#popup:ded`; [https://digital-event.ru/page32504222.html](https://digital-event.ru/page32504222.html) → попап `#popup:ded` |
| `&nbsp;&nbsp;└ frirayder/` | ФРИРАЙДЕР | 8 | [https://digital-event.ru/moviegames](https://digital-event.ru/moviegames) → попап `#popup:fririder`; [https://digital-event.ru/page32504222.html](https://digital-event.ru/page32504222.html) → попап `#popup:fririder` |
| `&nbsp;&nbsp;└ myshinye-bega/` | МЫШИНЫЕ БЕГА | 4 | [https://digital-event.ru/moviegames](https://digital-event.ru/moviegames) → попап `#popup:mouse`; [https://digital-event.ru/page32504222.html](https://digital-event.ru/page32504222.html) → попап `#popup:mouse` |
| `&nbsp;&nbsp;└ skeyter/` | СКЕЙТЕР | 12 | [https://digital-event.ru/moviegames](https://digital-event.ru/moviegames) → попап `#popup:skater`; [https://digital-event.ru/page32504222.html](https://digital-event.ru/page32504222.html) → попап `#popup:skater` |
| `└ voice-games/` | Voice Games — голосовые видеоигры | 2 | [https://digital-event.ru/page32504427.html](https://digital-event.ru/page32504427.html); [https://digital-event.ru/voicegame](https://digital-event.ru/voicegame) |
| `&nbsp;&nbsp;└ bon-voyazh/` | БОН ВОЯЖ | 6 | [https://digital-event.ru/page32504427.html](https://digital-event.ru/page32504427.html) → попап `#popup:voyaz`; [https://digital-event.ru/voicegame](https://digital-event.ru/voicegame) → попап `#popup:voyaz` |
| `&nbsp;&nbsp;└ don-kupidon/` | ДОН КУПИДОН | 6 | [https://digital-event.ru/page32504427.html](https://digital-event.ru/page32504427.html) → попап `#popup:don`; [https://digital-event.ru/voicegame](https://digital-event.ru/voicegame) → попап `#popup:don` |
| `&nbsp;&nbsp;└ karaorke/` | KARAORKE | 7 | [https://digital-event.ru/page32504427.html](https://digital-event.ru/page32504427.html) → попап `#popup:karaorke`; [https://digital-event.ru/voicegame](https://digital-event.ru/voicegame) → попап `#popup:karaorke` |
| `&nbsp;&nbsp;└ peretyani-deda/` | ПЕРЕТЯНИ ДЕДА | 1 | [https://digital-event.ru/page32504427.html](https://digital-event.ru/page32504427.html) → попап `#popup:peretinideda`; [https://digital-event.ru/voicegame](https://digital-event.ru/voicegame) → попап `#popup:peretinideda` |
| `&nbsp;&nbsp;└ poprygunchik/` | ПОПРЫГУНЧИК | 5 | [https://digital-event.ru/page32504427.html](https://digital-event.ru/page32504427.html) → попап `#popup:jumper`; [https://digital-event.ru/voicegame](https://digital-event.ru/voicegame) → попап `#popup:jumper` |
| `&nbsp;&nbsp;└ snegurochka/` | СНЕГУРОЧКА | 4 | [https://digital-event.ru/page32504427.html](https://digital-event.ru/page32504427.html) → попап `#popup:snegurochka`; [https://digital-event.ru/voicegame](https://digital-event.ru/voicegame) → попап `#popup:snegurochka` |
| `&nbsp;&nbsp;└ snezhnyy-marafon/` | СНЕЖНЫЙ МАРАФОН | 4 | [https://digital-event.ru/page32504427.html](https://digital-event.ru/page32504427.html) → попап `#popup:marafon`; [https://digital-event.ru/voicegame](https://digital-event.ru/voicegame) → попап `#popup:marafon` |
| `&nbsp;&nbsp;└ tachki-tyanuchki/` | ТАЧКИ-ТЯНУЧКИ | 3 | [https://digital-event.ru/page32504427.html](https://digital-event.ru/page32504427.html) → попап `#popup:tachki`; [https://digital-event.ru/voicegame](https://digital-event.ru/voicegame) → попап `#popup:tachki` |
| `&nbsp;&nbsp;└ toropyzhka/` | ТОРОПЫЖКА | 6 | [https://digital-event.ru/page32504427.html](https://digital-event.ru/page32504427.html) → попап `#popup:toropizka`; [https://digital-event.ru/voicegame](https://digital-event.ru/voicegame) → попап `#popup:toropizka` |
| `└ vr/` | VR-игры | 5 | [https://digital-event.ru/page32523486.html](https://digital-event.ru/page32523486.html); [https://digital-event.ru/vr](https://digital-event.ru/vr) |
| `services/videophoto-zones/` | **Видео / фото зоны** | 6 | [https://digital-event.ru/page32167874.html](https://digital-event.ru/page32167874.html); [https://digital-event.ru/videophoto](https://digital-event.ru/videophoto) |
| `└ 3d-kaleydoskop/` | 3D-КАЛЕЙДОСКОП | 8 | [https://digital-event.ru/page32167874.html](https://digital-event.ru/page32167874.html) → попап `#popup:3dkoled`; [https://digital-event.ru/videophoto](https://digital-event.ru/videophoto) → попап `#popup:3dkoled` |
| `└ lazernyy-koridor/` | ЛАЗЕРНЫЙ КОРИДОР | 6 | [https://digital-event.ru/page32167874.html](https://digital-event.ru/page32167874.html) → попап `#popup:lazer`; [https://digital-event.ru/videophoto](https://digital-event.ru/videophoto) → попап `#popup:lazer` |
| `└ media-cube/` | MEDIA CUBE | 4 | [https://digital-event.ru/page32167874.html](https://digital-event.ru/page32167874.html) → попап `#popup:mediacube`; [https://digital-event.ru/videophoto](https://digital-event.ru/videophoto) → попап `#popup:mediacube` |
| `└ planeta-molodozhenov/` | ПЛАНЕТА МОЛОДОЖЁНОВ | 8 | [https://digital-event.ru/page32167874.html](https://digital-event.ru/page32167874.html) → попап `#popup:planeta`; [https://digital-event.ru/videophoto](https://digital-event.ru/videophoto) → попап `#popup:planeta` |
| `└ scrollcam-360/` | SCROLLCAM 360 | 6 | [https://digital-event.ru/page32167874.html](https://digital-event.ru/page32167874.html) → попап `#popup:scrollcam`; [https://digital-event.ru/videophoto](https://digital-event.ru/videophoto) → попап `#popup:scrollcam` |
| `└ selfi-stoyka/` | СЕЛФИ СТОЙКА | 13 | [https://digital-event.ru/page32167874.html](https://digital-event.ru/page32167874.html) → попап `#popup:selfie`; [https://digital-event.ru/videophoto](https://digital-event.ru/videophoto) → попап `#popup:selfie` |
| `└ selfi-zerkalo/` | СЕЛФИ ЗЕРКАЛО | 7 | [https://digital-event.ru/page32167874.html](https://digital-event.ru/page32167874.html) → попап `#popup:zerkalo`; [https://digital-event.ru/videophoto](https://digital-event.ru/videophoto) → попап `#popup:zerkalo` |
| `└ selfie-star/` | SELFIE STAR | 9 | [https://digital-event.ru/page32167874.html](https://digital-event.ru/page32167874.html) → попап `#popup:selfiestar`; [https://digital-event.ru/videophoto](https://digital-event.ru/videophoto) → попап `#popup:selfiestar` |
| `└ tvoya-planeta/` | ТВОЯ ПЛАНЕТА | 14 | [https://digital-event.ru/page32167874.html](https://digital-event.ru/page32167874.html) → попап `#popup:planeta1`; [https://digital-event.ru/videophoto](https://digital-event.ru/videophoto) → попап `#popup:planeta1` |

«Event-анимация» упоминается текстом на /uslugi, но отдельной страницы у неё нет. «Digital Marketing» скачан для полноты архива; на новом сайте этот раздел не используем (см. `CLAUDE.md`).

## Остальное

| Папка | Картинок |
|---|---|
| `logos/clients/` | 44 |
| `logos/digital-events/` | 12 |
| `product/` | 1 |
| `common/about/` | 6 |
| `common/contacts/` | 2 |
| `common/home/` | 28 |
| `common/icons/` | 7 |
| `common/policy/` | 0 |
| `common/portfolio/` | 0 |
| `common/portfolio-2018/` | 15 |
| `common/portfolio-2019/` | 14 |
| `common/services-index/` | 8 |
| `common/shared/` | 2 |
| `common/space-media/` | 20 |

## Все страницы

| Страница | Title | Куда разложено |
|---|---|---|
| [/2018](https://digital-event.ru/2018) | Портфолио - 2018 | `common/portfolio-2018` |
| [/2019](https://digital-event.ru/2019) | Портфолио - 2019 | `common/portfolio-2019` |
| [/3dmapping](https://digital-event.ru/3dmapping) | Digital Events Услуги - 3D-mapping | `services/3d-mapping` |
| [/aboutus](https://digital-event.ru/aboutus) | Digital Events - О нас | `common/about` |
| [/aboutustest](https://digital-event.ru/aboutustest) | Space Media - ABOUT US | `common/space-media` |
| [/arforbusiness](https://digital-event.ru/arforbusiness) | Copy of Digital Events Услуги - AR FOR BUSINESS | `services/ar/ar-for-business` |
| [/arforevents](https://digital-event.ru/arforevents) | Digital Events Услуги - AR FOR EVENTS | `services/ar/ar-for-events` |
| [/artinstalperm](https://digital-event.ru/artinstalperm) | Инсталляция любовь Перми | `services/installations/lyubov-permi` |
| [/arvr](https://digital-event.ru/arvr) | Digital Events Услуги - AR | `services/ar` |
| [/brif](https://digital-event.ru/brif) | Digital Events - Бриф на разработку сайта | `services/design/websites` |
| [/contact](https://digital-event.ru/contact) | Digital Events 2021- Контакты | `common/contacts` |
| [/digitaldecor](https://digital-event.ru/digitaldecor) | Digital Events Услуги - Digital Decor | `services/digital-decor` |
| [/digitalmarketing](https://digital-event.ru/digitalmarketing) | Digital Marketing | `services/digital-marketing` |
| [/firedesign](https://digital-event.ru/firedesign) | Digital Events - Разрабатываем визуал для вашего продукта | `services/design` |
| [/firedesignweb](https://digital-event.ru/firedesignweb) | Digital Events - Создание сайтов | `services/design/websites` |
| [/format](https://digital-event.ru/format) | Digital Events Услуги - По формату события | `services/by-event-format` |
| [/gameadaptation](https://digital-event.ru/gameadaptation) | Видео Игры - GAME ADAPTATION | `services/videogames/game-adaptation` |
| [/](https://digital-event.ru/) | Digital Events | `common/home` |
| [/instalacii](https://digital-event.ru/instalacii) | Digital Events Услуги - Инсталяции | `services/installations` |
| [/instalationnew](https://digital-event.ru/instalationnew) | Digital Events Услуги - Инсталяции NEW | `services/installations` |
| [/interactiv](https://digital-event.ru/interactiv) | Digital Events Услуги - Интерактивы | `services/interactives` |
| [/marketplace](https://digital-event.ru/marketplace) | Digital Events - Дизайн огонь "Маркетплейсы" | `services/design/marketplaces` |
| [/moviegames](https://digital-event.ru/moviegames) | Видео Игры - MOVE GAMES/ Подвижные игры | `services/videogames/move-games` |
| [/newyear](https://digital-event.ru/newyear) | Digital Events 2021- Новогоднее предложение | `services/by-event-format/new-year` |
| [/online](https://digital-event.ru/online) | Digital Events Услуги - Online | `services/online-events` |
| [/onlinemeropriatia](https://digital-event.ru/onlinemeropriatia) | Digital Events Услуги - Онлайн мероприятия | `services/online-events` |
| [/onlinenew](https://digital-event.ru/onlinenew) | Digital Events Услуги - Онлайн мероприятия NEW | `services/online-events` |
| [/page21689012.html](https://digital-event.ru/page21689012.html) | Digital Events | `common/home` |
| [/page31620653.html](https://digital-event.ru/page31620653.html) | Digital Events - Дизайн огонь DUBLICAT | `services/design` |
| [/page31725470.html](https://digital-event.ru/page31725470.html) | Digital Events | `common/home` |
| [/page31763849.html](https://digital-event.ru/page31763849.html) | Digital Events - Услуги NEW | `common/services-index` |
| [/page31887588.html](https://digital-event.ru/page31887588.html) | Digital Events - О нас NEW | `common/about` |
| [/page32165794.html](https://digital-event.ru/page32165794.html) | Digital Events Услуги - Digital Decor NEW | `services/digital-decor` |
| [/page32167874.html](https://digital-event.ru/page32167874.html) | Digital Events Услуги - Видео и Фото Зоны NEW | `services/videophoto-zones` |
| [/page32168230.html](https://digital-event.ru/page32168230.html) | Digital Events Услуги - Online NEW НЕ ГОТОВ | `services/online-events` |
| [/page32168274.html](https://digital-event.ru/page32168274.html) | Digital Events Услуги - NEW | `services/interactives` |
| [/page32172246.html](https://digital-event.ru/page32172246.html) | Digital Events Услуги - Видеоигры NEW | `services/videogames` |
| [/page32504222.html](https://digital-event.ru/page32504222.html) | Видео Игры - MOVE GAMES/ Подвижные игры NEW | `services/videogames/move-games` |
| [/page32504427.html](https://digital-event.ru/page32504427.html) | Видео Игры - VOICE GAMES / Голосовые игры NEW | `services/videogames/voice-games` |
| [/page32523299.html](https://digital-event.ru/page32523299.html) | Digital Events Услуги - 3D-mapping NEW | `services/3d-mapping` |
| [/page32523486.html](https://digital-event.ru/page32523486.html) | Видео Игры - VR NEW | `services/videogames/vr` |
| [/page33369436.html](https://digital-event.ru/page33369436.html) | Digital Events - Контакты NEW | `common/contacts` |
| [/photo](https://digital-event.ru/photo) | Digital Events 2021- Портфолио | `common/portfolio` |
| [/policy](https://digital-event.ru/policy) | Digital Events Услуги - Политика конфиденциальности | `common/policy` |
| [/spacemodelagency](https://digital-event.ru/spacemodelagency) | Space Media - SPACE MODEL AGENCY | `common/space-media` |
| [/spacephotostudio](https://digital-event.ru/spacephotostudio) | Space Media - SPACE PHOTO STUDIO | `common/space-media` |
| [/tproduct/1-809003809191-begi-ded-begi](https://digital-event.ru/tproduct/1-809003809191-begi-ded-begi) | БЕГИ ДЕД, БЕГИ! | `product` |
| [/uslugi](https://digital-event.ru/uslugi) | Digital Events - Услуги | `common/services-index` |
| [/videogames](https://digital-event.ru/videogames) | Digital Events Услуги - Видеоигры | `services/videogames` |
| [/videophoto](https://digital-event.ru/videophoto) | Digital Events Услуги - Видео и Фото Зоны | `services/videophoto-zones` |
| [/videoproduct](https://digital-event.ru/videoproduct) | Digital Events Услуги - Видеопродакш | `services/video-production` |
| [/videoproductnew](https://digital-event.ru/videoproductnew) | Digital Events Услуги - Видеопродакш NEW | `services/video-production` |
| [/voicegame](https://digital-event.ru/voicegame) | Видео Игры - VOICE GAMES / Голосовые игры | `services/videogames/voice-games` |
| [/vr](https://digital-event.ru/vr) | Видео Игры - VR | `services/videogames/vr` |

Страницы с суффиксом NEW, `pageXXXX.html` — черновики Tilda (часто копии основных); их уникальные картинки добавлены в папку соответствующей услуги.

## Что не скачалось

- Все найденные файлы медиа скачаны.
- Страницы `/sayti`, `/spacemedia`, `/web` есть во внутренних ссылках, но отдают 404.
- Видео на сайте встроены с YouTube/VK; файлов mp4 на CDN Tilda нет. Ссылки на видео собраны в `description.md` / `texts.md` в разделе «Видео».
- Галерея товара в Tilda Store содержит одно фото; остальные фото этой игры лежат в `services/videogames/move-games/begi-ded-begi/`.
- `static.tildacdn.com` не открывается из сети, где делалась выгрузка, поэтому файлы скачаны с зеркала `static.tildacdn.net` (пути файлов те же).
