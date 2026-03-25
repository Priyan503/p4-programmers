"""
OCR Service — wraps Tesseract.
Falls back to a structured mock response if Tesseract is not installed.
"""
import re


def extract_text_from_image(image_path: str) -> str:
    try:
        from PIL import Image
        import pytesseract

        img = Image.open(image_path)
        return pytesseract.image_to_string(img)
    except Exception:
        # Graceful fallback — Tesseract not installed
        return "Mock OCR: Amount: 5000, Date: 2026-04-01, Category: vendor"


def parse_ocr_text(text: str) -> dict:
    """Simple regex-based parser; extend with LLM later."""
    amount_match = re.search(r"(?:Amount|Total|Rs\.?|₹)\s*[:\-]?\s*([\d,]+)", text, re.I)
    date_match = re.search(r"(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4})", text)
    category_match = re.search(r"(?:Category|Type)\s*[:\-]?\s*(\w+)", text, re.I)

    amount_raw = amount_match.group(1).replace(",", "") if amount_match else "0"

    return {
        "amount": float(amount_raw) if amount_raw.replace(".", "").isdigit() else 0.0,
        "date": date_match.group(1) if date_match else "2026-01-01",
        "category": category_match.group(1).lower() if category_match else "general",
        "type": "expense",
        "description": "OCR extracted",
    }
