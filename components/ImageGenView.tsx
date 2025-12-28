
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateImage } from '../services/geminiService';
import type { AspectRatio, ImageSize } from '../types';
import { ASPECT_RATIOS, IMAGE_SIZES } from '../constants';

export const ImageGenView: React.FC<{ T: any }> = ({ T }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [size, setSize] = useState<ImageSize>('1K');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const imageUrl = await generateImage({ prompt, aspectRatio, size });
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center">
        <h2 className="text-3xl font-bold mb-2">{T.imageGen.title}</h2>
      </motion.div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-lg backdrop-blur-md border border-white/20">
        <div className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={T.imageGen.prompt_placeholder}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            disabled={isLoading}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{T.imageGen.aspect_ratio}</label>
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} disabled={isLoading} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                {ASPECT_RATIOS.map(ar => <option key={ar} value={ar}>{ar}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{T.imageGen.size}</label>
              <select value={size} onChange={(e) => setSize(e.target.value as ImageSize)} disabled={isLoading} className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                {IMAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? T.imageGen.generating : T.imageGen.generate}
          </motion.button>
        </div>
      </form>

      {isLoading && (
         <div className="w-full max-w-2xl aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center animate-pulse">
            <div className="text-gray-500">{T.imageGen.generating}</div>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {generatedImage && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl">
          <img src={generatedImage} alt="Generated" className="rounded-lg shadow-xl" />
        </motion.div>
      )}
    </div>
  );
};
