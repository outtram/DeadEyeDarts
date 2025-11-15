# DeadEyeGames - Browser Tests

Automated browser tests for DeadEyeGames using Playwright and pytest.

## Prerequisites

1. **Server must be running**: Start the DeadEyeGames server before running tests
   ```bash
   ./run_games.sh
   # Or on Windows: run_games.bat
   ```
   The server should be accessible at `http://localhost:3000`

2. **Virtual environment activated**: Make sure you're in the venv
   ```bash
   source venv/bin/activate
   # Or on Windows: venv\Scripts\activate
   ```

## Running Tests

### Run all tests
```bash
pytest tests/
```

### Run tests with visible browser (headed mode)
```bash
pytest tests/ --headed
```

### Run specific test file
```bash
pytest tests/test_homepage.py
pytest tests/test_zombie_game.py
```

### Run a specific test
```bash
pytest tests/test_homepage.py::test_homepage_loads
```

### Run tests with detailed output
```bash
pytest tests/ -v -s
```

### Run tests and generate screenshots on failure
```bash
pytest tests/ --screenshot=on --video=retain-on-failure
```

## Test Files

- `test_homepage.py` - Tests for the DeadEyeGames homepage
  - Homepage loads correctly
  - Connection status panel displays

- `test_zombie_game.py` - Tests for the Zombie Slayer game
  - Game page loads correctly
  - Stats panel displays with correct initial values

## Debugging Tests

### Run with browser visible
Use `--headed` flag to see what the browser is doing:
```bash
pytest tests/ --headed --slowmo=1000
```
The `--slowmo` flag adds a delay (in milliseconds) between actions.

### Use Playwright Inspector
For interactive debugging:
```bash
PWDEBUG=1 pytest tests/test_homepage.py::test_homepage_loads
```

### Generate trace files
```bash
pytest tests/ --tracing=on
```
Then view traces at: https://trace.playwright.dev/

## Writing New Tests

All test functions should:
- Start with `test_` prefix
- Accept `page: Page` parameter (provided by pytest-playwright)
- Use Playwright's `expect()` assertions for auto-waiting

Example:
```python
def test_example(page: Page):
    page.goto("http://localhost:3000/")
    expect(page.locator("h1")).to_be_visible()
```

## Common Playwright Commands

- `page.goto(url)` - Navigate to URL
- `page.locator(selector)` - Find element by CSS selector
- `expect(locator).to_be_visible()` - Assert element is visible
- `expect(locator).to_have_text(text)` - Assert element has text
- `page.screenshot(path="screenshot.png")` - Take screenshot

## Useful pytest Options

- `-v` - Verbose output
- `-s` - Show print statements
- `-x` - Stop on first failure
- `-k "homepage"` - Run tests matching pattern
- `--headed` - Show browser window
- `--slowmo=500` - Slow down actions by milliseconds
- `--screenshot=on` - Take screenshots
- `--video=on` - Record videos
