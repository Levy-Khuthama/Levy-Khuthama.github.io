/**
 * contact.js — "Copy" button next to the email address.
 *
 * Markup: <button class="copy-btn" data-copy="you@example.com">Copy</button>
 */
(function () {
  'use strict';

  var RESET_DELAY_MS = 1200;

  document.querySelectorAll('.copy-btn[data-copy]').forEach(function (button) {
    var originalLabel = button.textContent;

    button.addEventListener('click', function () {
      if (!navigator.clipboard) return;

      navigator.clipboard.writeText(button.dataset.copy).then(function () {
        button.textContent = 'Copied';
        setTimeout(function () { button.textContent = originalLabel; }, RESET_DELAY_MS);
      });
    });
  });
})();
