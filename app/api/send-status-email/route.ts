import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("Missing RESEND_API_KEY: Transactional email service is not configured.");

      return NextResponse.json(
        {
          success: false,
          error: "Email service is not configured.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const {
      customer,
      email,
      orderId,
      status,
      courier,
      trackingNumber,
      trackingUrl,
    } = await req.json();

    let title = "";
    let message = "";

    switch (status) {
      case "Confirmed":
        title = "✅ Order Confirmed";
        message =
          "Great news! Your order has been confirmed and will be prepared shortly.";
        break;

      case "Processing":
        title = "📦 Order Processing";
        message =
          "Our team is carefully preparing your order for shipment.";
        break;

      case "Shipped":
        title = "🚚 Your Order Has Been Shipped";
        message = `
          Your package is on the way.<br><br>

          <b>Courier:</b> ${courier || "-"}<br>
          <b>Tracking Number:</b> ${trackingNumber || "-"}<br><br>

          ${
            trackingUrl
              ? `<a href="${trackingUrl}"
              style="
              display:inline-block;
              background:black;
              color:white;
              padding:12px 24px;
              text-decoration:none;
              border-radius:8px;
              ">
                Track Package
              </a>`
              : ""
          }
        `;
        break;

      case "Delivered":
        title = "📦 Order Delivered — EXRONIX";
        message =
          "Your order has been delivered successfully. Thank you for choosing EXRONIX.";
        break;

      default:
        title = `Order Updated — EXRONIX`;
        message = `Your order status has been updated to <b>${status}</b>.`;
    }

    const fromEmail = process.env.EMAIL_FROM || "EXRONIX <orders@exronix.store>";

    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: title,
      html: `
        <div style="max-width:650px;margin:auto;padding:40px;font-family:Arial,sans-serif;background:#ffffff;border-radius:12px;overflow:hidden;">

          <div style="background:#050608;padding:25px;text-align:center;border-bottom:2px solid #1677FF;">
            <h1 style="color:#ffffff;margin:0;letter-spacing:2px;font-size:24px;">
              EXRONIX
            </h1>
            <p style="color:#1677FF;margin-top:6px;font-size:11px;letter-spacing:1px;font-weight:bold;">
              ENGINEERED BEYOND LIMITS
            </p>
          </div>

          <div style="padding:30px;">
            <h2>
              Hi ${customer},
            </h2>

            <p style="font-size:16px;line-height:1.6;">${message}</p>

            <br>

            <div style="text-align:center;">
              <a
                href="${process.env.NEXT_PUBLIC_SITE_URL || "https://www.exronix.store"}/orders/${orderId}"
                style="
                  display:inline-block;
                  background:#1677FF;
                  color:white;
                  padding:14px 28px;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:bold;
                "
              >
                Track Order #${orderId}
              </a>
            </div>

            <br><br>

            <hr style="border:none;border-top:1px solid #eee;">

            <p style="color:#777;font-size:13px;text-align:center;">
              Thank you for trusting EXRONIX — Precision 3D Printing & Engineering.
            </p>
          </div>

        </div>
      `,
    });

    if (sendError) {
      console.error("Failed to send status update email:", sendError);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to send status update email.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Unexpected error in /api/send-status-email:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send status email.",
      },
      {
        status: 500,
      }
    );
  }
}