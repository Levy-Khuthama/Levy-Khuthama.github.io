/**
 * modal.js — project lightbox.
 *
 * Clicking a project card opens a modal filled from the card's data-*
 * attributes (name, desc, meta, img, link). Cards without an image (the CLI
 * projects) clone their terminal preview into the modal instead.
 */
(function () {
  'use strict';

  var modal = document.getElementById('modal');
  var thumb = document.getElementById('modal-thumb');
  var nameEl = document.getElementById('modal-name');
  var descEl = document.getElementById('modal-desc');
  var metaEl = document.getElementById('modal-meta');
  var linkEl = document.getElementById('modal-link');
  var closeBtn = document.getElementById('modal-close');
  var cards = document.querySelectorAll('.project-card');

  function renderThumb(card) {
    thumb.textContent = ''; // clear previous content

    if (card.dataset.img) {
      var img = document.createElement('img');
      img.src = card.dataset.img;
      img.alt = card.dataset.name;
      thumb.className = 'modal-thumb';
      thumb.appendChild(img);
      return;
    }

    var terminal = card.querySelector('.term-window');
    thumb.className = 'modal-thumb term';
    if (terminal) thumb.appendChild(terminal.cloneNode(true));
  }

  function openModal(card) {
    nameEl.textContent = card.dataset.name;
    descEl.textContent = card.dataset.desc;
    metaEl.textContent = card.dataset.meta;

    if (card.dataset.link) {
      linkEl.href = card.dataset.link;
      linkEl.style.display = 'inline-flex';
    } else {
      linkEl.style.display = 'none';
    }

    renderThumb(card);
    modal.classList.add('open');
  }

  function closeModal() {
    modal.classList.remove('open');
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function (event) {
      // The card's own "View on GitHub" link should just navigate.
      if (event.target.closest('a')) return;
      openModal(card);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', function (event) {
    if (event.target === modal) closeModal(); // click on the dimmed backdrop
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeModal();
  });
})();
