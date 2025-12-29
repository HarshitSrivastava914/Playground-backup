import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { customer_id, amount, method, frequency } = req.body;
    console.log(customer_id);
    console.log(frequency);

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
          ).toString("base64"),
        // Uncomment if you use sub-accounts
        // ...(process.env.RAZORPAY_ACCOUNT_ID && { "X-Razorpay-Account": process.env.RAZORPAY_ACCOUNT_ID }),
      },
      body: JSON.stringify({
        amount,
        currency: process.env.currency,
        customer_id,
        method: method,
        token: {
          max_amount: 200000,
          frequency,
          // "expire_at": 2709971120
        },
        receipt: "Receipt No. 1",
        notes: {
          notes_key_1: "Tea, Earl Grey, Hot",
          notes_key_2: "Tea, Earl Grey… decaf.",
        },
      }),
    });

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
