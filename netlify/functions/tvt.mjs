const TVT_URL =
  "https://www.waze.com/row-partnerhub-api/feeds-tvt/2b98a1f0-b1c0-4ad9-bef2-6ecb0a73706a?id=1786098271061";

export default async () => {
  try {
    const response = await fetch(TVT_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "OCC-Dashboard/1.0"
      }
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Waze TVT upstream request failed",
          status: response.status
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store"
          }
        }
      );
    }

    const body = await response.text();

    if (!body.trim()) {
      return new Response(
        JSON.stringify({
          error: "Waze TVT upstream returned an empty response"
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store"
          }
        }
      );
    }

    /*
      Validate the upstream response before sending it to the dashboard.
      The original text is returned so its complete structure is preserved.
    */
    try {
      JSON.parse(body);
    } catch {
      return new Response(
        JSON.stringify({
          error: "Waze TVT upstream returned invalid JSON"
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store"
          }
        }
      );
    }

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60, s-maxage=60"
      }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Unable to retrieve Waze TVT feed",
        message: error instanceof Error
          ? error.message
          : String(error)
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store"
        }
      }
    );
  }
};

export const config = {
  path: "/api/tvt"
};
