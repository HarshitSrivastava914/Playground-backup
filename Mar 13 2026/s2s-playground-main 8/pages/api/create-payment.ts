import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const {
      order_id,
      email,
      contact,
      method,
      card,
      upi,
      customer_id,
      amount,
      bank,
      bank_account,
      auth_type,
      wallet,
      product,
    } = req.body;

    const razorpayPayload: any = {
      amount,
      currency: process.env.currency,
      order_id,
      method,
      email,
      contact,
      card,
      upi,
      customer_id,
      ...(product !== "one-time" && {
        recurring: true,
        save: 1,
      }),
      ...(method === "emandate" && {
        bank,
        auth_type,
        bank_account,
      }),
      ...(method === "wallet" && {
        wallet,
      }),
      ...(method === "fpx" && {
        bank,
      }),
    };

    /* --------------------------------------------------
       PRINT COMPLETE CURL REQUEST (FOR DEBUGGING)
    --------------------------------------------------- */

    const curlCommand = `
curl -X POST "https://api.razorpay.com/v1/payments/create/json" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Basic ${Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64")}" \\
  -d '${JSON.stringify(razorpayPayload, null, 2)}'
`;

    console.log("\n===== COPY CURL REQUEST =====\n");
    console.log(curlCommand);
    console.log("\n=============================\n");

    /* -------------------------------------------------- */

    const response = await fetch(
      "https://api.razorpay.com/v1/payments/create/json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
            ).toString("base64"),
        },
        body: JSON.stringify(razorpayPayload),
      }
    );

    const data = await response.json();

    /* ----------- PRINT API RESPONSE ----------- */
    console.log("\n===== RAZORPAY API RESPONSE =====\n");
    console.log(JSON.stringify(data, null, 2));
    console.log("\n=================================\n");
    /* ------------------------------------------ */

    if (!response.ok) {
      console.error("❌ Razorpay Error:", data);
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    console.log("\n===== INTERNAL SERVER ERROR =====\n");
    console.log(err);
    console.log("\n=================================\n");

    console.error("🔥 Internal Server Error:", err);
    return res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }
}
