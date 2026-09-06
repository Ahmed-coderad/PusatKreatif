/* ==========================================================================
   PUSAT KREATIF RAD — scripts.js
   ========================================================================== */

/* --------------------------------------------------------------------------
   AudioFX — tiny synthesized sound-effect engine (no external audio files).
   Every effect is generated on the fly with the Web Audio API, so it stays
   lightweight and never breaks if an asset fails to load.
   -------------------------------------------------------------------------- */
const AudioFX = (() => {
    let ctx = null;
    let enabled = true;

    function ensureCtx() {
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            ctx = new AC();
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    function tone({ freq = 440, duration = 0.15, type = 'sine', gain = 0.12, glideTo = null, delay = 0 }) {
        if (!enabled) return;
        const ac = ensureCtx();
        if (!ac) return;
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = type;
        const t0 = ac.currentTime + delay;
        osc.frequency.setValueAtTime(freq, t0);
        if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + duration);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(gain, t0 + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
        osc.connect(g).connect(ac.destination);
        osc.start(t0);
        osc.stop(t0 + duration + 0.05);
    }

    function noiseBurst({ duration = 0.25, gain = 0.09, delay = 0, filterFreq = 1400 }) {
        if (!enabled) return;
        const ac = ensureCtx();
        if (!ac) return;
        const bufferSize = Math.max(1, Math.floor(ac.sampleRate * duration));
        const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const noise = ac.createBufferSource();
        noise.buffer = buffer;
        const filter = ac.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = filterFreq;
        const g = ac.createGain();
        const t0 = ac.currentTime + delay;
        g.gain.setValueAtTime(gain, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
        noise.connect(filter).connect(g).connect(ac.destination);
        noise.start(t0);
    }

    return {
        hover: () => tone({ freq: 920, duration: 0.07, type: 'sine', gain: 0.045 }),
        click: () => tone({ freq: 540, duration: 0.09, type: 'triangle', gain: 0.11, glideTo: 300 }),
        whoosh: () => noiseBurst({ duration: 0.28, gain: 0.07, filterFreq: 1200 }),
        pop: () => tone({ freq: 220, duration: 0.14, type: 'square', gain: 0.1, glideTo: 640 }),
        chime: () => {
            tone({ freq: 660, duration: 0.28, type: 'sine', gain: 0.09 });
            tone({ freq: 880, duration: 0.32, type: 'sine', gain: 0.08, delay: 0.09 });
            tone({ freq: 1320, duration: 0.4, type: 'sine', gain: 0.07, delay: 0.18 });
        },
        sparkle: () => {
            for (let i = 0; i < 5; i++) {
                tone({ freq: 1000 + Math.random() * 1200, duration: 0.12, type: 'sine', gain: 0.035, delay: i * 0.05 });
            }
        },
        setEnabled: (v) => { enabled = v; },
        isEnabled: () => enabled,
        prime: () => { ensureCtx(); }
    };
})();

document.addEventListener("DOMContentLoaded", () => {
    const btnAsetDigital = document.getElementById("btnAsetDigital");
    const btnAsetNFT = document.getElementById("btnAsetNFT");
    const btnBuatAset = document.getElementById("btnBuatAset");
    const btnAsetInspiratif = document.getElementById("btnAsetInspiratif");

    btnAsetDigital.addEventListener('click', () => showMenu('menu1'));
    btnAsetNFT.addEventListener('click', () => showMenu('menu2'));
    btnBuatAset.addEventListener('click', () => showMenu('menu3'));
    btnAsetInspiratif.addEventListener('click', () => showMenu('menu4'));

    document.getElementById("overlay").addEventListener('click', closeMenu);

    // Attach light hover/click sound cues to interactive brand elements.
    const sounded = document.querySelectorAll('.button, .menu button, .unmute-button, .translate-button, .gift-box-btn, .sound-toggle, .modal-buttons button');
    sounded.forEach(el => {
        el.addEventListener('mouseenter', () => AudioFX.hover());
        el.addEventListener('click', () => AudioFX.click());
    });

    // First user gesture unlocks the (autoplay-restricted) Web Audio context.
    ['click', 'touchstart'].forEach(evt => {
        document.body.addEventListener(evt, () => AudioFX.prime(), { once: true });
    });

    setupSoundToggle();
    setupGiftVault();
});

function showMenu(menuId) {
    const menu = document.getElementById(menuId);
    if (!menu) return;

    document.querySelectorAll('.menu').forEach(m => {
        m.classList.remove('menu-visible');
        m.classList.add('hidden');
    });

    const overlay = document.getElementById('overlay');
    overlay.classList.add('overlay-visible');
    menu.classList.remove('hidden');
    // Allow the browser to register the "hidden" removal before transitioning in.
    requestAnimationFrame(() => menu.classList.add('menu-visible'));
    AudioFX.whoosh();
}

function closeMenu() {
    const overlay = document.getElementById('overlay');
    overlay.classList.remove('overlay-visible');
    document.querySelectorAll('.menu').forEach(menu => menu.classList.remove('menu-visible'));
    window.setTimeout(() => {
        document.querySelectorAll('.menu').forEach(menu => menu.classList.add('hidden'));
    }, 280);
}

function unmuteVideo() {
    const video = document.getElementById('portfolioVideo');
    video.muted = false;
    video.play();
    document.getElementById('unmuteButton').style.display = 'none';
    const musicIcon = document.getElementById('musicIcon');
    if (musicIcon) musicIcon.classList.remove('hidden');
}

/* --------------------------------------------------------------------------
   Sound toggle — global mute switch for every synthesized effect.
   -------------------------------------------------------------------------- */
function setupSoundToggle() {
    const btn = document.getElementById('soundToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const next = !AudioFX.isEnabled();
        AudioFX.setEnabled(next);
        btn.textContent = next ? '🔊' : '🔇';
        btn.classList.toggle('muted', !next);
        if (next) AudioFX.chime();
    });
}

/* --------------------------------------------------------------------------
   Bilingual copy — extended to cover the gift vault + sound toggle.
   -------------------------------------------------------------------------- */
function toggleTranslation() {
    const headerTitle1 = document.querySelector("header h1:nth-of-type(1)");
    const headerTitle2 = document.querySelector("header h1:nth-of-type(2)");
    const subtitle = document.getElementById("subtitle");
    const translateButton = document.getElementById("translateButton");
    const unmuteButton = document.getElementById("unmuteButton");

    const btnAsetDigital = document.getElementById("btnAsetDigital");
    const btnAsetNFT = document.getElementById("btnAsetNFT");
    const btnBuatAset = document.getElementById("btnBuatAset");
    const btnAsetInspiratif = document.getElementById("btnAsetInspiratif");

    const giftVaultTitle = document.getElementById("giftVaultTitle");
    const giftVaultSubtitle = document.getElementById("giftVaultSubtitle");
    const giftLabels = document.querySelectorAll('.gift-label');

    const isEnglish = translateButton.textContent === "English translation";

    if (isEnglish) {
        headerTitle1.textContent = "WELCOME";
        headerTitle2.innerHTML = "TO THE DIGITAL CREATIVITY CENTER <span>RAD</span>!";
        subtitle.innerHTML = "Hi! Visionaries, Editors, or Creators looking for inspiration! <span class='icon'>🌟</span><br>You have just stepped into a world where visual ideas come to life and digital art tells stories with aesthetics.";
        translateButton.textContent = "Bahasa Indonesia";
        unmuteButton.textContent = "Enable Sound 🎵";

        btnAsetDigital.textContent = "Digital Art Assets";
        btnAsetNFT.textContent = "NFT Art Assets";
        btnBuatAset.textContent = "Create Assets";
        btnAsetInspiratif.textContent = "Inspirational Assets";

        if (giftVaultTitle) giftVaultTitle.textContent = "Pick Your Creative Gift ✨";
        if (giftVaultSubtitle) giftVaultSubtitle.textContent = "Hover, click, and unwrap one of the gifts below!";
        if (giftLabels.length === 3) {
            giftLabels[0].textContent = "Mystery Gift";
            giftLabels[1].textContent = "Exclusive Wallpaper";
            giftLabels[2].textContent = "Creative Quote Card";
        }
    } else {
        headerTitle1.textContent = "SELAMAT DATANG";
        headerTitle2.innerHTML = "DI PUSAT KREATIVITAS DIGITAL <span>RAD</span>!";
        subtitle.innerHTML = "Hai! Visioner, Editor, atau Kreator pencari inspirasi! <span class='icon'>🌟</span><br>Anda baru saja melangkah ke dunia di mana ide-ide visual hidup dan seni digital bercerita dengan estetik.";
        translateButton.textContent = "English translation";
        unmuteButton.textContent = "Aktifkan Suara 🎵";

        btnAsetDigital.textContent = "Aset Seni Digital";
        btnAsetNFT.textContent = "Aset Seni NFT";
        btnBuatAset.textContent = "Buat Aset";
        btnAsetInspiratif.textContent = "Aset Inspiratif";

        if (giftVaultTitle) giftVaultTitle.textContent = "Pilih Kado Kreatifmu ✨";
        if (giftVaultSubtitle) giftVaultSubtitle.textContent = "Geser, klik, dan buka salah satu kado di bawah ini!";
        if (giftLabels.length === 3) {
            giftLabels[0].textContent = "Kado Misteri";
            giftLabels[1].textContent = "Wallpaper Eksklusif";
            giftLabels[2].textContent = "Kartu Kutipan Kreatif";
        }
    }
}

/* --------------------------------------------------------------------------
   Gift vault — three curated, on-brand surprises for the creative audience:
     1. Kado Misteri     — the original personality-card reveal (kept as-is)
     2. Wallpaper         — a one-of-a-kind generative wallpaper, drawn live
     3. Kartu Kutipan     — a shareable creative-quote card, drawn live
   -------------------------------------------------------------------------- */
const CREATIVE_QUOTES = [
    { id: "Ide terbaik lahir saat kamu berani membuat draf pertama yang buruk.", en: "The best ideas are born the moment you dare to make a bad first draft." },
    { id: "Konsistensi mengalahkan inspirasi yang datang sesekali.", en: "Consistency beats inspiration that only shows up sometimes." },
    { id: "Setiap karya besar dimulai dari kanvas kosong yang menakutkan.", en: "Every great work starts on a blank canvas that once felt terrifying." },
    { id: "Kreativitas adalah keberanian untuk mencoba lagi setelah revisi ke-10.", en: "Creativity is the courage to try again after the tenth revision." },
    { id: "Warna favoritmu adalah yang berani kamu pakai lebih dulu.", en: "Your favorite color is the one you dare to use first." },
    { id: "Karya yang jujur selalu lebih kuat dari karya yang sempurna.", en: "Honest work always outlasts perfect work." }
];

function setupGiftVault() {
    const giftButtons = document.querySelectorAll('.gift-box-btn');
    const giftModal = document.getElementById('giftModal');
    const backButton = document.getElementById('backButton');
    const likeButton = document.getElementById('likeButton');
    const translateButtonModal = document.getElementById('translateButtonModal');

    if (!giftButtons.length || !giftModal) return;

    giftButtons.forEach(btn => {
        btn.addEventListener('click', () => openGift(btn.dataset.gift));
    });

    backButton.addEventListener('click', () => {
        giftModal.style.display = 'none';
        document.body.classList.remove('modal-active');
        resetModalVisuals();
    });

    likeButton.addEventListener('click', () => {
        AudioFX.sparkle();
        likeButton.textContent = '💖';
        window.setTimeout(() => { likeButton.textContent = '❤️'; }, 900);
    });

    translateButtonModal.addEventListener('click', () => {
        const isIndonesian = translateButtonModal.textContent === 'English translation';
        translateButtonModal.textContent = isIndonesian ? 'Bahasa Indonesia' : 'English translation';
        applyModalLanguage(isIndonesian ? 'en' : 'id');
    });
}

function resetModalVisuals() {
    document.getElementById('modalImage').classList.add('hidden');
    document.getElementById('modalCanvas').classList.add('hidden');
    document.getElementById('downloadButton').classList.add('hidden');
}

let currentGiftLang = 'id';
let currentGiftContent = null;

function applyModalLanguage(lang) {
    currentGiftLang = lang;
    if (!currentGiftContent) return;
    const title = document.getElementById('modalTitle');
    const subtitle = document.getElementById('modalSubtitle');
    const desc = document.getElementById('modalDescription');
    const content = currentGiftContent[lang];
    title.textContent = content.title;
    subtitle.textContent = content.subtitle;
    desc.innerHTML = content.description;
}

const GIFT_PEEK_EMOJI = {
    mystery: '❓',
    wallpaper: '🎨',
    quote: '💬'
};

function playGiftOpenSequence(giftBoxBtn) {
    const box = giftBoxBtn.querySelector('.gift-box');
    if (box) box.classList.add('opening');
    AudioFX.pop();
    window.setTimeout(() => AudioFX.chime(), 180);
    // A short burst of sparkles around the clicked box for tactile feedback.
    for (let i = 0; i < 6; i++) {
        window.setTimeout(() => spawnSparkle(giftBoxBtn), i * 60);
    }
    spawnPeek(giftBoxBtn, GIFT_PEEK_EMOJI[giftBoxBtn.dataset.gift] || '✨');
}

function spawnPeek(anchorEl, emoji) {
    const rect = anchorEl.getBoundingClientRect();
    const peek = document.createElement('div');
    peek.className = 'gift-peek';
    peek.textContent = emoji;
    peek.style.left = `${rect.left + rect.width / 2}px`;
    peek.style.top = `${rect.top + rect.height * 0.25}px`;
    document.body.appendChild(peek);
    window.setTimeout(() => peek.remove(), 900);
}

function spawnSparkle(anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    const sparkle = document.createElement('div');
    sparkle.className = 'gift-sparkle sparkle-fire';
    const dx = (Math.random() - 0.5) * 80;
    const dy = -Math.random() * 60 - 10;
    sparkle.style.setProperty('--dx', `${dx}px`);
    sparkle.style.setProperty('--dy', `${dy}px`);
    sparkle.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
    sparkle.style.top = `${rect.top + window.scrollY}px`;
    document.body.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 950);
}

function openGift(kind) {
    const giftModal = document.getElementById('giftModal');
    const giftBoxBtn = document.querySelector(`.gift-box-btn[data-gift="${kind}"]`);
    if (giftBoxBtn) playGiftOpenSequence(giftBoxBtn);

    resetModalVisuals();
    document.body.classList.add('modal-active');
    giftModal.style.display = 'block';
    launchConfetti();

    if (kind === 'mystery') openMysteryGift();
    else if (kind === 'wallpaper') openWallpaperGift();
    else if (kind === 'quote') openQuoteGift();

    window.setTimeout(() => {
        if (giftBoxBtn) {
            const box = giftBoxBtn.querySelector('.gift-box');
            if (box) box.classList.remove('opening');
        }
    }, 900);
}

async function openMysteryGift() {
    const cid = 'bafkreielbaxco67amijkxbfbtziahqfjm7qexlblztzgtf2awuv646lwna';
    const gateways = [
        'https://cloudflare-ipfs.com/ipfs/',
        'https://gateway.pinata.cloud/ipfs/',
        'https://infura-ipfs.io/ipfs/'
    ];

    currentGiftContent = {
        id: {
            title: 'SELAMAT',
            subtitle: 'kamu mendapatkan',
            description: '<strong>KUCING ISTJ</strong><br>Terorganisir, tradisional, dan bertanggung jawab. Kucing ISTJ suka rutinitas dan sangat teliti.'
        },
        en: {
            title: 'CONGRATULATIONS',
            subtitle: 'you got',
            description: '<strong>CAT ISTJ</strong><br>Organized, traditional, and responsible. ISTJ cats love routines and are very meticulous.'
        }
    };
    applyModalLanguage(currentGiftLang);

    const modalImage = document.getElementById('modalImage');
    let fileFound = false;

    for (let i = 0; i < gateways.length && !fileFound; i++) {
        const fileUrl = `${gateways[i]}${cid}`;
        try {
            const response = await fetch(fileUrl);
            if (response.ok) {
                fileFound = true;
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                modalImage.src = blobUrl;
                modalImage.classList.remove('hidden');

                const downloadButton = document.getElementById('downloadButton');
                downloadButton.classList.remove('hidden');
                downloadButton.textContent = currentGiftLang === 'en' ? 'Download 💾' : 'Unduh 💾';
                downloadButton.onclick = () => {
                    const link = document.createElement('a');
                    link.href = blobUrl;
                    link.download = 'Kucing_ISTJ.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    AudioFX.sparkle();
                };
            }
        } catch (error) {
            console.error(`Error fetching from gateway ${gateways[i]}:`, error);
        }
    }

    if (!fileFound) console.error('File not found in any gateway.');
}

function openWallpaperGift() {
    currentGiftContent = {
        id: {
            title: 'WALLPAPER UNTUKMU',
            subtitle: 'satu-satunya di dunia',
            description: 'Wallpaper generatif ini dibuat khusus saat ini juga, dengan warna khas <strong>RAD</strong>. Unduh dan pasang di layarmu!'
        },
        en: {
            title: 'A WALLPAPER FOR YOU',
            subtitle: 'one of a kind',
            description: 'This generative wallpaper was drawn live, in signature <strong>RAD</strong> colors. Download it and set it as your background!'
        }
    };
    applyModalLanguage(currentGiftLang);

    const canvas = document.getElementById('modalCanvas');
    canvas.classList.remove('hidden');
    drawWallpaper(canvas);

    const downloadButton = document.getElementById('downloadButton');
    downloadButton.classList.remove('hidden');
    downloadButton.textContent = currentGiftLang === 'en' ? 'Download 💾' : 'Unduh 💾';
    downloadButton.onclick = () => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'RAD-wallpaper.png';
        link.click();
        AudioFX.sparkle();
    };
}

function drawWallpaper(canvas) {
    const width = 720;
    const height = 1280;
    canvas.width = width;
    canvas.height = height;
    const ctx2d = canvas.getContext('2d');

    const gradient = ctx2d.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0b5788');
    gradient.addColorStop(0.55, '#1171B1');
    gradient.addColorStop(1, '#02DF4C');
    ctx2d.fillStyle = gradient;
    ctx2d.fillRect(0, 0, width, height);

    const palette = ['rgba(252,193,2,0.35)', 'rgba(255,255,255,0.14)', 'rgba(2,223,76,0.28)'];
    for (let i = 0; i < 14; i++) {
        const r = 40 + Math.random() * 160;
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx2d.beginPath();
        ctx2d.fillStyle = palette[i % palette.length];
        ctx2d.arc(x, y, r, 0, Math.PI * 2);
        ctx2d.fill();
    }

    ctx2d.save();
    ctx2d.globalAlpha = 0.9;
    ctx2d.fillStyle = '#FCC102';
    ctx2d.font = '700 64px Montserrat, sans-serif';
    ctx2d.textAlign = 'center';
    ctx2d.fillText('RAD', width / 2, height - 90);
    ctx2d.font = '600 20px Montserrat, sans-serif';
    ctx2d.fillStyle = 'rgba(255,255,255,0.85)';
    ctx2d.fillText('PUSAT KREATIF', width / 2, height - 55);
    ctx2d.restore();
}

function openQuoteGift() {
    const quote = CREATIVE_QUOTES[Math.floor(Math.random() * CREATIVE_QUOTES.length)];

    currentGiftContent = {
        id: {
            title: 'KUTIPAN UNTUKMU',
            subtitle: 'bahan bakar kreatif hari ini',
            description: 'Simpan kartu ini sebagai pengingat setiap kali kamu butuh dorongan untuk berkarya.'
        },
        en: {
            title: 'A QUOTE FOR YOU',
            subtitle: "today's creative fuel",
            description: 'Save this card as a reminder whenever you need a push to keep creating.'
        }
    };
    applyModalLanguage(currentGiftLang);

    const canvas = document.getElementById('modalCanvas');
    canvas.classList.remove('hidden');
    drawQuoteCard(canvas, quote);

    const downloadButton = document.getElementById('downloadButton');
    downloadButton.classList.remove('hidden');
    downloadButton.textContent = currentGiftLang === 'en' ? 'Download 💾' : 'Unduh 💾';
    downloadButton.onclick = () => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'RAD-quote-card.png';
        link.click();
        AudioFX.sparkle();
    };
}

function drawQuoteCard(canvas, quote) {
    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;
    const ctx2d = canvas.getContext('2d');

    ctx2d.fillStyle = '#FBFBFB';
    ctx2d.fillRect(0, 0, width, height);
    ctx2d.strokeStyle = '#1171B1';
    ctx2d.lineWidth = 10;
    ctx2d.strokeRect(20, 20, width - 40, height - 40);

    ctx2d.fillStyle = '#FCC102';
    ctx2d.beginPath();
    ctx2d.arc(width / 2, 150, 46, 0, Math.PI * 2);
    ctx2d.fill();
    ctx2d.fillStyle = '#1171B1';
    ctx2d.font = '700 48px Montserrat, sans-serif';
    ctx2d.textAlign = 'center';
    ctx2d.fillText('"', width / 2, 168);

    const text = currentGiftLang === 'en' ? quote.en : quote.id;
    ctx2d.fillStyle = '#333333';
    ctx2d.font = '500 40px Lora, serif';
    wrapCanvasText(ctx2d, text, width / 2, 340, width - 160, 54);

    ctx2d.fillStyle = '#02DF4C';
    ctx2d.font = '700 28px Montserrat, sans-serif';
    ctx2d.fillText('— PUSAT KREATIF RAD', width / 2, height - 70);
}

function wrapCanvasText(ctx2d, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let cursorY = y;
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx2d.measureText(testLine).width > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line.trim());

    const startY = cursorY - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((l, i) => ctx2d.fillText(l, x, startY + i * lineHeight));
}

/* --------------------------------------------------------------------------
   Confetti — a short, tasteful particle burst inside the modal on reveal.
   -------------------------------------------------------------------------- */
function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const giftModal = document.getElementById('giftModal');
    if (!canvas || !giftModal) return;
    const rect = giftModal.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx2d = canvas.getContext('2d');

    const colors = ['#1171B1', '#FCC102', '#02DF4C'];
    const particles = Array.from({ length: 60 }, () => ({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.9) * 9,
        size: 4 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1
    }));

    let frame = 0;
    function tick() {
        frame++;
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.25;
            p.life -= 0.015;
            ctx2d.globalAlpha = Math.max(p.life, 0);
            ctx2d.fillStyle = p.color;
            ctx2d.fillRect(p.x, p.y, p.size, p.size);
        });
        ctx2d.globalAlpha = 1;
        if (frame < 90) requestAnimationFrame(tick);
        else ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(tick);
}
