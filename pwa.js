const installBtn = document.getElementById('installBtn');
let deferredPrompt = null;

const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch((error) => {
            console.warn('Service worker registration failed:', error);
        });
    });
}

if (installBtn) {
    const hideInstallButton = () => {
        deferredPrompt = null;
        installBtn.hidden = true;
    };

    if (!isStandalone()) {
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredPrompt = event;
            installBtn.hidden = false;
        });
    }

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        hideInstallButton();
    });

    window.addEventListener('appinstalled', hideInstallButton);

    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    const onStandaloneChange = (event) => {
        if (event.matches) hideInstallButton();
    };

    if (standaloneQuery.addEventListener) {
        standaloneQuery.addEventListener('change', onStandaloneChange);
    } else if (standaloneQuery.addListener) {
        standaloneQuery.addListener(onStandaloneChange);
    }
}
