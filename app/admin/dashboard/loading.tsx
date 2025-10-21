import { LoadingSpinner } from '@/components/LoadingSpinner';
import Image from 'next/image';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-orange-50 to-blue-50">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white p-3 border-2 border-primary animate-pulse relative">
          <Image 
            src="/logo.png" 
            alt="Wachamo Fellowship Logo" 
            fill
            className="object-contain p-2"
          />
        </div>
        <LoadingSpinner />
        <p className="mt-4 text-gray-600 font-medium">Loading Dashboard...</p>
      </div>
    </div>
  );
}

