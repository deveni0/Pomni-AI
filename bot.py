"""
Pomni AI - Telegram control bot.

Secrets are read only from environment variables. Never commit a bot token.
The WhatsApp pairing endpoints are provided by the Node.js core API and must
be implemented before /connect and /disconnect can complete a real pairing.
"""
from __future__ import annotations

import logging
import os
import re
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
SUPER_ADMIN_ID_RAW = os.getenv("SUPER_ADMIN_ID", "5539527858").strip()
POMNI_API_URL = os.getenv("POMNI_API_URL", "").strip().rstrip("/")
POMNI_API_SECRET = os.getenv("POMNI_API_SECRET", "").strip()

logging.basicConfig(
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
)
logger = logging.getLogger("pomni.telegram")


def is_super_admin(user_id: int | None) -> bool:
    """Compare Telegram numeric IDs; never trust a username for authorization."""
    try:
        return user_id is not None and user_id == int(SUPER_ADMIN_ID_RAW)
    except ValueError:
        logger.error("SUPER_ADMIN_ID must be a numeric Telegram user ID")
        return False


def api_request(method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    """Call the private Pomni Node API. Pairing codes are never written to logs."""
    if not POMNI_API_URL or not POMNI_API_SECRET:
        raise RuntimeError("POMNI_API_URL and POMNI_API_SECRET are not configured")

    import json

    body = json.dumps(payload or {}).encode("utf-8") if method != "GET" else None
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {POMNI_API_SECRET}",
    }
    if body is not None:
        headers["Content-Type"] = "application/json"

    request = Request(
        f"{POMNI_API_URL}{path}",
        data=body,
        headers=headers,
        method=method,
    )
    try:
        with urlopen(request, timeout=15) as response:
            raw = response.read(1_000_000).decode("utf-8")
            return json.loads(raw) if raw else {}
    except HTTPError as exc:
        # Do not log response bodies: they may contain private pairing data.
        raise RuntimeError(f"Pomni API returned HTTP {exc.code}") from None
    except (URLError, TimeoutError):
        raise RuntimeError("Cannot reach the Pomni API") from None


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    if not user or not update.message:
        return

    admin_note = "\n\nأنت المسؤول الرئيسي." if is_super_admin(user.id) else ""
    await update.message.reply_text(
        "أهلًا بك في Pomni AI 🎪\n"
        "بوت إدارة وربط جلسات واتساب.\n\n"
        "الأوامر المتاحة:\n"
        "/id - عرض Telegram ID الخاص بك\n"
        "/status - حالة خدمة Pomni\n"
        "/connect 201XXXXXXXXX - طلب ربط رقم واتساب\n"
        "/disconnect - فصل جلسة واتساب الخاصة بك\n"
        "/help - المساعدة"
        + admin_note
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message:
        await update.message.reply_text(
            "اكتب رقم واتساب بكود الدولة، أرقام فقط، مثال: "
            "/connect 201012345678\n"
            "لن يتم الربط إلا بعد إدخال رمز الاقتران بنفسك داخل واتساب > الأجهزة المرتبطة.\n"
            "لا تشارك رمز الاقتران مع أي شخص."
        )


async def id_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    if user and update.message:
        role = "المسؤول الرئيسي" if is_super_admin(user.id) else "مستخدم"
        await update.message.reply_text(f"Telegram ID: {user.id}\nالصلاحية: {role}")


async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return
    try:
        data = api_request("GET", "/api/telegram/status")
        state = data.get("status", "unknown")
        await update.message.reply_text(f"حالة خدمة Pomni: {state}")
    except RuntimeError:
        await update.message.reply_text(
            "بوت تيليجرام يعمل، لكن واجهة Pomni Node API غير متصلة أو لم يتم إعدادها بعد."
        )


async def connect_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    message = update.message
    if not user or not message:
        return

    if not context.args:
        await message.reply_text("استخدم الأمر هكذا: /connect 201XXXXXXXXX")
        return

    phone = re.sub(r"[^0-9]", "", context.args[0])
    if not re.fullmatch(r"[1-9][0-9]{9,14}", phone):
        await message.reply_text("رقم غير صحيح. اكتب الرقم بكود الدولة، من غير + أو مسافات.")
        return

    try:
        result = api_request(
            "POST",
            "/api/telegram/connect",
            {"telegram_id": user.id, "phone_number": phone},
        )
        pairing_code = result.get("pairing_code")
        if pairing_code:
            await message.reply_text(
                f"رمز الاقتران الخاص بك: {pairing_code}\n"
                "أدخله بنفسك في واتساب > الأجهزة المرتبطة > ربط جهاز باستخدام رقم الهاتف. "
                "لا ترسله لأي شخص."
            )
        else:
            await message.reply_text(result.get("message", "تم استلام طلب الربط."))
    except RuntimeError as exc:
        logger.warning("Connect request failed: %s", exc)
        await message.reply_text(
            "ميزة الربط لم تكتمل بعد: يلزم تشغيل واجهة Node API وربطها بمدير جلسات واتساب."
        )


async def disconnect_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    message = update.message
    if not user or not message:
        return
    try:
        result = api_request(
            "POST",
            "/api/telegram/disconnect",
            {"telegram_id": user.id},
        )
        await message.reply_text(result.get("message", "تم إرسال طلب فصل الجلسة."))
    except RuntimeError as exc:
        logger.warning("Disconnect request failed: %s", exc)
        await message.reply_text(
            "ميزة الفصل لم تكتمل بعد: واجهة Node API غير متصلة أو غير جاهزة."
        )


async def admin_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    message = update.message
    if not user or not message:
        return
    if not is_super_admin(user.id):
        await message.reply_text("غير مصرح لك باستخدام أوامر المسؤول.")
        return
    await message.reply_text(
        "تم التحقق من Telegram ID الخاص بالمسؤول الرئيسي.\n"
        "أوامر التحكم الإداري ستُفعّل بعد توصيل واجهة الإدارة الآمنة في Node.js."
    )


async def post_init(application: Application) -> None:
    logger.info("Pomni Telegram bot started (polling).")


def main() -> None:
    if not TELEGRAM_BOT_TOKEN:
        raise SystemExit("Missing TELEGRAM_BOT_TOKEN environment variable.")

    try:
        int(SUPER_ADMIN_ID_RAW)
    except ValueError as exc:
        raise SystemExit("SUPER_ADMIN_ID must be a numeric Telegram ID.") from exc

    application = (
        Application.builder()
        .token(TELEGRAM_BOT_TOKEN)
        .post_init(post_init)
        .build()
    )
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("id", id_command))
    application.add_handler(CommandHandler("status", status_command))
    application.add_handler(CommandHandler("connect", connect_command))
    application.add_handler(CommandHandler("disconnect", disconnect_command))
    application.add_handler(CommandHandler("admin", admin_command))

    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
