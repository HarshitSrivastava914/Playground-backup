import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { order_id, email, contact, method, card, upi, customer_id, amount } =
      req.body;
    console.log("printing method inside api", method);
    console.log(req.body);
    console.log("starting API call");
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
          // Uncomment if you use sub-accounts
          // ...(process.env.RAZORPAY_ACCOUNT_ID && { "X-Razorpay-Account": process.env.RAZORPAY_ACCOUNT_ID }),
        },
        body: JSON.stringify({
          amount,
          currency: process.env.currency,
          order_id,
          method,
          email,
          contact,
          card,
          upi,
          recurring: "1",
          customer_id,
        }),
      }
    );
    console.log("After API call");
    //console.log(upi.vpa);

    const data = await response.json();

    if (!response.ok) {
      console.log("Inside response ok");
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
    console.log(req.body);
    console.log("Razorpay Payment Creation Response:", data);
    console.log("Inside try block of create-payment.ts");
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
    console.log("Inside catch block of create-payment.ts");
  }
}
