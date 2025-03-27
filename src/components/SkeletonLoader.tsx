import { useEffect, useState } from "react";

export default function SkeletonLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2초 후에 로딩 완료
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      {loading ? (
        <div className="space-y-3">
          <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-48 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-full h-20 bg-gray-300 rounded animate-pulse"></div>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold">🎉 로딩 완료!</h2>
          <p className="text-gray-600">이제 실제 콘텐츠가 표시됩니다.</p>
        </div>
      )}
    </div>
  );
}
