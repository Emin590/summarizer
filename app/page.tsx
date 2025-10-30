"use client"
import React from 'react'
import Title from '@/components/Title';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button"
import { fetchTranscript } from '@/actions/captions';

const Home = () => {
  const [results, setResults] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResults("🔄 Processing your request...");
    
    const formData = new FormData(event.currentTarget);
    const videoUrl = formData.get('videoId') as string;
    
    try {
      const videoId = extractVideoId(videoUrl);
      
      if (!videoId) {
        setResults("❌ Invalid YouTube URL\n\nPlease use a format like:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID");
        return;
      }

      console.log("🔄 Calling server action with videoId:", videoId);
      const result = await fetchTranscript(videoId);
      console.log("🔄 Server action returned:", result);

      if (result.success && result.transcript) {
        const wordCount = result.transcript.split(/\s+/).length;
        const charCount = result.transcript.length;
        
        let successMessage = `✅ Transcript fetched successfully!\n\n`;
        successMessage += `📊 Stats:\n`;
        successMessage += `• Segments: ${result.segmentCount}\n`;
        successMessage += `• Words: ${wordCount}\n`;
        successMessage += `• Characters: ${charCount}\n`;
        
        if (result.availableLanguages && result.availableLanguages.length > 0) {
          successMessage += `• Available Languages: ${result.availableLanguages.length}\n`;
        }
        
        successMessage += `\n📝 Preview:\n${result.transcript.substring(0, 500)}...`;
        
        setResults(successMessage);
      } else {
        setResults(`❌ ${result.error || 'Failed to get transcript'}\n\n💡 Try a different video or check if captions are available.`);
      }
      
    } catch (error: any) {
      console.error('🔴 Form submission error:', error);
      setResults(`❌ Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col min-h-screen items-center bg-navbar gap-8 pt-20 px-4 sm:px-6 lg:px-8'>
      <Title />
      <form onSubmit={handleSubmit} className='flex flex-row gap-2 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl'>
        <Input 
          type="text" 
          name="videoId" 
          placeholder="Paste YouTube URL (e.g., https://youtu.be/0e3GPea1Tyg)" 
          className="bg-white border-none"
          disabled={loading}
          required
        />
        <Button 
          type="submit" 
          variant="outline" 
          className="bg-button border-none hover:bg-white"
          disabled={loading}
        >
          {loading ? "🔄 Processing..." : "📝 Get Transcript"}
        </Button>
      </form>
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-lg p-6 shadow-md min-h-[200px]">
          <pre className="whitespace-pre-wrap text-sm font-sans">
            {results || "👆 Enter a YouTube URL above and click 'Get Transcript'"}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default Home