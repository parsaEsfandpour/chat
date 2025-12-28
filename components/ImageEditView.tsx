
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { editImage } from '../services/geminiService';
import { ImageIcon } from './Icons';

export const ImageEditView: React.FC<{ T: any }> = ({ T }) => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOriginalImage(file);
      setOriginalImagePreview(URL.createObjectURL(file));
      setEditedImage(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !originalImage) return;

    setIsLoading(true);
    setEditedImage(null);
    setError(null);

    try {
      const imageUrl = await editImage({ prompt, image: originalImage });
      setEditedImage(imageUrl);
    } catch (err) {
      setError('Failed to edit image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center gap-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center">
        <h2 className="text-3xl font-bold mb-2">{T.imageEdit.title}</h2>
      </motion.div>

      <div className="w-full p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl shadow-lg backdrop-blur-md border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg aspect-square">
            {!originalImagePreview ? (
              <div className="text-center text-gray-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                <p>{T.imageEdit.upload_prompt}</p>
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">
                  Upload
                </button>
              </div>
            ) : (
              <img src={originalImagePreview} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" />
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={T.imageEdit.edit_prompt_placeholder}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={5}
              disabled={isLoading || !originalImage}
            />
            <motion.button
              type="submit"
              disabled={isLoading || !prompt.trim() || !originalImage}
              className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? T.imageEdit.editing : T.imageEdit.edit}
            </motion.button>
          </form>
        </div>
      </div>

      {(isLoading || editedImage || error) && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
                <h3 className="text-center font-semibold mb-2">Original</h3>
                {originalImagePreview && <img src={originalImagePreview} alt="Original to be edited" className="rounded-lg shadow-lg"/>}
            </div>
            <div>
                 <h3 className="text-center font-semibold mb-2">Edited</h3>
                {isLoading && (
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center animate-pulse">
                        <div className="text-gray-500">{T.imageEdit.editing}</div>
                    </div>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {editedImage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <img src={editedImage} alt="Edited" className="rounded-lg shadow-xl" />
                    </motion.div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
