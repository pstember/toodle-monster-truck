import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCurrentLanguage,
  t,
  tCurrent,
  setLanguage,
  translations,
  LANGUAGE_STORAGE_KEY
} from './translations.js';

describe('Translations', () => {
  beforeEach(() => {
    // Reset DOM
    document.documentElement.lang = 'en';
    document.title = '';
    document.body.innerHTML = '';

    // Clear localStorage
    localStorage.clear();

    // Reset to English
    setLanguage('en');
  });

  describe('getCurrentLanguage', () => {
    it('returns en by default', () => {
      expect(getCurrentLanguage()).toBe('en');
    });

    it('returns updated language after setLanguage', () => {
      setLanguage('fr');
      expect(getCurrentLanguage()).toBe('fr');
    });
  });

  describe('t', () => {
    it('returns translation for valid lang and key', () => {
      const result = t('en', 'btn-photo');
      expect(result).toBe('📸 Choose a photo');
    });

    it('returns French translation when lang is fr', () => {
      const result = t('fr', 'btn-photo');
      expect(result).toBe('📸 Choisir une photo');
    });

    it('returns Spanish translation when lang is es', () => {
      const result = t('es', 'btn-photo');
      expect(result).toBe('📸 Elegir una foto');
    });

    it('falls back to en when key missing in requested lang', () => {
      // Add a key only to English
      translations.en['test-only-en'] = 'English only';

      const result = t('fr', 'test-only-en');
      expect(result).toBe('English only');

      // Cleanup
      delete translations.en['test-only-en'];
    });

    it('returns key itself when missing in all langs', () => {
      const result = t('en', 'nonexistent-key-xyz');
      expect(result).toBe('nonexistent-key-xyz');
    });

    it('falls back to en table when invalid lang', () => {
      const result = t('invalid-lang', 'btn-photo');
      expect(result).toBe('📸 Choose a photo');
    });
  });

  describe('tCurrent', () => {
    it('uses current language (en default)', () => {
      const result = tCurrent('btn-photo');
      expect(result).toBe('📸 Choose a photo');
    });

    it('uses current language after setLanguage to fr', () => {
      setLanguage('fr');
      const result = tCurrent('btn-photo');
      expect(result).toBe('📸 Choisir une photo');
    });

    it('uses current language after setLanguage to es', () => {
      setLanguage('es');
      const result = tCurrent('btn-photo');
      expect(result).toBe('📸 Elegir una foto');
    });
  });

  describe('setLanguage', () => {
    it('rejects invalid language (not en/fr/es)', () => {
      setLanguage('de');
      expect(getCurrentLanguage()).toBe('en'); // Should stay en
    });

    it('updates document.documentElement.lang', () => {
      setLanguage('fr');
      expect(document.documentElement.lang).toBe('fr');
    });

    it('updates document.title', () => {
      setLanguage('fr');
      expect(document.title).toBe('Puzzle photo');
    });

    it('updates elements with data-i18n attribute', () => {
      const btn = document.createElement('button');
      btn.setAttribute('data-i18n', 'btn-photo');
      document.body.appendChild(btn);

      setLanguage('fr');
      expect(btn.textContent).toBe('📸 Choisir une photo');
    });

    it('updates elements with data-i18n-title attribute', () => {
      const div = document.createElement('div');
      div.setAttribute('data-i18n-title', 'difficulty-title');
      document.body.appendChild(div);

      setLanguage('es');
      expect(div.getAttribute('title')).toBe('Tamaño de la cuadrícula: más casillas, más difícil.');
    });

    it('updates elements with data-i18n-aria attribute', () => {
      const nav = document.createElement('nav');
      nav.setAttribute('data-i18n-aria', 'difficulty-aria');
      document.body.appendChild(nav);

      setLanguage('fr');
      expect(nav.getAttribute('aria-label')).toBe('Difficulté du puzzle');
    });

    it('dispatches puzzle-lang-updated custom event', () => {
      const handler = vi.fn();
      document.addEventListener('puzzle-lang-updated', handler);

      setLanguage('es');

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { lang: 'es' }
        })
      );

      document.removeEventListener('puzzle-lang-updated', handler);
    });

    it('persists language to localStorage', () => {
      setLanguage('fr');
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      expect(stored).toBe('fr');
    });

    it('handles multiple elements with same data-i18n key', () => {
      const btn1 = document.createElement('button');
      btn1.setAttribute('data-i18n', 'btn-replay');
      const btn2 = document.createElement('button');
      btn2.setAttribute('data-i18n', 'btn-replay');
      document.body.appendChild(btn1);
      document.body.appendChild(btn2);

      setLanguage('es');

      expect(btn1.textContent).toBe('🔄 Jugar de nuevo');
      expect(btn2.textContent).toBe('🔄 Jugar de nuevo');
    });
  });
});
