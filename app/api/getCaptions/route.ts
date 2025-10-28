// app/api/getCaptions/route.js

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("videoId");
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!videoId) {
    return new Response(JSON.stringify({ msg: "Video ID is required" }), { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=id,snippet&videoId=${videoId}&key=${apiKey}`
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ msg: "Internal Server Error" }), { status: 500 });
  }
}
