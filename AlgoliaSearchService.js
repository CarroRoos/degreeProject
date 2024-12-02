import { createNullCache } from "@algolia/cache-common";
import { createInMemoryCache } from "@algolia/cache-in-memory";
import { createAPIKeyStrategy } from "@algolia/client-search";
import { createTransporter } from "@algolia/transporter";

const createSearchClient = (appId, apiKey) => {
  const headers = {
    "x-algolia-api-key": apiKey,
    "x-algolia-application-id": appId,
  };

  const transporter = createTransporter({
    headers,
    queryParameters: {},
    timeouts: { connect: 2, read: 5, write: 30 },
    hosts: [{ url: `${appId}-dsn.algolia.net` }],
  });

  const cache = createNullCache();

  return {
    search: async (queries) => {
      try {
        const { results } = await transporter.read({
          method: "POST",
          path: "/1/indexes/*/queries",
          data: {
            requests: queries.map((q) => ({
              ...q,
              params: new URLSearchParams(q.params).toString(),
            })),
          },
        });

        return { results };
      } catch (error) {
        console.error("Search error:", error);
        return { results: [], error: error.message };
      }
    },
  };
};

const searchClient = createSearchClient(
  "UBHJYH9DZZ",
  "b0fb4ded362b98421a89e30a99a8f1ef"
);

const search = async (query) => {
  try {
    const { results } = await searchClient.search([
      {
        indexName: "Salonger",
        query,
        params: {
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
        },
      },
    ]);

    return { results: results[0].hits, error: null };
  } catch (error) {
    console.error("Algolia search error:", error);
    return { results: [], error: error.message };
  }
};

export default { search };
