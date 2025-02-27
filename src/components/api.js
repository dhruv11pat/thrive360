// API service for fetching data

const API_BASE_URL = 'https://orekselc5g5qjsp5qz4kkj3eme0etgxp.lambda-url.us-east-1.on.aws';

/**
 * Fetch country data from the API
 */
export const fetchCountryData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/country/Nigeria`, { 
      mode: 'cors' 
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn('No country data found');
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching country data:', error);
    throw error;
  }
};

/**
 * Fetch store data from the API
 */
export const fetchStoreData = async (storeId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/storeid/${storeId}`,
      { mode: 'cors' }
    );

    // Check if response is not OK
    if (!response.ok) {
      // If it's a 404 or similar, treat it as a "no data" case.
      if (response.status === 404) {
        let errorMsg = 'No data found for the specified query.';
        try {
          const errorJson = await response.json();
          if (errorJson.error) {
            errorMsg = errorJson.error;
          }
        } catch (e) {
          // ignore JSON parse errors
        }
        console.warn(`Store ${storeId} returned error: ${errorMsg}`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    if (json.error) {
      console.warn(`Store ${storeId} returned error: ${json.error}`);
      return null;
    }
    return json;
  } catch (error) {
    console.error(`Error fetching store data for store ${storeId}:`, error);
    throw error;
  }
};