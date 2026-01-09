import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;

  if (!keyId) {
    return res.status(500).json({ error: "RAZORPAY_KEY_ID not configured" });
  }

  // IMPORTANT: colon is required after key_id
  const auth = Buffer.from(`${keyId}:`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/methods", {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  console.log("data inside fetch-method.ts", data);

  if (!response.ok) {
    return res.status(response.status).json({
      error: data?.error?.description || "Failed to fetch payment methods",
    });
  }

  return res.status(200).json(data);
}
