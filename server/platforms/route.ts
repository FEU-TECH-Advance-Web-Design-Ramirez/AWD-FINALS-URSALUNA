import express from 'express';
import { Request, Response } from 'express';

interface Platform {
  id: number;
  name: string;
  website: string;
  languagesOffered: string[];
  description: string;
  submittedBy: string;
  validated?: boolean;
}

const router = express.Router();

let platforms: Platform[] = [];

// Initialize default language learning platforms
const defaultPlatforms: Platform[] = [
  {
    id: 1,
    name: "Duolingo",
    website: "https://www.duolingo.com",
    languagesOffered: ["Spanish", "French", "German", "Italian", "Portuguese", "Japanese", "Korean", "Chinese", "Russian"],
    description: "A free language-learning platform with a gamified approach. Features bite-sized lessons, daily streaks, and a mobile app.",
    submittedBy: "admin",
    validated: true
  },
  {
    id: 2,
    name: "Memrise",
    website: "https://www.memrise.com",
    languagesOffered: ["Spanish", "French", "German", "Japanese", "Korean", "Chinese", "Italian", "Russian", "Portuguese"],
    description: "Uses spaced repetition and memory techniques to help users learn languages effectively. Features video clips of native speakers.",
    submittedBy: "admin",
    validated: true
  },
  {
    id: 3,
    name: "Babbel",
    website: "https://www.babbel.com",
    languagesOffered: ["Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Dutch", "Turkish", "Polish"],
    description: "Focuses on conversation skills with real-world dialogues. Offers structured lessons and speech recognition technology.",
    submittedBy: "admin",
    validated: true
  },
  {
    id: 4,
    name: "Busuu",
    website: "https://www.busuu.com",
    languagesOffered: ["Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Chinese", "Japanese", "Arabic"],
    description: "Combines AI-powered learning with community features. Offers official language certificates and personalized study plans.",
    submittedBy: "admin",
    validated: true
  },
  {
    id: 5,
    name: "Rosetta Stone",
    website: "https://www.rosettastone.com",
    languagesOffered: ["Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese", "Korean", "Arabic"],
    description: "Uses immersive learning techniques with no translations. Focuses on natural language acquisition through visual and audio cues.",
    submittedBy: "admin",
    validated: true
  }
];
platforms.push(...defaultPlatforms);

// Create new platform
router.post('/', (req: Request, res: Response) => {
  const { name, website, languagesOffered, description, submittedBy } = req.body;
  const newPlatform: Platform = {
    id: platforms.length + 1,
    name,
    website,
    languagesOffered,
    description,
    submittedBy,
    validated: false
  };
  platforms.push(newPlatform);
  res.status(201).json(newPlatform);
});

// Get all platforms
router.get('/', (req: Request, res: Response) => {
  res.status(200).json(platforms);
});

// Get platform by ID
router.get('/:id', (req: Request, res: Response) => {
  const platform = platforms.find((p) => p.id == req.params.id);
  platform
    ? res.status(200).json(platform)
    : res.status(404).json({ message: "Platform not found" });
});

// Update platform
router.put('/:id', (req: Request, res: Response) => {
  const platform = platforms.find((p) => p.id == req.params.id);
  if (platform) {
    Object.assign(platform, req.body);
    res.status(200).json(platform);
  } else {
    res.status(404).json({ message: "Platform not found" });
  }
});

// Delete platform
router.delete('/:id', (req: Request, res: Response) => {
  const platformIndex = platforms.findIndex((p) => p.id == req.params.id);
  platformIndex !== -1
    ? (platforms.splice(platformIndex, 1),
      res.status(200).json({ message: "Platform deleted successfully" }))
    : res.status(404).json({ message: "Platform not found" });
});

export default router; 