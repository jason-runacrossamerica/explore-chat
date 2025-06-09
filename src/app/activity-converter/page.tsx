import ActivityConverter from '../../components/ActivityConverter';

export default function ActivityConverterPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <ActivityConverter />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Activity Converter - Distance Estimator',
  description: 'Estimate how far you moved for any activities you forgot to track, or for movement that\'s not inherently distance-based.',
};
