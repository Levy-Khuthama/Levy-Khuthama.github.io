/**
 * scroll.js — everything driven by scrolling:
 *   1. progress bar at the top of the page
 *   2. nav border once the page has scrolled
 *   3. nav scroll-spy (highlights the link for the section in view)
 *   4. reveal-on-scroll for sections
 */
(function () {
  'use strict';

  var progressBar = document.getElementById('progress-bar');
  var nav = document.getElementById('nav');
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav .links a');

  /* ---- 1. Progress bar ---- */
  function updateProgressBar() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = percent + '%';
  }

  /* ---- 2. Nav border ---- */
  function updateNavBorder() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  /* ---- 3. Scroll-spy ----
   * A section counts as "current" once its top crosses a marker line near the
   * top of the viewport. Position-based on purpose: an IntersectionObserver
   * missed short sections (Education, Contact), which never sat in its band.
   */
  function updateActiveSection() {
    if (!sections.length) return;

    var markerY = window.innerHeight * 0.35;
    var current = sections[0];

    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= markerY) {
        current = section;
      }
    });

    // At the very bottom, force the last section: a short final section may
    // never have room to reach the marker line.
    var atBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    if (atBottom) {
      current = sections[sections.length - 1];
    }

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === current.id);
    });
  }

  function onScroll() {
    updateProgressBar();
    updateNavBorder();
    updateActiveSection();
  }

  /* ---- 4. Reveal on scroll ---- */
  function initReveal() {
    var targets = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  initReveal();
})();
