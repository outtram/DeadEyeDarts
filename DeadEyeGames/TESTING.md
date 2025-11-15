# Browser Testing Setup - DeadEyeGames

## What's Installed

You now have **Playwright** browser automation testing set up for DeadEyeGames!

### Components
- **Playwright** - Modern browser automation framework
- **pytest** - Python testing framework
- **pytest-playwright** - Integration between pytest and Playwright
- **Chromium browser** - Installed and ready for testing

## Quick Start

### 1. Start the server (in one terminal)
```bash
cd /Users/troyouttram/CODE/DeadEyeGames
./run_games.sh
```

### 2. Run tests (in another terminal)
```bash
cd /Users/troyouttram/CODE/DeadEyeGames
./run_tests.sh
```

That's it! The tests will run in headless mode (no browser window).

## Test Files Created

### `/Users/troyouttram/CODE/DeadEyeGames/tests/test_homepage.py`
Two simple tests:
- `test_homepage_loads` - Verifies homepage loads and displays title
- `test_connection_status_panel` - Verifies connection status panel exists

### `/Users/troyouttram/CODE/DeadEyeGames/tests/test_zombie_game.py`
Two simple tests:
- `test_zombie_game_loads` - Verifies zombie game page loads
- `test_zombie_game_stats_display` - Verifies game stats display correctly

## Running Tests Different Ways

### See the browser while testing (headed mode)
```bash
./run_tests.sh --headed
```

### Run with slow motion (helpful for debugging)
```bash
./run_tests.sh --headed --slowmo=500
```

### Run only homepage tests
```bash
source venv/bin/activate
pytest tests/test_homepage.py -v
```

### Run only zombie game tests
```bash
source venv/bin/activate
pytest tests/test_zombie_game.py -v
```

### Run a specific test
```bash
source venv/bin/activate
pytest tests/test_homepage.py::test_homepage_loads -v
```

### Interactive debugging with Playwright Inspector
```bash
source venv/bin/activate
PWDEBUG=1 pytest tests/test_homepage.py::test_homepage_loads
```

## Understanding Test Output

### ✅ Passing test looks like:
```
tests/test_homepage.py::test_homepage_loads PASSED
```

### ❌ Failing test looks like:
```
tests/test_homepage.py::test_homepage_loads FAILED
```
With details about what went wrong.

## Adding More Tests

Tests are just Python functions that start with `test_`:

```python
def test_my_new_feature(page: Page):
    # Navigate to a page
    page.goto("http://localhost:3000/")

    # Find an element
    button = page.locator("button.start-game")

    # Make assertions
    expect(button).to_be_visible()
    expect(button).to_have_text("Start Game")

    # Click and interact
    button.click()

    # Wait for something to appear
    expect(page.locator(".game-started")).to_be_visible()
```

## Useful Playwright Selectors

```python
# By CSS class
page.locator(".class-name")

# By ID
page.locator("#element-id")

# By text content
page.locator("text=Click me")

# By role (accessibility)
page.locator("role=button[name='Submit']")

# Chaining selectors
page.locator("div.container").locator("button")
```

## Common Assertions

```python
# Visibility
expect(element).to_be_visible()
expect(element).to_be_hidden()

# Text content
expect(element).to_have_text("Exact text")
expect(element).to_contain_text("Partial text")

# Attributes
expect(element).to_have_attribute("href", "/games")
expect(element).to_have_class("active")

# Page
expect(page).to_have_title("My Page")
expect(page).to_have_url("http://localhost:3000/")
```

## Testing WebSocket/Socket.IO Features

Since DeadEyeGames uses Socket.IO for real-time dart events, you can test those too:

```python
def test_dart_event_handling(page: Page):
    page.goto("http://localhost:3000/games/zombie-slayer/zombie.html")

    # Wait for WebSocket connection
    page.wait_for_selector(".status-indicator.connected", timeout=5000)

    # Simulate dart throw (you'd need to trigger this from darts-caller)
    # Then verify the UI updates
    expect(page.locator("#score")).to_contain_text("20")
```

## Best Practices

1. **Always start the server before running tests**
   - Tests expect the server at `http://localhost:3000`

2. **Use auto-waiting assertions**
   - Playwright automatically waits for elements
   - Use `expect(element).to_be_visible()` instead of manual waits

3. **Keep tests simple and focused**
   - One test should verify one thing
   - Tests should be independent (don't rely on order)

4. **Use descriptive test names**
   - `test_homepage_loads` ✅
   - `test_1` ❌

5. **Add screenshots on failures**
   ```bash
   pytest tests/ --screenshot=only-on-failure
   ```

## Debugging Failed Tests

### 1. Run with visible browser
```bash
./run_tests.sh --headed
```

### 2. Add slowmo to see actions
```bash
./run_tests.sh --headed --slowmo=1000
```

### 3. Use Playwright Inspector
```bash
PWDEBUG=1 pytest tests/test_homepage.py::test_that_fails
```
This opens an interactive debugger where you can step through the test.

### 4. Take screenshots
```python
def test_something(page: Page):
    page.goto("http://localhost:3000/")
    page.screenshot(path="debug.png")
    # ... rest of test
```

### 5. Generate trace files
```bash
pytest tests/ --tracing=on
```
Then view at: https://trace.playwright.dev/

## Next Steps

Want to test more advanced features?

- **Test game interactions** - Click buttons, verify score updates
- **Test Socket.IO events** - Verify real-time dart throw handling
- **Test navigation** - Click between pages, verify routing
- **Visual regression testing** - Compare screenshots over time
- **Mobile testing** - Test responsive design with device emulation
- **Cross-browser testing** - Install Firefox/Safari with `playwright install`

## Troubleshooting

### "Server not running" error
Make sure `./run_games.sh` is running in another terminal.

### "Connection refused" errors
Check that the server is on port 3000: `lsof -i :3000`

### Playwright not found
```bash
source venv/bin/activate
pip install playwright pytest-playwright
playwright install chromium
```

### Tests are flaky
- Use Playwright's auto-waiting: `expect(element).to_be_visible()`
- Avoid `time.sleep()` - use proper waits instead
- Make tests independent (don't rely on previous test state)

## Resources

- [Playwright Python Docs](https://playwright.dev/python/)
- [pytest Documentation](https://docs.pytest.org/)
- [Playwright Best Practices](https://playwright.dev/python/docs/best-practices)
- Test examples: `/Users/troyouttram/CODE/DeadEyeGames/tests/README.md`
