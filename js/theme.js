/**
 * theme.js — light/dark theme.
 *
 * Loaded in <head> WITHOUT defer so the saved theme is applied before the
 * first paint (no flash of the wrong colours). The toggle button is wired
 * up once the DOM is ready.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'portfolio-theme';
  var root = document.documentElement;

  function readSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null; // storage can be blocked (private mode, strict settings)
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* non-critical: the theme simply won't persist */
    }
  }

  function preferredTheme() {
    var saved = readSavedTheme();
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);

    var sun = document.getElementById('icon-sun');
    var moon = document.getElementById('icon-moon');
    if (sun && moon) {
      sun.style.display = theme === 'dark' ? 'none' : 'block';
      moon.style.display = theme === 'dark' ? 'block' : 'none';
    }
  }

  // Apply immediately (icons don't exist yet; they are synced on DOMContentLoaded).
  applyTheme(preferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(root.getAttribute('data-theme'));

    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
    });
  });
})();
