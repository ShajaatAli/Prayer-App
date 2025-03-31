import axios from 'axios';

const BASE_URL = 'http://api.aladhan.com/v1';

export const fetchPrayerTimes = async (latitude, longitude, date) => {
  try {
    const response = await axios.get(`${BASE_URL}/timings/${date}`, {
      params: {
        latitude,
        longitude,
        method: 2, // Islamic Society of North America (ISNA) method
      },
    });
    
    const { data } = response.data;
    return {
      fajr: data.timings.Fajr,
      dhuhr: data.timings.Dhuhr,
      asr: data.timings.Asr,
      maghrib: data.timings.Maghrib,
      isha: data.timings.Isha,
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}; 