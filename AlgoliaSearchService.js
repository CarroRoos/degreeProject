import { createNullCache } from "@algolia/cache-common";
import { createInMemoryCache } from "@algolia/cache-in-memory";
import { createAPIKeyStrategy } from "@algolia/client-search";
import { createTransporter } from "@algolia/transporter";

const search = async (query) => {
  try {
    const [salonResponse, userResponse] = await Promise.all([
      fetch("https://UBHJYH9DZZ-dsn.algolia.net/1/indexes/salonger/query", {
        method: "POST",
        headers: {
          "X-Algolia-API-Key": "b0fb4ded362b98421a89e30a99a8f1ef",
          "X-Algolia-Application-Id": "UBHJYH9DZZ",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
      }),
      fetch("https://UBHJYH9DZZ-dsn.algolia.net/1/indexes/users/query", {
        method: "POST",
        headers: {
          "X-Algolia-API-Key": "b0fb4ded362b98421a89e30a99a8f1ef",
          "X-Algolia-Application-Id": "UBHJYH9DZZ",
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
          ],
        }),
      }),
    ]);

    const [salonData, userData] = await Promise.all([
      salonResponse.json(),
      userResponse.json(),
    ]);

    console.log("Salon results:", salonData.hits);
    console.log("User results:", userData.hits);

    return {
      salongerResults: salonData.hits || [],
      usersResults: userData.hits || [],
      error: null,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      salongerResults: [],
      usersResults: [],
      error: error.message,
    };
  }
};

export default { search };
