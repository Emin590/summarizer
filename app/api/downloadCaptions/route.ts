// app/api/downloadCaptions/route.ts

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const captionId = searchParams.get("captionId");
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!captionId) {
    return new Response(JSON.stringify({ error: "Caption ID is required" }), { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/captions/${captionId}?tfmt=srt&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch captions content");
    }

    const captionText = await response.text();

    return new Response(captionText, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${captionId}.srt"`,
      },
    });
    } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }

}
