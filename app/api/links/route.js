const puppeteer = require("puppeteer");

export async function POST(req) {
  try {
    // Obtener los datos del body
    const body = await req.json();
    console.log("Body recibido: ", body);

    const { channelLink } = body;

    if (!channelLink || !channelLink.startsWith("https://www.youtube.com/")) {
      return Response.json(
        { error: "Proporciona un enlace válido de YouTube." },
        { status: 400 }
      );
    }
    const URL = `${channelLink}/videos`;
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (["image", "stylesheet", "font"].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });
    let array = [];
    let previousHeight;

    while (true) {
      previousHeight = await page.evaluate(
        "document.documentElement.scrollHeight"
      );
      await page.evaluate(
        "window.scrollTo(0, document.documentElement.scrollHeight)"
      );

      await new Promise((resolve) => setTimeout(resolve, 400));

      const newHeight = await page.evaluate(
        "document.documentElement.scrollHeight"
      );

      if (newHeight === previousHeight) break;
    }

    const newVideos = await page.evaluate(() => {
      const videos = Array.from(
        document.querySelectorAll(
          ".yt-simple-endpoint.style-scope.ytd-playlist-thumbnail"
        )
      );

      return videos.map((video) => {
        const href = video.href;
        return { href };
      });
    });

    array = [...array, ...newVideos];

    await browser.close();

    return Response.json({ array });
  } catch (error) {
    console.error("Error al hacer scraping:", error);
    return Response.json(
      { error: "Hubo un problema al obtener los videos." },
      { status: 500 }
    );
  }
}
