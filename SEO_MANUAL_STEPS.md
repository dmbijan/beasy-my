# 🚀 Checklist SEO Beasy.my - Langkah Manual

## ✅ Yang Sudah Diimplementasi (Codebase)

### 1. Technical SEO Foundation
- [x] `metadataBase` di root layout
- [x] Dynamic meta tags per event page
- [x] Keywords dalam metadata
- [x] Open Graph images (OG)
- [x] Twitter Cards
- [x] PWA manifest + icons
- [x] robots.txt optimized
- [x] sitemap.xml dynamic (auto-discover events)

### 2. Structured Data (JSON-LD)
- [x] FAQPage schema (homepage)
- [x] Event schema (per event page)
- [x] SoftwareApplication schema (LocalBusiness)
- [x] Canonical URLs

### 3. Landing Pages (SEO Keywords)
- [x] `/events/wedding` - "Jemputan Kahwin Digital"
- [x] `/events/birthday` - "Jemputan Birthday Online"
- [x] `/events/corporate` - "Jemputan Korporat"
- [x] `/events/aqiqah` - "Jemputan Aqiqah Digital"

### 4. Content Marketing
- [x] `/guides/panduan-jemputan-kahwin-digital` (2500+ words)
- [x] FAQ section di homepage
- [x] Testimonials section

---

## 🔴 LANGKAH MANUAL YANG PERLU ANDA BUAT

### Step 1: Submit Sitemap ke Google Search Console ⭐ PRIORITI TINGGI

**Kenapa:** Google perlu tahu tentang website anda. Tanpa ini, pages tak akan index.

**Cara Buat:**

1. Pergi ke https://search.google.com/search-console
2. Klik "Add Property"
3. Masukkan: `beasy.my` (atau `www.beasy.my`)
4. Verify ownership - pilih salah satu cara:
   - **HTML file upload**: Download file dari Google, upload ke `public/google-site-verification.html`
   - **DNS record**: Tambah TXT record di domain hosting
   - **HTML tag**: Copy paste code ke `<head>` layout.tsx
   - **Google Analytics**: Jika dah ada GA4, verify melalui sana

5. Setelah verified, pergi ke "Sitemaps" menu
6. Submit sitemap URL: `https://beasy.my/sitemap.xml`
7. Klik "Submit"

**Verify indexing:**
```
Di Google Search Console → Search Results → Performance
Check jika pages muncul dalam carian
```

**Timeline:** 1-7 hari untuk pages mula index

---

### Step 2: Daftar Social Media Profiles (Dengan Backlink)

**Kenapa:** Social profiles = backlinks berkualiti. Juga untuk brand authority.

**Platforms & Handle Suggestions:**

| Platform | Handle Idea | Profile URL Target |
|----------|-------------|-------------------|
| **Facebook** | @beasy.my | facebook.com/beasy.my |
| **Instagram** | @beasy_my | instagram.com/beasy_my |
| **TikTok** | @beasy.my | tiktok.com/@beasy.my |
| **Twitter/X** | @beasy_my | twitter.com/beasy_my |
| **YouTube** | Beasy.my | youtube.com/@beasy.my |
| **Pinterest** | Beasy.my | pinterest.com/beasy_my |
| **LinkedIn** | Beasy.my | linkedin.com/company/beasy-my |

**Bio Template (semua platforms):**
```
Beasy.my 🇲🇾 Platform acara digital Malaysia — jemputan online, galeri foto, audio guestbook, RSVP & angpao digital. Percuma untuk mulakan! ✨
🔗 beasy.my
```

**Action Items:**
1. ✅ Daftar semua accounts di atas
2. ✅ Upload logo sama (icon.svg dari project)
3. ✅ Bio link ke `https://beasy.my`
4. ✅ Post pertama: Link ke landing pages (`/events/wedding`, dll)
5. ✅ Pin post panduan di Facebook page

---

### Step 3: Submit ke Directories Malaysia

**Kenapa:** Directory submissions = backlinks + visibility

**Directories Untuk Submit:**

#### High Priority (Submit Sekarang):
1. **ProdukMalaysia.com** - produkmalaysia.com
   - Category: Technology / Web Services
   - Free listing available

2. **HotFirms.com** - hotfirm.com
   - Category: Business Services
   - Free registration

3. **MyEvents.com.my** - myevents.com.my
   - Category: Event Platforms
   - Perfect match for Beasy.my

4. **DirectoryMalaysia.com** - directorymalaysia.com
   - General business directory

5. **YellowPages.com.my** - yelp.com.my
   - Popular Malaysian directory

#### Medium Priority (Week 2-4):
6. **Crunchbase** - crunchbase.com
   - Startup profile (builds credibility)

7. **AngelList/Wellfound** - wellfound.com
   - For startup hiring & visibility

8. **ProductHunt** - producthunt.com
   - Launch Beasy.my as product
   - HUGE traffic boost possible

9. **G2** - g2.com
   - Software reviews platform

10. **Capterra** - capterra.com
    - Software directory

**Submission Tips:**
- Gunakan description yang sama di semua directories
- Include keywords: "digital invitation platform Malaysia", "wedding event platform"
- Link ke homepage + landing pages
- Upload logo (icon.svg)
- Add website screenshot

---

### Step 4: Vendor Partnerships (Backlinks Strategy)

**Kenapa:** Wedding vendor backlinks = HIGH authority dalam niche wedding Malaysia

**Target Vendors (50+ vendors):**

#### Kategori Photographer/Videographer:
```
1. Wedding photography studio (carikata.com)
2. Cinematic wedding videographers
3. Pre-wedding shoot studios
4. Mobile photographers
```

#### Kategori Venue/Dewan:
```
1. Dewan serbaguna seluruh Malaysia
2. Wedding venues (Klang Valley, Penang, JB)
3. Resort wedding packages
4. Outdoor wedding locations
```

#### Kategori Catering:
```
1. Catering services (buffet, box meals)
2. Traditional Malay catering
3. Modern fusion catering
4. Cake shops (wedding cakes)
```

#### Kategori Fashion/Beauty:
```
1. Bridal boutiques
2. Makeup artists (MUA)
3. Tailors (baju kurung, songkok)
4. Jewelry designers
```

**Partnership Offer Template:**
```
Subject: Collaboration - Promote Your Portfolio to Our Users

Hi [Vendor Name],

I'm from Beasy.my, a digital event platform serving thousands of 
newlyweds in Malaysia.

We'd love to feature your portfolio/services on our platform and 
include a link to your website in our vendor directory.

In return, we ask that you include a link back to beasy.my in:
- Your website footer
- Your email signature
- Social media bio

This is a win-win: your services get exposure to engaged couples, 
and we get to recommend quality vendors to our users.

Interested? Let me know and I'll send more details!

Best regards,
[Your Name]
Beasy.my Team
```

**Expected Timeline:**
- Month 1-2: 20 vendor partnerships
- Month 3-4: 50 vendor partnerships
- Month 5-6: 100+ vendor partnerships

---

### Step 5: Guest Posting (Blog Outreach)

**Kenapa:** Guest posts = high-quality backlinks + referral traffic

**Target Blogs:**

#### Wedding Blogs (High Priority):
```
1. Cantik乐 (cantikle.com) - Malaysian Chinese wedding
2. MyWedding.com.my
3. TheKnot.com.my
4. Bridezola Malaysia
5. WeddingVibes.my
6. Nuffnang Weddings
7. HotFM Raya campaigns
```

#### Lifestyle/Business Blogs:
```
1. SheGlobalizes
2. Fimky Bakri blog
3. Zayan Shah blogs
4. Startup blogs (eCommerce Malaysia)
5. Tech blogs (TechNave, Digital Life)
```

#### Education/How-to Blogs:
```
1. HiredMalaysia
2. Kenyans in Malaysia (for diaspora weddings)
3. Expat blogs in KL/Penang
```

**Guest Post Topics (Pitch These):**
```
1. "5 Cara Buat Jemputan Kahwin Digital Yang Memukau"
2. "Trend Jemputan Digital di Malaysia 2025"
3. "Panduan Lengkap Planning Majlis Perkahwinan Budget RM10k"
4. "Kenapa Jemputan Digital Lebih Baik Dari Cetak?"
5. "Tips Uruskan Wedding Budget Secara Efisien"
```

**Outreach Email Template:**
```
Subject: Guest Post Contribution - [Topic Title]

Hi [Blog Owner Name],

I've been following your blog for a while and really enjoy your 
content on [specific topic they write about].

I'm the founder of Beasy.my, a Malaysian digital event platform. 
I'd love to contribute a guest post to your blog.

Here are 3 topic ideas I can write:

1. "[Topic 1]" - Focus on wedding planning tips
2. "[Topic 2]" - Digital trends in Malaysia
3. "[Topic 3]" - Practical budget guide

All posts will be:
- 2000+ words original content
- SEO optimized
- Include relevant images
- Provide value to your readers

Would any of these topics work for you?

Best regards,
[Your Name]
Founder, Beasy.my
```

---

### Step 6: Content Calendar (Bulan Pertama)

**Month 1 Blog Posts:**

#### Week 1: Panduan Utama (Already Done ✅)
- ✅ `/guides/panduan-jemputan-kahwin-digital`

#### Week 2: Template Showcase
- Create: `/guides/10-template-jemputan-kahwin-cantik`
- Target keyword: "template jemputan kahwin melayu"
- Showcase 10 best templates dengan screenshots
- Include CTA ke create wizard

#### Week 3: Comparison Post
- Create: `/guides/banding-platform-jemputan-online`
- Target keyword: "platform jemputan online terbaik"
- Comparison table: Beasy.my vs Sedetik vs MomenSpace vs Galeri Kawen
- Be honest but highlight Beasy advantages

#### Week 4: Case Study
- Create: `/guides/case-study-ainhaikal-wedding-beasy`
- Target keyword: "jemputan kahwin digital成功案例"
- Real story from demo event
- Photos, stats, testimonials

**Monthly Schedule:**
```
Month 1: 4 posts (guides)
Month 2: 4 posts (templates + tips)
Month 3: 4 posts (case studies + trends)
Month 4: 4 posts (seasonal - Raya/Wedding season)
Month 5: 4 posts (advanced features)
Month 6: 4 posts (year-end review + predictions)

Total: 24 blog posts in 6 months
```

---

### Step 7: Google My Business (Jika Ada Office)

**Kenapa:** Local SEO - muncul dalam Google Maps

**Jika ada physical office:**
1. Pergi: business.google.com
2. Add business
3. Category: "Web Agency" atau "Event Service"
4. Address: [your office address]
5. Phone: [business number]
6. Website: beasy.my
7. Hours: Monday-Friday 9AM-6PM
8. Add photos (office, team, products)
9. Verify via mail (Google post card)

**Jika remote-only:**
- Skip GMB
- Focus pada national/international SEO instead

---

### Step 8: Pinterest Strategy

**Kenapa:** Pinterest = visual search engine. Great for wedding content.

**Setup:**
1. Create Pinterest Business account
2. Board names (SEO optimized):
   - "Jemputan Kahwin Digital Malaysia"
   - "Template Undangan Perkahwinan"
   - "Wedding Invitation Ideas Malaysia"
   - "Melayu Islamic Wedding Design"
   - "Pre-Wedding Photography Inspiration"

3. Pin strategy:
   - Pin template screenshots (with watermark)
   - Pin infographics ("Cara Buat Jemputan Digital")
   - Pin case studies
   - 10-20 pins per day (use scheduler)

4. Link every pin back to beasy.my pages

---

### Step 9: YouTube Channel

**Kenapa:** YouTube = 2nd largest search engine. Video SEO = huge opportunity.

**Channel Setup:**
1. Create YouTube channel "Beasy.my"
2. Banner: Professional design with tagline
3. About: Same bio as other platforms
4. Links: beasy.my

**Video Ideas (First 10 Videos):**
```
1. "Beasy.my Tutorial - Cara Buat Jemputan Kahwin Digital"
2. "88+ Template Jemputan Kahwin - Full Showcase"
3. "Audio Guestbook Feature Demo"
4. "Payment Gateway Setup Guide"
5. "RSVP Management Tips"
6. "Before vs After - Jemputan Tradisional vs Digital"
7. "Real Wedding Case Study Using Beasy.my"
8. "Tips Pilih Template Jemputan Yang Sesuai"
9. "QR Code Untuk Jemputan - Cara Guna"
10. "Review Beasy.my - Platform Jemputan Digital Malaysia"
```

**Video SEO Tips:**
- Title: Include keywords "jemputan digital", "kahwin", "Malaysia"
- Description: 200+ words with keywords
- Tags: Malaysian wedding keywords
- Thumbnail: Eye-catching with text overlay
- End screen: Link to beasy.my

---

### Step 10: TikTok Strategy

**Kenapa:** TikTok = viral potential. Wedding niche is HOT.

**Content Types:**
```
1. Before/After transformations
2. Template showcase (fast cuts)
3. User testimonials
4. Behind the scenes
5. Wedding planning tips
6. Trending sounds + wedding theme
```

**Hashtags:**
```
#jemputandigital #undanganonline #jemputankahwin
#weddingmalaysia #perkahwinan #templatetemponghaj
#rsvpmy #audio guestbook #angpaodigital
```

**Posting Frequency:**
- Minimum: 3 videos per week
- Ideal: Daily posting
- Best times: 7-9 PM (peak hours)

---

## 📊 Monitoring & Tracking

### Tools Required:

#### Free Tools:
1. **Google Search Console** - search.google.com/search-console
   - Track indexing status
   - Monitor search queries
   - Check crawl errors

2. **Google Analytics 4** - analytics.google.com
   - Traffic sources
   - User behavior
   - Conversion tracking

3. **Ubersuggest** - neilpatel.com/ubersuggest (free tier)
   - Keyword rankings
   - Competitor analysis

4. **Google Trends** - trends.google.com
   - Trending topics
   - Seasonal patterns

#### Paid Tools (Upgrade Later):
5. **Ahrefs** - ahrefs.com (RM300+/month)
   - Backlink monitoring
   - Competitor analysis
   - Keyword research

6. **SEMrush** - semrush.com (RM250+/month)
   - All-in-one SEO tool
   - Content marketing toolkit

### Key Metrics to Track Weekly:

```
Organic Traffic: _______ (target: +20% month-over-month)
Keyword Rankings: _______ (target: top 20 for 10 keywords)
Backlinks: _______ (target: +10/month)
Domain Authority: _______ (target: 20+ in 6 months)
Index Pages: _______ (target: all pages indexed)
CTR: _______ (target: >5% from search results)
```

---

## 🎯 Priority Order (Do This Sequence)

### Week 1 (URGENT):
1. ✅ Submit sitemap to Google Search Console
2. ✅ Register all social media profiles
3. ✅ Submit to 5 directories (ProdukMalaysia, HotFirms, etc.)

### Week 2:
4. ✅ Start Pinterest board
5. ✅ Create YouTube channel + first tutorial video
6. ✅ Begin vendor outreach (contact 10 vendors)

### Week 3-4:
7. ✅ Write 2 more blog posts (template showcase, comparison)
8. ✅ Guest post outreach (contact 5 blogs)
9. ✅ TikTok account setup + first 3 videos

### Month 2:
10. ✅ Continue content calendar (4 posts)
11. ✅ Scale vendor partnerships (50 total)
12. ✅ Launch Product Hunt
13. ✅ PR pitch to media outlets

---

## 💰 Estimated Budget (Optional)

### Free Path (Bootstrap):
- Time investment: 2-3 hours/day
- Expected results in 6 months: 10K organic visitors/month

### Low Budget (RM500/month):
- Ahrefs/SEMrush: RM300
- Guest post sponsorships: RM200
- Expected results in 6 months: 50K organic visitors/month

### Aggressive (RM2000+/month):
- Premium SEO tools: RM500
- Content writers (2 writers): RM1000
- PR agency: RM500+
- Expected results in 6 months: 200K+ organic visitors/month

---

## 🏆 Success Milestones

### Month 1:
- [ ] Google Search Console verified
- [ ] All pages indexed
- [ ] 10+ backlinks acquired
- [ ] Social profiles active

### Month 3:
- [ ] Rank top 50 for 5 long-tail keywords
- [ ] 50+ backlinks
- [ ] 10K monthly organic visitors
- [ ] Domain Authority 15+

### Month 6:
- [ ] Rank top 20 for 15 keywords
- [ ] 200+ backlinks
- [ ] 50K monthly organic visitors
- [ ] Domain Authority 25+
- [ ] Featured in 3+ media outlets

### Month 12:
- [ ] **#1 ranking** for main keywords
- [ ] 500+ backlinks
- [ ] 200K+ monthly organic visitors
- [ ] Domain Authority 40+
- [ ] Recognized as #1 platform in Malaysia
