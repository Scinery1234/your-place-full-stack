// Placeholder Page
import { useParams } from 'react-router-dom';

export default function ListingDetail() {
  const { type, id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-display text-primary-500">Listing Details</h1>
      <p className="mt-4">Coming Soon...</p>
    </div>
  );
}
