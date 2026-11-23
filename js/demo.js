/**
 * demo.js: runs the real SoleStock program in the browser ("Try SoleStock").
 *
 * Python runs in the browser through Pyodide, which is only downloaded when
 * the visitor presses "Start the demo". The program's source files come from
 * js/solestock-bundle.js (built by tools/build_demo_bundle.py).
 *
 * A browser cannot pause Python to wait for typing, so every time the visitor
 * presses Enter the whole session is replayed from the start with the answers
 * given so far (see tools/session_runner.py). The program is deterministic,
 * so the screen is exactly what a real terminal would show.
 */
(function () {
  'use strict';

  var PYODIDE_VERSION = '0.29.3';
  var PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v' + PYODIDE_VERSION + '/full/';
  var MAX_ANSWERS = 150;
  var HEADER = '$ python solestock.py\n';

  var MENU_SHORTCUTS = [
    ['1', 'Reload'], ['2', 'Add shoe'], ['3', 'View all'], ['4', 'Restock'],
    ['5', 'Search'], ['6', 'Values'], ['7', 'Top stock'], ['8', 'Exit']
  ];

  var root = document.getElementById('demo-app');
  var bundle = window.SOLESTOCK_DEMO;
  if (!root) return;

  var els = {
    screen: document.getElementById('demo-screen'),
    output: document.getElementById('demo-output'),
    line: document.getElementById('demo-line'),
    prompt: document.getElementById('demo-prompt'),
    input: document.getElementById('demo-input'),
    start: document.getElementById('demo-start'),
    launch: document.getElementById('demo-launch'),
    status: document.getElementById('demo-status'),
    chips: document.getElementById('demo-chips'),
    restart: document.getElementById('demo-restart'),
    announce: document.getElementById('demo-announce')
  };

  var runSession = null;   // Python function, set once Pyodide has loaded
  var answers = [];        // everything the visitor has typed so far
  var lastOutput = '';     // previous screen text, to announce only what is new
  var waiting = false;     // true while the program is waiting at a prompt

  function setState(state) {
    root.setAttribute('data-state', state);
  }

  function setStatus(text) {
    els.status.textContent = text;
  }

  /* ---- Loading Python ---- */

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = function () { reject(new Error('Could not load ' + src)); };
      document.head.appendChild(script);
    });
  }

  function loadRuntime() {
    var ready = window.loadPyodide
      ? Promise.resolve()
      : loadScript(PYODIDE_URL + 'pyodide.js');
    return ready.then(function () {
      return window.loadPyodide({ indexURL: PYODIDE_URL });
    });
  }

  function installProgram(pyodide) {
    pyodide.FS.mkdirTree('/app/solestock');
    Object.keys(bundle.files).forEach(function (name) {
      pyodide.FS.writeFile('/app/' + name, bundle.files[name]);
    });
    pyodide.FS.writeFile('/app/sample_inventory.txt', bundle.sample);
    pyodide.runPython(bundle.runner);
    runSession = pyodide.globals.get('run_session');
  }

  function launch() {
    if (!bundle) {
      setState('error');
      setStatus('The demo files are missing (js/solestock-bundle.js).');
      return;
    }
    setState('loading');
    els.launch.disabled = true;
    setStatus('Loading Python…');

    loadRuntime()
      .then(function (pyodide) {
        setStatus('Starting SoleStock…');
        installProgram(pyodide);
        els.start.hidden = true;
        els.restart.hidden = false;
        restart();
      })
      .catch(function () {
        setState('error');
        els.launch.disabled = false;
        els.launch.textContent = 'Try again';
        setStatus('Could not load Python. Check your connection and try again.');
      });
  }

  /* ---- Running the program ---- */

  function replay() {
    var result;
    try {
      result = JSON.parse(runSession(JSON.stringify(answers)));
    } catch (error) {
      result = { status: 'error', output: 'The demo hit an unexpected problem.\n' };
    }
    render(result);
  }

  function restart() {
    answers = [];
    lastOutput = '';
    replay();
  }

  function submit(text) {
    if (!waiting || answers.length >= MAX_ANSWERS) return;
    answers.push(text);
    replay();
  }

  /* ---- Drawing the screen ---- */

  function render(result) {
    var text = result.output;
    var newPart = text.slice(lastOutput.length);
    lastOutput = text;

    if (result.status === 'waiting') {
      // Everything after the last newline is the open prompt: show it in
      // front of the input field instead of in the log.
      var cut = text.lastIndexOf('\n') + 1;
      els.output.textContent = HEADER + text.slice(0, cut);
      els.prompt.textContent = text.slice(cut);
      els.line.hidden = false;
      els.input.value = '';
      waiting = true;
      setState('running');
      showShortcuts(text.slice(cut));
      els.input.focus({ preventScroll: true });
    } else {
      var note = result.status === 'ended'
        ? '\n[The program has finished. Press Restart to run it again.]'
        : '\n[Something went wrong. Press Restart to try again.]';
      els.output.textContent = HEADER + text + note;
      els.line.hidden = true;
      els.chips.hidden = true;
      waiting = false;
      setState(result.status);
    }

    els.announce.textContent = newPart.trim();
    els.screen.scrollTop = els.screen.scrollHeight;
  }

  /* ---- Menu shortcuts ---- */

  function buildShortcuts() {
    MENU_SHORTCUTS.forEach(function (item) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'demo-chip';
      var number = document.createElement('b');
      number.textContent = item[0];
      button.appendChild(number);
      button.appendChild(document.createTextNode(item[1]));
      button.addEventListener('click', function () { submit(item[0]); });
      els.chips.appendChild(button);
    });
  }

  function showShortcuts(promptText) {
    els.chips.hidden = promptText.indexOf('Enter your choice') !== 0;
  }

  /* ---- Wiring ---- */

  els.launch.addEventListener('click', launch);
  els.restart.addEventListener('click', restart);
  els.input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit(els.input.value);
    }
  });
  // Clicking anywhere on the screen puts the cursor in the field, like a terminal
  els.screen.addEventListener('click', function (event) {
    if (waiting && !window.getSelection().toString() && event.target !== els.input) {
      els.input.focus({ preventScroll: true });
    }
  });

  buildShortcuts();
})();
