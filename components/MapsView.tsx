
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateWithMapsGrounding } from '../services/geminiService';
import { SearchIcon } from './Icons';
import type { GroundingSource } from '../types';

export const MapsView: React.FC<{ T: any }> = ({ T }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: GroundingSource[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState(T.maps.gettingLocation);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('');
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setLocationStatus(T.maps.locationError);
        setError(T.maps.locationError);
      }
    );
  }, [T.maps.locationError, T.maps.gettingLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !location) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await generateWithMapsGrounding(prompt, location);
      const text = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: GroundingSource[] = groundingChunks
        .map((chunk: any) => ({
          uri: chunk.maps?.uri || chunk.maps?.placeAnswerSources?.reviewSnippets?.[0]?.uri,
          title: chunk.maps?.title || chunk.maps?.placeAnswerSources?.reviewSnippets?.[0]?.title,
        }))
        .filter((source: any) => source.uri);

      setResult({ text, sources });
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center">
        <h2 className="text-3xl font-bold mb-2">{T.maps.title}</h2>
      </motion.div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={T.maps.prompt_placeholder}
            className="w-full p-4 pr-12 text-lg bg-white dark:bg-gray-800 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading || !location}
          />
          <button type="submit" disabled={isLoading || !prompt.trim() || !location} className="absolute top-1/2 -translate-y-1/2 right-4 rtl:left-4 rtl:right-auto text-gray-500 hover:text-purple-600 disabled:text-gray-300">
            <SearchIcon className="w-6 h-6" />
          </button>
        </div>
        {locationStatus && <p className="text-center mt-2 text-sm text-gray-500">{locationStatus}</p>}
      </form>

      {isLoading && <div className="mt-8 text-lg">{T.maps.searching}</div>}
      {error && !isLoading && <p className="mt-8 text-red-500">{error}</p>}
      
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="w-full max-w-3xl mt-8 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-lg backdrop-blur-md border border-white/20"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none break-words whitespace-pre-wrap">{result.text}</div>
          {result.sources.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
              <h4 className="font-semibold mb-2">{T.chat.sources}</h4>
              <ul className="list-disc list-inside space-y-1">
                {result.sources.map((source, index) => (
                  <li key={index}>
                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline text-indigo-500 dark:text-indigo-400">
                      {source.title || source.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
