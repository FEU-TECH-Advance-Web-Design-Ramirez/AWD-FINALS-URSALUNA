import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Sample platform data
  const platforms = [
    {
      id: 1,
      name: "Duolingo",
      description: "Learn languages for free",
      url: "https://www.duolingo.com",
      averageRating: 4.5,
      popularity: 1000
    },
    {
      id: 2,
      name: "Babbel",
      description: "Learn a new language with Babbel",
      url: "https://www.babbel.com",
      averageRating: 4.3,
      popularity: 800
    }
  ];

  res.status(200).json(platforms);
} 