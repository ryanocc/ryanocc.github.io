const WAZE_URL =
  "https://www.waze.com/row-partnerhub-api/partners/11867436614/waze-feeds/4e8ef399-d6b9-4338-9840-7c2beacd235b?format=1";

export default async () => {
  try {
    const response = await fetch(WAZE_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "OCC-Dashboard/1.0"
      }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Waze upstream request failed",
          status: response.status
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json; charset=utf-8"
          }
        }
      );
    }

    const body = await response.text();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=30",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Unable to retrieve Waze feed",
        message: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};

export const config = {
  path: "/api/waze"
};
