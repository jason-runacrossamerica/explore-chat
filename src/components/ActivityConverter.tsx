'use client';

import { useState, useEffect } from 'react';
import { Activity, ConversionResult } from '../types/activity';

export default function ActivityConverter() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [duration, setDuration] = useState<number>(20);
  const [result, setResult] = useState<ConversionResult>({ miles: 0, kilometers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data: Activity[] = await response.json();
        setActivities(data);
        
        // Set random default activity
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setSelectedActivity(data[randomIndex].id);
        }
      } catch (err) {
        setError('Failed to load activities');
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Calculate distance when activity or duration changes
  useEffect(() => {
    if (selectedActivity && duration > 0) {
      const activity = activities.find(a => a.id === selectedActivity);
      if (activity) {
        const miles = duration / activity.minutesPerMile;
        const kilometers = miles * 1.609344;
        setResult({
          miles: parseFloat(miles.toFixed(2)),
          kilometers: parseFloat(kilometers.toFixed(2))
        });
      }
    } else {
      setResult({ miles: 0, kilometers: 0 });
    }
  }, [selectedActivity, duration, activities]);

  const copyToClipboard = async (value: number) => {
    try {
      await navigator.clipboard.writeText(value.toString());
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-red-500 mb-4">
        Distance estimator
      </h1>
      
      <p className="text-gray-700 mb-6 text-center">
        Estimate how far you moved for any activities you forgot to track, or for movement that&apos;s
        not inherently distance-based (e.g. Yard Work).
        <a href="#more" className="text-blue-600 hover:underline ml-1">More info</a>
      </p>

      <div className="space-y-6">
        {/* Activity Selection */}
        <div>
          <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-2">
            What activity did you do?
          </label>
          <select
            id="activity"
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an activity</option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Input */}
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            How long did you move?
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="duration"
              type="number"
              min="0"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value) || 0)}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter duration"
            />
            <span className="text-lg font-medium text-gray-700">minutes</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Distance estimate to record
          </h2>
          
          {/* Miles */}
          <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-md">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-800">
                {result.miles}
              </span>
              <span className="text-lg text-gray-600">miles</span>
            </div>
            <button
              onClick={() => copyToClipboard(result.miles)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Copy distance
            </button>
          </div>

          {/* Kilometers */}
          <div className="flex items-center justify-between p-4 bg-white rounded-md">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-800">
                {result.kilometers}
              </span>
              <span className="text-lg text-gray-600">kilometers</span>
            </div>
            <button
              onClick={() => copyToClipboard(result.kilometers)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Copy distance
            </button>
          </div>
        </div>

        {/* Feedback Button */}
        <div className="text-center">
          <button
            onClick={() => window.open('https://forms.office.com/r/QwnUwyf6sL', '_blank')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Share feedback on the estimator
          </button>
        </div>

        {/* More Info Section */}
        <div id="more" className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">More info</h4>
          <p className="text-blue-700">
            This tool is only an estimator and your effort will vary each time you get moving.
            Before recording the distance, you can adjust it to dial it in for your particular workout.
            Estimates are based on data from the University of Tennessee&apos;s Walk Across Tennessee program.
          </p>
        </div>
      </div>
    </div>
  );
}
