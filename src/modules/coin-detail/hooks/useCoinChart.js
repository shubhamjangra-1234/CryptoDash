import { useState, useEffect } from 'react';
import cryptoService from '../services/cryptoService';

const useCoinChart = (coinId, currency = 'usd', days = 7) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!coinId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await cryptoService.getCoinMarketChart(coinId, currency, days);
        setData(response);
      } catch (err) {
        setError(err);
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinId, currency, days]);

  return { data, loading, error };
};

export default useCoinChart;
