/**
 * projects.js — category filter pills for the project grid.
 *
 * Each pill has data-filter="all|data|software"; each card has data-cat.
 * Non-matching cards get the .hidden class (see css/projects.css).
 */
(function () {
  'use strict';

  var buttons = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project-card');

  function applyFilter(filter) {
    cards.forEach(function (card) {
      var visible = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !visible);
    });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      button.classList.add('active');
      applyFilter(button.dataset.filter);
    });
  });
})();
