import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
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
        title = "❤️ Order Delivered";
        message =
          "Your order has been delivered successfully. Thank you for choosing Zayna Studio.";
        break;

      default:
        title = `Order Updated`;
        message = `Your order status has been updated to <b>${status}</b>.`;
    }

    await resend.emails.send({
      from: "Zayna Studio <orders@zaynastudio.store>",
      to: email,
      subject: title,
      html: `
        <div style="max-width:650px;margin:auto;padding:40px;font-family:Arial">

          <h1 style="text-align:center;">
            ZAYNA STUDIO
          </h1>

          <h2>
            Hi ${customer},
          </h2>

          <p>${message}</p>

          <br>

          <a
            href="https://www.zaynastudio.store/orders/${orderId}"
            style="
              display:inline-block;
              background:black;
              color:white;
              padding:14px 24px;
              text-decoration:none;
              border-radius:8px;
            "
          >
            View Order
          </a>

          <br><br>

          <p>
            Order #${orderId}
          </p>

          <hr>

          <p style="color:#777">
            Thank you for shopping with Zayna Studio.
          </p>

        </div>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}