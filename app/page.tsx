"use client"
import React from 'react'
import Title from '@/components/Title';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import { fetchCaptionId, downloadCaptions } from '@/actions/captions';
//import {} from '@/actions/captions';

const Home = () => {
  const [results, setResults] = React.useState<string | null>(null);

  

  return (
    <div className='flex flex-col min-h-screen items-center bg-navbar gap-8 pt-20 px-4 sm:px-6 lg:px-8'>
      <Title />
      <form onSubmit={async (event) => {
        const captionId = await fetchCaptionId(event);
        const result = await downloadCaptions(captionId);
        setResults(result);
      }} className='flex flex-row gap-2 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl'>
        <Input type="text" name="videoId" placeholder="Enter link here" className="bg-white border-none"/>
        <Button type="submit" variant="outline" className="bg-button border-none hover:bg-white">Summarize</Button>
      </form>
      <div>
        <p>
          {results || "Results will appear here..."}
        </p>
      </div>
    </div>
  )
}

export default Home