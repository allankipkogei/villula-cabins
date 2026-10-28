import logging
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

logger = logging.getLogger(__name__)


def send_verification_email(email, code, purpose='signup'):
    subject = f"Your Staff Admin Verification Code: {code} - Villula Cabins Resort"
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'Villula Cabins Resort <noreply@villula.co.ke>')
    
    action_text = "complete your administrator registration and verify your staff account" if purpose == 'signup' else "verify your staff account sign-in"
    
    text_content = f"""
Welcome to Villula Cabins Resort!

Your 6-digit authentication code is: {code}

Use this code to {action_text}.
This authentication code is valid for 15 minutes.

If you did not request this code, please safely ignore this email.

Warm regards,
Villula Cabins Resort Team
Eldoret, Uasin Gishu County, Kenya
https://villula.co.ke
"""

    html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Verification Code</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8F6F0; margin: 0; padding: 30px 15px; color: #1F2937;">
  <div style="max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
    
    <!-- Header -->
    <div style="background-color: #0E1B13; padding: 28px 24px; text-align: center;">
      <h1 style="color: #FFFFFF; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">V I L L U L A</h1>
      <p style="color: #C9A86A; margin: 6px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px;">Cabins Resort &bull; Eldoret, Kenya</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 28px;">
      <h2 style="margin: 0 0 12px; font-size: 20px; color: #111827; font-weight: 700;">Verify Your Email Address</h2>
      <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #4B5563;">
        Welcome to Villula Cabins Resort. Use the 6-digit authentication code below to {action_text}:
      </p>

      <!-- Code Box -->
      <div style="background-color: #F3F4F6; border: 2px dashed #C9A86A; border-radius: 12px; padding: 18px 24px; text-align: center; margin: 0 0 24px;">
        <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #163323; font-family: monospace;">{code}</span>
        <div style="font-size: 12px; color: #6B7280; margin-top: 6px;">Expires in 15 minutes</div>
      </div>

      <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.5; color: #6B7280;">
        For your security, never share this code with anyone. Resort staff will never ask for your authentication code.
      </p>

      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9CA3AF;">
        If you didn't create an account or request this verification code, you can safely ignore this email.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #FAFAF9; border-top: 1px solid #E5E7EB; padding: 20px 24px; text-align: center; font-size: 12px; color: #9CA3AF;">
      &copy; 2026 Villula Cabins Resort. Scenic Nature Enclave, Eldoret, Kenya.<br />
      Eco-Architectural Stargazing Retreat.
    </div>

  </div>
</body>
</html>
"""

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=[email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        logger.info(f"Verification email sent to {email}")
        print(f"[AUTH CODE SENT] Email: {email} | Code: {code}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {email}: {e}")
        # Always output to console so local development or offline servers never fail
        print(f"[AUTH CODE EMAIL FALLBACK] Email: {email} | Code: {code} | Error sending: {e}")
        return False
