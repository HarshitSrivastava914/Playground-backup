import type { NextApiRequest, NextApiResponse } from "next";
import QRCode from "qrcode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { upiLink } = req.body;

    console.log("Rakshita is sleepyyyyyy ");

    if (!upiLink) {
      return res.status(400).json({
        success: false,
        error: "No UPI link provided",
      });
    }

    // Generate QR
    const qr = await QRCode.toDataURL(upiLink);

    return res.status(200).json({
      success: true,
      qr,
    });
  } catch (error: any) {
    console.error("QR API ERROR:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
