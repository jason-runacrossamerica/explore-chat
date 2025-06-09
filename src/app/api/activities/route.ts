import { NextResponse } from 'next/server';
import { Activity } from '../../../types/activity';

// Activity conversion data - moved server-side for security
const activities: Activity[] = [
  { id: 'aerobics-low', name: 'Aerobics (low impact)', minutesPerMile: 16 },
  { id: 'aerobics-moderate', name: 'Aerobics (moderate)', minutesPerMile: 13 },
  { id: 'aerobics-high', name: 'Aerobics (high impact)', minutesPerMile: 11 },
  { id: 'basketball', name: 'Basketball', minutesPerMile: 11 },
  { id: 'bicycling-leisurely', name: 'Bicycling (leisurely)', minutesPerMile: 20 },
  { id: 'bicycling-moderate', name: 'Bicycling (moderate)', minutesPerMile: 10 },
  { id: 'bicycling-vigorous', name: 'Bicycling (vigorous)', minutesPerMile: 6 },
  { id: 'bowling', name: 'Bowling', minutesPerMile: 20 },
  { id: 'boxing', name: 'Boxing', minutesPerMile: 9 },
  { id: 'building-snowman', name: 'Building a Snowman', minutesPerMile: 30 },
  { id: 'climbing', name: 'Climbing', minutesPerMile: 15 },
  { id: 'cross-country-ski', name: 'Cross Country Ski', minutesPerMile: 10 },
  { id: 'dancing', name: 'Dancing', minutesPerMile: 15 },
  { id: 'dog-walk', name: 'Dog walk', minutesPerMile: 20 },
  { id: 'elliptical', name: 'Elliptical', minutesPerMile: 10 },
  { id: 'fencing', name: 'Fencing', minutesPerMile: 15 },
  { id: 'football', name: 'Football', minutesPerMile: 15 },
  { id: 'gardening', name: 'Gardening', minutesPerMile: 15 },
  { id: 'golf-walking', name: 'Golf (walking)', minutesPerMile: 20 },
  { id: 'handcycle-leisurely', name: 'Handcycle (leisurely)', minutesPerMile: 20 },
  { id: 'handcycle-moderate', name: 'Handcycle (moderate)', minutesPerMile: 10 },
  { id: 'hiking-general', name: 'Hiking (general)', minutesPerMile: 12 },
  { id: 'hiking-pack', name: 'Hiking (20+ lb pack)', minutesPerMile: 9 },
  { id: 'hockey', name: 'Hockey', minutesPerMile: 11 },
  { id: 'ice-skate', name: 'Ice Skate', minutesPerMile: 18 },
  { id: 'jump-rope-slow', name: 'Jump Rope (slow)', minutesPerMile: 11 },
  { id: 'jump-rope-moderate', name: 'Jump Rope (moderate)', minutesPerMile: 8 },
  { id: 'kayak', name: 'Kayak', minutesPerMile: 25 },
  { id: 'kickboxing-karate', name: 'Kickboxing / Karate', minutesPerMile: 7 },
  { id: 'paddleboard', name: 'Paddleboard', minutesPerMile: 14 },
  { id: 'pickleball', name: 'Pickleball', minutesPerMile: 12 },
  { id: 'pilates', name: 'Pilates', minutesPerMile: 20 },
  { id: 'rollerblade', name: 'Rollerblade', minutesPerMile: 10 },
  { id: 'row-moderate', name: 'Row (moderate)', minutesPerMile: 13 },
  { id: 'run', name: 'Run', minutesPerMile: 8 },
  { id: 'run-walk', name: 'Run / Walk', minutesPerMile: 10 },
  { id: 'skating', name: 'Skating', minutesPerMile: 20 },
  { id: 'ski', name: 'Ski', minutesPerMile: 15 },
  { id: 'snowball-fight', name: 'Snowball Fight', minutesPerMile: 20 },
  { id: 'snowshoe', name: 'Snowshoe', minutesPerMile: 13 },
  { id: 'soccer', name: 'Soccer', minutesPerMile: 10 },
  { id: 'stair-stepper', name: 'Stair stepper', minutesPerMile: 10 },
  { id: 'stationary-bike-light', name: 'Stationary Bike (light)', minutesPerMile: 16 },
  { id: 'stationary-bike-moderate', name: 'Stationary Bike (moderate)', minutesPerMile: 12 },
  { id: 'stationary-bike-vigorous', name: 'Stationary Bike (vigorous)', minutesPerMile: 8 },
  { id: 'stretching', name: 'Stretching', minutesPerMile: 60 },
  { id: 'strength-training', name: 'Strength Training', minutesPerMile: 25 },
  { id: 'stroller-walk', name: 'Stroller Walk', minutesPerMile: 18 },
  { id: 'swim-leisurely', name: 'Swim (leisurely)', minutesPerMile: 15 },
  { id: 'swim-moderate', name: 'Swim (moderate)', minutesPerMile: 12 },
  { id: 'swim-treading', name: 'Swim (treading)', minutesPerMile: 41 },
  { id: 'swim-vigorous', name: 'Swim (vigorous)', minutesPerMile: 9 },
  { id: 'tai-chi', name: 'Tai Chi', minutesPerMile: 24 },
  { id: 'team-sport', name: 'Team Sport', minutesPerMile: 10 },
  { id: 'tennis', name: 'Tennis', minutesPerMile: 10 },
  { id: 'treadmill-leisurely', name: 'Treadmill (leisurely)', minutesPerMile: 20 },
  { id: 'treadmill-moderate', name: 'Treadmill (moderate)', minutesPerMile: 14 },
  { id: 'treadmill-vigorous', name: 'Treadmill (vigorous)', minutesPerMile: 8 },
  { id: 'volleyball-leisure', name: 'Volleyball (leisure)', minutesPerMile: 23 },
  { id: 'volleyball-match', name: 'Volleyball (match)', minutesPerMile: 9 },
  { id: 'walk-leisurely', name: 'Walk (leisurely)', minutesPerMile: 20 },
  { id: 'walk-moderate', name: 'Walk (moderate)', minutesPerMile: 17 },
  { id: 'walk-power', name: 'Walk (power)', minutesPerMile: 13 },
  { id: 'walk-with-kids', name: 'Walk with Kids', minutesPerMile: 20 },
  { id: 'wheelchair-leisurely', name: 'Wheelchair (leisurely)', minutesPerMile: 20 },
  { id: 'wheelchair-moderate', name: 'Wheelchair (moderate)', minutesPerMile: 14 },
  { id: 'wheelchair-vigorous', name: 'Wheelchair (vigorous)', minutesPerMile: 8 },
  { id: 'yoga', name: 'Yoga', minutesPerMile: 40 },
  { id: 'yard-work', name: 'Yard Work', minutesPerMile: 15 },
];

export async function GET() {
  try {
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
