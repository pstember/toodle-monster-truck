// ===================================
// TRANSLATIONS MODULE
// ===================================

export const translations = {
    en: {
        'splash-title': '🚙 Monster Truck Match 🚙',
        'splash-subtitle': 'Match the shapes and colors!',
        'start-game': 'START GAME',
        'level': 'Level',
        'amazing': '🎉 Amazing! 🎉',
        'mud-wash-title': '🧽 Wash the Truck! 🧽',
        'mud-wash-instructions': 'Swipe to clean off the mud!',
        'cleaned': 'Cleaned:',
        'sticker-shop-title': '✨ Decorate Your Truck! ✨',
        'sticker-shop-instructions': 'Drag stickers onto your truck, then click DONE!',
        'done': 'DONE!',
        'big-jump-title': '🚀 BIG JUMP! 🚀',
        'big-jump-instructions': 'Click JUMP to do a backflip!',
        'jump': 'JUMP!',
        'bubble-wrap-title': '🎈 POP THE BUBBLES! 🎈',
        'bubble-wrap-instructions': 'Tap all the bubbles to pop them!',
        'popped': 'popped'
    },
    fr: {
        'splash-title': '🚙 Match de Monster Truck 🚙',
        'splash-subtitle': 'Associe les formes et les couleurs !',
        'start-game': 'COMMENCER',
        'level': 'Niveau',
        'amazing': '🎉 Incroyable ! 🎉',
        'mud-wash-title': '🧽 Lave le Camion ! 🧽',
        'mud-wash-instructions': 'Glisse pour nettoyer la boue !',
        'cleaned': 'Nettoyé :',
        'sticker-shop-title': '✨ Décore Ton Camion ! ✨',
        'sticker-shop-instructions': 'Glisse les autocollants sur ton camion, puis clique sur FINI !',
        'done': 'FINI !',
        'big-jump-title': '🚀 GRAND SAUT ! 🚀',
        'big-jump-instructions': 'Clique sur SAUTER pour faire un salto !',
        'jump': 'SAUTER !',
        'bubble-wrap-title': '🎈 ÉCLATE LES BULLES ! 🎈',
        'bubble-wrap-instructions': 'Tape sur toutes les bulles pour les éclater !',
        'popped': 'éclatées'
    },
    es: {
        'splash-title': '🚙 Empareja el Monster Truck 🚙',
        'splash-subtitle': '¡Empareja las formas y los colores!',
        'start-game': 'EMPEZAR',
        'level': 'Nivel',
        'amazing': '🎉 ¡Increíble! 🎉',
        'mud-wash-title': '🧽 ¡Lava el Camión! 🧽',
        'mud-wash-instructions': '¡Desliza para limpiar el lodo!',
        'cleaned': 'Limpiado:',
        'sticker-shop-title': '✨ ¡Decora Tu Camión! ✨',
        'sticker-shop-instructions': '¡Arrastra pegatinas a tu camión y luego haz clic en LISTO!',
        'done': '¡LISTO!',
        'big-jump-title': '🚀 ¡GRAN SALTO! 🚀',
        'big-jump-instructions': '¡Haz clic en SALTAR para hacer una voltereta!',
        'jump': '¡SALTAR!',
        'bubble-wrap-title': '🎈 ¡REVIENTA LAS BURBUJAS! 🎈',
        'bubble-wrap-instructions': '¡Toca todas las burbujas para reventarlas!',
        'popped': 'reventadas'
    }
};

let currentLanguage = localStorage.getItem('monster-truck-language') || 'en';

export function getCurrentLanguage() {
    return currentLanguage;
}

export function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('monster-truck-language', lang);

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}
