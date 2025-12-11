export function HotelCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse">
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
  );
}

export function HotelDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="w-full h-96 bg-gray-300 rounded-2xl"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-gray-300 rounded-xl"></div>
        <div className="h-32 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
}

export function BookingPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
      <div className="space-y-8">
        <div className="h-12 bg-gray-300 rounded w-1/2"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-100 p-8 rounded-3xl h-fit">
        <div className="space-y-4">
          <div className="h-24 bg-gray-300 rounded-xl"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
