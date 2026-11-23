"""Runs the real SoleStock program for the in-browser demo.

A browser cannot pause Python while it waits for a keypress, so the demo
replays the whole session from the start every time the visitor presses
Enter. The answers typed so far are handed to input() one by one; when they
run out, the program is stopped at that prompt and the page waits for the
next answer.

SoleStock is deterministic and every replay starts from the same sample data,
so the replay is exact: the screen is what a real terminal session would show.
"""

import builtins
import io
import json
import os
import shutil
import sys
import traceback

APP_DIR = "/app"
DATA_DIR = "/demo"
DATA_FILE = DATA_DIR + "/inventory.txt"
SAMPLE_FILE = APP_DIR + "/sample_inventory.txt"


class NeedInput(BaseException):
    """Raised when the program asks for an answer the visitor has not typed.

    Derives from BaseException so the program's own `except Exception`
    handlers can never swallow it.
    """


def run_session(answers_json):
    """Replay the program with these answers; return JSON for the page.

    The result is {"status", "output"}: status is "waiting" (stopped at a
    prompt), "ended" (the program finished) or "error".
    """
    answers = json.loads(answers_json)

    if APP_DIR not in sys.path:
        sys.path.insert(0, APP_DIR)
    for name in [m for m in sys.modules
                 if m == "solestock" or m.startswith("solestock.")]:
        del sys.modules[name]

    shutil.rmtree(DATA_DIR, ignore_errors=True)
    os.makedirs(DATA_DIR)
    shutil.copyfile(SAMPLE_FILE, DATA_FILE)

    output = io.StringIO()
    remaining = iter(answers)

    def scripted_input(prompt=""):
        output.write(prompt)
        try:
            answer = next(remaining)
        except StopIteration:
            raise NeedInput() from None
        output.write(answer + "\n")
        return answer

    saved = sys.stdout, sys.stderr, builtins.input
    sys.stdout = sys.stderr = output
    builtins.input = scripted_input
    status = "ended"
    try:
        from solestock.cli import main
        main(["--file", DATA_FILE])
    except NeedInput:
        status = "waiting"
    except SystemExit:
        pass
    except Exception:
        traceback.print_exc(file=output)
        status = "error"
    finally:
        sys.stdout, sys.stderr, builtins.input = saved

    return json.dumps({"status": status, "output": output.getvalue()})
