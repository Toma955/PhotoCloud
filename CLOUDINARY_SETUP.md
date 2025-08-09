# Cloudinary Setup Instructions

## 🔧 Koraci za konfiguraciju Cloudinary

### 1. Kreirajte Upload Preset

1. Idite na [Cloudinary Dashboard](https://cloudinary.com/console)
2. Kliknite na **Settings** → **Upload**
3. Idite na **Upload presets** tab
4. Kliknite **Add upload preset**
5. Podesite sledeće opcije:
   - **Preset name**: `photos_upload`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `photos` (opciono)
   - **Access Mode**: `public`
6. Kliknite **Save**

### 2. Environment Variables

Vaši credentials su već sačuvani u `.env` fajlu:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=dtyzo5ynr
REACT_APP_CLOUDINARY_API_KEY=179351566759926
REACT_APP_CLOUDINARY_API_SECRET=dnPXjyX8D08BgjfNz38IlrTAyPI
```

### 3. Test Upload

Nakon što kreirate upload preset, možete testirati upload:

1. Pokrenite aplikaciju: `npm start`
2. Idite na `http://localhost:3000`
3. Pokušajte upload slike
4. Proverite Cloudinary dashboard da vidite uploadovane slike

### 4. Troubleshooting

**Ako upload ne radi:**
- Proverite da li je upload preset kreiran sa "Unsigned" signing mode
- Proverite da li je preset name tačno `photos_upload`
- Proverite browser console za greške
- Proverite Cloudinary dashboard za upload history

**Ako vidite CORS greške:**
- Proverite da li je upload preset javno dostupan
- Proverite da li je folder pravilno konfigurisan

### 5. Security Notes

- **API Secret** se koristi samo na backend-u, ne na frontend-u
- **Upload preset** mora biti "Unsigned" za frontend uploads
- **Cloud name** je javno dostupan i bezbedan za frontend

### 6. Vercel Deployment

Za deployment na Vercel:

1. Dodajte environment variables u Vercel dashboard
2. Kreirajte isti upload preset u Cloudinary
3. Deploy aplikaciju

---

Vaša aplikacija je sada spremna za upload slika! 🚀 