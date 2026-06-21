"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { historyService } from "@/services/historyService";

interface PerformanceProps {
  fundData: any;
}

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Period = "1M" | "3M" | "6M" | "1Y";

const Performance: React.FC<PerformanceProps> = ({ fundData }) => {
  const params = useParams();
  const fundId = params?.id as string;
  const periods: Period[] = ["1M", "3M", "6M", "1Y"];
  const t = useTranslations();

  const [historyData, setHistoryData] = useState<any[]>([]);
  const [periodData, setPeriodData] = useState<Record<Period, { date: string; price: number }[]>>({
    "1M": [],
    "3M": [],
    "6M": [],
    "1Y": [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch fund history data
  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!fundId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await historyService.getFundHistory(fundId);
        const history = response?.history || [];
        setHistoryData(history);
        
        // Process data for different periods
        const processedData = processHistoryData(history);
        setPeriodData(processedData);
      } catch (err: any) {
        setError(err.message || 'Failed to load fund history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, [fundId]);

  // Process history data for different time periods
  const processHistoryData = (history: any[]): Record<Period, { date: string; price: number }[]> => {
    const sortedHistory = history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // If status is 0, exclude the last item (most recent)
    const dataToUse = fundData?.fundDetails?.status === 0 
      ? sortedHistory.slice(0, -1) 
      : sortedHistory;

    // Take most recent data for each period instead of strict date filtering
    const getRecentData = (maxItems: number) => {
      return dataToUse
        .slice(-maxItems) // Take last N items (most recent)
        .map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: parseFloat(item.price)
        }));
    };

    // For different periods, show different amounts of most recent data
    return {
      "1M": getRecentData(Math.min(6, dataToUse.length)), // Show up to 6 most recent items
      "3M": getRecentData(Math.min(12, dataToUse.length)), // Show up to 12 most recent items
      "6M": getRecentData(Math.min(18, dataToUse.length)), // Show up to 18 most recent items
      "1Y": getRecentData(dataToUse.length), // Show all available data
    };
  };

  function ApexChart({ data }: { data: { date: string; price: number }[] }) {
    const chartOptions = {
      series: [
        {
          name: "Price",
          data: data.map((d) => d.price),
        },
      ],
      chart: {
        type: "area" as const,
        height: 250,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      colors: ["#0d2d5a"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth" as const,
        width: 2.5,
      },
      xaxis: {
        categories: data.map((d) => d.date),
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "11px",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "11px",
          },
          formatter: (val: number) => val.toFixed(2),
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      grid: {
        borderColor: "#f3f4f6",
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      tooltip: {
        theme: "light" as const,
        style: {
          fontSize: "12px",
        },
        y: {
          formatter: (val: number) => `EGP ${val.toFixed(3)}`,
        },
      },
      markers: {
        size: 0,
        colors: ["#0d2d5a"],
        strokeColors: "#fff",
        strokeWidth: 2,
        strokeOpacity: 0.9,
        fillOpacity: 1,
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: Math.floor(data.length / 2),
            fillColor: "#fff",
            strokeColor: "#0d2d5a",
            size: 6,
          },
        ],
      },
    };

    return (
      <Chart options={chartOptions} series={chartOptions.series} type="area" height={250} />
    );
  }

  const [activePeriod, setActivePeriod] = useState<Period>("1M");
  const data = periodData[activePeriod];

return (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-6">
      {t('performance.title')}
    </h1>

    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
        {t('performance.currentBalance')}
      </p>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-50 mb-6">
        {fundData?.fundDetails?.status === 1 
          ? (fundData?.fundDetails?.newprice || fundData?.fundDetails?.currentprice || fundData?.fundDetails?.price || '0.00')
          : (fundData?.fundDetails?.currentprice || fundData?.fundDetails?.price || '0.00')
        }
      </p>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64 mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00437a]"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500 dark:text-red-400 mb-4">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Chart */}
      {!isLoading && !error && (
        <div className="mb-4">
          <ApexChart data={data} />
          {data.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
              <p>No data available for the selected period</p>
            </div>
          )}
        </div>
      )}

      {/* Period Selector */}
      <div className="flex justify-center gap-2">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activePeriod === p
                ? "bg-[#00437A] text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  </div>
);
}

export default Performance;