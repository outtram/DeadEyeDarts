"""
Quick test to verify HEIST CREW game card appears on homepage
"""
import pytest
from playwright.sync_api import Page, expect


def test_heist_crew_card_exists(page: Page):
    """Test that the HEIST CREW game card is visible on the homepage"""
    # Navigate to the homepage
    page.goto("http://localhost:5001/")

    # Take a screenshot for debugging
    page.screenshot(path="homepage_screenshot.png")

    # Look for the heist crew link
    heist_link = page.locator('a[href="/games/heist-crew/heist.html"]')

    # Check if it exists
    print(f"\nHeist link count: {heist_link.count()}")

    if heist_link.count() > 0:
        print("✓ HEIST CREW card found!")
        expect(heist_link).to_be_visible()

        # Get the text content
        text = heist_link.text_content()
        print(f"Card text: {text}")
    else:
        print("✗ HEIST CREW card NOT found")

        # List all game cards we can find
        all_links = page.locator("a.game-card")
        print(f"\nFound {all_links.count()} game cards total:")
        for i in range(all_links.count()):
            card = all_links.nth(i)
            print(f"  - {card.get_attribute('href')}")
