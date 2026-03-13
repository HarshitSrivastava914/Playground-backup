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
      customer_id,
      amount,
      method,
      frequency,
      expire_at,
      max_amount,
      receipt,
      notes,
      recurring_value,
      recurring_type,
      auth_type,
      beneficiary_name,
      account_number,
      account_type,
      ifsc,
    } = req.body;

    const payload = {
      amount,
      currency: process.env.currency,
      ...(customer_id && { customer_id }),
      method: method,
      ...(method === "emandate" && {
        payment_capture: true,
      }),
      token: {
        max_amount,
        frequency,
        expire_at,
        ...(method === "upi" && {
          recurring_value,
          recurring_type,
        }),
        ...(method === "emandate" && {
          auth_type,
          bank_account: {
            beneficiary_name,
            account_number,
            account_type,
            ifsc_code: ifsc,
          },
        }),
      },
      receipt,
      notes,
    };

    /* ----------- cURL LOG ----------- */
    const curlCommand = `
curl -X POST "https://api.razorpay.com/v1/orders" \\
-u "${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}" \\
-H "Content-Type: application/json" \\
-d '${JSON.stringify(payload, null, 2)}'
`;

    console.log("\n===== COPY CURL REQUEST =====\n");
    console.log(curlCommand);
    console.log("\n=============================\n");
    /* -------------------------------- */

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
          ).toString("base64"),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    /* ----------- PRINT API RESPONSE ----------- */
    console.log("\n===== RAZORPAY API RESPONSE =====\n");
    console.log(JSON.stringify(data, null, 2));
    console.log("\n=================================\n");
    /* ------------------------------------------ */

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (err: any) {
    console.log("\n===== INTERNAL SERVER ERROR =====\n");
    console.log(err);
    console.log("\n=================================\n");

    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
