import { FormEvent } from "react";

/*sync function summarizeLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const videoId = formData.get('videoId') as string;

    console.log("Summarizing videoId:", videoId);
}*/

async function fetchCaptionId(event: FormEvent<HTMLFormElement>): Promise<string> {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const videoId = formData.get('videoId') as string;

  // extract videoId from URL
  const id = videoId;

  const res = await fetch(`/api/getCaptions?videoId=${id}`);
  const data = await res.json();
  console.log(data.items[0].id); // captions data

  return data.items[0].id; // return first caption ID
}

async function downloadCaptions(captionId: string): Promise<string> {
  const res = await fetch(`/api/downloadCaptions?captionId=${captionId}`);
  const data = await res.text();
  console.log(data); // captions content

  return data; // return caption content
}



export { fetchCaptionId, downloadCaptions };

