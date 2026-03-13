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

    /* ----------- PRINT REQUEST DATA ----------- */
    console.log("\n===== QR API REQUEST =====\n");
    console.log("UPI LINK:", upiLink);
    console.log("\n==========================\n");
    /* ----------------------------------------- */

    if (!upiLink) {
      return res.status(400).json({
        success: false,
        error: "No UPI link provided",
      });
    }

    // Generate QR
    const qr = await QRCode.toDataURL(upiLink);

    /* ----------- PRINT API RESPONSE ----------- */
    console.log("\n===== QR API RESPONSE =====\n");
    console.log(
      JSON.stringify(
        {
          success: true,
          qr,
        },
        null,
        2
      )
    );
    console.log("\n===========================\n");
    /* ------------------------------------------ */

    return res.status(200).json({
      success: true,
      qr,
    });
  } catch (error: any) {
    console.error("\n===== QR API ERROR =====\n");
    console.error(error);
    console.error("\n========================\n");

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
