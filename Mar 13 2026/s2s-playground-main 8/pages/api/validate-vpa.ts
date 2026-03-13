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

    const auth = Buffer.from(
      `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString("base64");

    const payload = {
      vpa,
    };

    const razorpayUrl = "https://api.razorpay.com/v1/payments/validate/vpa";

    /* ----------- PRINT CURL REQUEST ----------- */
    const curlCommand = `
curl -X POST "${razorpayUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Basic ${auth}" \\
  -d '${JSON.stringify(payload, null, 2)}'
`;

    console.log("\n===== COPY CURL REQUEST =====\n");
    console.log(curlCommand);
    console.log("\n=============================\n");
    /* ----------------------------------------- */

    const response = await fetch(razorpayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + auth,
        // ...(process.env.RAZORPAY_ACCOUNT_ID && { "X-Razorpay-Account": process.env.RAZORPAY_ACCOUNT_ID }),
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
    console.error("\n===== VPA VALIDATION ERROR =====\n");
    console.error(err);
    console.error("\n================================\n");

    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
