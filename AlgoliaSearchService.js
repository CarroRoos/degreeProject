import { createNullCache } from "@algolia/cache-common";
import { createInMemoryCache } from "@algolia/cache-in-memory";
import { createAPIKeyStrategy } from "@algolia/client-search";
import { createTransporter } from "@algolia/transporter";

const ALGOLIA_APP_ID = "UBHJYH9DZZ";
const ALGOLIA_API_KEY = "b0fb4ded362b98421a89e30a99a8f1ef";
const ALGOLIA_BASE_URL = `https://${ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes`;

const search = async (query, options = {}) => {
  try {
    const defaultSearchParams = {
      query,
      attributesToRetrieve: [
        "objectID",
        "salon",
        "treatment",
        "stylist",
        "id",
        "time",
        "distance",
        "price",
        "ratings",
        "image",
      ],
      attributesToHighlight: [],
      ...options,
      getRankingInfo: true,
      analytics: true,
      clickAnalytics: true,
    };

    const [salonResponse, userResponse] = await Promise.all([
      fetch(`${ALGOLIA_BASE_URL}/salonger/query`, {
        method: "POST",
        headers: {
          "X-Algolia-API-Key": ALGOLIA_API_KEY,
          "X-Algolia-Application-Id": ALGOLIA_APP_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultSearchParams),
      }),
      fetch(`${ALGOLIA_BASE_URL}/users/query`, {
        method: "POST",
        headers: {
          "X-Algolia-API-Key": ALGOLIA_API_KEY,
          "X-Algolia-Application-Id": ALGOLIA_APP_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          attributesToRetrieve: [
            "objectID",
            "displayName",
            "email",
            "photoURL",
            "uid",
            "location",
            "categories",
          ],
          attributesToHighlight: [],
        }),
      }),
    ]);

    const [salonData, userData] = await Promise.all([
      salonResponse.json(),
      userResponse.json(),
    ]);

    let salongerResults = salonData.hits || [];

    if (!salongerResults.length && !userData.hits?.length) {
      return {
        salongerResults: [],
        usersResults: [],
        error: "Inga resultat",
      };
    }

    return {
      salongerResults,
      usersResults: userData.hits || [],
      error: null,
    };
  } catch (error) {
    return {
      salongerResults: [],
      usersResults: [],
      error: "Inga resultat",
    };
  }
};

const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${ALGOLIA_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "X-Algolia-API-Key": ALGOLIA_API_KEY,
        "X-Algolia-Application-Id": ALGOLIA_APP_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        objectID: userId,
        ...userData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update Algolia: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

const reindexSalon = async (salonId, salonData) => {
  try {
    const response = await fetch(`${ALGOLIA_BASE_URL}/salonger/${salonId}`, {
      method: "PUT",
      headers: {
        "X-Algolia-API-Key": ALGOLIA_API_KEY,
        "X-Algolia-Application-Id": ALGOLIA_APP_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        objectID: salonId,
        ...salonData,
        _timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to reindex salon: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export default { search, updateUser, reindexSalon };
