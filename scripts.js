document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. TRANSLATIONS
       ============================================================ */
    const translations = {
        id: {
            'hero.title1': 'SELAMAT DATANG',
            'hero.title2a': 'DI PUSAT KREATIVITAS DIGITAL',
            'hero.subtitle': 'Hai! Visioner, Editor, atau Kreator pencari inspirasi! <span class="icon">🌟</span><br>Anda baru saja melangkah ke dunia di mana ide-ide visual hidup dan seni digital bercerita dengan estetik.',
            'video.unmuteAria': 'Aktifkan suara video',
            'assets.title': 'Jelajahi Aset Kreatif',
            'assets.subtitle': 'Empat pintu menuju dunia visual RAD — pilih yang sesuai kebutuhanmu.',
            'assets.digital.title': 'Aset Seni Digital',
            'assets.digital.desc': 'Foto, ilustrasi, dan elemen desain siap pakai untuk proyek kreatifmu.',
            'assets.nft.title': 'Aset Seni NFT',
            'assets.nft.desc': 'Karya seni digital bergerak dalam koleksi Timeless Motion Art.',
            'assets.commission.title': 'Buat Aset',
            'assets.commission.desc': 'Pesan desain custom sesuai kebutuhan brand atau proyekmu.',
            'assets.inspiration.title': 'Aset Inspiratif',
            'assets.inspiration.desc': 'Video proses kreatif dan konten inspiratif di balik layar.',
            'footer.copy': '© 2025 Rizky Ahmed Darmawan. All Rights Reserved.',
            'reward.tooltip': 'Klaim hadiah kreatif ✨',
            'reward.title': 'Roda Hadiah Kreatif',
            'reward.desc': 'Putar sekali sehari dan menangkan hadiah eksklusif untuk kreator.',
            'reward.spin': 'Putar Sekarang',
            'reward.cooldown': 'Kamu sudah putar hari ini. Kembali lagi besok!',
            'reward.won': 'Kamu memenangkan:',
            'reward.copy': 'Salin',
            'reward.instructions': 'Tunjukkan kode ini lewat DM Instagram untuk klaim hadiahmu.',
            'reward.cta': 'Buka Instagram',
            'reward.copied': 'Tersalin!'
        },
        en: {
            'hero.title1': 'WELCOME',
            'hero.title2a': 'TO RAD\u2019S DIGITAL CREATIVE STUDIO',
            'hero.subtitle': 'Hi! Visionaries, editors, and creators chasing inspiration! <span class="icon">🌟</span><br>You\u2019ve just stepped into a world where visual ideas come alive and digital art tells its story.',
            'video.unmuteAria': 'Turn on video sound',
            'assets.title': 'Explore the Creative Assets',
            'assets.subtitle': 'Four doorways into RAD\u2019s visual world \u2014 pick what fits your project.',
            'assets.digital.title': 'Digital Art Assets',
            'assets.digital.desc': 'Ready-to-use photos, illustrations, and design elements for your next project.',
            'assets.nft.title': 'NFT Art Assets',
            'assets.nft.desc': 'Motion-based digital artwork from the Timeless Motion Art collection.',
            'assets.commission.title': 'Create Assets',
            'assets.commission.desc': 'Commission a custom design tailored to your brand or project.',
            'assets.inspiration.title': 'Inspirational Assets',
            'assets.inspiration.desc': 'Behind-the-scenes process videos and creative inspiration.',
            'footer.copy': '© 2025 Rizky Ahmed Darmawan. All Rights Reserved.',
            'reward.tooltip': 'Claim a creative reward ✨',
            'reward.title': 'The Creative Reward Wheel',
            'reward.desc': 'Spin once a day for a chance to win an exclusive reward for creators.',
            'reward.spin': 'Spin Now',
            'reward.cooldown': 'You already spun today. Come back tomorrow!',
            'reward.won': 'You won:',
            'reward.copy': 'Copy',
            'reward.instructions': 'Show this code via Instagram DM to claim your reward.',
            'reward.cta': 'Open Instagram',
            'reward.copied': 'Copied!'
        }
    };

    const langToggle = document.getElementById('langToggle');
    let currentLang = document.documentElement.getAttribute('data-lang') || 'id';

    function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.setAttribute('data-lang', lang);
        document.documentElement.setAttribute('lang', lang);

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key] !== undefined) {
                el.innerHTML = translations[lang][key];
            }
        });
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria');
            if (translations[lang][key] !== undefined) {
                el.setAttribute('aria-label', translations[lang][key]);
            }
        });

        const currentEl = langToggle.querySelector('.lang-pill__current');
        const nextEl = langToggle.querySelector('.lang-pill__next');
        if (lang === 'id') { currentEl.textContent = 'ID'; nextEl.textContent = 'EN'; }
        else { currentEl.textContent = 'EN'; nextEl.textContent = 'ID'; }
        langToggle.setAttribute('aria-label', lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia');

        buildWheel(); // re-render wheel labels in the new language
    }

    langToggle.addEventListener('click', () => {
        Sound.click();
        applyLanguage(currentLang === 'id' ? 'en' : 'id');
    });

    /* ============================================================
       2. SYNTHESIZED SOUND EFFECTS (Web Audio API — no audio files,
          no network dependency, works fully offline)
       ============================================================ */
    const Sound = (() => {
        let ctx = null;
        let enabled = true;
        try {
            enabled = localStorage.getItem('rad_sound_enabled') !== 'false';
        } catch (e) { /* localStorage unavailable, default to enabled */ }

        function ensureContext() {
            if (!ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) ctx = new AudioCtx();
            }
            if (ctx && ctx.state === 'suspended') ctx.resume();
            return ctx;
        }

        function tone(freq, duration, { type = 'sine', vol = 0.12, delay = 0, glideTo = null } = {}) {
            if (!enabled) return;
            const c = ensureContext();
            if (!c) return;
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, c.currentTime + delay);
            if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, c.currentTime + delay + duration);
            gain.gain.setValueAtTime(0.0001, c.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(vol, c.currentTime + delay + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + duration);
            osc.connect(gain).connect(c.destination);
            osc.start(c.currentTime + delay);
            osc.stop(c.currentTime + delay + duration + 0.05);
        }

        return {
            setEnabled(v) {
                enabled = v;
                try { localStorage.setItem('rad_sound_enabled', v ? 'true' : 'false'); } catch (e) {}
            },
            isEnabled() { return enabled; },
            click() { tone(720, 0.07, { type: 'triangle', vol: 0.1 }); },
            hover() { tone(560, 0.05, { type: 'sine', vol: 0.045 }); },
            open() { tone(420, 0.22, { type: 'sine', vol: 0.08, glideTo: 720 }); },
            closeUi() { tone(560, 0.18, { type: 'sine', vol: 0.07, glideTo: 320 }); },
            tick() { tone(880 + Math.random() * 120, 0.045, { type: 'square', vol: 0.06 }); },
            win() {
                tone(523.25, 0.28, { vol: 0.1 });
                tone(659.25, 0.28, { vol: 0.1, delay: 0.09 });
                tone(783.99, 0.4, { vol: 0.11, delay: 0.18 });
            }
        };
    })();

    const soundToggle = document.getElementById('soundToggle');
    soundToggle.setAttribute('aria-pressed', Sound.isEnabled() ? 'true' : 'false');
    soundToggle.addEventListener('click', () => {
        const next = !Sound.isEnabled();
        Sound.setEnabled(next);
        soundToggle.setAttribute('aria-pressed', next ? 'true' : 'false');
        if (next) Sound.click();
    });

    // Gentle hover feedback across primary interactive elements
    document.querySelectorAll('.asset-card__trigger, .cta-btn, .reward-orb, .icon-btn, .lang-pill, .asset-card__panel a').forEach(el => {
        el.addEventListener('mouseenter', () => Sound.hover());
    });

    /* ============================================================
       3. VIDEO CONTROLS
       ============================================================ */
    const video = document.getElementById('portfolioVideo');
    const unmuteButton = document.getElementById('unmuteButton');
    const waveform = document.getElementById('waveform');

    unmuteButton.addEventListener('click', () => {
        Sound.click();
        video.muted = !video.muted;
        video.play().catch(() => {});
        unmuteButton.querySelector('.video-sound-btn__icon').textContent = video.muted ? '🔈' : '🔊';
        waveform.classList.toggle('is-active', !video.muted);
    });

    /* ============================================================
       4. ASSET CATEGORY ACCORDION CARDS
       ============================================================ */
    document.querySelectorAll('.asset-card').forEach(card => {
        const trigger = card.querySelector('.asset-card__trigger');
        trigger.addEventListener('click', () => {
            const isOpen = card.classList.contains('is-open');
            Sound.click();
            // close any other open card for a tidy single-panel feel
            document.querySelectorAll('.asset-card.is-open').forEach(other => {
                if (other !== card) {
                    other.classList.remove('is-open');
                    other.querySelector('.asset-card__trigger').setAttribute('aria-expanded', 'false');
                }
            });
            card.classList.toggle('is-open', !isOpen);
            trigger.setAttribute('aria-expanded', String(!isOpen));
        });
    });

    /* ============================================================
       5. REWARD WHEEL
       ============================================================ */
    const REWARDS = [
        { id: 'commission15', color: '#35C2C1', id_label: 'Diskon 15% Jasa Desain', en_label: '15% Off Commission' },
        { id: 'wallpapers',   color: '#FFC145', id_label: 'Paket Wallpaper Gratis', en_label: 'Free Wallpaper Pack' },
        { id: 'presets',      color: '#FF6F59', id_label: 'Paket Preset Gratis',    en_label: 'Free Preset Pack' },
        { id: 'shoutout',     color: '#4ADE80', id_label: 'Shoutout di Instagram', en_label: 'IG Story Shoutout' },
        { id: 'nftAccess',    color: '#35C2C1', id_label: 'Akses Awal Drop NFT',   en_label: 'Early NFT Access' },
        { id: 'feedback',     color: '#FFC145', id_label: 'Sesi Review Portofolio', en_label: 'Portfolio Feedback Call' }
    ];

    const wheelEl = document.getElementById('wheel');
    const SEGMENT_ANGLE = 360 / REWARDS.length;

    // Precomputed unit-circle points for a 6-slice wheel (viewBox 0 0 200 200, center 100,100, r 95)
    const POINTS = [
        [100, 5], [182.27, 52.5], [182.27, 147.5], [100, 195], [17.73, 147.5], [17.73, 52.5], [100, 5]
    ];

    function buildWheel() {
        const label = (r) => currentLang === 'id' ? r.id_label : r.en_label;
        let svg = `<svg viewBox="0 0 200 200">`;
        REWARDS.forEach((reward, i) => {
            const [x1, y1] = POINTS[i];
            const [x2, y2] = POINTS[i + 1];
            svg += `<path d="M100,100 L${x1},${y1} A95,95 0 0 1 ${x2},${y2} Z" fill="${reward.color}" stroke="#0B1220" stroke-width="1.5"/>`;

            const mid = (i * SEGMENT_ANGLE) + SEGMENT_ANGLE / 2;
            const words = label(reward).split(' ');
            const lines = [];
            let line = '';
            words.forEach(w => {
                if ((line + ' ' + w).trim().length > 12) { lines.push(line.trim()); line = w; }
                else { line = (line + ' ' + w).trim(); }
            });
            if (line) lines.push(line);

            const tspans = lines.map((l, li) => `<tspan x="100" dy="${li === 0 ? 0 : 10}">${l}</tspan>`).join('');
            svg += `<text x="100" y="34" font-size="9" text-anchor="middle" transform="rotate(${mid} 100 100)">${tspans}</text>`;
        });
        svg += `</svg>`;
        wheelEl.innerHTML = svg;
    }
    buildWheel();

    /* ============================================================
       6. CONFETTI (lightweight, self-contained canvas burst)
       ============================================================ */
    const confettiCanvas = document.getElementById('confettiCanvas');
    const cCtx = confettiCanvas.getContext('2d');
    let confettiParticles = [];
    let confettiRunning = false;

    function resizeConfettiCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeConfettiCanvas);
    resizeConfettiCanvas();

    function burstConfetti() {
        const colors = ['#35C2C1', '#FFC145', '#FF6F59', '#4ADE80', '#F5F3EE'];
        confettiParticles = Array.from({ length: 90 }, () => ({
            x: confettiCanvas.width / 2,
            y: confettiCanvas.height * 0.35,
            vx: (Math.random() - 0.5) * 12,
            vy: Math.random() * -10 - 4,
            size: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.3,
            life: 0
        }));
        if (!confettiRunning) {
            confettiRunning = true;
            requestAnimationFrame(animateConfetti);
        }
    }

    function animateConfetti() {
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        let anyAlive = false;
        confettiParticles.forEach(p => {
            p.vy += 0.35; // gravity
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.spin;
            p.life++;
            if (p.life < 160 && p.y < confettiCanvas.height + 20) {
                anyAlive = true;
                cCtx.save();
                cCtx.translate(p.x, p.y);
                cCtx.rotate(p.rotation);
                cCtx.fillStyle = p.color;
                cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                cCtx.restore();
            }
        });
        if (anyAlive) requestAnimationFrame(animateConfetti);
        else { confettiRunning = false; cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); }
    }

    /* ============================================================
       7. REWARD MODAL + SPIN LOGIC (one spin per day, via localStorage)
       ============================================================ */
    const rewardOrb = document.getElementById('rewardOrb');
    const rewardModal = document.getElementById('rewardModal');
    const spinButton = document.getElementById('spinButton');
    const spinCooldown = document.getElementById('spinCooldown');
    const wheelView = document.getElementById('wheelView');
    const rewardResult = document.getElementById('rewardResult');
    const rewardResultText = document.getElementById('rewardResultText');
    const rewardCode = document.getElementById('rewardCode');
    const rewardCta = document.getElementById('rewardCta');
    const copyCode = document.getElementById('copyCode');

    let lastFocusedEl = null;
    let currentRotation = 0;

    function todayKey() {
        return new Date().toISOString().slice(0, 10);
    }

    function getStoredSpin() {
        try {
            const raw = localStorage.getItem('rad_last_spin');
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }

    function storeSpin(rewardId, code) {
        try {
            localStorage.setItem('rad_last_spin', JSON.stringify({ date: todayKey(), rewardId, code }));
        } catch (e) { /* ignore persistence failures */ }
    }

    function generateCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'RAD-';
        for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
        return code;
    }

    function showResult(reward, code) {
        const label = currentLang === 'id' ? reward.id_label : reward.en_label;
        rewardResultText.textContent = label;
        rewardCode.textContent = code;
        rewardCta.href = 'https://www.instagram.com/rizky_ahmed_darmawan/';
        wheelView.classList.add('hidden');
        rewardResult.classList.remove('hidden');
    }

    function refreshCooldownState() {
        const stored = getStoredSpin();
        const alreadySpunToday = stored && stored.date === todayKey();
        if (alreadySpunToday) {
            spinButton.disabled = true;
            spinButton.classList.add('hidden');
            spinCooldown.classList.remove('hidden');
            const reward = REWARDS.find(r => r.id === stored.rewardId) || REWARDS[0];
            showResult(reward, stored.code);
        } else {
            spinButton.disabled = false;
            spinButton.classList.remove('hidden');
            spinCooldown.classList.add('hidden');
            wheelView.classList.remove('hidden');
            rewardResult.classList.add('hidden');
        }
    }

    function openModal() {
        lastFocusedEl = document.activeElement;
        rewardModal.setAttribute('aria-hidden', 'false');
        Sound.open();
        refreshCooldownState();
        const closeBtn = rewardModal.querySelector('.modal__close');
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        rewardModal.setAttribute('aria-hidden', 'true');
        Sound.closeUi();
        if (lastFocusedEl) lastFocusedEl.focus();
    }

    rewardOrb.addEventListener('click', openModal);
    rewardModal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && rewardModal.getAttribute('aria-hidden') === 'false') closeModal();
    });

    spinButton.addEventListener('click', () => {
        if (spinButton.disabled) return;
        spinButton.disabled = true;

        const targetIndex = Math.floor(Math.random() * REWARDS.length);
        const reward = REWARDS[targetIndex];

        const extraSpins = 5; // full rotations for a satisfying spin
        const targetMid = (targetIndex * SEGMENT_ANGLE) + SEGMENT_ANGLE / 2;
        // wheel's 0deg segment center is drawn at top-ish; rotate so pointer (top) lands on target
        const finalRotation = currentRotation + (extraSpins * 360) + (360 - targetMid);
        currentRotation = finalRotation % 360;

        wheelEl.style.transform = `rotate(${finalRotation}deg)`;

        // ticking sound synced roughly to segment crossings during the spin
        const totalTicks = extraSpins * REWARDS.length + targetIndex;
        const spinDuration = 4200;
        let ticksPlayed = 0;
        const tickTimer = setInterval(() => {
            ticksPlayed++;
            Sound.tick();
            if (ticksPlayed >= totalTicks) clearInterval(tickTimer);
        }, spinDuration / totalTicks);

        setTimeout(() => {
            clearInterval(tickTimer);
            const code = generateCode();
            storeSpin(reward.id, code);
            Sound.win();
            burstConfetti();
            showResult(reward, code);
        }, spinDuration + 150);
    });

    copyCode.addEventListener('click', () => {
        const text = rewardCode.textContent;
        const original = translations[currentLang]['reward.copy'];
        const done = () => {
            copyCode.textContent = translations[currentLang]['reward.copied'];
            setTimeout(() => { copyCode.textContent = original; }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
            done();
        }
    });

    // Reveal the reward orb once the visitor nears the bottom of the page
    function checkOrbVisibility() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.scrollHeight;
        rewardOrb.style.opacity = scrollPosition >= pageHeight - 300 ? '1' : '0';
        rewardOrb.style.pointerEvents = scrollPosition >= pageHeight - 300 ? 'auto' : 'none';
    }
    rewardOrb.style.transition = 'opacity 0.3s ease';
    checkOrbVisibility();
    document.addEventListener('scroll', checkOrbVisibility, { passive: true });
    window.addEventListener('resize', checkOrbVisibility);

    /* Initial language pass to normalize DOM to the declared default */
    applyLanguage(currentLang);
});
