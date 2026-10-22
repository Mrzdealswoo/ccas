# CCAS Campus (Ceylon College of Applied Studies) - Website Redesign

A premier, world-class redesign of the official **CCAS Campus** (Sri Lanka) web portal, tailored for international higher education standards.

---

## 🌟 Key Upgrades & Highlights

### 1. Modern Academic Brand Identity
- **Color Palette:** Deep Academic Midnight Navy (`#040d1a`, `#07162c`), Imperial Gold accents (`#d4af37`, `#e6bc3a`), Crisp Slate neutrals, and glassmorphic micro-surfaces.
- **Typography:** Modern Plus Jakarta Sans with crisp hierarchical contrast, clean reading flow, and institutional dignity.
- **Accreditation Trust Banners:** UK Ofqual Regulated Framework, Gatehouse Awards, TQUK, USYBF, TVEC Sri Lanka, and IAU Global University Endorsements.

### 2. Interactive Academic Features
- **Dynamic Program Explorer (22+ Programs):**
  - Instant live filter by qualification level (Undergraduate Degrees, UK Level 5 HNDs, 1-Year Professional Diplomas, and Creative/Vocational Certificates).
  - Instant filter by Academic Faculty (Computing & IT, Business & Management, Behavioral Sciences & Health, Education & Languages, Built Environment & Architecture, Creative Arts).
  - Real-time search by keywords, skills, and career keywords.
- **Interactive Course Syllabus Modal:**
  - Complete curriculum breakdown module-by-module.
  - Entry criteria (O/L, A/L, mature entry).
  - Career outcomes and industry roles.
  - Financial snapshot and direct application trigger.
- **Global Degree Pathway Map (2+1 / Top-Up Architecture):**
  - Interactive diagram showing how students can start at CCAS in Sri Lanka, complete their UK Level 5 HND, and transfer into Year 3 at partner universities in the **United Kingdom, Australia, or Malaysia** (saving up to 70% in foreign living costs).
  - Interactive destination country tabs with partner universities and post-study work visa rights.
- **Interactive Tuition & Easy Installment Estimator:**
  - Real-time calculator for upfront merit scholarships (10%, 15%, 20%).
  - Flexible monthly installment tenure options (6, 12, 18, 24 months).
  - Transparent fee breakdowns in Sri Lankan Rupees (LKR).
- **Dual Campus & Islandwide Center Locator:**
  - Tabbed interactive explorer between **Colombo Coordinating Centre (Kalubowila / Dehiwela)** and **Southern Head Office Campus (Weligama / Matara)** with live Google Maps embeds, facility tags, and direct hotlines.
  - Islandwide satellite examination hubs notice.
- **Multi-Step Fast-Track Admission Modal & WhatsApp Connect:**
  - Guided student registration form with automatic WhatsApp counseling message generation.
- **Verified Alumni Stories:**
  - Real student testimonials from CCAS graduates in IT, Business Administration, Early Childhood Education, and Psychology.

---

## 📁 Project Structure

```
ccas-redesign/
│
├── index.html            # Main semantic HTML5 responsive university website
├── styles.css            # Custom academic CSS, gradients, animations, glassmorphism
├── programs-data.js      # Structured academic course database (22+ programs with full modules)
├── app.js                # Core interactive JavaScript logic (filter, modal, calculator, pathways)
├── README.md             # Documentation and deployment guide
└── original.html         # Archived original website source for comparison
```

---

## 🚀 How to Run Locally

You can open `index.html` directly in any web browser, or launch a lightweight local server:

### Option A: Open directly
Double-click `index.html` in your file explorer or open it in Chrome, Edge, or Firefox.

### Option B: Local Python HTTP Server
```bash
cd "C:\Users\LOQ\.gemini\antigravity\scratch\ccas-redesign"
python -m http.server 3000
```
Then visit: `http://localhost:3000`

### Option C: Node.js / npx serve
```bash
npx serve .
```

---

## 🌐 Instant Free Deployment Options

- **Vercel / Netlify:** Drag-and-drop the `ccas-redesign` folder to [netlify.com/drop](https://app.netlify.com/drop) or push to GitHub and import into Vercel.
- **cPanel / Apache / Nginx:** Upload all files directly to `public_html/`.
- **GitHub Pages:** Push to a repository and enable GitHub Pages in Settings -> Pages -> Deploy from branch (`main` / root).
