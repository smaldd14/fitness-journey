// src/pages/Home/index.tsx

import { useState } from "react";
import WorkoutExtractorPage from "@/components/Workout/workout-extractor";
import WorkoutStravaExtractor from "@/components/Workout/workout-strava-extractor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("workout-extractor");

  // Show tabs on mobile, side-by-side on desktop
  return (
    <div className="w-full max-w-full py-6">
      {/* Mobile View (Tab Interface) */}
      <div className="md:hidden w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Workout Tools</h1>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="workout-extractor">Preview Only</TabsTrigger>
            <TabsTrigger value="workout-strava">Post to Strava</TabsTrigger>
          </TabsList>
          <TabsContent value="workout-extractor" className="mt-4 px-2">
            <div className="scale-100 transform-origin-top">
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                <h3 className="font-medium text-blue-800">Preview Workout Data</h3>
                <p className="text-blue-700 text-sm">This tool extracts workout data from your Google Sheet for preview only.</p>
              </div>
              <WorkoutExtractorPage />
            </div>
          </TabsContent>
          <TabsContent value="workout-strava" className="mt-4 px-2">
            <div className="scale-100 transform-origin-top">
              <div className="bg-orange-50 rounded-lg p-4 mb-4 border border-orange-200">
                <h3 className="font-medium text-orange-800">Post to Strava</h3>
                <p className="text-orange-700 text-sm">This tool extracts workout data and immediately posts it to Strava.</p>
              </div>
              <WorkoutStravaExtractor />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop View (Side-by-side) */}
      <div className="hidden md:block">
        <h1 className="text-3xl font-bold mb-8 text-center">Workout Tools</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Preview Workout Data</h2>
            <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
              <p className="text-blue-700">This tool extracts workout data from your Google Sheet but does not post to Strava. Use this to preview what will be extracted.</p>
            </div>
            <WorkoutExtractorPage />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Extract & Post to Strava</h2>
            <div className="bg-orange-50 rounded-lg p-4 mb-4 border border-orange-200">
              <p className="text-orange-700">This tool extracts workout data and immediately posts it to Strava in one step.</p>
            </div>
            <WorkoutStravaExtractor />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;