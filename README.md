![falentine](https://files.catbox.moe/dgjdmh.png)
# 💌 Falentine

**Falentine** is a small web-based Valentine project that lets you send **hidden photos or messages inside a single emoji**.  
The emoji looks normal, but it secretly contains data that can be decoded by this app.

This works entirely on the **client side (HTML + JS)** — no backend required.

---

## ✨ Features

- 🔐 Hide messages or photo links inside an emoji (emoji steganography)
- 💝 Two mail types:
  - **Photo mail** (multiple image URLs)
  - **Message mail** (personal text message)
- 📋 One-click copy emoji to clipboard
- 📬 Decode emoji back into a message or photo gallery
- ⏳ Optional countdown lock with early-access passcode
- 📱 Mobile-friendly UI using BeerCSS + Animate.css

---

## 🧠 How It Works (Simple Explanation)

Falentine uses **Unicode Variation Selectors** to hide data.

### Emoji Steganography
- Unicode has invisible characters called **Variation Selectors**
- These characters are not visible but still stored in text
- This app converts:
  - Text / JSON → bytes
  - Bytes → invisible variation selectors
  - Variation selectors → appended to a visible emoji

So what you send looks like: 💌

But internally it contains hidden data.

---

## 🧪 Mail Types

### 💌 Photo Mail
Encodes a list of image URLs.

Example hidden data:
```json
{
  "type": "photos",
  "images": ["url1", "url2", "url3"]
}
```

### 💝 Messages mail
Encodes a personal Valentine message.

example data

```json

{
  "type": "message",
  "foruser": "Her Name",
  "message": "Happy Valentine ❤️",
  "sendfrom": "Your Name"
}
```

## How to use

**1.create mail**

- goto edit
- choose pesan/message or foto/photo
- fill the form
- click "buatkan emoji"

**2. Send Emoji**

- Copy the generated emoji
- Send it via chat (WhatsApp, Telegram, etc.)

**3. Open Mail**

- Paste the emoji into the input filed
- click:
  - buka mail foto 💌 or
  - buka mail pesan 💝

---


**⏳ Countdown Lock (Optional)**

The app can be locked until a specific date using timer.json.

- Blocks the UI with a fullscreen countdown
- Triple-click the countdown to enter a passcode
- Early access is stored in localStorage

This is useful for:

- Valentine reveal
- Event-based releases
- Surprise launches

**🛠 Tech Stack**

- HTML5 + Vanilla JavaScript
- [BeerCSS (UI)](https://www.beercss.com/)
- [SweetAlert2 (Popups)](https://sweetalert2.github.io/)
- [Animate.css (Animations)](https://animate.style/)
- Unicode Variation Selectors (Steganography)


**⚠️ Notes**
- This is not encryption, only obfuscation
- Anyone with the decoder can read the
 - content
Best used for fun / surprises, not security

made by sanchex