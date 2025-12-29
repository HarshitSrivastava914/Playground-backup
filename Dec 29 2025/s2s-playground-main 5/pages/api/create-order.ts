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
    } = req.body;

    console.log(customer_id);
    console.log(frequency);

    /* ----------- cURL LOG (DEBUG ONLY) ----------- */
    const curlCommand = `
curl -X POST https://api.razorpay.com/v1/orders \\
  -u ${process.env.RAZORPAY_KEY_ID}:****** \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(
    {
      amount,
      currency: process.env.currency,
      customer_id,
      method,
      token: {
        max_amount,
        frequency,
        expire_at,
      },
      receipt,
      notes,
    },
    null,
    2
  )}'
`;
    console.log("Razorpay Order Create cURL:");
    console.log(curlCommand);
    /* ------------------------------------------- */

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
          ).toString("base64"),
        // ...(process.env.RAZORPAY_ACCOUNT_ID && {
        //   "X-Razorpay-Account": process.env.RAZORPAY_ACCOUNT_ID,
        // }),
      },
      body: JSON.stringify({
        amount,
        currency: process.env.currency,
        customer_id,
        method: method,
        token: {
          max_amount,
          frequency,
          expire_at,
          ...(method === "upi" && {
            recurring_value,
            recurring_type,
          }),
        },
        receipt,
        notes,
      }),
    });
    console.log(
      "Order Creation Request Body:",
      method,
      recurring_type,
      recurring_value
    );

    const data = await response.json();
    console.log("Razorpay Order Creation Response:", data);

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
