import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./users/route";
import platformRoutes from "./platforms/route";
import reviewRoutes from "./reviews/route";
import adminRoutes from "./admin/route";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Initialize app.locals for shared data
app.locals.users = [];
app.locals.platforms = [];
app.locals.reviews = [];

// Mount routes
app.use("/api/LanguageLearner/users", userRoutes);
app.use("/api/LanguageLearner/platforms", platformRoutes);
app.use("/api/LanguageLearner/reviews", reviewRoutes);
app.use("/api/LanguageLearner/admin", adminRoutes);

// Add a test route
app.get("/api/LanguageLearner/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export the Express app
export default app;
