
import { GoogleGenAI, Type } from "@google/genai";
import type { AppInfo, ScanResult, VirusTotalScanResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const appInfoSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: 'The name of the application.' },
        version: { type: Type.STRING, description: 'A realistic version number, e.g., 3.14.2' },
        description: { type: Type.STRING, description: 'A short, one-sentence description of the app.' },
        category: { type: Type.STRING, description: 'The primary category, e.g., Social, Productivity, Games, Utilities.' },
        iconUrl: { type: Type.STRING, description: 'A placeholder image URL from picsum.photos, e.g., https://picsum.photos/200' },
      },
      required: ['name', 'version', 'description', 'category', 'iconUrl']
    }
};

export const generateInitialApps = async (): Promise<AppInfo[]> => {
  const prompt = `Generate a list of 12 popular and diverse fictional iOS apps that could exist. Provide a name, version, description, category, and an icon URL from picsum.photos for each. Ensure variety in categories.`;
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: appInfoSchema,
        },
    });
    
    const jsonText = response.text.trim();
    const apps = JSON.parse(jsonText) as AppInfo[];
    return apps;

  } catch (error) {
    console.error("Error generating initial apps:", error);
    throw new Error("Failed to fetch app data from Gemini API.");
  }
};


const scanResultSchema = {
    type: Type.OBJECT,
    properties: {
      status: {
        type: Type.STRING,
        enum: ['Clean', 'Warning'],
        description: 'The final safety status of the scan.'
      },
      details: {
        type: Type.ARRAY,
        description: 'A list of checks performed during the scan.',
        items: {
          type: Type.OBJECT,
          properties: {
            check: { type: Type.STRING, description: 'The name of the security check performed.' },
            result: {
              type: Type.STRING,
              enum: ['Passed', 'Failed', 'Warning', 'Not applicable'],
              description: 'The result of this specific check.'
            },
            details: { type: Type.STRING, description: 'A brief explanation of the check and its findings.' },
          },
          required: ['check', 'result', 'details']
        }
      }
    },
    required: ['status', 'details']
};


export const generateScanResult = async (appName: string): Promise<ScanResult> => {
    const prompt = `Simulate a detailed virus scan report for a fictional iOS IPA file named '${appName}'. The report should include a final status ('Clean' or 'Warning'), and a list of 4 to 6 detailed checks performed with individual results (e.g., 'Signature Verification', 'Malware Scan (Heuristics)', 'Permission Analysis', 'Network Traffic Analysis'). Randomly decide if the app should have a 'Warning' status (about a 25% chance). If there is a warning, make it plausible, like 'Unusual network activity detected' or 'Requests excessive permissions for its category'. Provide the response in the specified JSON format.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: scanResultSchema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as ScanResult;
        return result;

    } catch (error) {
        console.error(`Error generating scan result for ${appName}:`, error);
        throw new Error("Failed to generate scan result from Gemini API.");
    }
};

const virusTotalScanResultSchema = {
    type: Type.OBJECT,
    properties: {
        status: { type: Type.STRING, enum: ['Clean', 'Infected'] },
        positives: { type: Type.INTEGER, description: "Number of engines that detected a threat." },
        total: { type: Type.INTEGER, description: "Total number of engines in the report." },
        details: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    engine: { type: Type.STRING, description: "Name of the fictional antivirus engine." },
                    result: { type: Type.STRING, enum: ['clean', 'detected'] },
                    threat_name: { type: Type.STRING, description: "Name of the detected threat, or null if clean." },
                },
                required: ['engine', 'result', 'threat_name']
            }
        }
    },
    required: ['status', 'positives', 'total', 'details']
};

export const generateVirusTotalScanResult = async (fileName: string): Promise<VirusTotalScanResult> => {
    const prompt = `
        Simulate a VirusTotal scan report for an iOS IPA file named '${fileName}'.
        The final status should be 'Clean' or 'Infected'. Give it a 20% chance of being 'Infected'.
        
        The report must include:
        1. A 'status': 'Clean' or 'Infected'.
        2. A 'positives' count: 0 if clean, between 1 and 3 if infected.
        3. A 'total' count: Should be exactly 15.
        4. A 'details' array with exactly 15 fictional antivirus engine results.
        
        Engine names should be creative (e.g., 'BitGuardian', 'Cybereason', 'iSecure', 'AvastPro', 'Malwarebytes Mobile').
        If the status is 'Infected', the 'positives' number of engines must have a result of 'detected' and a plausible iOS malware threat name (e.g., 'Adware.iOS.Generic', 'Spyware.PegasusVariant', 'Trojan.Clicker.iOS'). All other engines must have a result of 'clean' and a threat_name of null.
        If the status is 'Clean', all 15 engines must have a result of 'clean' and a threat_name of null.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: virusTotalScanResultSchema,
            },
        });

        const jsonText = response.text.trim();
        // The response might contain nulls as strings "null", so we replace them before parsing
        const cleanedJsonText = jsonText.replace(/"null"/g, 'null');
        const result = JSON.parse(cleanedJsonText) as VirusTotalScanResult;
        return result;

    } catch (error) {
        console.error(`Error generating VirusTotal scan result for ${fileName}:`, error);
        throw new Error("Failed to generate VirusTotal scan result from Gemini API.");
    }
};
