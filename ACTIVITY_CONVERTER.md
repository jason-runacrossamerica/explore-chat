# Activity Converter - Distance Estimator

This is a recreation of the JavaScript activity converter from https://www.runacrossamerica.app/activity-converter, now implemented as a secure Next.js application with server-side data protection.

## Features

- **Server-side data protection**: Activity conversion factors are now stored server-side and cannot be easily downloaded by users
- **Modern React/Next.js implementation**: Built with TypeScript for type safety
- **Responsive design**: Works on all devices with Tailwind CSS styling
- **Real-time calculations**: Distance updates automatically as users change activity or duration
- **Copy to clipboard**: Easy copying of calculated distances in both miles and kilometers
- **Comprehensive activity database**: 64 different activities with accurate conversion factors

## How It Works

The converter uses the formula: `Distance (miles) = Duration (minutes) / Minutes per Mile`

Each activity has a "minutes per mile" factor based on data from the University of Tennessee's Walk Across Tennessee program. For example:
- Running: 8 minutes per mile
- Walking (leisurely): 20 minutes per mile
- Bicycling (vigorous): 6 minutes per mile

## API Endpoints

### GET /api/activities
Returns the complete list of activities with their conversion factors.

**Response:**
```json
[
  {
    "id": "run",
    "name": "Run",
    "minutesPerMile": 8
  },
  {
    "id": "walk-leisurely",
    "name": "Walk (leisurely)",
    "minutesPerMile": 20
  }
]
```

## File Structure

```
src/
├── app/
│   ├── activity-converter/
│   │   └── page.tsx              # Main activity converter page
│   └── api/
│       └── activities/
│           └── route.ts          # API endpoint for activity data
├── components/
│   └── ActivityConverter.tsx     # Main converter component
└── types/
    └── activity.ts               # TypeScript type definitions
```

## Security Improvements

The original implementation exposed all conversion factors in the client-side HTML, making them easily accessible. This implementation:

1. **Server-side data storage**: Conversion factors are stored in the API route
2. **Runtime data fetching**: Data is fetched from the server when needed
3. **No client-side exposure**: Raw conversion data is not embedded in the HTML
4. **Type safety**: TypeScript ensures data integrity

## Usage

1. Navigate to `/activity-converter`
2. Select an activity from the dropdown
3. Enter the duration in minutes
4. View calculated distance in miles and kilometers
5. Copy results to clipboard as needed

## Development

To run locally:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

## Activities Supported

The converter supports 64 different activities including:
- Aerobics (various intensities)
- Sports (basketball, tennis, soccer, etc.)
- Cycling (various intensities)
- Swimming (various intensities)
- Walking/Running (various paces)
- Strength training and yoga
- Outdoor activities (hiking, skiing, etc.)
- And many more...

## Notes

- This tool provides estimates only - actual effort may vary
- Based on University of Tennessee's Walk Across Tennessee program data
- Users should adjust estimates based on their personal workout intensity
