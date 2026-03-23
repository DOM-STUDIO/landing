from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def make_driver(width: int, height: int) -> webdriver.Chrome:
    options = Options()
    options.binary_location = "/usr/lib64/chromium-browser/chromium-browser"
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--hide-scrollbars")
    options.add_argument("--window-size=%d,%d" % (width, height))
    options.add_argument("--force-color-profile=srgb")
    options.add_argument("--font-render-hinting=medium")
    options.add_argument("--enable-font-antialiasing")
    service = Service("/usr/bin/chromedriver")
    driver = webdriver.Chrome(service=service, options=options)
    driver.set_window_size(width, height)
    return driver


def wait_until_ready(driver: webdriver.Chrome) -> None:
    WebDriverWait(driver, 20).until(
        lambda d: d.execute_script("return document.readyState") == "complete"
    )
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "header.site-header"))
    )
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".hero"))
    )
    time.sleep(1.5)


def page_snapshot(driver: webdriver.Chrome, out_dir: Path, path: str, width: int) -> None:
    full_height = driver.execute_script(
        "return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);"
    )
    driver.set_window_size(width, min(int(full_height) + 120, 3600))
    time.sleep(0.5)
    driver.save_screenshot(str(out_dir / path))


def inspect_fonts(driver: webdriver.Chrome) -> dict:
    return driver.execute_script(
        """
        const heading = document.querySelector('.hero__title');
        const bodyStyle = getComputedStyle(document.body).fontFamily;
        const headingStyle = heading ? getComputedStyle(heading).fontFamily : null;
        const fontStatus = Array.from(document.fonts || []).map((font) => ({
          family: font.family,
          status: font.status,
          weight: font.weight,
          style: font.style
        }));
        return {
          bodyFont: bodyStyle,
          headingFont: headingStyle,
          fontStatus
        };
        """
    )


def run_page(base_url: str, out_dir: Path, label: str, path: str, width: int, height: int) -> dict:
    driver = make_driver(width, height)
    try:
        driver.get(f"{base_url}{path}")
        wait_until_ready(driver)
        page_snapshot(driver, out_dir, f"{label}.png", width)
        result = {
            "label": label,
            "url": driver.current_url,
            "lang": driver.execute_script("return document.documentElement.lang"),
            "title": driver.title,
            "fonts": inspect_fonts(driver),
        }

        if label == "et-desktop":
            gallery = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "[data-gallery-item]"))
            )
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", gallery)
            time.sleep(0.6)
            gallery.click()
            WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.CSS_SELECTOR, ".lightbox:not([hidden])"))
            )
            driver.save_screenshot(str(out_dir / "et-lightbox.png"))
            result["lightbox_open"] = True
            close = driver.find_element(By.CSS_SELECTOR, "[data-lightbox-close]")
            close.click()
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".lightbox[hidden]"))
            )

        if label == "et-desktop":
            switch = driver.find_element(By.CSS_SELECTOR, ".lang-switch a[href*='/ru/']")
            switch.click()
            WebDriverWait(driver, 10).until(
                lambda d: d.execute_script("return document.documentElement.lang") == "ru"
            )
            time.sleep(0.8)
            driver.save_screenshot(str(out_dir / "ru-after-switch.png"))
            result["language_switch"] = driver.current_url

        return result
    finally:
        driver.quit()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run a quick visual QA pass against the local DOM STUDIO website."
    )
    parser.add_argument(
        "--base-url",
        default="http://127.0.0.1:8000",
        help="Base URL of the locally served website.",
    )
    parser.add_argument(
        "--out-dir",
        default="/tmp/domstudio-qa",
        help="Directory where screenshots and the JSON report will be written.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    results = []
    scenarios = [
        ("et-mobile", "/et/", 320, 900),
        ("et-tablet", "/et/", 768, 1100),
        ("et-desktop", "/et/", 1440, 1200),
        ("ru-desktop", "/ru/", 1440, 1200),
    ]
    for scenario in scenarios:
        try:
            results.append(run_page(args.base_url, out_dir, *scenario))
        except TimeoutException as exc:
            results.append({"label": scenario[0], "error": f"timeout: {exc}"})

    (out_dir / "report.json").write_text(
        json.dumps(results, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
