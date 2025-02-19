export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-5">
              <div className="flex items-center">
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                <div className="ml-5 w-full">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="mt-2 h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
          <div className="mt-4 bg-white shadow rounded-lg p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    <div className="mt-2 h-3 w-1/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 