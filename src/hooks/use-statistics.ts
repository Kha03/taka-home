import { useEffect, useState } from "react";
import { statisticsService } from "@/lib/api/services/statistics";
import type { StatisticsOverview } from "@/lib/api/types";

export function useStatisticsOverview() {
  const [statistics, setStatistics] = useState<StatisticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await statisticsService.getOverview();
      if (response.code === 200 && response.data) {
        setStatistics(response.data);
      } else {
        setError(response.message || "Không thể tải dữ liệu thống kê");
      }
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê");
      console.error("Error fetching statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
}
