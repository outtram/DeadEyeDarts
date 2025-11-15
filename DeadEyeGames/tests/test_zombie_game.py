"""
Test cases for Zombie Slayer game
Simple Playwright tests to verify game page loads and displays correctly
"""
import pytest
from playwright.sync_api import Page, expect


def test_zombie_game_loads(page: Page):
    """Test that the Zombie Slayer game page loads successfully"""
    # Navigate to the zombie game
    page.goto("http://localhost:5001/games/zombie-slayer/zombie.html")

    # Check that the page title is correct
    expect(page).to_have_title("Zombie Slayer - DeadEyeGames")

    # Verify the game header is visible
    game_header = page.locator(".game-header h1")
    expect(game_header).to_be_visible()
    expect(game_header).to_contain_text("ZOMBIE SLAYER")


def test_zombie_game_stats_display(page: Page):
    """Test that the game stats panel displays correctly with initial values"""
    # Navigate to the zombie game
    page.goto("http://localhost:5001/games/zombie-slayer/zombie.html")

    # Check that the stats panel is visible
    stats_panel = page.locator(".stats-panel")
    expect(stats_panel).to_be_visible()

    # Verify score starts at 0
    score = page.locator("#score")
    expect(score).to_be_visible()
    expect(score).to_have_text("0")

    # Verify kills starts at 0
    kills = page.locator("#kills")
    expect(kills).to_be_visible()
    expect(kills).to_have_text("0")

    # Verify misses display
    misses = page.locator("#misses")
    expect(misses).to_be_visible()
    expect(misses).to_contain_text("0/3")  # Starts at 0 out of 3 misses allowed

    # Verify the back to home button exists
    back_button = page.locator(".back-btn")
    expect(back_button).to_be_visible()
    expect(back_button).to_contain_text("Back to Home")
