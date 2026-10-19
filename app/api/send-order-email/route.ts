import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const {
      customer,
      email,
      orderId,
      total,
      payment,
      address,
      items,
    } = await req.json();

    const itemRows = items
      .map(
        (item: any) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">
              ${item.product_name}
            </td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">
              ${item.quantity}
            </td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">
              NPR ${(item.price * item.quantity).toLocaleString()}
            </td>
          </tr>
        `
      )
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<div style="max-width:650px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;">

<div style="background:#000;padding:40px;text-align:center;">
<h1 style="color:#fff;margin:0;">
ZAYNA STUDIO
</h1>

<p style="color:#ddd;margin-top:10px;">
Wear the Grace
</p>
</div>

<div style="padding:40px;">

<h2>
Hi ${customer},
</h2>

<p>
Thank you for shopping with
<b>Zayna Studio.</b>

Your order has been placed successfully.
</p>

<h3>
Order #${orderId}
</h3>

<table
width="100%"
cellspacing="0"
style="margin-top:25px;border-collapse:collapse;"
>

<tr style="background:#fafafa;">
<th align="left" style="padding:10px;">
Product
</th>

<th style="padding:10px;">
Qty
</th>

<th align="right" style="padding:10px;">
Price
</th>
</tr>

${itemRows}

</table>

<hr style="margin:30px 0;">

<p>

<b>Total:</b>

NPR ${total.toLocaleString()}

</p>

<p>

<b>Payment:</b>

${payment}

</p>

<p>

<b>Shipping Address:</b>

${address}

</p>

<div style="margin-top:40px;text-align:center;">

<a
href="https://www.zaynastudio.store/orders/${orderId}"
style="
display:inline-block;
background:#000;
color:#fff;
padding:14px 30px;
text-decoration:none;
border-radius:8px;
font-weight:bold;
"
>

View Order

</a>

</div>

<p style="margin-top:40px;color:#666;font-size:14px;">
We'll notify you again when your order ships.
</p>

</div>

</div>

</body>
</html>
`;

    await resend.emails.send({
      from: "Zayna Studio <orders@zaynastudio.store>",
      to: email,
      subject: `Your Order #${orderId} is Confirmed 🎉`,
      html,
    });
    await resend.emails.send({
  from: " Zayna Studio <orders@zaynastudio.store>",
  to: "zaynaofficial07@gmail.com", // Change if you use another admin email
  subject: `🛒 New Order #${orderId}`,
  html: `
    <h2>New Order Received</h2>

    <p><b>Customer:</b> ${customer}</p>

    <p><b>Email:</b> ${email}</p>

    <p><b>Payment:</b> ${payment}</p>

    <p><b>Total:</b> NPR ${total.toLocaleString()}</p>

    <p><b>Shipping Address:</b></p>

    <p>${address}</p>

    <hr>

    <h3>Products</h3>

    <ul>
      ${items
        .map(
          (item: any) => `
            <li>
              ${item.product_name}
              ×
              ${item.quantity}
            </li>
          `
        )
        .join("")}
    </ul>

    <br>

    <a
      href="https://www.zaynastudio.store/admin/orders"
      style="
      background:black;
      color:white;
      padding:12px 20px;
      text-decoration:none;
      border-radius:8px;
      "
    >
      Open Admin Dashboard
    </a>
  `,
});

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

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