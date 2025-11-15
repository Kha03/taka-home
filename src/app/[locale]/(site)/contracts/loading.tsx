export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>

        {/* Filter skeleton */}
        <div className="flex gap-4 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded w-32 animate-pulse"
            ></div>
          ))}
        </div>

        {/* Status tabs skeleton */}
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded-lg w-28 animate-pulse"
            ></div>
          ))}
        </div>

        {/* Contract cards skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
