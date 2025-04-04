// src/pages/Home/index.tsx

import WorkoutExtractorPage from "@/components/Workout/workout-extractor";
import WorkoutStravaExtractor from "@/components/Workout/workout-strava-extractor";

const HomePage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <WorkoutExtractorPage />
      <WorkoutStravaExtractor />

    </div>
  );
};

export default HomePage;