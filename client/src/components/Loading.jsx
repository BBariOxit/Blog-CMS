/**
 * Loading.jsx
 * Loading spinner component
 */

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="relative">
        {/* Outer spinning ring */}
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
        {/* Inner spinning gradient ring */}
        <div className="absolute top-0 left-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-primary-600 border-r-purple-600"></div>
        {/* Center pulse */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading amazing content...</p>
    </div>
  );
}
