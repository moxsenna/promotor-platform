/**
 * Parse YouTube URLs and extract video ID + metadata.
 * 
 * Supports:
 * - https://youtu.be/8xQ2Kd1vRlA (short)
 * - https://www.youtube.com/watch?v=8xQ2Kd1vRlA (standard)
 * - https://www.youtube.com/watch?v=8xQ2Kd1vRlA&t=123s (with timestamp)
 * - https://www.youtube.com/embed/8xQ2Kd1vRlA (embed URL)
 * 
 * Returns structured data or throws error on invalid URL.
 */

export interface YouTubeParsedResult {
  videoId: string;
  timestamp?: number; // seconds from start
  embedUrl: string;
}

export function parseYouTubeUrl(url: string): YouTubeParsedResult {
  try {
    const urlObj = new URL(url.trim());
    
    let videoId: string | null = null;
    let timestamp: number | undefined = undefined;
    
    // Standard YouTube watch page
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v');
      timestamp = urlObj.searchParams.get('t') ? 
        parseInt(urlObj.searchParams.get('t')!.replace('s', ''), 10) : 
        undefined;
    }
    // Short URL (youtu.be)
    else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    }
    // Embed URL
    else if (urlObj.hostname === 'www.youtube.com' && urlObj.pathname.startsWith('/embed/')) {
      const pathParts = urlObj.pathname.split('/');
      videoId = pathParts.length >= 3 && pathParts[2] ? pathParts[2] : null;
    }
    
    if (!videoId || videoId.length !== 11) {
      throw new Error('Invalid YouTube video ID');
    }
    
    // Clean timestamp
    if (timestamp && (timestamp < 0 || timestamp > 3600 * 24)) {
      throw new Error('Timestamp out of valid range');
    }
    
    return {
      videoId,
      timestamp,
      embedUrl: `https://www.youtube.com/embed/${videoId}${timestamp ? `?start=${timestamp}` : ''}`,
    };
  } catch {
    throw new Error('Invalid YouTube URL format');
  }
}

/**
 * Validate YouTube URL before use.
 * Returns success object with metadata or error message.
 */
export function validateYouTubeUrl(url: string): {
  isValid: boolean;
  result?: YouTubeParsedResult;
  error?: string;
} {
  try {
    const parsed = parseYouTubeUrl(url);
    return { isValid: true, result: parsed };
  } catch (err) {
    return { isValid: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
