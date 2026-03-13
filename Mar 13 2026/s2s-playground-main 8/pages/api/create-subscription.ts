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
      plan_id,
      total_count,
      quantity,
      customer_notify,
      start_at,
      expire_by,
      addons,
      notes,
    } = req.body;

    const payload = {
      plan_id,
      total_count,
      quantity,
      customer_notify,
      start_at,
      expire_by,
      addons,
      notes,
    };

    /* ----------- PRINT CURL REQUEST ----------- */
    const curlCommand = `
curl -X POST "https://api.razorpay.com/v1/subscriptions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Basic ${Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64")}" \\
  -d '${JSON.stringify(payload, null, 2)}'
`;

    console.log("\n===== COPY CURL REQUEST =====\n");
    console.log(curlCommand);
    console.log("\n=============================\n");
    /* ------------------------------------------ */

    const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
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
