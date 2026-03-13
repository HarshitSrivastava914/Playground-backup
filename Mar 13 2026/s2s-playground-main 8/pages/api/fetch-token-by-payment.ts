import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { payment_id } = req.query;
  if (!payment_id || typeof payment_id !== "string") {
    return res.status(400).json({ error: "Missing or invalid payment_id" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;

  if (!keyId) {
    return res.status(500).json({ error: "RAZORPAY_KEY_ID not configured" });
  }

  // IMPORTANT: colon is required after key_id
  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const razorpayUrl = `https://api.razorpay.com/v1/payments/${payment_id}`;

  /* ----------- PRINT CURL REQUEST ----------- */
  const curlCommand = `
curl -X GET "${razorpayUrl}" \\
  -H "Authorization: Basic ${auth}" \\
  -H "Content-Type: application/json"
`;

  console.log("\n===== COPY CURL REQUEST =====\n");
  console.log(curlCommand);
  console.log("\n=============================\n");
  /* ----------------------------------------- */

  const response = await fetch(razorpayUrl, {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  /* ----------- PRINT API RESPONSE ----------- */
  console.log("\n===== RAZORPAY API RESPONSE =====\n");
  console.log(JSON.stringify(data, null, 2));
  console.log("\n=================================\n");
  /* ------------------------------------------ */

  if (!response.ok) {
    return res.status(response.status).json({
      error: data?.error?.description || "Failed to fetch token status",
    });
  }

  return res.status(200).json(data);
}
