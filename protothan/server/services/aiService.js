/**
 * Service to analyze surplus food using the Gemini API.
 */

/**
 * Downloads a file from a URL and converts it to base64.
 * @param {string} url - The Cloudinary image URL.
 * @returns {Promise<{base64: string, mimeType: string}>}
 */
async function fetchImageAsBase64(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from Cloudinary: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = response.headers.get("content-type") || "image/jpeg";
    return { base64, mimeType };
  } catch (error) {
    console.error("❌ Error converting image to base64:", error.message);
    throw error;
  }
}

/**
 * Evaluates food item details and image using the Gemini API.
 * @param {object} params - The food details.
 * @returns {Promise<object>} - AI analysis results.
 */
export async function analyzeFoodData({ foodName, category, quantity, storageType, prepTime, imageUrl }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    console.warn("⚠️ GEMINI_API_KEY is not configured. Skipping AI analysis, marking as pending.");
    return {
      aiStatus: "pending",
    };
  }

  try {
    let parts = [];
    
    // 1. Construct prompt
    const promptText = `Analyze this surplus food registry entry and return a structured JSON object.
Food Name: ${foodName || "Surplus Food"}
Provided Category: ${category || "Unknown"}
Quantity: ${quantity || 0} portions/kg
Storage Atmosphere: ${storageType || "Room Temperature"}
Preparation Timestamp: ${prepTime || "Recent"}

The JSON object must contain exactly these properties:
{
  "foodCategory": "string (Cooked Meals, Raw Fruits & Veggies, Dairy Products, Bakery surplus, Packaged / Canned Items, Beverages, or Other)",
  "freshness": "number (estimate of freshness, 0-100)",
  "safeHours": "number (estimated safe consumption duration left in hours)",
  "riskLevel": "string (low, medium, or high)",
  "confidenceScore": "number (AI analysis confidence, 0-100)",
  "urgencyScore": "number (urgency level of pickup, 0-100)",
  "carbonSavingEstimate": "number (estimated carbon offset in kg. Use formula: quantity in kg * 2.5)",
  "suggestedNGOs": ["string (array of matching NGO types, e.g., 'shelter', 'foodbank', 'community', 'orphanage', 'religious')"]
}

Output ONLY valid JSON. Do not write any explanations.`;

    parts.push({ text: promptText });

    // 2. Download and include image if URL exists
    if (imageUrl && imageUrl.startsWith("http")) {
      try {
        const { base64, mimeType } = await fetchImageAsBase64(imageUrl);
        parts.push({
          inlineData: {
            mimeType,
            data: base64,
          },
        });
      } catch (imageErr) {
        console.warn("⚠️ Failed to append image payload to Gemini, proceeding with text-only parameters:", imageErr.message);
      }
    }

    // 3. Post to Gemini generateContent REST Endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API returned status ${response.status}: ${errorBody}`);
    }

    const result = await response.json();
    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      throw new Error("Empty response text from Gemini model candidates");
    }

    const aiData = JSON.parse(responseText.trim());
    console.log("✅ Gemini AI Analysis completed successfully:", aiData);

    return {
      aiStatus: "success",
      freshnessScore: Number(aiData.freshness) || 80,
      trustScore: Number(aiData.confidenceScore) || 85,
      confidenceScore: Number(aiData.confidenceScore) || 85,
      urgencyScore: Number(aiData.urgencyScore) || 50,
      riskLevel: aiData.riskLevel || "low",
      safeUntil: `${aiData.safeHours || 12} hours`,
      carbonSaved: Number(aiData.carbonSavingEstimate) || (Number(quantity) * 2.5 || 5),
      mealsSaved: Math.round(Number(quantity) * 2 || 10), // Approx 2 meals per kg
      suggestedNGOs: aiData.suggestedNGOs || ["foodbank", "shelter"],
      aiAnalysisRaw: aiData,
    };
  } catch (error) {
    console.error("❌ Gemini API request failed:", error.message);
    return {
      aiStatus: "failed",
      aiAnalysisRaw: { error: error.message },
    };
  }
}
