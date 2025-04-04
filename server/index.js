import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

let users = [];
let platforms = [];
let reviews = [];

// Initialize admin account
const adminAccount = {
  id: 1,
  email: 'admin',
  password: 'admin123',
  name: 'Administrator',
  role: 'admin'
};
users.push(adminAccount);

// Initialize default language learning platforms
const defaultPlatforms = [
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

// User Account Management
app.post("/api/LanguageLearner/users", (req, res) => {
  const { email, name, password } = req.body;
  const newUser = { id: users.length + 1, email, name, password };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get("/api/LanguageLearner/users", (req, res) =>
  res.status(200).json(users)
);

app.post("/api/LanguageLearner/users/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (user) {
    res.status(200).json({ 
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user'
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

app.put("/api/LanguageLearner/users/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.delete("/api/LanguageLearner/users/:id", (req, res) => {
  const userIndex = users.findIndex((u) => u.id == req.params.id);
  userIndex !== -1
    ? (users.splice(userIndex, 1),
      res.status(200).json({ message: "User banned successfully" }))
    : res.status(404).json({ message: "User not found" });
});

// Language Learning Platform Submission & Management
app.post("/api/LanguageLearner/platforms", (req, res) => {
  const { name, website, languagesOffered, description, submittedBy } =
    req.body;
  const newPlatform = {
    id: platforms.length + 1,
    name,
    website,
    languagesOffered,
    description,
    submittedBy,
  };
  platforms.push(newPlatform);
  res.status(201).json(newPlatform);
});

app.get("/api/LanguageLearner/platforms", (req, res) =>
  res.status(200).json(platforms)
);

app.get("/api/LanguageLearner/platforms/:id", (req, res) => {
  const platform = platforms.find((p) => p.id == req.params.id);
  platform
    ? res.status(200).json(platform)
    : res.status(404).json({ message: "Platform not found" });
});

app.put("/api/LanguageLearner/admin/platforms/:id", (req, res) => {
  const platform = platforms.find((p) => p.id == req.params.id);
  if (platform) {
    Object.assign(platform, req.body);
    res.status(200).json(platform);
  } else {
    res.status(404).json({ message: "Platform not found" });
  }
});

app.delete("/api/LanguageLearner/admin/platforms/:id", (req, res) => {
  const platformIndex = platforms.findIndex((p) => p.id == req.params.id);
  platformIndex !== -1
    ? (platforms.splice(platformIndex, 1),
      res.status(200).json({ message: "Platform deleted successfully" }))
    : res.status(404).json({ message: "Platform not found" });
});

// Reviews & Ratings
app.post("/api/LanguageLearner/reviews", (req, res) => {
  const { platformId, userId, rating, comment } = req.body;
  const newReview = {
    id: reviews.length + 1,
    platformId,
    userId,
    rating,
    comment,
    validated: false
  };
  reviews.push(newReview);
  res.status(201).json(newReview);
});

app.get("/api/LanguageLearner/reviews", (req, res) => {
  res.status(200).json(reviews);
});

app.put("/api/LanguageLearner/reviews/:reviewId", (req, res) => {
  const review = reviews.find((r) => r.id == req.params.reviewId);
  if (review) {
    Object.assign(review, req.body);
    res.status(200).json(review);
  } else {
    res.status(404).json({ message: "Review not found" });
  }
});

app.delete("/api/LanguageLearner/reviews/:reviewId", (req, res) => {
  const reviewIndex = reviews.findIndex((r) => r.id == req.params.reviewId);
  reviewIndex !== -1
    ? (reviews.splice(reviewIndex, 1),
      res.status(200).json({ message: "Review deleted successfully" }))
    : res.status(404).json({ message: "Review not found" });
});

// Ranking & Sorting
app.get("/api/LanguageLearner/admin-rankings-page/leaderboard", (req, res) => {
  const platformsWithMetrics = platforms.map((platform) => {
    const platformReviews = reviews.filter(
      (review) => review.platformId === platform.id.toString() && review.validated === true
    );
    const averageRating = platformReviews.length
      ? platformReviews.reduce(
          (sum, review) => sum + parseInt(review.rating),
          0
        ) / platformReviews.length
      : 0;
    const popularity = platformReviews.length;
    return {
      ...platform,
      averageRating,
      popularity,
    };
  });

  const sortedPlatforms = platformsWithMetrics.sort(
    (a, b) => b.averageRating - a.averageRating
  );
  res.status(200).json(sortedPlatforms);
});

app.get("/api/LanguageLearner/admin-rankings-page/:orderBy", (req, res) => {
  const { orderBy } = req.params;

  if (orderBy !== "rating" && orderBy !== "popularity") {
    return res.status(400).json({
      message: "Invalid orderBy parameter. Use 'rating' or 'popularity'.",
    });
  }

  // Default values map
  const defaultValues = {
    "Duolingo": { rating: 4.5, popularity: 1000 },
    "Memrise": { rating: 4.3, popularity: 800 },
    "Babbel": { rating: 4.2, popularity: 50 },
    "Busuu": { rating: 4.6, popularity: 400 },
    "Rosetta Stone": { rating: 3.8, popularity: 20 }
  };

  const platformsWithMetrics = platforms.map((platform) => {
    const platformReviews = reviews.filter(
      (review) => parseInt(review.platformId) === platform.id && review.validated === true
    );
    
    // Get default values if they exist
    const defaultValue = defaultValues[platform.name];
    
    if (defaultValue) {
      // For platforms with default values
      if (platformReviews.length > 0) {
        // Calculate weighted average: (default_rating * default_popularity + sum_of_new_ratings) / (default_popularity + number_of_new_reviews)
        const sumOfNewRatings = platformReviews.reduce((sum, review) => sum + parseInt(review.rating), 0);
        const totalRating = (defaultValue.rating * defaultValue.popularity) + sumOfNewRatings;
        const totalCount = defaultValue.popularity + platformReviews.length;
        const weightedAverageRating = totalRating / totalCount;
        
        return {
          ...platform,
          averageRating: parseFloat(weightedAverageRating.toFixed(1)),
          popularity: defaultValue.popularity + platformReviews.length
        };
      } else {
        // If no new reviews, use default values
        return {
          ...platform,
          averageRating: defaultValue.rating,
          popularity: defaultValue.popularity
        };
      }
    } else {
      // For new platforms without default values
      const averageRating = platformReviews.length
        ? platformReviews.reduce((sum, review) => sum + parseInt(review.rating), 0) / platformReviews.length
        : 0;
      
      return {
        ...platform,
        averageRating: parseFloat(averageRating.toFixed(1)),
        popularity: platformReviews.length
      };
    }
  });

  const sortedPlatforms = platformsWithMetrics.sort((a, b) => {
    if (orderBy === "rating") {
      if (b.averageRating === a.averageRating) {
        return b.popularity - a.popularity;
      }
      return b.averageRating - a.averageRating;
    } else {
      if (b.popularity === a.popularity) {
        return b.averageRating - a.averageRating;
      }
      return b.popularity - a.popularity;
    }
  });

  res.status(200).json(sortedPlatforms);
});

// Admin Validation
app.post("/api/LanguageLearner/admin/platforms/:id/validate", (req, res) => {
  const platform = platforms.find((p) => p.id == req.params.id);
  platform
    ? ((platform.validated = true),
      res.status(200).json({ message: "Platform validated successfully" }))
    : res.status(404).json({ message: "Platform not found" });
});

app.post("/api/LanguageLearner/admin/reviews/:id/validate", (req, res) => {
  const review = reviews.find((r) => r.id == req.params.id);
  review
    ? ((review.validated = true),
      res.status(200).json({ message: "Review validated successfully" }))
    : res.status(404).json({ message: "Review not found" });
});

app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);
