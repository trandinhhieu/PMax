# Technical SEO Audit — Hermanos

**Ngày audit:** 19/07/2026  
**Domain theo cấu hình:** `https://www.hermanos.asia`  
**Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Vercel  
**Điểm Technical SEO:** **78/100**

## Kết Luận Điều Hành

Không phát hiện lỗi code-level chặn index trên bốn URL kinh doanh chính: `/en`, `/vi`, `/en/menu`, `/vi/menu`.

Bốn trang đều được prerender thành HTML tĩnh, trả `200`, có nội dung, H1, title, description, canonical tự tham chiếu và hreflang EN/VI. `robots.txt` không chặn Google và sitemap chứa đúng URL canonical public.

Các nguyên nhân hợp lý nhất khiến Search Console vẫn báo chưa index:

1. Sitemap vừa được sửa ngày **17/07/2026**, chỉ hai ngày trước audit. Initial commit là ngày **06/07/2026**. Nếu production deploy theo các mốc này, Google có thể chưa xử lý lại đầy đủ.
2. `/`, `/menu`, `/privacy-policy`, `/thank-you` đang redirect tạm thời `307`; GSC báo “Page with redirect” cho các URL này là đúng.
3. Website chỉ có sáu URL trong sitemap; không có blog, product, category hay booking route riêng.
4. Baseline GSC/CWV trong repository vẫn là `TBD`, nên chưa phân biệt được Discovered, Crawled, duplicate, soft 404 hay lỗi host/DNS.
5. Menu chỉ server-render 12 món pizza ban đầu; category và món còn lại cần JavaScript/interactions.

## Phạm Vi Và Giới Hạn

Đã build production, crawl HTTP như bot, kiểm tra status, redirect, robots, sitemap, canonical, hreflang, metadata, raw HTML, headings, links, images, JSON-LD, rendering mode, mobile/a11y evidence, assets và tests.

Chưa xác minh trực tiếp được DNS/TLS/redirect production, Vercel CDN headers, Google Search Console, field Core Web Vitals và Rich Results Test trên URL live. Vì vậy kết luận production-live có mức tin cậy trung bình, còn kết luận source/build có mức tin cậy cao.

## Route Evidence

| Route | Status | Kết quả |
|---|---:|---|
| `/` | `307` → `/en` | Redirect tạm thời |
| `/en`, `/vi` | `200` | SSG, indexable, canonical đúng |
| `/menu` | `307` → `/en/menu` | Redirect tạm thời |
| `/en/menu`, `/vi/menu` | `200` | SSG, indexable, canonical đúng |
| `/privacy-policy` | `307` → `/en/privacy-policy` | Redirect tạm thời |
| `/en/privacy-policy`, `/vi/privacy-policy` | `200` | Utility pages indexable |
| `/thank-you` | `307` → `/en/thank-you` | Redirect tạm thời |
| `/en/thank-you`, `/vi/thank-you` | `200` | Indexable ngoài ý muốn |
| `/robots.txt` | `200` | Hợp lệ |
| `/sitemap.xml` | `200` | XML hợp lệ, 6 URL |
| Booking APIs GET | `405` | POST-only, không có page content |
| URL không tồn tại | `404` + `noindex` | Đúng |

Production build xác nhận homepage/menu/privacy/thank-you đều là SSG; API là dynamic. First Load JS khoảng `175 kB` cho homepage, `134 kB` cho menu và `103 kB` cho utility pages.

## Critical Issues

### C-01 — Chưa có bằng chứng production/GSC để chẩn đoán cuối cùng

**Giải thích:** Source code và local production output không có blocker rõ ràng, nhưng index là quyết định trên URL production. Không có export GSC hoặc URL Inspection nên chưa biết Googlebot đã fetch URL nào, canonical Google chọn, crawl date và response live.

**Root cause:** Baseline vẫn là `TBD` tại `docs/initiatives/seo-phase-0/baseline.md:9`.

**Files:** `docs/initiatives/seo-phase-0/baseline.md:9`, `docs/initiatives/seo-phase-0/external-setup-zero-to-hero.md:1`.

**Suggested fix:** Lưu Page Indexing export, URL Inspection của bốn URL chính, Sitemap Details/Last read, Crawl Stats 90 ngày, mobile PageSpeed/CrUX và bằng chứng Vercel domain/redirect.

**Estimated SEO impact:** **Critical đối với khả năng chẩn đoán**, chưa thể khẳng định là lỗi website.

## High Priority

### H-01 — Canonical aliases dùng redirect tạm thời `307`

**Giải thích:** `/`, `/menu`, `/privacy-policy`, `/thank-you` không phải URL indexable cuối cùng. Chúng trả `307` do `permanent: false`, vì vậy “Page with redirect” là kết quả dự kiến.

**Root cause/files:** `next.config.ts:43`, đặc biệt `next.config.ts:48`, `next.config.ts:53`, `next.config.ts:58`, `next.config.ts:63`.

**Suggested code:**

```ts
{
  source: "/",
  destination: "/en",
  permanent: true,
}
```

Áp dụng tương tự cho `/menu` và `/privacy-policy`. Destination thank-you vẫn phải `noindex`.

**Estimated SEO impact:** **High** nếu đang request index URL alias; **Medium** đối với destination canonical.

### H-02 — Thank-you pages đang indexable, duplicate và thin

**Giải thích:** `/en/thank-you` và `/vi/thank-you` trả `200`, không có meta robots/canonical/metadata riêng, kế thừa cùng title/description mặc định và chỉ có khoảng 91–115 từ.

**Root cause/files:** Không export metadata tại `src/app/[locale]/thank-you/page.tsx:1`; kế thừa `src/app/[locale]/layout.tsx:15`.

**Suggested code:**

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
```

Giữ thank-you ngoài sitemap. Không chặn route bằng robots.txt vì crawler cần fetch để đọc `noindex`.

**Estimated SEO impact:** **High** đối với index hygiene; không trực tiếp chặn homepage/menu.

### H-03 — Full menu không có đầy đủ nội dung trong initial HTML

**Giải thích:** Menu khởi tạo category `pizza`, page size `12`, rồi slice danh sách. Category khác cần click; món tiếp theo phụ thuộc IntersectionObserver hoặc load more. Không nên dựa vào việc Googlebot click/scroll.

**Root cause/files:** `src/components/menu/useMenuCatalogController.ts:6`, `src/components/menu/useMenuCatalogController.ts:9`, `src/components/menu/useMenuCatalogController.ts:37`.

**Suggested fix:** Server-render toàn bộ category/món thành semantic sections rồi dùng client-side filtering, hoặc tạo URL category crawlable khi mỗi category có intent và content độc lập. Không tạo hàng loạt URL mỏng.

**Estimated SEO impact:** **High** cho menu/long-tail; **Medium** cho indexability của chính `/menu`.

### H-04 — Website chỉ có sáu URL indexable

**Giải thích:** Không có blog, guide, product, category hay booking page; booking chỉ là `#booking`. Điều này giới hạn crawl demand, topical depth và số landing page có search intent.

**Root cause/files:** `src/app/sitemap.ts:5`, `src/app/[locale]/page.tsx:59`, `src/app/[locale]/menu/page.tsx:15`.

**Suggested fix:** Sau khi bốn commercial URLs index ổn định, xây content hub có intent thực, ảnh/dữ liệu/trải nghiệm thật, author/reviewer và internal links về menu, booking, location. Không dùng programmatic SEO hoặc nội dung AI hàng loạt.

**Estimated SEO impact:** **High** đối với organic visibility; không phải technical blocker hiện tại.

## Medium Priority

### M-01 — Thiếu `x-default` và metadata helper dùng chung

**Giải thích:** EN/VI hreflang reciprocal và self-canonical đều đúng, nhưng chưa có `x-default`. Metadata đang lặp giữa pages nên dễ lệch canonical, OG, Twitter khi mở rộng.

**Root cause/files:** `languages` chỉ có `en`, `vi` tại `src/app/[locale]/page.tsx:34` và `src/app/[locale]/menu/page.tsx:28`.

**Suggested code:**

```ts
languages: {
  en: `${domain}/en${path}`,
  vi: `${domain}/vi${path}`,
  "x-default": `${domain}/en${path}`,
}
```

**Estimated SEO impact:** **Medium** cho international targeting và regression prevention.

### M-02 — Structured data chỉ có `Restaurant` trên homepage

**Giải thích:** Restaurant JSON-LD hiện có NAP, geo, opening hours, menu và social profiles. Tuy nhiên chưa có `@id` ổn định và graph liên kết `WebSite`, `WebPage`, `Restaurant`, `Menu`, `BreadcrumbList`.

**Root cause/files:** Chỉ homepage render JSON-LD tại `src/app/[locale]/page.tsx:66`; schema trả một Restaurant object tại `src/lib/schema.ts:12`.

**Suggested fix:** Tạo `@graph` với `@id` ổn định; thêm WebSite/WebPage, Menu và BreadcrumbList đúng với nội dung hiển thị. Không thêm rating/review/offer giả.

**Estimated SEO impact:** **Medium** cho entity understanding; không bắt buộc để index.

### M-03 — Metadata utility pages chưa localized đầy đủ

**Giải thích:** Privacy chỉ khai báo title và alternates, nên EN/VI kế thừa cùng description tiếng Anh và OG mặc định. Thank-you không có metadata riêng.

**Root cause/files:** `src/app/[locale]/privacy-policy/page.tsx:21`, default metadata tại `src/app/[locale]/layout.tsx:21`.

**Suggested fix:** Thêm description localized cho privacy; noindex thank-you. Privacy có thể ở lại sitemap vì quy mô site nhỏ.

**Estimated SEO impact:** **Medium-Low**.

### M-04 — SEO checker chỉ kiểm tra presence, không kiểm tra output

**Giải thích:** `ai:check-seo` pass nếu corpus có chữ metadata/Restaurant; không bắt canonical sai, mất hreflang, sitemap redirect, thank-you thiếu noindex hoặc JSON-LD parse error.

**Root cause/files:** Regex presence checks tại `scripts/ai/check-seo-files.mjs:29`–`scripts/ai/check-seo-files.mjs:33`.

**Suggested fix:** Thêm integration assertions cho robots, sitemap, title, description, canonical/hreflang, JSON-LD và `noindex` thank-you.

**Estimated SEO impact:** **Medium** vì bảo vệ production khỏi regression.

### M-05 — Security headers chưa cấu hình toàn site trong code

**Giải thích:** Local response lộ `X-Powered-By: Next.js`; code chỉ thêm `X-Content-Type-Options` cho sitemap và cache cho images. Vercel có thể thêm header trên live nhưng chưa xác minh.

**Root cause/files:** `headers()` chỉ có hai rule tại `next.config.ts:17`.

**Suggested code:**

```ts
const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Add tested global security headers.
};
```

Triển khai CSP ở report-only trước vì GTM dùng inline script.

**Estimated SEO impact:** **Low trực tiếp**, **Medium** cho security/operations.

### M-06 — Mobile menu button không có accessible name

**Giải thích:** Button mở menu chỉ chứa icon `aria-hidden`, có `aria-expanded` nhưng không có `aria-label`; raw HTML cho thấy accessible text rỗng.

**Root cause/files:** `src/components/landing/Header.tsx:91`–`src/components/landing/Header.tsx:100`.

**Suggested code:**

```tsx
<Button
  aria-label={locale === "en" ? "Menu" : "Menu điều hướng"}
  aria-expanded={isOpen}
  onClick={openMenu}
>
  <MenuIcon aria-hidden />
</Button>
```

**Estimated SEO impact:** **Low trực tiếp**, **Medium** cho accessibility/mobile usability.

### M-07 — API index hardening chưa explicit

**Giải thích:** APIs không có trong sitemap và GET trả `405`, nên hiện không có content indexable. Tuy nhiên robots allow toàn site và API không có `X-Robots-Tag`.

**Root cause/files:** `src/app/robots.ts:6`; không có global header cho `/api/:path*`.

**Suggested fix:** Optional hardening bằng `X-Robots-Tag: noindex, nofollow` trên API. Không thêm API vào sitemap.

**Estimated SEO impact:** **Low-Medium**.

### M-08 — Thiếu favicon/manifest assets chuyên dụng

**Giải thích:** Layout dùng logo JPEG 2000×2000 làm icon/apple icon. Không thấy favicon, manifest hoặc icon chuẩn kích thước.

**Root cause/files:** `src/app/[locale]/layout.tsx:22`, `src/config/business.ts:38`.

**Suggested fix:** Thêm favicon và apple-touch icon đúng kích thước; thêm manifest nếu cần PWA/brand consistency.

**Estimated SEO impact:** **Low**.

## Low Priority

1. Sitemap không có `lastmod`: hợp lệ; chỉ thêm ngày cập nhật chính xác, không dùng `new Date()` cho mọi build.
2. Chưa có breadcrumb UI/schema: hữu ích khi site mở rộng, chưa cấp thiết với route depth hiện tại.
3. Open Graph locale dùng `en`/`vi`: nên chuẩn hóa locale/alternate locale phù hợp.
4. Original JPEG assets khá lớn, nhưng pages dùng `next/image`, AVIF/WebP, responsive sizes và lazy loading.
5. Không có custom 404: status và `noindex` đúng; custom page chỉ cải thiện UX.

## Passed Checks

### Robots Và Sitemap

- `robots.txt` tồn tại, trả `200`, public và syntax hợp lệ.
- `User-Agent: *`, `Allow: /`; không chặn Googlebot hoặc public assets.
- Sitemap absolute HTTPS đúng domain.
- Sitemap trả `200`, `application/xml`, có 6 URL, không localhost, duplicate, query params, redirects hay API URLs.
- Mỗi public indexable URL xuất hiện đúng một lần; quy mô không cần sitemap index.

### Status, Canonical Và Crawlability

- Core localized pages trả `200`; invalid locale/URL trả `404`.
- Không thấy auth, middleware, cookie wall, redirect loop hoặc blocked assets trong source.
- Core pages không có `noindex`, `nofollow`, `none` hoặc X-Robots-Tag chặn index.
- Core pages có self-canonical HTTPS đúng host, reciprocal hreflang và trailing-slash consistency.
- API GET trả `405`, không giả thành content page.

### Rendering Và HTML

- Tất cả public pages là SSG, không CSR-only.
- Raw HTML chứa text, headings, links và homepage JSON-LD trước hydration.
- Homepage có một H1, 9 H2 và khoảng 616 từ EN/797 từ VI.
- Menu có một H1 và khoảng 473 từ EN/609 từ VI trong initial visible DOM.
- Privacy khoảng 92 từ EN/125 từ VI; thank-you khoảng 91 từ EN/115 từ VI.

### Images, Mobile Và Accessibility

- Homepage có 14 images, không thiếu alt; một alt rỗng là hero decorative hợp lệ.
- Menu có 13 images, không thiếu alt.
- Hero dùng priority/fetch priority high; ảnh khác lazy load.
- `next/image` dùng responsive sources, AVIF/WebP và aspect-ratio wrappers.
- Viewport meta đúng và `<html lang>` theo locale.
- Contrast chính đạt WCAG AA: muted/cream `5.24:1`, tomato/cream `5.31:1`, white/tomato `5.96:1`.
- Responsive audit hiện có pass 320 px, reflow 200% và keyboard traversal cho public routes.
- H1 hierarchy đúng; form có labels và ARIA validation states.

### Build Và Tests

- `npm run build:production`: pass, 15 static pages generated.
- `npm run ai:check-seo`: pass.
- `npm run typecheck`: pass.
- `npm run test:unit`: 38/38 pass.
- Production gate fail-build nếu thiếu/sai `NEXT_PUBLIC_SITE_URL` hoặc GTM trong Vercel production.

## Coverage Theo 25 Nhóm Audit

| Nhóm | Kết quả |
|---|---|
| Robots | Pass |
| Sitemap | Pass; `lastmod` optional |
| HTTP status | Core pass; aliases là `307` |
| Meta robots | Core pass; thank-you fail |
| Canonical | Core pass |
| Next.js metadata | Pass chính; utility pages incomplete |
| SSR/SSG/ISR/CSR | Pass, public pages SSG |
| Raw HTML | Pass |
| Structured data | Partial: Restaurant homepage only |
| Internal linking | Pass cho 6 URLs; không có breadcrumbs/content hub |
| Crawlability | Pass trong source; live host chưa verify |
| Core Web Vitals | Chưa có field/lab production data |
| Duplicate content | Thank-you và utility metadata có vấn đề |
| Content quality | Core tốt; utility thin/expected |
| Images | Pass |
| URL structure | Pass |
| Redirect chains | Không thấy loop; aliases nên permanent |
| Security | Partial; live headers chưa verify |
| Performance | Tốt ở mức build; cần PSI/CrUX |
| Vercel deployment | Production env gate pass; domain/CDN live chưa verify |
| GSC issues | Mapping hoàn tất; cần export để kết luận |
| Build configuration | Pass |
| APIs | Không ở sitemap, GET 405; hardening optional |
| Mobile SEO | Pass theo responsive evidence |
| Accessibility | Pass phần lớn; mobile menu label cần sửa |

## Mapping Google Search Console

| GSC status | Khả năng | Diễn giải |
|---|---|---|
| Discovered – currently not indexed | Cao nếu deploy/sitemap mới | Sitemap vừa đổi 17/07/2026; site có thể còn mới và ít external signals |
| Crawled – currently not indexed | Cao cho privacy/thank-you | Thank-you thin/duplicate; privacy utility; core home/menu có content tốt hơn |
| Duplicate without user-selected canonical | Thấp trong code | Core pages self-canonical; cần kiểm tra apex/www, HTTP/HTTPS và Vercel preview URLs |
| Alternate page with canonical | Có thể đúng với URL variants | Cần xem inspected URL và Google-selected canonical |
| Soft 404 | Trung bình cho thank-you | `200` nhưng thin và transactional |
| Blocked by robots.txt | Rất thấp | Robots allow all |
| Blocked due to unauthorized request | Rất thấp cho public pages | Không có auth/middleware; API là POST-only |
| Page with redirect | Chắc chắn cho aliases | `/`, `/menu`, `/privacy-policy`, `/thank-you` là `307` |

## Kế Hoạch Xử Lý

### Trong 24 Giờ

1. Đổi redirect aliases sang permanent.
2. Thêm `noindex` cho EN/VI thank-you.
3. Deploy và inspect bốn core URLs trong GSC.
4. Chỉ request indexing cho bốn core URLs, không request URL redirect hoặc thank-you.
5. Xác minh apex, `www`, HTTP và Vercel preview hợp nhất về canonical host.

### Trong 7 Ngày

1. Thêm `x-default` và metadata helper.
2. Thêm automated SEO output tests.
3. Chọn kiến trúc server-render toàn menu hoặc category URLs crawlable.
4. Hoàn thiện Restaurant/WebSite/WebPage/Menu/Breadcrumb graph.
5. Ghi baseline GSC, GA4 và CWV thực tế.

### Trong 30–60 Ngày

1. Theo dõi index coverage hàng tuần, không request indexing lặp lại liên tục.
2. Xây content hub và 2–4 trang intent-driven chất lượng cao.
3. Tăng internal links từ homepage/menu/footer tới content mới.
4. Đồng bộ NAP, menu URL và website URL trên Google Business Profile/social profiles.
5. Đo organic/local conversions thay vì chỉ đếm indexed pages.

## Score Breakdown

| Nhóm | Điểm |
|---|---:|
| Crawlability, robots, sitemap, status | 18/20 |
| Metadata, canonical, hreflang | 14/18 |
| Rendering và HTML content | 16/18 |
| Structured data/entity | 8/12 |
| Internal linking và architecture | 7/10 |
| Performance, images, mobile, accessibility | 10/12 |
| Deployment verification, security, regression tests | 5/10 |
| **Tổng** | **78/100** |

## Kết Luận Cuối

**Không có bằng chứng source code cho thấy Google bị robots/noindex/canonical/CSR chặn trên bốn trang kinh doanh chính.** Nếu `/en`, `/vi`, `/en/menu`, `/vi/menu` vẫn chưa index, cần ưu tiên điều tra production host configuration, độ mới của deployment/sitemap, URL Inspection và tín hiệu quality/authority ngoài website.

Ba thay đổi code nên làm ngay:

1. Permanent redirects.
2. Noindex thank-you.
3. Server-render/crawl architecture cho toàn bộ menu.

Sau đó cần lấy dữ liệu GSC thực tế trước khi kết luận thêm hoặc tạo nhiều URL mới.
