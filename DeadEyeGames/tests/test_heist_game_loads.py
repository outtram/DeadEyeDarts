"""
Test that HEIST CREW game page loads correctly
"""
import pytest
from playwright.sync_api import Page, expect


def test_heist_crew_game_loads(page: Page):
    """Test that the HEIST CREW game page loads successfully"""
    # Navigate to the heist crew game
    page.goto("http://localhost:5001/games/heist-crew/heist.html")

    # Check that the page title is correct
    expect(page).to_have_title("HEIST CREW - DeadEyeGames")

    # Verify the main heading is visible
    main_heading = page.locator("h1")
    expect(main_heading).to_be_visible()

    # Take a screenshot
    page.screenshot(path="heist_game_screenshot.png")

    print("\n✓ HEIST CREW game page loaded successfully!")
