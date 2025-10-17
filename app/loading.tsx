import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-orange-50 to-blue-50">
      <div className="text-center">
        <img 
          src="/logo.png" 
          alt="Wachamo Fellowship Logo" 
          className="w-24 h-24 mx-auto mb-6 animate-pulse"
        />
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 font-medium">Wachamo Fellowship</p>
      </div>
    </div>
  );
}

