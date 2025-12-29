import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { vpa } = req.body;

    const response = await fetch(
      "https://api.razorpay.com/v1/payments/validate/vpa",
      {
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
          vpa,
        }),
      }
    );

    const data = await response.json();
    console.log("VPA Validation Response:", data);

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
