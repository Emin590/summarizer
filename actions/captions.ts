"use server"

const SEARCH_API_KEY = process.env.SEARCH_API_KEY;

export async function fetchTranscript(videoId: string) {
  console.log('🔍 Server action called with videoId:', videoId);
  
  if (!videoId || typeof videoId !== 'string') {
    return {
      success: false,
      error: 'Invalid video ID'
    };
  }

  if (!SEARCH_API_KEY) {
    return {
      success: false,
      error: 'API key not configured. Please set SEARCH_API_KEY in environment variables.'
    };
  }

  try {
    const apiUrl = new URL('https://www.searchapi.io/api/v1/search');
    
    // Set API parameters
    apiUrl.searchParams.set('api_key', SEARCH_API_KEY);
    apiUrl.searchParams.set('engine', 'youtube_transcripts');
    apiUrl.searchParams.set('video_id', videoId);
    apiUrl.searchParams.set('lang', 'en'); // Prefer English
    
    console.log('🔍 Calling SearchAPI.io...');
    
    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ SearchAPI response received');
    
    // Parse the response based on the actual format
    const parseResult = parseSearchApiResponse(data);
    
    if (parseResult.success) {
      return {
        success: true,
        transcript: parseResult.transcript,
        segmentCount: parseResult.segmentCount,
        availableLanguages: parseResult.availableLanguages
      };
    } else {
      return {
        success: false,
        error: parseResult.error
      };
    }
    
  } catch (error: any) {
    console.error('🔴 Error in fetchTranscript:', error);
    
    let errorMessage = 'Failed to fetch transcript';
    
    if (error.message?.includes('401') || error.message?.includes('403')) {
      errorMessage = 'Invalid API key. Please check your SearchAPI.io configuration.';
    } else if (error.message?.includes('429')) {
      errorMessage = 'API rate limit exceeded. Please try again later.';
    } else if (error.message?.includes('404')) {
      errorMessage = 'Video not found or transcript unavailable.';
    } else {
      errorMessage = error.message || 'Unknown error occurred';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

function parseSearchApiResponse(data: any): { 
  success: boolean; 
  transcript?: string; 
  segmentCount?: number;
  availableLanguages?: any[];
  error?: string;
} {
  try {
    // Check if we have transcripts array
    if (data.transcripts && Array.isArray(data.transcripts) && data.transcripts.length > 0) {
      const transcriptText = data.transcripts
        .map((segment: any) => segment.text)
        .join(' ')
        .trim();
      
      if (transcriptText) {
        return {
          success: true,
          transcript: transcriptText,
          segmentCount: data.transcripts.length,
          availableLanguages: data.available_languages || []
        };
      }
    }
    
    // Check for error cases
    if (data.error) {
      return {
        success: false,
        error: data.error
      };
    }
    
    // No transcripts found
    return {
      success: false,
      error: 'No transcript available for this video'
    };
    
  } catch (error: any) {
    console.error('Error parsing API response:', error);
    return {
      success: false,
      error: 'Failed to parse API response'
    };
  }
}