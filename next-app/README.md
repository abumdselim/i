# Intactic — Next.js + TypeScript build

এই ফোল্ডারটা সাইটের নতুন ইমপ্লিমেন্টেশন — স্টেপ ২-এর পর **ডিজাইন সিস্টেমও এখানেই থাকে**: CSS, আইকন
স্প্রাইট আর ফন্ট আর `_build/` থেকে কপি হয় না। পুরনো জেনারেটর শুধু ইতিহাস (`legacy/`, স্টেপ ৩)।

## চালানো

```powershell
cd next-app
npm install
npm run dev        # http://localhost:3000
npm run build      # next build → out/
npm run gate       # out/ বনাম qa/reference, রুট ধরে ধরে
npm run verify     # build + gate + lint একসাথে
npm run lint       # eslint (next/core-web-vitals)
```

`npm run build` আর কিছু সিঙ্ক করে না: CSS/ফন্ট/আইকন তিনটাই এখন রেপোর ভিতরের সোর্স।
`out/` হলো পাবলিশ আর্টিফ্যাক্ট (static)।

## কোন ফাইল কোথা থেকে আসে

| এখানে | সোর্স | নিয়ম |
|---|---|---|
| `src/styles/globals.css` | **এখন এটাই সোর্স** (স্টেপ ২) | হাতে এডিট; নিচের অংশ পুরনো `styles.css`-এর সাথে বাইট-সমান |
| `src/fonts/*.woff2` | `_build/fonts/fonts.css`-এর base64 | একবার ডিকোড করা, এখন রেপোর ফাইল |
| `src/components/icons.ts` | **হাতে-এডিটেবল** (স্টেপ ২) | ৬৮টা `<symbol>` + `IconName` ইউনিয়ন |
| `src/components/pages/*.tsx` | হাতে-লেখা | **সব ১৯টা রুট কম্পোনেন্ট** |
| `src/lib/content/*.ts` | `_build/cats.py`, `_build/products.py`, `_build/build.py`-এর `PAGES` ও ফিগার | **এখন এটাই সোর্স** — এক্সপোর্টার অবসর, JSON আর নেই (স্টেপ ১) |
| `public/_redirects` | `src/lib/content/pages.ts` | **স্ট্যাটিক** (স্টেপ ২) — নতুন রুট হলে হাতে যোগ করতে হয়; গেট না থাকলে ফেল করে |

## কনটেন্ট লেয়ার

ছয়টা ক্যাপাবিলিটি, চারটা প্রোডাক্ট আর প্রোডাক্ট হাব — এই ১১টা রুট এক-একটা টেমপ্লেট থেকে আসে,
আর তাদের কনটেন্ট আসে টাইপড ডেটা থেকে, JSX-এ লেখা কপি থেকে নয়।

| স্তর | ফাইল | নিয়ম |
|---|---|---|
| সোর্স | `src/lib/content/{capabilities,products}.ts` | কপি এডিট হয় এখানেই — প্রতিটা এন্ট্রির উপরে এক লাইন কমেন্ট |
| ম্যানিফেস্ট | `src/lib/content/pages.ts` | রুট · টাইটেল · ডেসক্রিপশন · `navKey` · `kind`; সব টুল এখান থেকেই পড়ে (`scripts/manifest.mjs`) |
| স্কিমা | `src/lib/content/types.ts` | `IconName`, `MetaValue` union, `CapabilityContent` / `ProductContent` |
| সেকশন | `components/sections/{PageHead,SystemMap,Blocks}.tsx` | হেড + মেটা রেল, ৯-সেল ম্যাপ, সেকশন হেড, ডেলিভারেবল, রুলস, রিলেটেড, স্ট্যাক প্যানেল |
| টেমপ্লেট | `components/pages/{CapabilityPage,ProductPage,ProductsHub}.tsx` | ৬ + ৪ + ১ পেজ |
| হোম | `components/pages/home/{Hero,Sections,index}.tsx` | ৯ সেকশন, নিজস্ব ডেটা |
| গ্রাফিক্স | `components/sections/Figure.tsx` | ৯ ফিগার + ৪২-সেল প্লেট ডেটা থেকে |
| রুট | `src/app/[slug]/page.tsx` | `generateStaticParams` + `dynamicParams = false` |

**নতুন ক্যাপাবিলিটি বা প্রোডাক্ট যোগ করতে:** `src/lib/content/capabilities.ts` (বা `products.ts`)-এ
একটা এন্ট্রি, `src/lib/content/pages.ts`-এ রুট — তারপর `npm run build`। নতুন পেজ ফাইল বা রুট
লিখতে হয় না। আইকনের নাম স্প্রাইটে না থাকলে **টাইপচেকেই** ধরা পড়ে (`satisfies`), বিল্ড ফেল করে।

## পুরনো সাইট থেকে ইচ্ছাকৃত চারটা পার্থক্য

1. **রিভিল গেট** — `html.js` → `html.reveal-ready`, আর রিভিলড অবস্থা `.in` ক্লাসের বদলে
   `data-revealed` অ্যাট্রিবিউট (React `className`-এর মালিক, তাই হাইড্রেশন সেটা ফিরিয়ে দিতে
   পারত)। IO/MutationObserver না থাকলে গেট বসেই না, আর ১.৫ সেকেন্ডের ওয়াচডগ: অবজারভার
   কিছু না জানালে সব কনটেন্ট দেখানো হয়।
2. **ফন্ট** — base64 inline বদলে `next/font/local`; `tokens.css`-এর `'Barlow'`/`'Titillium Web'`
   `var(--font-barlow)` / `var(--font-titillium)`-এ ম্যাপ করা, ক্লাসটা `<html>`-এ (body-তে দিলে
   `--font-*` invalid at computed-value হয়ে সাইট serif-এ পড়ে)।
3. **লিঙ্ক** — রুটের সাপেক্ষ `contact.html` → অ্যাবসোলিউট `/contact`, ছবি `assets/…` → `/assets/…`।
4. **CTA** — পুরনো সাইটের মতোই `<main>`-এর বাইরে, প্রতিটা পেজের শেষে।

এছাড়া `data-reveal` কনটেন্ট RSC-তেই থাকে (প্রতি সেকশনে client wrapper নেই), আর স্প্রাইট
`layout.tsx`-এ ঠিক একবার রেন্ডার হয়।

## গেট কী দেখে

`npm run gate` (`scripts/gate.py`) প্রতি রুটে:

তুলনাটা হয় `qa/reference/`-এর **ফ্রোজেন কপির** সাথে, রুটের জীবন্ত `*.html`-এর সাথে নয় —
`python scripts/freeze-reference.py` একবার ওটা বানিয়ে প্রতি পেজের ডাইজেস্ট `baseline.json`-এ
রেখে দেয়। ফলে রুটের ফাইল পরে বদলালেও গেটের মাপকাঠি নড়ে না।

- `qa/reference/baseline.json`-এর ডাইজেস্টের সাথে ফ্রোজেন ফাইলগুলো অটুট আছে কি না,
- `<main>`-এর দৃশ্যমান টেক্সট **অক্ষর-ধরে** পুরনো পেজের সাথে মিলছে কি না (থ্রেশহোল্ড ০),
- **মার্কআপ স্বাক্ষর** — `<main>`-এর ভেতরের প্রতিটা `tag.class` একই ক্রমে আছে কি না (wrapper
  বা ক্লাস বদলালে টেক্সট মিললেও ধরা পড়ে),
- `<title>` মিলছে কি না,
- স্প্রাইটে নেই এমন `<use href="#…">`, duplicate `id`, টার্গেটহীন anchor আছে কি না,
- থিম/রিভিল bootstrap হেডারের আগে চলে কি না,
- `globals.css`-এ `.reveal-ready [data-reveal]` আছে আর পুরনো `.js [data-reveal]` নেই,
- `--font-barlow` / `--font-titillium` / `--accent:#115fc8` / `--head-h:74px` অটুট আছে কি না,
- `public/_redirects` এক্সপোর্ট হয়েছে কি না, আর ম্যানিফেস্টের **প্রতিটা রুটের** নিয়ম আছে কি না,

## যাচাই

```powershell
npm run qa:capture   # ১৯ রুট × ৩ width × ২ theme — দুই বিল্ড থেকে স্ক্রিনশট
npm run qa:compare  # Pillow দিয়ে পিক্সেল ডিফ
npm run qa:device   # ডিভাইস ইমুলেশন পাস (৬০টা পরিচিত ফ্ল্যাগে exit 1)
npm run qa:device:diff  # পোর্ট বনাম পুরনো বিল্ড — **নতুন** সমস্যা থাকলেেই ফেল
```

`qa:capture`-এর জন্য একটাই সার্ভার লাগে: `127.0.0.1:8080` (`npm run preview`)। তুলনা হয়
`qa/reference/shots/`-এর অনুমোদিত ছবিগুলোর সাথে — আর কোনো পুরনো বিল্ড সার্ভ করতে হয় না।

**শেষ ফলাফল:** ১১৪ জোড়া ছবি, **০ ব্যর্থতা** — সর্বোচ্চ পার্থক্য ০.০৪৩%, গড় ০.০০৩%, ৭৪টা
জোড়া পিক্সেল-হুবহু। প্রতিটা জোড়ায় পেজের উচ্চতা সমান (কোনো `SIZE` মিসম্যাচ নেই)।

`qa:device` ৩০টা পেজ/ভিউপোর্ট মিলিয়ে দেখে: horizontal overflow, হেডারের ৭৪px, breakpoint-এ
nav/burger, contrast (WCAG AA 4.5:1), আর 24×24 tap target। ফল: ৬০টা ফ্ল্যাগ — **সবগুলোই
পুরনো সাইটেও আছে** (ফুটারের লিঙ্কগুলোর উচ্চতা ১৮–২৩px), তাই `qa:device` সবসময় exit 1 দেয়।
তাই CI চালায় `qa:device:diff`: দুই বিল্ডের সমস্যার তালিকা মিলিয়ে শুধু **নতুন** সমস্যায় ফেল করে।

## হুক ও CI

**প্রি-কমিট হুক** (টাইপচেক + গেট) রেপোতে আছে, কিন্তু গ্রাহককে একবার চালু করতে হয়:

```powershell
git config core.hooksPath .githooks
```

`out/` না থাকলে হুক গেট বাদ দেয় (শুধু টাইপচেক চালায়) — আগে `npm run build`।

**CI** (`.github/workflows/ci.yml`) push/PR-এ দুইটা জব চালায়: `verify` (build · gate · lint · tsc)
আর `visual` (১৪৪ পেয়ারের পিক্সেল ডিফ + ডিভাইস ডেল্টা)। ভিজ্যুয়াল জব ৮০৮১-এ **`qa/reference`**
পরিবেশন করে, রুটের `*.html` নয় — মাপকাঠি একটাই হওয়া উচিত। ফেল করলে `qa/diff` আর্টিফ্যাক্ট
আপলোড হয়।

## বেসলাইন সরানো (ইচ্ছাকৃত পরিবর্তনের পর)

গেট আর ভিজ্যুয়াল ডিফ দুটোই `qa/reference/`-এর সাথে মেলে — তাই ইচ্ছাকৃত কপি বা মার্কআপ বদল
আলাদা করে "অনুমোদন" করতে হয়, নইলে প্রতিটা বিল্ড লাল দেখাবে:

```powershell
npm run build
npm run qa:capture -- --only <route>          # নতুন স্ক্রিনশট
python scripts/approve.py <page>.html --note "কেন বদলাল" --shots
npm run gate                                  # এখন সবুজ
```

`approve.py` পেজটার HTML কপি করে, ডাইজেস্ট নতুন করে হিসাব করে, আর `baseline.json`-এর
`approvals`-এ কারণ লিখে রাখে — কে, কবে, কেন মাপকাঠি সরাল তা পরে দেখা যায়।

ডিভাইস পাসের গ্রহণযোগ্য সমস্যার তালিকা `qa/reference/device-problems.txt`; ইচ্ছাকৃতভাবে
নতুন করে লিখতে `node scripts/device-regress.mjs --write-baseline`।

## হোস্টিং

`output: 'export'` — যেখানে আগে ফাইল ছিল, সেখানেই ফাইল। পাবলিশ আর্টিফ্যাক্ট `next-app/out/`:

- ২০টা পেজ (১৯ রুট + `404.html`), `_next/` অ্যাসেট, `assets/img/`, ফন্ট
- `robots.txt` ও `sitemap.xml` — `public/`-এ স্ট্যাটিক; গেট যাচাই করে প্রতিটা রুট সাইটম্যাপে আছে
- `_redirects` — পুরনো `.html` URL → ক্লিন URL (Netlify / Cloudflare Pages)

| হোস্ট | যা করতে হবে |
|---|---|
| Netlify / Cloudflare Pages | publish directory = `next-app/out`; `_redirects` নিজেই কাজ করে |
| Vercel | `cleanUrls: true`; `_redirects` Vercel পড়ে না, তাই redirect গুলো `vercel.json`-এ লিখতে হবে |
| nginx | নিচের দুই লাইন |

```nginx
rewrite ^/(.+)\.html$ /$1 permanent;
try_files $uri $uri.html $uri/ =404;
```

`next.config.ts`-এ `redirects()` ব্যবহার করা যায় না — export মোডে সেটা সাপোর্ট করে না।

**যাচাই করা আছে:** ১৯টা রুটই `out/`-এর ফাইলের বাইটের সাথে অক্ষরে অক্ষরে মিলিয়ে সার্ভ হয়,
আর `robots.txt`, `sitemap.xml`, `_redirects`, `404.html`, লোগো ও OG ইমেজ সব ২০০ দেয়।
ডিপ্লয় নিজে করা হয়নি — হোস্ট, DNS আর লাইভ যাওয়ার সময় মানুষের সিদ্ধান্ত।

## যা এখনো বাকি

- ডিপ্লয়মেন্ট (স্টেপ ৫): হোস্ট বাছাই, DNS, লাইভ যাওয়া — আর্টিফ্যাক্ট তৈরি ও যাচাই করা।
- CI এখনো GitHub-এ চালানো হয়নি; প্রথম push-এ দেখতে হবে দুইটা জব পাশ করে।
- `prefers-reduced-motion`-এ প্লেট ল্যাটিসের ~০.৮ সেকেন্ড ফাঁকা থাকা — পুরনো সাইটেরই বাগ
  (`.js .lat .cell-on` কোনো এলিমেন্টে মেলে না), ইচ্ছাকৃতভাবে ঠিক করা হয়নি।
- `contact` ফর্মের `budget` ফিল্ড mailto বডিতে যায় না — পুরনো আচরণ অপরিবর্তিত রাখা হয়েছে।
