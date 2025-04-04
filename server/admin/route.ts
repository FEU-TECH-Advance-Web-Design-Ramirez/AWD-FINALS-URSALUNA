import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Get leaderboard
router.get('/leaderboard', (req: Request, res: Response) => {
  const platforms = req.app.locals.platforms || [];
  const reviews = req.app.locals.reviews || [];

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

// Get rankings by order
router.get('/rankings/:orderBy', (req: Request, res: Response) => {
  const { orderBy } = req.params;
  const platforms = req.app.locals.platforms || [];
  const reviews = req.app.locals.reviews || [];

  if (orderBy !== "rating" && orderBy !== "popularity") {
    return res.status(400).json({
      message: "Invalid orderBy parameter. Use 'rating' or 'popularity'.",
    });
  }

  const platformsWithMetrics = platforms.map((platform) => {
    const platformReviews = reviews.filter(
      (review) => parseInt(review.platformId) === platform.id && review.validated === true
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

  const sortedPlatforms = platformsWithMetrics.sort((a, b) => {
    if (orderBy === "rating") {
      return b.averageRating - a.averageRating;
    } else {
      return b.popularity - a.popularity;
    }
  });

  res.status(200).json(sortedPlatforms);
});

export default router; 