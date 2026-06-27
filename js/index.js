
(() => {
    let exportAnimationObserver = null;

    function initializeAnimations(root = document) {
        const animationElements = Array.from(root.querySelectorAll(
            '.reveal, .reveal-left, .reveal-right, .image-reveal'
        ));
        let imageIndex = 0;

        animationElements.forEach((element) => {
            if (element.classList.contains('image-reveal')) {
                element.style.setProperty('--delay', (imageIndex * 0.8) + 's');
                imageIndex++;
            }

            if (element.dataset.gcAnimationObserved === 'true') {
                return;
            }
            element.dataset.gcAnimationObserved = 'true';

            if ('IntersectionObserver' in window) {
                if (!exportAnimationObserver) {
                    exportAnimationObserver = new IntersectionObserver((entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add('active');
                            }
                        });
                    }, { threshold: 0.1 });
                }
                exportAnimationObserver.observe(element);
                return;
            }

            window.setTimeout(() => element.classList.add('active'), 0);
        });
    }

    function updateCountdown(element) {
        const targetValue = element.getAttribute('data-export-date');
        const target = new Date(targetValue).getTime();
        if (!Number.isFinite(target)) return;
        const difference = Math.max(0, target - Date.now());
        const values = {
            days: Math.floor(difference / 86400000),
            hours: Math.floor((difference % 86400000) / 3600000),
            minutes: Math.floor((difference % 3600000) / 60000),
            seconds: Math.floor((difference % 60000) / 1000)
        };
        const unitElements = {
            days: element.querySelector('#days, #cd-days'),
            hours: element.querySelector('#hours, #cd-hours'),
            minutes: element.querySelector('#minutes, #cd-minutes'),
            seconds: element.querySelector('#seconds, #cd-seconds')
        };
        if (Object.values(unitElements).some(Boolean)) {
            Object.entries(unitElements).forEach(([unit, node]) => {
                if (!node) return;
                node.textContent = unit === 'days'
                    ? String(values[unit])
                    : String(values[unit]).padStart(2, '0');
            });
            return;
        }
        element.textContent = difference <= 0
            ? '¡Ya comenzó!'
            : values.days + ' días ' + values.hours + 'h ' + values.minutes + 'm ' + values.seconds + 's';
    }

    function initializeCountdowns() {
        const countdowns = Array.from(document.querySelectorAll('[data-export-date]'));
        const update = () => countdowns.forEach(updateCountdown);
        update();
        if (countdowns.length) window.setInterval(update, 1000);
    }

    function initializeMusic() {
        const bar = document.querySelector('[data-export-music-src]');
        if (!bar) return;
        const source = bar.getAttribute('data-export-music-src');
        const playButton = document.getElementById('play-btn');
        const pauseButton = document.getElementById('pause-btn');
        const progressBar = document.getElementById('progress-bar');
        const progressCurrent = document.getElementById('progress-current');
        const timeDisplay = document.getElementById('time-display');
        if (!source || !playButton || !pauseButton) return;
        const audio = new Audio(source);
        const formatTime = (seconds) => {
            if (!Number.isFinite(seconds)) return '00:00';
            const minutes = Math.floor(seconds / 60);
            const remaining = Math.floor(seconds % 60);
            return String(minutes).padStart(2, '0') + ':' + String(remaining).padStart(2, '0');
        };
        const updateProgress = () => {
            if (progressCurrent && Number.isFinite(audio.duration) && audio.duration > 0) {
                progressCurrent.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
            }
            if (timeDisplay) timeDisplay.textContent = formatTime(audio.currentTime);
        };
        playButton.addEventListener('click', () => audio.play().catch(() => {}));
        pauseButton.addEventListener('click', () => audio.pause());
        audio.addEventListener('play', () => {
            playButton.style.display = 'none';
            pauseButton.style.display = 'flex';
        });
        audio.addEventListener('pause', () => {
            playButton.style.display = 'flex';
            pauseButton.style.display = 'none';
        });
        audio.addEventListener('timeupdate', updateProgress);
        if (progressBar) {
            progressBar.addEventListener('click', (event) => {
                if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
                const rect = progressBar.getBoundingClientRect();
                audio.currentTime = ((event.clientX - rect.left) / rect.width) * audio.duration;
            });
        }
    }

    function initializeStaticRsvp() {
        document.querySelectorAll('.gc-rsvp-form').forEach((form) => {
            form.querySelectorAll('input, textarea, button').forEach((control) => {
                control.disabled = false;
            });
            const showStaticMessage = () => {
                const status = form.parentElement && form.parentElement.querySelector('.gc-rsvp-status');
                if (status) {
                    status.textContent = 'Esta copia estática no está conectada al panel RSVP de GiftClick.';
                }
            };
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                showStaticMessage();
            });
            form.querySelectorAll('button').forEach((button) => {
                button.addEventListener('click', showStaticMessage);
            });
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        initializeAnimations();
        initializeCountdowns();
        initializeMusic();
        initializeStaticRsvp();
    });
})();

(() => {

            window.addEventListener("scroll", function () {
                const bg = document.querySelector(".background-image");
                const scrollY = window.scrollY;
                // Ajusta el valor 0.5 para mayor o menor movimiento
                bg.style.transform = `translateY(${scrollY * 0.5}px)`;
            });
        
})();

(() => {

                    const video = document.getElementById('video');

                    function togglePlay() {
                        if (video.paused) {
                            video.play();
                        } else {
                            video.pause();
                        }
                    }
                
})();

(() => {

                        const RSVP_PHONE = "51985632181";
                        const RSVP_MESSAGE = "Sí, podré asistir a la boda de Humberto y Adelma el día sábado 8 de agosto de 2026. Mi nombre y apellido es:";

                        function openRsvpWhatsApp() {
                            const url = `https://api.whatsapp.com/send?phone=${RSVP_PHONE}&text=${encodeURIComponent(RSVP_MESSAGE)}`;
                            window.open(url, "_blank", "noopener,noreferrer");
                        }

                        window.redirectNovia = openRsvpWhatsApp;
                    
})();

(() => {
    const outputNameMap = {"index.html":"index.html"};

    function enforceExportLinks() {
        document.querySelectorAll('a[href]').forEach((link) => {
            const rawHref = link.getAttribute('href') || '';
            if (!rawHref || rawHref.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(rawHref)) {
                return;
            }

            try {
                const url = new URL(rawHref, window.location.href);
                if (url.origin !== window.location.origin) return;

                const normalizedPath = decodeURIComponent(url.pathname).replace(/^\/+/, '');
                const sourceName = normalizedPath.split('/').pop() || normalizedPath;
                const mappedName = outputNameMap[normalizedPath] || outputNameMap[sourceName];
                if (!mappedName) return;

                link.setAttribute('href', mappedName + url.search + url.hash);
            } catch (error) {
                // Leave malformed links untouched.
            }
        });
    }

    window.addEventListener('DOMContentLoaded', () => {
        window.setTimeout(enforceExportLinks, 0);
    });
})();
