import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { name, email, contact } = req.body;

    const response = await fetch("https://api.razorpay.com/v1/customers", {
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
        name,
        email,
        contact,
        fail_existing: "0",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
