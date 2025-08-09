# Catering Šetsanovac App

Elegantna React aplikacija za premium catering usluge u Šetsanovcu sa Apple-inspirisanim dizajnom.

## ✨ Funkcionalnosti

- **Apple-style dizajn** - čist i elegantan interface
- **Dark/Light tema** - automatska detekcija sistemske teme
- **Grid/List view** - dva načina prikaza slika
- **Fullscreen slideshow** - sa gesture controls
- **Drag & drop upload** - podrška za foldere i pojedinačne slike
- **Responsive dizajn** - optimizovano za mobile i desktop
- **Vercel Analytics** - tracking koristnja
- **Cloudinary integracija** - direktan upload na Cloudinary

## 🚀 Quick Start

### 1. Instalacija dependencies

```bash
npm install
```

### 2. Cloudinary Setup

1. Kreirajte nalog na [Cloudinary](https://cloudinary.com)
2. Idite u Dashboard → Settings → Upload
3. Kreirajte novi "Upload Preset" sa sledećim podešavanjima:
   - **Signing Mode**: Unsigned
   - **Folder**: photos (opciono)
4. Kopirajte vaše credentials

### 3. Environment Variables

Kreirajte `.env` fajl u root direktorijumu:

```bash
cp env.example .env
```

Zamenite placeholder vrednosti sa vašim Cloudinary credentials:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Pokretanje aplikacije

```bash
npm start
```

Aplikacija će biti dostupna na `http://localhost:3000`

## 📱 Funkcionalnosti

### Upload
- **Drag & drop** - prevucite slike ili folder
- **Click to select** - kliknite za file picker
- **Progress bar** - praćenje uploada
- **File validation** - samo slike (JPG, PNG, GIF, WebP)

### View Modes
- **Grid view** - masonry layout sa različitim veličinama
- **List view** - horizontalne kartice sa detaljima
- **Smooth transitions** između view-ova

### Slideshow
- **Fullscreen mode** - kliknite na sliku
- **Keyboard navigation** - arrow keys, ESC
- **Photo info** - ime, veličina, datum
- **Progress bar** - pozicija u galeriji

### Theme
- **Auto-detection** - prema sistemskoj temi
- **Manual toggle** - sun/moon ikona
- **Persistent** - pamti izbor u localStorage

## 🎨 Dizajn

### Apple Design System
- **Typography** - Inter font family
- **Colors** - neutralne boje sa akcentima
- **Shadows** - subtle depth
- **Animations** - smooth transitions
- **Glassmorphism** - blur efekti

### Responsive Breakpoints
- **Mobile**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+

## 📊 Analytics

Aplikacija koristi Vercel Analytics za praćenje:
- Upload aktivnosti
- View mode promene
- Theme promene
- Slideshow navigaciju

## 🛠️ Tech Stack

- **React 18** - UI framework
- **CSS Grid/Flexbox** - layout
- **React Dropzone** - file upload
- **Cloudinary SDK** - image hosting
- **Vercel Analytics** - tracking
- **Inter Font** - typography

## 📁 Struktura Projekta

```
src/
├── components/
│   ├── PhotoGrid.jsx          # Grid prikaz
│   ├── PhotoList.jsx          # List prikaz
│   ├── PhotoCard.jsx          # Pojedinačna slika
│   ├── UploadZone.jsx         # Upload area
│   ├── Slideshow.jsx          # Fullscreen slideshow
│   ├── ThemeToggle.jsx        # Theme switch
│   └── ViewToggle.jsx         # Grid/List toggle
├── hooks/
│   └── useTheme.js           # Theme management
├── styles/
│   ├── index.css             # Global styles
│   └── App.css               # App layout
└── App.js                    # Main component
```

## 🔧 Development

### Build za produkciju

```bash
npm run build
```

### Deployment

Aplikacija je optimizovana za deployment na:
- **Vercel** (preporučeno)
- **Netlify**
- **GitHub Pages**

## 📝 Napomene

- **Bez login-a** - jednostavna aplikacija bez autentifikacije
- **Cloudinary limits** - proverite vaše planove za upload limits
- **File size** - preporučeno do 10MB po slici
- **Browser support** - moderni browseri sa ES6+ podrškom

## 🤝 Contributing

1. Fork projekat
2. Kreirajte feature branch
3. Commit vaše promene
4. Push na branch
5. Otvorite Pull Request

## 📄 License

MIT License - slobodno koristite i modifikujte.

---

Napravljeno sa ❤️ u Apple stilu 