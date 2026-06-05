# Guide thay đổi dự án HTML tĩnh

Dự án này dùng HTML tĩnh, Tailwind CSS qua CDN, CSS custom theo BEM và vanilla JavaScript. Host hết tài nguyên về local. 

## Cấu trúc thư mục

```text
cnvn/
├── index.html
├── assets/
│   ├── css/styles.css
│   ├── js/main.js
│   └── img/
└── guide.md
```

## Chạy dự án

Mở trực tiếp file `index.html` trong trình duyệt.

Nếu muốn chạy bằng local server:

```bash
python3 -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

## Quy ước HTML

- Nội dung chính nằm trong `index.html`.
- Mỗi vùng lớn nên dùng `section`, ví dụ `hero`, `features`, `workflow`.
- Nếu cần thêm section mới, copy một block có sẵn rồi đổi class theo block mới.
- Các tương tác JavaScript nên dùng attribute `data-*`, ví dụ `data-menu-toggle`.
- Mỗi trang phải có class định danh trên `body` theo format `page-*`, ví dụ `page-home`, `page-about`, `page-contact`.
- CSS/JS dành riêng cho một trang phải bám qua class `page-*` trên `body` để tránh ảnh hưởng trang khác.
- Nếu một trang có trạng thái layout đặc biệt, thêm class phụ cạnh `page-*`, ví dụ `page-home no-footer` hoặc `page-product has-sticky-actions`.

Ví dụ:

```html
<body class="page-home">
  ...
</body>
```

## Hệ thống layout

### Container

- Mặc định dùng `.container-fluid` cho các vùng cần bám sát mép viewport như header, footer, app shell.
- Dùng `.container` cho nội dung trang cần căn giữa, có `max-width` và padding responsive.
- Không tự set `max-width` rời rạc trong từng section nếu có thể dùng token/container có sẵn.
- Nội dung ở giữa trang luôn cố gắng đặt trong `.container` trước, sau đó mới chia grid bên trong.
- Nếu section cần full-bleed background, background nằm ở section, nội dung vẫn nằm trong `.container`.

Ví dụ:

```html
<section class="content-section">
  <div class="container">
    ...
  </div>
</section>
```

### Grid 12 cột

- Layout nội dung chính ưu tiên dùng grid 12 cột: `.grid grid--12`.
- Không căn giữa bằng margin/padding tùy hứng nếu có thể đặt item vào cột hợp lý.
- Nội dung text hẹp thường chiếm 4-6 cột, nội dung rộng/card list chiếm 8-12 cột, media lớn chiếm 6-8 cột tùy design.
- Trên mobile, các cột nên tự rơi về 1 cột bằng breakpoint CSS thay vì hard-code width riêng.
- Khi cần offset/căn vị trí theo design, ưu tiên dùng column span/start thay vì pixel absolute, trừ các chi tiết trang trí đặc thù.

Ví dụ:

```html
<section class="content-section">
  <div class="container">
    <div class="grid grid--12">
      <div class="grid__col grid__col--6">...</div>
      <div class="grid__col grid__col--6">...</div>
    </div>
  </div>
</section>
```

Ví dụ căn giữa nội dung 6 cột trong grid 12:

```html
<div class="grid grid--12">
  <div class="grid__col grid__col--6 grid__col-start--4">...</div>
</div>
```

### Home horizontal grid

- Riêng home horizontal dùng một grid lớn `60 cột x 8 dòng`, tương đương `5 screen`.
- Mỗi screen gồm 12 cột. Item luôn dùng wrapper `.grid-item`, nội dung nằm bên trong.
- Vị trí item dùng class dễ đọc: `screen-*`, `col-*`, `row-*`, `span-*`, `row-span-*`.
- Ví dụ `screen-1 col-2 row-2 span-4` nghĩa là item ở screen 1, bắt đầu cột 2, dòng 2, rộng 4 cột.
- CSS phải khai báo đủ `screen-1.col-1` đến `screen-5.col-12`, tương ứng 60 cột thật của `.home-grid`; không chỉ khai báo các cột đang dùng.
- CSS cũng phải khai báo đủ `span-1` đến `span-12` và `row-span-1` đến `row-span-8`; thiếu utility sẽ làm `grid-column`/`grid-row` bị invalid và item bị auto-place sai màn.
- Width của `.home-grid` tính bằng `calc(var(--screen-width) * var(--screen-count))`; responsive chỉ chỉnh `--screen-width`, không hard-code `* 5` rải rác.
- Không đặt `padding` trực tiếp lên `.home-grid` vì sẽ làm lệch nhịp 12 cột mỗi screen. Dùng offset bằng `col-*`, hoặc padding ở content bên trong item.
- Background line của grid là utility độc lập: dùng `.grid-background--rows-8` cho nền 8 hàng hoặc `.grid-background--rows-4` cho nền 4 hàng. Chỉ thêm class khi cần hiển thị line.
- Thêm `.scroll-parallax` vào text/element cần hiệu ứng parallax ngang khi scroll home.
- Không gán `grid-column` trực tiếp vào content text/card nếu có thể dùng các class vị trí trên.
- `.grid-item` chỉ dùng cho layout/vị trí. Không gắn class style/component lên cùng wrapper như `.grid-item.story-impact`; nếu cần style riêng, đặt element bên trong rồi set class ở inner element. Modifier như `.grid-item--stretch` được phép vì chỉ xử lý layout.

Ví dụ:

```html
<div class="grid-item screen-1 col-2 span-4 row-2">
  <div class="grid-content">
    <h1 class="heading-title-1 text-black text-uppercase text-bold text-flat">Impacts</h1>
  </div>
</div>
```

## Hệ thống typography

- Không tự set `font-size` tùy ý trong component mới.
- Luôn ưu tiên dùng size có sẵn trong hệ thống typography: CSS variable, utility class hoặc class component đã map về token.
- Nếu Figma có size lạ, chọn token gần nhất trước. Chỉ thêm token mới khi size đó lặp lại nhiều lần hoặc là cấp typography quan trọng của brand.
- Component chỉ nên set `font-weight`, `text-transform`, `text-align`, `max-width` khi cần; `font-size` và `line-height` nên lấy từ token.
- Heading/content nên dùng đúng cấp bậc: display cho hero lớn, heading cho section, body cho paragraph, caption/nav cho meta/menu.
- Không scale chữ bằng viewport width trực tiếp trong component mới. Nếu cần responsive, tạo token bằng `clamp()` ở `:root`, rồi dùng lại token đó.
- Với home horizontal, text size dùng utility `.heading-title-1`, `.heading-title-2`, `.heading-title-3`, `.heading-title-4`; class nội dung chỉ giữ layout/position/transform đặc thù, không tự đặt `font-size`.
- Màu text trong home horizontal dùng utility `.text-black`, `.text-muted`, `.text-primary`, `.text-white`; component class không tự đặt `color`.
- Text case/weight/margin trong home horizontal dùng utility như `.text-uppercase`, `.text-bold`, `.text-medium`, `.text-normal`, `.text-flat`; không tạo class content-specific chỉ để set typography như `.home-title`, `.home-kicker`, `.home-growth`.

Token khuyến nghị trong `assets/css/styles.css`:

```css
:root {
  --text-16: clamp(14px, 0.28vw + 13px, 16px);
  --text-18: clamp(15px, 0.42vw + 13px, 18px);
  --text-24: clamp(18px, 0.83vw + 15px, 24px);
  --text-32: clamp(22px, 1.39vw + 17px, 32px);
  --text-36: clamp(24px, 1.67vw + 18px, 36px);
  --text-54: clamp(34px, 2.78vw + 24px, 54px);
  --text-64: clamp(38px, 3.61vw + 25px, 64px);
  --text-72: clamp(44px, 3.89vw + 30px, 72px);
  --text-84: clamp(48px, 5vw + 30px, 84px);
  --text-96: clamp(54px, 5.83vw + 33px, 96px);
  --text-128: clamp(64px, 8.89vw + 32px, 128px);
  --text-display-1: var(--text-128);
  --text-display-2: var(--text-64);
  --text-heading-1: var(--text-54);
  --text-heading-2: var(--text-36);
  --text-heading-3: var(--text-24);
  --text-body: var(--text-16);
}
```

Ví dụ:

```html
<h2 class="text-heading-2">Brand Solutions</h2>
<p class="text-body">...</p>
```

## Note phong cách viết từ BM88io

Tham khảo từ `/Users/xuanlt/Works/Freelancer/BM88io`.

### Cấu trúc trang

Các page thường dùng dạng mobile app shell:

```html
<!-- BEGIN Site -->
<div class="site d-flex flex-column">
  <!-- BEGIN Site Header -->
  <div class="site-header d-flex align-items-center fixed-top">
    <div class="container-fluid">
      <div class="header-inner d-flex align-items-center">
        ...
      </div>
    </div>
  </div><!-- END Site Header -->

  <!-- BEGIN Site Main -->
  <div class="site-main flex-grow-1 custom-scroll" data-overlayscrollbars-initialize>
    <div class="h-0px">
      ...
    </div>
  </div><!-- END Site Main-->

  <!-- BEGIN Site Footer -->
  <div class="site-footer d-flex align-items-center mt-auto fixed-bottom">
    ...
  </div><!-- END Site Footer -->
</div><!-- END Site -->
```

Quy ước nên giữ:

- Dùng comment `<!-- BEGIN ... -->` và `<!-- END ... -->` cho block lớn.
- Wrapper ngoài cùng là `.site`.
- Header là `.site-header`, nội dung header là `.header-inner`.
- Main là `.site-main`, bên trong thường có thêm `.h-0px` để xử lý layout scroll.
- Footer là `.site-footer`.
- Container hay dùng `.container-fluid`, không dùng container rộng desktop.
- Layout ưu tiên dạng fullpage, header fixed, footer fixed.

### Cách đặt tên class

Phong cách hiện tại không phải BEM thuần 100%. Nó là kiểu hybrid:

- Block chính dùng kebab-case: `.site-header`, `.page-header`, `.product-item`, `.grid-categories`, `.wallet-balance`.
- Element con thường dùng tên ngắn, lặp lại trong block: `.item`, `.item-link`, `.item-thumb`, `.item-title`, `.icon`, `.text`, `.image`.
- Modifier dùng class phụ đặt cạnh block: `.no-footer`, `.h1x5footer`, `.affiliate`, `.unread`, `.active`.
- Trạng thái hoặc menu active thường target theo block cha: `.item-order .nav-link`, `.item-profile .nav-link`.
- Utility class được dùng rất nhiều cho spacing/layout/state: `.d-flex`, `.align-items-center`, `.ms-auto`, `.mb-4`, `.rounded-3`, `.text-primary`.

Khi viết theo BEM trong dự án mới, nên giữ tinh thần này:

```html
<div class="product-item">
  <div class="product-item__thumb">
    <img class="image" src="./assets/img/example.png" alt="" />
  </div>
  <h3 class="product-item__title">Product name</h3>
  <p class="product-item__desc">Short description</p>
</div>
```

Nếu cần giống BM88io hơn, có thể dùng element ngắn:

```html
<div class="product-item">
  <div class="item-thumb">
    <img class="image" src="./assets/img/example.png" alt="" />
  </div>
  <h3 class="item-title">Product name</h3>
</div>
```

Ưu tiên cho scaffold này:

- Component mới dùng BEM: `.block`, `.block__element`, `.block--modifier`.
- Các class generic như `.icon`, `.text`, `.image`, `.item` chỉ dùng khi nằm trong block rõ ràng.
- Không đặt tên quá dài nếu component chỉ dùng trong một khu vực nhỏ.

### Cấu trúc header

Header trang chủ thường có logo và wallet:

```html
<div class="site-header d-flex align-items-center fixed-top">
  <div class="container-fluid">
    <div class="header-inner d-flex align-items-center">
      <div class="site-brand">
        <a href="index.html" class="site-link">
          <img src="assets/img/logo.svg" class="site-logo" alt="BM88">
        </a>
      </div>
      <div class="user-wallet ms-auto" onclick="location.href='wallet.html'">
        <span class="text amount">45.5$</span>
        <span class="icon"><i class="fa-regular fa-wallet"></i></span>
      </div>
    </div>
  </div>
</div>
```

Header trang con thường có nút back và title:

```html
<div class="site-header bg-primary text-light d-flex align-items-center fixed-top">
  <div class="container-fluid">
    <div class="header-inner d-flex align-items-center">
      <button class="btn btn-sm btn-clight w-36px h-36px d-inline-flex justify-content-center align-items-center rounded-circle me-3" onclick="history.back()">
        <i class="fa-regular fa-chevron-left"></i>
      </button>
      <h4 class="mb-0">Page title</h4>
    </div>
  </div>
</div>
```

### Cấu trúc footer nav

Footer nav dùng `ul.nav`, mỗi tab có `.nav-item item-*`, trong link có `.icon` và `.text`:

```html
<ul class="nav nav-primary align-items-center justify-content-center shadow">
  <li class="nav-item item-home">
    <a href="index.html" class="nav-link">
      <span class="icon"><i class="fa-regular fa-house-blank"></i></span>
      <span class="text text-truncate">Home</span>
    </a>
  </li>
</ul>
```

Set active bằng JS ngắn ở cuối trang:

```html
<script>
  document.querySelector('.item-order .nav-link').classList.add("active");
</script>
```

### Cách chia file include

BM88io dùng `assets/inc` để include CSS/JS và header/footer bằng `document.write`:

```html
<script src="assets/inc/styles.js"></script>
<link href="assets/css/main.css" rel="stylesheet" />
...
<script src="assets/inc/site-header.js"></script>
...
<script src="assets/inc/site-footer.js"></script>
...
<script src="assets/inc/plugins.js"></script>
<script src="assets/js/main.js"></script>
```

Với scaffold Tailwind hiện tại, có thể giữ đơn giản hơn. Nếu dự án có nhiều trang, tạo thêm:

```text
assets/inc/site-header.js
assets/inc/site-footer.js
assets/inc/plugins.js
```

### Cách viết JS

JS hiện tại thiên về khởi tạo plugin và helper global:

```js
function viewheight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
viewheight();

window.addEventListener('resize', () => {
    viewheight();
});
```

Quy ước nên giữ:

- JS dùng chung toàn site viết trong `assets/js/main.js`: viewport helper, plugin init, menu/header/footer, utility dùng lại.
- JS riêng từng page viết trong `assets/js/page-*.js`, ví dụ `page-home.js`, `page-about.js`, `page-contact.js`.
- File `page-*.js` phải khớp với class `page-*` trên `body`. Ví dụ `body.page-home` dùng `assets/js/page-home.js`.
- Thứ tự include: vendor plugin trước, `assets/js/main.js` sau, file `assets/js/page-*.js` cuối cùng.
- Inline script ở cuối trang chỉ dùng cho setup cực nhỏ hoặc dữ liệu server-rendered bắt buộc; nếu logic dài hơn vài dòng thì đưa vào `page-*.js`.
- Các selector thường dùng class trực tiếp, ví dụ `.custom-scroll`, `.item-order .nav-link`.

Ví dụ:

```html
<script src="assets/vendor/gsap/gsap.min.js"></script>
<script src="assets/js/main.js"></script>
<script src="assets/js/page-home.js"></script>
```

### OverlayScrollbars, Lenis, Swiper, GSAP và Phosphor Icons

Vendor local:

```text
assets/vendor/overlayscrollbars/
assets/vendor/lenis/
assets/vendor/swiper/
assets/vendor/gsap/
assets/vendor/phosphor/
```

Vùng scroll dọc dùng:

```html
<main class="site-main custom-scroll" data-overlayscrollbars-initialize>
  ...
</main>
```

Vùng scroll ngang, nếu cần, dùng:

```html
<div class="custom-scroll-x" data-overlayscrollbars-initialize>
  ...
</div>
```

Smooth scroll ngang/canvas dài ưu tiên dùng Lenis local:

```html
<script src="assets/vendor/lenis/lenis.min.js"></script>
```

Nếu chỉ dùng riêng cho một page, cấu hình trong `assets/js/page-*.js`, không đặt logic page-specific vào `main.js`.

Slider dùng Swiper markup:

```html
<section class="hero-slider swiper" data-hero-slider>
  <div class="swiper-wrapper">
    <article class="hero-card swiper-slide">...</article>
  </div>
  <div class="hero-slider__pagination swiper-pagination"></div>
</section>
```

Khởi tạo plugin nằm trong `assets/js/main.js`.

Animation dùng GSAP local:

```html
<script src="./assets/vendor/gsap/gsap.min.js"></script>
```

Các animation chung nên viết thành function trong `assets/js/main.js`, ví dụ `initPageAnimations()`.

Icon dùng Phosphor Icons font local:

```html
<i class="ph ph-storefront"></i>
<i class="ph-fill ph-house"></i>
```

Ưu tiên chọn icon theo ý nghĩa giao diện, không cần giống Figma tuyệt đối.

### Cách viết CSS/SCSS

BM88io có các nhóm rõ ràng:

```scss
/* -------------------
 GLOBAL
 --------------------*/

/* -------------------
 LAYOUT
 --------------------*/

/* -------------------
 Site Header
 --------------------*/
```

Nên giữ cách nhóm này trong `assets/css/styles.css`:

- `GLOBAL`: biến màu, body, typography.
- `UTILITIES`: class kích thước như `.w-32px`, `.h-32px` nếu cần.
- `LAYOUT`: `.site`, `.site-main`, `.container-fluid`.
- `COMPONENTS`: header, footer, nav, card, product item, table.

Style component thường nest theo block trong SCSS. Với CSS thường, viết phẳng:

```css
.site-header {}
.site-header .header-inner {}
.site-header .site-logo {}
```

Nếu muốn BEM hơn:

```css
.site-header {}
.site-header__inner {}
.site-header__logo {}
```

### Pattern UI hay dùng

- Product card/list: `.product-item`, `.product-title`, `.price-tag`.
- Category grid: `.grid-categories`, `.item`, `.item-link`, `.item-thumb`, `.item-title`.
- Page title/header: `.page-header`, `.page-title`.
- Scroll area: `.custom-scroll`, `.custom-scroll-light`.
- Fixed dimensions: `.w-32px`, `.h-32px`, `.w-36px`, `.h-36px`.
- Table variants: `.table-px-0`, `.table-shopping-cart`.
- Nav variants: `.nav-primary`, `.nav-underline`, `.nav-site-menu`.

## Quy ước tài nguyên local

Không gọi CDN hoặc Google Fonts trực tiếp trong HTML.

- Font local nằm trong `assets/fonts/`.
- Font được khai báo bằng `@font-face` ở đầu `assets/css/styles.css`.
- Asset lấy từ Figma nằm trong `assets/img/figma/`.
- Layout hiện tại không cần Tailwind CDN vì style đã viết trong `assets/css/styles.css`.

Nếu sau này cần dùng Tailwind thật sự, ưu tiên build ra CSS local rồi link file đã build, không dùng Tailwind CDN runtime trong HTML.

## Quy ước CSS BEM

CSS custom nằm trong `assets/css/styles.css`.

## Quy ước Typography

Typography nằm ở đầu `assets/css/styles.css`, dùng CSS variables và `clamp()` để co giãn nhẹ theo viewport.

Scale chính:

```css
--text-display-1
--text-display-2
--text-heading-1
--text-heading-2
--text-heading-3
--text-body
--text-small
--text-caption
--heading-title-1
--heading-title-2
--heading-title-3
--heading-title-4
```

HTML heading không tự map size global. Dùng utility class theo hệ token khi cần đổi cấp hiển thị mà vẫn giữ semantic tag:

```html
<h1 class="text-display-1">Page title</h1>
<h2 class="text-heading-2">Section title</h2>
<p class="text-body">Body content</p>
<span class="text-caption">Small label</span>
```

Quy ước dùng:

- `h1`: tiêu đề page lớn.
- `h2`: tiêu đề section lớn.
- `h3`: tiêu đề block/card quan trọng.
- `h4` đến `h6`: tiêu đề nhỏ trong component.
- `.text-body`: nội dung mặc định.
- `.text-small`: nội dung phụ trong card/list.
- `.text-caption`: stock badge, seller name, chú thích nhỏ.

Cú pháp BEM:

```css
.block {}
.block__element {}
.block--modifier {}
```

Ví dụ:

```css
.feature-card {}
.feature-card__title {}
.feature-card__text {}
```

Khi tạo component mới:

1. Đặt tên block theo vai trò, ví dụ `.pricing`, `.testimonial`, `.product-card`.
2. Element con dùng `__`, ví dụ `.pricing__title`.
3. Biến thể dùng `--`, ví dụ `.button--primary`.

## Quy ước JavaScript

JavaScript nằm trong `assets/js/main.js`.

Nguyên tắc:

- Dùng vanilla JS, không cần thư viện.
- Query DOM bằng `data-*` cho hành vi, không phụ thuộc vào class style.
- Bọc logic trong function scope để tránh biến global.
- Kiểm tra element tồn tại trước khi gắn event.

Ví dụ:

```js
const button = document.querySelector("[data-action]");

if (button) {
  button.addEventListener("click", function () {
    console.log("Clicked");
  });
}
```

## Thêm ảnh

Đặt ảnh vào `assets/img/`, sau đó dùng đường dẫn tương đối:

```html
<img src="./assets/img/example.jpg" alt="Mô tả ảnh" />
```

## Thêm trang mới

Tạo file mới cùng cấp `index.html`, ví dụ:

```text
about.html
contact.html
```

Trong trang mới, giữ lại các link asset:

```html
<link rel="stylesheet" href="./assets/css/styles.css" />
<script src="./assets/js/main.js"></script>
```

## Checklist trước khi bàn giao

- Text không bị tràn trên mobile.
- Link điều hướng hoạt động.
- Menu mobile đóng mở đúng.
- Ảnh có `alt`.
- CSS custom theo đúng BEM.
- Không viết JS inline trong HTML nếu không cần thiết.
