"""
Sendbyte Africa Transactional Email Service
All email templates for Musk Capital platform.
Set SENDBYTE_API_KEY in your .env to enable sending.
"""

import os
import requests
from datetime import datetime

SENDBYTE_API_KEY = os.getenv('SENDBYTE_API_KEY', os.getenv('BREVO_API_KEY', ''))
SENDBYTE_API_URL = 'https://api.sendbyte.africa/v1/emails'
ADMIN_EMAIL      = 'muskcapital7@gmail.com'
FROM_EMAIL       = os.getenv('MAIL_FROM', 'muskcapital7@gmail.com')
FROM_NAME        = 'Musk Capital'
PLATFORM_URL     = os.getenv('PLATFORM_URL', 'http://localhost:5173')


def send_email(to_email: str, to_name: str, subject: str, html_content: str, attachment_path: str = None) -> bool:
    """
    Send an email using the Sendbyte Africa API.
    Supports optional file attachment (base64 encoded).
    Returns True on success, False on failure.
    """
    api_key = os.getenv('SENDBYTE_API_KEY', SENDBYTE_API_KEY)
    if not api_key:
        print(f'[Email] SENDBYTE_API_KEY not set. Would send to {to_email}: {subject}')
        return False

    payload = {
        'from':    f'{FROM_NAME} <{FROM_EMAIL}>',
        'to':      [to_email],
        'subject': subject,
        'html':    html_content,
    }

    if attachment_path and os.path.exists(attachment_path):
        import base64
        try:
            with open(attachment_path, 'rb') as f:
                encoded = base64.b64encode(f.read()).decode('utf-8')
            filename = os.path.basename(attachment_path)
            payload['attachments'] = [{'content': encoded, 'filename': filename}]
        except Exception as err:
            print(f'[Email] Failed to attach file {attachment_path}: {err}')

    try:
        response = requests.post(
            SENDBYTE_API_URL,
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type':  'application/json',
            },
            json=payload,
            timeout=15,
        )
        if response.status_code in (200, 201):
            print(f'[Email] [SUCCESS] Sent "{subject}" to {to_email} via Sendbyte')
            return True
        else:
            print(f'[Email] [FAILED] ({response.status_code}): {response.text}')
            return False
    except Exception as e:
        print(f'[Email] [ERROR] Exception sending to {to_email}: {e}')
        return False


# ─── Logo HTML (inline, no external image needed) ─────────────────────────────
LOGO_HTML = """
<div style="display:inline-flex;align-items:center;gap:0;font-family:'Segoe UI',Arial,sans-serif;text-decoration:none;">
  <span style="font-size:22px;font-weight:900;letter-spacing:0.08em;color:#FFFFFF;">MUSK</span>
  <span style="font-size:22px;font-weight:900;color:#D4AF37;margin:0 6px;">|</span>
  <span style="font-size:22px;font-weight:900;letter-spacing:0.08em;color:#D4AF37;">CAPITAL</span>
</div>
"""


# ─── Base Layout ──────────────────────────────────────────────────────────────
def _base_layout(content_html: str, preview_text: str = '') -> str:
    year = datetime.now().year
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>Musk Capital</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body {{ margin:0; padding:0; background:#07090D; font-family:'Segoe UI',Helvetica,Arial,sans-serif; }}
    table {{ border-collapse:collapse; }}
    a {{ color:#D4AF37; text-decoration:none; }}
    @media only screen and (max-width:600px) {{
      .container {{ width:100% !important; padding:0 16px !important; }}
      .card {{ padding:28px 20px !important; }}
      .btn {{ width:100% !important; text-align:center; display:block; }}
    }}
  </style>
</head>
<body style="margin:0;padding:0;background:#07090D;">
  <!-- Preview text (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">{preview_text}&nbsp;</div>

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#07090D;min-height:100vh;">
    <tr><td align="center" style="padding:40px 16px;">

      <!-- Container -->
      <table class="container" width="580" cellpadding="0" cellspacing="0" role="presentation" style="width:580px;max-width:100%;">

        <!-- ── Header ── -->
        <tr>
          <td style="background:#0D0F14;border-radius:16px 16px 0 0;border:1px solid #1F2937;border-bottom:none;padding:24px 40px;text-align:center;">
            <a href="{PLATFORM_URL}" style="text-decoration:none;">
              {LOGO_HTML}
            </a>
          </td>
        </tr>

        <!-- ── Gold Divider ── -->
        <tr>
          <td style="background:linear-gradient(90deg,transparent,#D4AF37,transparent);height:2px;border-left:1px solid #1F2937;border-right:1px solid #1F2937;"></td>
        </tr>

        <!-- ── Content Card ── -->
        <tr>
          <td class="card" style="background:#0D0F14;border:1px solid #1F2937;border-top:none;border-bottom:none;padding:40px 40px;">
            {content_html}
          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="background:#080A0F;border:1px solid #1F2937;border-top:none;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:#4B5563;">
              <a href="{PLATFORM_URL}" style="color:#D4AF37;">Home</a> &nbsp;·&nbsp;
              <a href="{PLATFORM_URL}/markets" style="color:#D4AF37;">Markets</a> &nbsp;·&nbsp;
              <a href="{PLATFORM_URL}/support" style="color:#D4AF37;">Support</a> &nbsp;·&nbsp;
              <a href="mailto:{FROM_EMAIL}" style="color:#D4AF37;">Contact</a>
            </p>
            <p style="margin:0 0 6px;font-size:11px;color:#374151;">
              © {year} Musk Capital. All rights reserved.
            </p>
            <p style="margin:0;font-size:10px;color:#374151;">
              This is a transactional email from Musk Capital.<br/>
              Not affiliated with Elon Musk or his companies.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""


# ─── Helper: Gold Button ──────────────────────────────────────────────────────
def _btn(label: str, url: str) -> str:
    return f"""
<table cellpadding="0" cellspacing="0" role="presentation" style="margin:24px auto 0;">
  <tr>
    <td style="background:linear-gradient(135deg,#D4AF37,#F0D060);border-radius:10px;">
      <a class="btn" href="{url}"
         style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;
                color:#000000;text-decoration:none;letter-spacing:0.05em;font-family:'Segoe UI',Arial,sans-serif;">
        {label}
      </a>
    </td>
  </tr>
</table>"""


# ─── Helper: Status Badge ─────────────────────────────────────────────────────
def _badge(text: str, color: str, bg: str) -> str:
    return f"""<span style="display:inline-block;padding:4px 14px;border-radius:99px;
                font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
                color:{color};background:{bg};border:1px solid {color}40;">{text}</span>"""


# ─── Helper: Info Row ─────────────────────────────────────────────────────────
def _info_row(label: str, value: str) -> str:
    return f"""
<tr>
  <td style="padding:8px 0;border-bottom:1px solid #1F2937;">
    <span style="font-size:12px;color:#6B7280;">{label}</span>
  </td>
  <td style="padding:8px 0;border-bottom:1px solid #1F2937;text-align:right;">
    <span style="font-size:13px;font-weight:600;color:#FFFFFF;">{value}</span>
  </td>
</tr>"""


# ══════════════════════════════════════════════════════════════════════════════
#  TEMPLATE 1 — WELCOME / REGISTRATION
# ══════════════════════════════════════════════════════════════════════════════
def welcome_template(user_name: str, username: str) -> str:
    content = f"""
<h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:#FFFFFF;line-height:1.2;">
  Welcome to Musk Capital{', ' + user_name if user_name else ''} 🚀
</h1>
<p style="margin:0 0 24px;font-size:14px;color:#9CA3AF;line-height:1.6;">
  Your account has been created successfully. You're now part of an elite community
  building portfolios around the future of innovation.
</p>

<!-- Account Info Box -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="background:#0A0C11;border:1px solid #1F2937;border-radius:12px;padding:20px;margin-bottom:24px;">
  <tr>
    <td>
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#D4AF37;letter-spacing:0.1em;text-transform:uppercase;">Your Account</p>
      <p style="margin:0;font-size:20px;font-weight:800;color:#FFFFFF;">@{username}</p>
    </td>
  </tr>
</table>

<!-- What's next -->
<p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#FFFFFF;text-transform:uppercase;letter-spacing:0.08em;">
  Get started in 3 steps:
</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  {''.join([f"""
  <tr>
    <td width="36" valign="top" style="padding:0 12px 12px 0;">
      <div style="width:28px;height:28px;border-radius:8px;background:#D4AF3722;border:1px solid #D4AF3740;
                  display:flex;align-items:center;justify-content:center;text-align:center;
                  font-size:12px;font-weight:800;color:#D4AF37;line-height:28px;">{n}</div>
    </td>
    <td valign="top" style="padding-bottom:12px;">
      <p style="margin:0;font-size:13px;font-weight:600;color:#FFFFFF;">{t}</p>
      <p style="margin:2px 0 0;font-size:12px;color:#6B7280;">{d}</p>
    </td>
  </tr>""" for n, t, d in [
    ('1', 'Fund your account', 'Make your first deposit via crypto or gift card.'),
    ('2', 'Choose an investment plan', 'Pick a plan matching your financial goals.'),
    ('3', 'Track your portfolio', 'Monitor your growth with real-time market data.'),
  ]])}
</table>

{_btn('Go to Dashboard', f'{PLATFORM_URL}/dashboard')}

<p style="margin:28px 0 0;font-size:12px;color:#4B5563;text-align:center;line-height:1.6;">
  Questions? Email us at <a href="mailto:{FROM_EMAIL}" style="color:#D4AF37;">{FROM_EMAIL}</a>
</p>
"""
    return _base_layout(content, f'Welcome to Musk Capital, {user_name}!')


# ══════════════════════════════════════════════════════════════════════════════
#  TEMPLATE 2 — DEPOSIT RECEIVED (PENDING)
# ══════════════════════════════════════════════════════════════════════════════
def deposit_received_template(user_name: str, amount: float, currency: str,
                               tx_hash: str = '', deposit_id: str = '') -> str:
    content = f"""
<div style="text-align:center;margin-bottom:28px;">
  <div style="width:60px;height:60px;background:#D4AF3718;border:1px solid #D4AF3740;
              border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
    <span style="font-size:28px;">📥</span>
  </div>
  {_badge('Pending Review', '#F97316', '#F9731618')}
</div>

<h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#FFFFFF;text-align:center;">
  Deposit Received
</h1>
<p style="margin:0 0 28px;font-size:14px;color:#9CA3AF;text-align:center;line-height:1.6;">
  Hi {user_name}, we've received your deposit and it's currently under review.
  You'll be notified once it's approved — typically within 1–24 hours.
</p>

<!-- Details Table -->
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="background:#0A0C11;border:1px solid #1F2937;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
  <tbody>
    {_info_row('Amount', f'<span style="color:#10B981;font-weight:800;">${amount:,.2f} {currency}</span>')}
    {_info_row('Currency', currency)}
    {_info_row('Status', _badge('Pending', '#F97316', '#F9731618'))}
    {_info_row('Reference ID', f'<span style="font-family:monospace;font-size:11px;color:#9CA3AF;">{deposit_id}</span>') if deposit_id else ''}
    {_info_row('TX Hash', f'<span style="font-family:monospace;font-size:11px;color:#9CA3AF;">{tx_hash[:24]}...</span>') if tx_hash else ''}
    {_info_row('Submitted', datetime.now().strftime('%b %d, %Y %H:%M UTC'))}
  </tbody>
</table>

<div style="background:#F9731608;border:1px solid #F9731630;border-radius:10px;padding:14px 18px;margin-bottom:8px;">
  <p style="margin:0;font-size:12px;color:#FED7AA;line-height:1.6;">
    ⏳ Our team manually reviews all deposits for security. You'll receive a confirmation email once approved.
  </p>
</div>

{_btn('View Deposit Status', f'{PLATFORM_URL}/dashboard/deposit')}
"""
    return _base_layout(content, f'Deposit of ${amount:,.2f} {currency} received — pending review')


# ══════════════════════════════════════════════════════════════════════════════
#  TEMPLATE 3 — DEPOSIT APPROVED
# ══════════════════════════════════════════════════════════════════════════════
def deposit_approved_template(user_name: str, amount: float, currency: str,
                               new_balance: float = 0) -> str:
    content = f"""
<div style="text-align:center;margin-bottom:28px;">
  <div style="width:60px;height:60px;background:#10B98118;border:1px solid #10B98140;
              border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
    <span style="font-size:28px;">✅</span>
  </div>
  {_badge('Approved', '#10B981', '#10B98118')}
</div>

<h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#FFFFFF;text-align:center;">
  Deposit Approved!
</h1>
<p style="margin:0 0 28px;font-size:14px;color:#9CA3AF;text-align:center;line-height:1.6;">
  Great news, {user_name}! Your deposit has been approved and added to your account balance.
</p>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="background:#0A0C11;border:1px solid #1F2937;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
  <tbody>
    {_info_row('Deposit Amount', f'<span style="color:#10B981;font-weight:800;">+${amount:,.2f} {currency}</span>')}
    {_info_row('Status', _badge('Approved', '#10B981', '#10B98118'))}
    {_info_row('New Balance', f'<span style="color:#D4AF37;font-weight:800;">${new_balance:,.2f}</span>') if new_balance else ''}
    {_info_row('Processed', datetime.now().strftime('%b %d, %Y %H:%M UTC'))}
  </tbody>
</table>

<div style="background:#10B98108;border:1px solid #10B98130;border-radius:10px;padding:14px 18px;margin-bottom:8px;">
  <p style="margin:0;font-size:12px;color:#A7F3D0;line-height:1.6;">
    🎉 Your funds are now available. Start exploring investment plans or track live markets!
  </p>
</div>

{_btn('Invest Now', f'{PLATFORM_URL}/dashboard/plans')}
"""
    return _base_layout(content, f'✅ Your ${amount:,.2f} {currency} deposit has been approved!')


# ══════════════════════════════════════════════════════════════════════════════
#  TEMPLATE 4 — DEPOSIT REJECTED
# ══════════════════════════════════════════════════════════════════════════════
def deposit_rejected_template(user_name: str, amount: float, currency: str,
                               reason: str = '') -> str:
    content = f"""
<div style="text-align:center;margin-bottom:28px;">
  <div style="width:60px;height:60px;background:#EF444418;border:1px solid #EF444440;
              border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
    <span style="font-size:28px;">❌</span>
  </div>
  {_badge('Rejected', '#EF4444', '#EF444418')}
</div>

<h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#FFFFFF;text-align:center;">
  Deposit Not Approved
</h1>
<p style="margin:0 0 28px;font-size:14px;color:#9CA3AF;text-align:center;line-height:1.6;">
  Hi {user_name}, unfortunately your deposit could not be processed at this time.
</p>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="background:#0A0C11;border:1px solid #1F2937;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
  <tbody>
    {_info_row('Amount', f'${amount:,.2f} {currency}')}
    {_info_row('Status', _badge('Rejected', '#EF4444', '#EF444418'))}
    {_info_row('Reason', f'<span style="color:#FCA5A5;">{reason}</span>') if reason else ''}
    {_info_row('Date', datetime.now().strftime('%b %d, %Y %H:%M UTC'))}
  </tbody>
</table>

<div style="background:#EF444408;border:1px solid #EF444430;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
  <p style="margin:0;font-size:12px;color:#FCA5A5;line-height:1.6;">
    If you believe this is an error, please contact our support team at
    <a href="mailto:{FROM_EMAIL}" style="color:#D4AF37;">{FROM_EMAIL}</a> with your transaction details.
  </p>
</div>

{_btn('Contact Support', f'{PLATFORM_URL}/support')}
"""
    return _base_layout(content, f'Action required: Your ${amount:,.2f} {currency} deposit was not approved')


# ══════════════════════════════════════════════════════════════════════════════
#  TEMPLATE 5 — WITHDRAWAL RECEIVED (PENDING)
# ══════════════════════════════════════════════════════════════════════════════
def withdrawal_received_template(user_name: str, amount: float, currency: str,
                                  wallet_address: str = '', withdrawal_id: str = '') -> str:
    short_wallet = f'{wallet_address[:10]}...{wallet_address[-6:]}' if len(wallet_address) > 20 else wallet_address
    content = f"""
<div style="text-align:center;margin-bottom:28px;">
  <div style="width:60px;height:60px;background:#8B5CF618;border:1px solid #8B5CF640;
              border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
    <span style="font-size:28px;">📤</span>
  </div>
  {_badge('Processing', '#8B5CF6', '#8B5CF618')}
</div>

<h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#FFFFFF;text-align:center;">
  Withdrawal Request Received
</h1>
<p style="margin:0 0 28px;font-size:14px;color:#9CA3AF;text-align:center;line-height:1.6;">
  Hi {user_name}, we've received your withdrawal request. Our team will review and process it within 24 hours.
</p>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="background:#0A0C11;border:1px solid #1F2937;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
  <tbody>
    {_info_row('Amount', f'<span style="color:#EF4444;font-weight:800;">-${amount:,.2f} {currency}</span>')}
    {_info_row('Currency', currency)}
    {_info_row('Wallet', f'<span style="font-family:monospace;font-size:11px;color:#9CA3AF;">{short_wallet}</span>') if wallet_address else ''}
    {_info_row('Reference ID', f'<span style="font-family:monospace;font-size:11px;">{withdrawal_id}</span>') if withdrawal_id else ''}
    {_info_row('Status', _badge('Pending', '#F97316', '#F9731618'))}
    {_info_row('Submitted', datetime.now().strftime('%b %d, %Y %H:%M UTC'))}
  </tbody>
</table>

<div style="background:#EF444408;border:1px solid #EF444430;border-radius:10px;padding:14px 18px;margin-bottom:8px;">
  <p style="margin:0;font-size:12px;color:#FCA5A5;line-height:1.6;">
    ⚠️ Funds have been deducted from your balance and are held pending approval. If you did not initiate this request, contact support immediately.
  </p>
</div>

{_btn('View Withdrawal Status', f'{PLATFORM_URL}/dashboard/withdraw')}
"""
    return _base_layout(content, f'Withdrawal of ${amount:,.2f} {currency} submitted — pending review')


# ══════════════════════════════════════════════════════════════════════════════
#  TEMPLATE 6 — WITHDRAWAL APPROVED
# ══════════════════════════════════════════════════════════════════════════════
def withdrawal_approved_template(user_name: str, amount: float, currency: str,
                                  wallet_address: str = '') -> str:
    short_wallet = f'{wallet_address[:10]}...{wallet_address[-6:]}' if len(wallet_address) > 20 else wallet_address
    content = f"""
<div style="text-align:center;margin-bottom:28px;">
  <div style="width:60px;height:60px;background:#10B98118;border:1px solid #10B98140;
              border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
    <span style="font-size:28px;">💸</span>
  </div>
  {_badge('Approved & Sent', '#10B981', '#10B98118')}
</div>

<h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#FFFFFF;text-align:center;">
  Withdrawal Approved!
</h1>
<p style="margin:0 0 28px;font-size:14px;color:#9CA3AF;text-align:center;line-height:1.6;">
  Hi {user_name}, your withdrawal has been approved and is being sent to your wallet.
</p>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="background:#0A0C11;border:1px solid #1F2937;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
  <tbody>
    {_info_row('Amount Sent', f'<span style="color:#10B981;font-weight:800;">${amount:,.2f} {currency}</span>')}
    {_info_row('Destination', f'<span style="font-family:monospace;font-size:11px;color:#9CA3AF;">{short_wallet}</span>') if wallet_address else ''}
    {_info_row('Status', _badge('Sent', '#10B981', '#10B98118'))}
    {_info_row('Processed', datetime.now().strftime('%b %d, %Y %H:%M UTC'))}
  </tbody>
</table>

<div style="background:#10B98108;border:1px solid #10B98130;border-radius:10px;padding:14px 18px;margin-bottom:8px;">
  <p style="margin:0;font-size:12px;color:#A7F3D0;line-height:1.6;">
    🚀 Your {currency} is on its way. Network confirmation times vary — typically 10–60 minutes depending on blockchain congestion.
  </p>
</div>

{_btn('View Transactions', f'{PLATFORM_URL}/dashboard/transactions')}
"""
    return _base_layout(content, f'✅ Your ${amount:,.2f} {currency} withdrawal has been sent!')


# ══════════════════════════════════════════════════════════════════════════════
#  TEMPLATE 7 — WITHDRAWAL REJECTED
# ══════════════════════════════════════════════════════════════════════════════
def withdrawal_rejected_template(user_name: str, amount: float, currency: str,
                                  reason: str = '') -> str:
    content = f"""
<div style="text-align:center;margin-bottom:28px;">
  <div style="width:60px;height:60px;background:#EF444418;border:1px solid #EF444440;
              border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
    <span style="font-size:28px;">🔒</span>
  </div>
  {_badge('Rejected', '#EF4444', '#EF444418')}
</div>

<h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#FFFFFF;text-align:center;">
  Withdrawal Not Processed
</h1>
<p style="margin:0 0 28px;font-size:14px;color:#9CA3AF;text-align:center;line-height:1.6;">
  Hi {user_name}, your withdrawal request was not approved. Your funds have been returned to your account balance.
</p>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="background:#0A0C11;border:1px solid #1F2937;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
  <tbody>
    {_info_row('Amount (Refunded)', f'<span style="color:#10B981;font-weight:800;">+${amount:,.2f} {currency}</span>')}
    {_info_row('Status', _badge('Rejected', '#EF4444', '#EF444418'))}
    {_info_row('Reason', f'<span style="color:#FCA5A5;">{reason}</span>') if reason else ''}
    {_info_row('Date', datetime.now().strftime('%b %d, %Y %H:%M UTC'))}
  </tbody>
</table>

<div style="background:#EF444408;border:1px solid #EF444430;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
  <p style="margin:0;font-size:12px;color:#FCA5A5;line-height:1.6;">
    Your funds have been returned to your Musk Capital balance. Contact support if you have questions.
  </p>
</div>

{_btn('Contact Support', f'{PLATFORM_URL}/support')}
"""
    return _base_layout(content, f'Action required: Your ${amount:,.2f} {currency} withdrawal was rejected — funds returned')


# ══════════════════════════════════════════════════════════════════════════════
#  TEMPLATE 8 — GIFT CARD RECEIVED
# ══════════════════════════════════════════════════════════════════════════════
def gift_card_received_template(user_name: str, card_type: str, value: float) -> str:
    content = f"""
<div style="text-align:center;margin-bottom:28px;">
  <div style="width:60px;height:60px;background:#D4AF3718;border:1px solid #D4AF3740;
              border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
    <span style="font-size:28px;">🎁</span>
  </div>
  {_badge('Under Review', '#F97316', '#F9731618')}
</div>

<h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#FFFFFF;text-align:center;">
  Gift Card Received
</h1>
<p style="margin:0 0 28px;font-size:14px;color:#9CA3AF;text-align:center;line-height:1.6;">
  Hi {user_name}, your {card_type} gift card submission has been received and is currently being verified by our team.
</p>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="background:#0A0C11;border:1px solid #1F2937;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
  <tbody>
    {_info_row('Card Type', card_type)}
    {_info_row('Declared Value', f'<span style="color:#D4AF37;font-weight:800;">${value:,.2f}</span>')}
    {_info_row('Status', _badge('Pending', '#F97316', '#F9731618'))}
    {_info_row('Submitted', datetime.now().strftime('%b %d, %Y %H:%M UTC'))}
  </tbody>
</table>

<div style="background:#D4AF3708;border:1px solid #D4AF3730;border-radius:10px;padding:14px 18px;margin-bottom:8px;">
  <p style="margin:0;font-size:12px;color:#FEF3C7;line-height:1.6;">
    ⏳ Gift card verification typically takes 2–48 hours. We'll notify you once it's processed.
  </p>
</div>

{_btn('View Submission', f'{PLATFORM_URL}/dashboard/deposit')}
"""
    return _base_layout(content, f'Your {card_type} gift card of ${value:,.2f} is under review')


# ══════════════════════════════════════════════════════════════════════════════
#  TEMPLATE 9 — PASSWORD RESET
# ══════════════════════════════════════════════════════════════════════════════
def password_reset_template(user_name: str, reset_link: str) -> str:
    content = f"""
<div style="text-align:center;margin-bottom:28px;">
  <div style="width:60px;height:60px;background:#3B82F618;border:1px solid #3B82F640;
              border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
    <span style="font-size:28px;">🔐</span>
  </div>
</div>

<h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#FFFFFF;text-align:center;">
  Reset Your Password
</h1>
<p style="margin:0 0 28px;font-size:14px;color:#9CA3AF;text-align:center;line-height:1.6;">
  Hi {user_name}, we received a request to reset your Musk Capital password.
  Click the button below to set a new password. This link expires in <strong style="color:#FFFFFF;">30 minutes</strong>.
</p>

{_btn('Reset My Password', reset_link)}

<p style="margin:28px 0 0;font-size:12px;color:#4B5563;text-align:center;line-height:1.6;">
  If you did not request a password reset, please ignore this email — your account remains secure.<br/>
  For security concerns, contact us at <a href="mailto:{FROM_EMAIL}" style="color:#D4AF37;">{FROM_EMAIL}</a>.
</p>
"""
    return _base_layout(content, 'Reset your Musk Capital password')


# ══════════════════════════════════════════════════════════════════════════════
#  TEMPLATE 10 — ACCOUNT SUSPENDED
# ══════════════════════════════════════════════════════════════════════════════
def account_suspended_template(user_name: str, reason: str = '') -> str:
    content = f"""
<div style="text-align:center;margin-bottom:28px;">
  <div style="width:60px;height:60px;background:#EF444418;border:1px solid #EF444440;
              border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
    <span style="font-size:28px;">🚫</span>
  </div>
  {_badge('Account Suspended', '#EF4444', '#EF444418')}
</div>

<h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#FFFFFF;text-align:center;">
  Account Suspended
</h1>
<p style="margin:0 0 28px;font-size:14px;color:#9CA3AF;text-align:center;line-height:1.6;">
  Hi {user_name}, your Musk Capital account has been temporarily suspended.
</p>

{f'<div style="background:#EF444408;border:1px solid #EF444430;border-radius:10px;padding:14px 18px;margin-bottom:24px;"><p style="margin:0;font-size:13px;color:#FCA5A5;"><strong>Reason:</strong> {reason}</p></div>' if reason else ''}

<p style="margin:0 0 24px;font-size:13px;color:#9CA3AF;text-align:center;line-height:1.6;">
  If you believe this is a mistake or would like to appeal, please contact our support team directly.
</p>

{_btn('Contact Support', f'{PLATFORM_URL}/support')}
"""
    return _base_layout(content, 'Important: Your Musk Capital account has been suspended')


# ══════════════════════════════════════════════════════════════════════════════
#  SENDBYTE AFRICA API SENDER
# ══════════════════════════════════════════════════════════════════════════════
def send_email(to_email: str, to_name: str, subject: str, html_content: str, attachment_path: str = None) -> bool:
    """
    Send an email using the Sendbyte Africa API.
    Supports optional file attachment (base64 encoded).
    Returns True on success, False on failure.
    """
    api_key = os.getenv('SENDBYTE_API_KEY', SENDBYTE_API_KEY)
    if not api_key:
        print(f'[Email] SENDBYTE_API_KEY not set. Would send to {to_email}: {subject}')
        return False

    sender_email = FROM_EMAIL if 'gmail.com' not in FROM_EMAIL else 'onboarding@try.sendbyte.africa'
    payload = {
        'from':    f'{FROM_NAME} <{sender_email}>',
        'to':      [to_email],
        'subject': subject,
        'html':    html_content,
        'reply_to': FROM_EMAIL,
    }

    if attachment_path and os.path.exists(attachment_path):
        import base64, mimetypes
        try:
            with open(attachment_path, 'rb') as f:
                encoded = base64.b64encode(f.read()).decode('utf-8')
            filename = os.path.basename(attachment_path)
            mime_type, _ = mimetypes.guess_type(attachment_path)
            if not mime_type:
                mime_type = 'application/octet-stream'
            payload['attachments'] = [{
                'content':      encoded,
                'filename':     filename,
                'content_type': mime_type,
            }]
        except Exception as err:
            print(f'[Email] Failed to attach file {attachment_path}: {err}')

    try:
        response = requests.post(
            SENDBYTE_API_URL,
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type':  'application/json',
            },
            json=payload,
            timeout=15,
        )
        if response.status_code in (200, 201):
            print(f'[Email] [SUCCESS] Sent "{subject}" to {to_email} via Sendbyte')
            return True
        else:
            print(f'[Email] [FAILED] ({response.status_code}): {response.text}')
            return False
    except Exception as e:
        print(f'[Email] [ERROR] Exception sending to {to_email}: {e}')
        return False



# ══════════════════════════════════════════════════════════════════════════════
#  CONVENIENCE FUNCTIONS (call these from routes)
# ══════════════════════════════════════════════════════════════════════════════

def email_welcome(user) -> bool:
    html = welcome_template(user.name or user.username, user.username)
    return send_email(user.email, user.name or user.username,
                      '🚀 Welcome to Musk Capital — Your journey begins!', html)


def email_deposit_received(user, deposit) -> bool:
    html = deposit_received_template(
        user.name or user.username, deposit.amount, deposit.currency,
        deposit.tx_hash or '', str(deposit.id)
    )
    return send_email(user.email, user.name or user.username,
                      f'📥 Deposit of ${deposit.amount:,.2f} {deposit.currency} received — pending review', html)


def email_deposit_approved(user, deposit) -> bool:
    html = deposit_approved_template(
        user.name or user.username, deposit.amount, deposit.currency, user.balance
    )
    return send_email(user.email, user.name or user.username,
                      f'✅ Your ${deposit.amount:,.2f} {deposit.currency} deposit has been approved!', html)


def email_deposit_rejected(user, deposit, reason: str = '') -> bool:
    html = deposit_rejected_template(
        user.name or user.username, deposit.amount, deposit.currency, reason
    )
    return send_email(user.email, user.name or user.username,
                      f'❌ Your ${deposit.amount:,.2f} {deposit.currency} deposit was not approved', html)


def email_withdrawal_received(user, withdrawal) -> bool:
    html = withdrawal_received_template(
        user.name or user.username, withdrawal.amount, withdrawal.currency,
        withdrawal.wallet_address or '', str(withdrawal.id)
    )
    return send_email(user.email, user.name or user.username,
                      f'📤 Withdrawal of ${withdrawal.amount:,.2f} {withdrawal.currency} submitted', html)


def email_withdrawal_approved(user, withdrawal) -> bool:
    html = withdrawal_approved_template(
        user.name or user.username, withdrawal.amount, withdrawal.currency,
        withdrawal.wallet_address or ''
    )
    return send_email(user.email, user.name or user.username,
                      f'💸 Your ${withdrawal.amount:,.2f} {withdrawal.currency} withdrawal has been sent!', html)


def email_withdrawal_rejected(user, withdrawal, reason: str = '') -> bool:
    html = withdrawal_rejected_template(
        user.name or user.username, withdrawal.amount, withdrawal.currency, reason
    )
    return send_email(user.email, user.name or user.username,
                      f'🔒 Your withdrawal was rejected — funds returned to your balance', html)


def email_gift_card_received(user, gift_card) -> bool:
    html = gift_card_received_template(
        user.name or user.username, gift_card.card_type, gift_card.value
    )
    return send_email(user.email, user.name or user.username,
                      f'🎁 Your {gift_card.card_type} gift card is under review', html)


def email_gift_card_to_admin(user, gift_card, full_image_path: str = None) -> bool:
    content = f"""
<h1 style="margin:0 0 12px;font-size:22px;font-weight:900;color:#FFFFFF;">
  🚨 New Gift Card Submission Received
</h1>
<p style="margin:0 0 20px;font-size:14px;color:#9CA3AF;line-height:1.6;">
  A user has submitted a new gift card deposit. Details are below:
</p>

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
       style="background:#0A0C11;border:1px solid #1F2937;border-radius:12px;padding:4px 20px;margin-bottom:24px;">
  <tbody>
    {_info_row('User Name', user.name or user.username)}
    {_info_row('User Email', user.email)}
    {_info_row('Card Type', f'<strong style="color:#D4AF37;">{gift_card.card_type}</strong>')}
    {_info_row('Card Value', f'<span style="color:#10B981;font-weight:800;">${gift_card.value:,.2f}</span>')}
    {_info_row('Card Code / Notes', f'<span style="font-family:monospace;font-size:12px;color:#FFFFFF;">{gift_card.card_code or gift_card.notes or "None provided"}</span>')}
    {_info_row('Submission Date', datetime.now().strftime('%b %d, %Y %H:%M UTC'))}
  </tbody>
</table>

<p style="margin:0;font-size:13px;color:#9CA3AF;">
  📎 The gift card image has been attached to this email (if uploaded).
</p>

{_btn('Review in Admin Panel', f'{PLATFORM_URL}/admin/gift-cards')}
"""
    html = _base_layout(content, f'New ${gift_card.value:,.2f} {gift_card.card_type} Gift Card Submission')
    return send_email(
        ADMIN_EMAIL,
        'Musk Capital Admin',
        f'NEW GIFT CARD DEPOSIT: ${gift_card.value:,.2f} {gift_card.card_type} from {user.name or user.username} ({user.email})',
        html,
        attachment_path=full_image_path
    )



def email_password_reset(user, reset_link: str) -> bool:
    html = password_reset_template(user.name or user.username, reset_link)
    return send_email(user.email, user.name or user.username,
                      '🔐 Reset your Musk Capital password', html)


def email_account_suspended(user, reason: str = '') -> bool:
    html = account_suspended_template(user.name or user.username, reason)
    return send_email(user.email, user.name or user.username,
                      '🚫 Your Musk Capital account has been suspended', html)
