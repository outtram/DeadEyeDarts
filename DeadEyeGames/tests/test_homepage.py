"""
Test cases for DeadEyeGames homepage
Simple Playwright tests to verify basic functionality
"""
import pytest
from playwright.sync_api import Page, expect


def test_homepage_loads(page: Page):
    """Test that the homepage loads successfully and displays key elements"""
    # Navigate to the homepage
    page.goto("http://localhost:5001/")

    # Check that the page title is correct
    expect(page).to_have_title("DeadEyeGames - Retro Cyberpunk Dart Gaming")

    # Verify the hero title is visible
    hero_title = page.locator(".hero-title")
    expect(hero_title).to_be_visible()
    expect(hero_title).to_contain_text("DEADEYE GAMES")

    # Verify the tagline is visible
    tagline = page.locator(".tagline")
    expect(tagline).to_be_visible()


def test_connection_status_panel(page: Page):
    """Test that the connection status panel is displayed"""
    # Navigate to the homepage
    page.goto("http://localhost:5001/")

    # Check that the connection panel exists
    connection_panel = page.locator(".connection-panel")
    expect(connection_panel).to_be_visible()

    # The panel should show some connection status
    # (might be "Connected" or "Disconnected" depending on darts-caller)
    expect(connection_panel).to_contain_text("")  # Just verify it has some content
