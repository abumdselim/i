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
npm run verify     # build + gate একসাথে
```

`npm run build` আর কিছু সিঙ্ক করে না: CSS/ফন্ট/আইকন তিনটাই এখন রেপোর ভিতরের সোর্স।
`out/` হলো পাবলিশ আর্টিফ্যাক্ট (static)।

## কোন ফাইল কোথা থেকে আসে

| এখানে | সোর্স | নিয়ম |
|---|---|---|
| `src/styles/globals.css` | **এখন এটাই সোর্স** (স্টেপ ২) | হাতে এডিট; নিচের অংশ পুরনো `styles.css`-এর সাথে বাইট-সমান |
| `src/fonts/*.woff2` | `_build/fonts/fonts.css`-এর base64 | একবার ডিকোড করা, এখন রেপোর ফাইল |
| `src/components/icons.ts` | **হাতে-এডিটেবল** (স্টেপ ২) | ৬৮টা `<symbol>` + `IconName` ইউনিয়ন |
| `src/components/pages/*.tsx` | হাতে-লেখা | **সব ১৯টা রুট কম্পোনেন্ট**; `scripts/import-page.mjs` আর ব্যবহৃত হয় না (স্টেপ ৪.১-এ মুছে ফেলা হবে) |
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
npm run qa:device   # ডিভাইস ইমুলেশন পাস
```

`qa:capture`-এর জন্য দুই সার্ভার লাগে: পুরনো সাইট `127.0.0.1:8081` (রিপো রুট) আর নতুন বিল্ড
`127.0.0.1:8080` (`npm run preview`)।

**শেষ ফলাফল:** ১১৪ জোড়া ছবি, **০ ব্যর্থতা** — সর্বোচ্চ পার্থক্য ০.০৪৩%, গড় ০.০০৩%, ৭৪টা
জোড়া পিক্সেল-হুবহু। প্রতিটা জোড়ায় পেজের উচ্চতা সমান (কোনো `SIZE` মিসম্যাচ নেই)।

`qa:device` ৩০টা পেজ/ভিউপোর্ট মিলিয়ে দেখে: horizontal overflow, হেডারের ৭৪px, breakpoint-এ
nav/burger, contrast (WCAG AA 4.5:1), আর 24×24 tap target। ফল: ৬০টা ফ্ল্যাগ — **সবগুলোই
পুরনো সাইটেও আছে** (ফুটারের লিঙ্কগুলোর উচ্চতা ১৮–২৩px), অর্থাৎ পোর্টে নতুন রিগ্রেশন শূন্য।

## হোস্টিং

`output: 'export'` — যেখানে আগে ফাইল ছিল, সেখানেই ফাইল। পুরনো `.html` URL-এর জন্য
`public/_redirects` (Netlify / Cloudflare Pages) তৈরি হয়। nginx হলে:

```nginx
rewrite ^/(.+)\.html$ /$1 permanent;
try_files $uri $uri.html $uri/ =404;
```

`next.config.ts`-এ `redirects()` ব্যবহার করা যায় না — export মোডে সেটা সাপোর্ট করে না।

## যা এখনো বাকি

- স্টেপ ০.৫ (কমিট + ট্যাগ) — ব্যবহারকারীর সিদ্ধান্তের অপেক্ষায়।
- স্টেপ ২–৫: ডিজাইন সিস্টেমের সোর্স হাতের কাছে নেওয়া, `_build/` অবসর, CI, ডিপ্লয়মেন্ট।
- `prefers-reduced-motion`-এ প্লেট ল্যাটিসের ~০.৮ সেকেন্ড ফাঁকা থাকা — পুরনো সাইটেরই বাগ
  (`.js .lat .cell-on` কোনো এলিমেন্টে মেলে না), ইচ্ছাকৃতভাবে ঠিক করা হয়নি।
- `contact` ফর্মের `budget` ফিল্ড mailto বডিতে যায় না — পুরনো আচরণ অপরিবর্তিত রাখা হয়েছে।
