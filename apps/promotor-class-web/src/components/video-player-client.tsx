"use client";

import { useState } from "react";
import { parseYouTubeUrl, validateYouTubeUrl } from "@/lib/parse-youtube-url";

interface VideoPlayerClientProps {
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
}

export default function VideoPlayerClient({ 
  defaultUrl = "", 
  onUrlChange 
}: VideoPlayerClientProps) {
  const [inputUrl, setInputUrl] = useState(defaultUrl);
  const [validation, setValidation] = useState<{
    isValid: boolean;
    error?: string;
    result?: ReturnType<typeof parseYouTubeUrl>;
  }>(() => ({
    isValid: false,
  }));

  const handleUrlBlur = () => {
    const result = validateYouTubeUrl(inputUrl);
    
    if (result.isValid && result.result) {
      setValidation(result);
      
      // Auto-save to parent
      if (onUrlChange && inputUrl !== defaultUrl) {
        onUrlChange(inputUrl);
      }
    } else {
      setValidation(result);
    }
  };

  return (
    <div className="pc-video-editor">
      {!defaultUrl ? (
        <p className="pc-video-hint">
          Video dipasang lewat tautan YouTube. Unggah berkas video belum tersedia.
        </p>
      ) : null}

      <div className="pc-video-input-group">
        <label htmlFor="youtube-url" className="pc-field-label">
          Tautan YouTube
        </label>
        <input
          id="youtube-url"
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onBlur={handleUrlBlur}
          placeholder="https://youtu.be/..."
          className={`pc-field-input ${validation.error ? 'pc-field-input--error' : ''}`}
        />
        
        {validation.result && (
          <div className="pc-video-validation-success">
            <span className="pc-video-status-dot"></span>
            <span className="pc-video-validation-text">
              Video terdeteksi — ditampilkan via YouTube embed.
            </span>
          </div>
        )}
        
        {validation.error && (
          <div className="pc-video-validation-error">
            <span className="pc-video-error-icon">⚠️</span>
            <span className="pc-video-validation-text">{validation.error}</span>
          </div>
        )}
      </div>

      {/* Video preview area */}
      {validation.result && !validation.error && (
        <div className="pc-video-preview">
          <iframe
            src={validation.result.embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="pc-video-embed"
          />
        </div>
      )}
    </div>
  );
}
