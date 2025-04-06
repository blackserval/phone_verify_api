import type { NextApiRequest, NextApiResponse } from 'next';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const API_KEY = process.env.API_KEY || 'API_KEY_EXAMPLE';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key not found in X-API-Key header.' });
  }

  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API Key.' });
  }

  const { numbers, country = 'BR' } = req.body;

  if (!numbers || (!Array.isArray(numbers) && typeof numbers !== 'string')) {
    return res.status(400).json({ error: 'Please provide a number or array in "numbers" field.' });
  }

  const numbersArray = Array.isArray(numbers) ? numbers : [numbers];

  const result = numbersArray.map((rawPhone) => {
    const phoneNumber = parsePhoneNumberFromString(rawPhone, country);

    if (phoneNumber && phoneNumber.isValid()) {
      return {
        original: rawPhone,
        international: phoneNumber.formatInternational(),
        national: phoneNumber.formatNational(),
        e164: phoneNumber.number,
        valid: true,
      };
    } else {
      return {
        original: rawPhone,
        valid: false,
        error: 'Invalid number',
      };
    }
  });

  return res.status(200).json({ result });
}
