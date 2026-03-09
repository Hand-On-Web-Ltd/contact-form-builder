# Contact Form Builder

Build contact forms by dragging fields around, then grab the embed code and paste it on your site. No backend needed — forms submit via mailto: or a webhook URL you configure.

Includes honeypot spam protection out of the box, so you won't drown in bot submissions.

## Features

- Drag and drop fields: name, email, phone, message, dropdown, checkbox
- Live preview updates as you build
- Generates clean embed code (HTML + CSS)
- Honeypot field for spam protection (hidden from real users, catches bots)
- Send form data via `mailto:` link or a webhook URL (Zapier, Make, n8n, etc.)
- Responsive forms that work on any screen size
- No dependencies, no build step

## How to Use

1. Open `index.html` in your browser
2. Drag fields from the left panel into your form
3. Customise labels and placeholder text
4. Set your email address or webhook URL
5. Click **Generate Embed Code**
6. Copy the code and paste it into your website

## Install via npm

```bash
npm install @hand-on-web/contact-form-builder
```

## Spam Protection

The form includes a honeypot field — an invisible input that real users never see. Bots fill it in automatically, and the form silently rejects those submissions. Simple and effective, no CAPTCHAs needed.

## Demo

Open `index.html` to try the builder. The left side is your toolbox, the right side shows a live preview of your form.

## About Hand On Web
We build AI chatbots, voice agents, and automation tools for businesses.
- 🌐 [handonweb.com](https://www.handonweb.com)
- 📧 outreach@handonweb.com
- 📍 Chester, UK

## Licence
MIT
