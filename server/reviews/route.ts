import express from 'express';
import { Request, Response } from 'express';

interface Review {
  id: number;
  platformId: number;
  userId: number;
  rating: number;
  comment: string;
  validated: boolean;
}

const router = express.Router();

let reviews: Review[] = [];

// Create new review
router.post('/', (req: Request, res: Response) => {
  const { platformId, userId, rating, comment } = req.body;
  const newReview: Review = {
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

// Get all reviews
router.get('/', (req: Request, res: Response) => {
  res.status(200).json(reviews);
});

// Update review
router.put('/:reviewId', (req: Request, res: Response) => {
  const review = reviews.find((r) => r.id == req.params.reviewId);
  if (review) {
    Object.assign(review, req.body);
    res.status(200).json(review);
  } else {
    res.status(404).json({ message: "Review not found" });
  }
});

// Delete review
router.delete('/:reviewId', (req: Request, res: Response) => {
  const reviewIndex = reviews.findIndex((r) => r.id == req.params.reviewId);
  reviewIndex !== -1
    ? (reviews.splice(reviewIndex, 1),
      res.status(200).json({ message: "Review deleted successfully" }))
    : res.status(404).json({ message: "Review not found" });
});

export default router; 