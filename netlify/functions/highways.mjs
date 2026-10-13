const HIGHWAYS_URL =
  "https://m.highwaysengland.co.uk/feeds/rss/UnplannedEvents/North%20West.xml";

export default async () => {
  try {
    const response = await fetch(HIGHWAYS_URL, {
      method: "GET",
      headers: {
        "Accept": "application/rss+xml, application/xml, text/xml",
        "User-Agent": "OCC-Dashboard/1.0"
      }
    });

    if (!response.ok) {
      return new Response(
        `National Highways upstream returned HTTP ${response.status}`,
        {
          status: 502,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    const body = await response.text();

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=60",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(
      `Unable to retrieve National Highways feed: ${error.message}`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};

export const config = {
  path: "/api/highways"
};
