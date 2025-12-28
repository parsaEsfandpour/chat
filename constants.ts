import type { AspectRatio, ImageSize } from './types';

export const MODELS = {
  chat: {
    // FIX: Updated model name to align with guidelines.
    fast: 'gemini-flash-lite-latest',
    pro: 'gemini-3-pro-preview',
    thinking: 'gemini-3-pro-preview',
  },
  imageAnalysis: 'gemini-3-pro-preview',
  imageGen: 'gemini-3-pro-image-preview',
  imageEdit: 'gemini-2.5-flash-image',
  search: 'gemini-3-flash-preview',
  maps: 'gemini-2.5-flash',
};

export const ASPECT_RATIOS: AspectRatio[] = ["1:1", "4:3", "3:4", "16:9", "9:16"];
export const IMAGE_SIZES: ImageSize[] = ["1K", "2K", "4K"];

export const LOCALES = {
  en: {
    appName: "Parsa AI",
    sidebar: {
      chat: "Chat",
      imageGen: "Image Generation",
      imageEdit: "Image Editing",
      search: "Web Search",
      maps: "Maps Search",
    },
    chat: {
      placeholder: "Ask Parsa AI anything...",
      mode: "Mode",
      fast: "Fast",
      pro: "Pro",
      thinking: "Deep Thinking",
      uploadImage: "Upload Image",
      analyzing: "Analyzing...",
      // FIX: Renamed duplicate 'thinking' property to 'thinkingStatus'.
      thinkingStatus: "Thinking...",
      sources: "Sources:",
    },
    imageGen: {
      title: "Image Generation",
      prompt_placeholder: "Describe the image you want to create...",
      aspect_ratio: "Aspect Ratio",
      size: "Size",
      generate: "Generate",
      generating: "Generating...",
    },
    imageEdit: {
      title: "Image Editing",
      upload_prompt: "Upload an image to start editing",
      edit_prompt_placeholder: "Describe the edits...",
      edit: "Edit",
      editing: "Editing...",
    },
    search: {
      title: "Web Search",
      prompt_placeholder: "Search the web with AI...",
      search: "Search",
      searching: "Searching...",
    },
    maps: {
      title: "Maps Search",
      prompt_placeholder: "Search for places with AI...",
      search: "Search",
      searching: "Searching...",
      gettingLocation: "Getting your location...",
      locationError: "Could not get location. Please allow location access.",
    },
  },
  fa: {
    appName: "هوش مصنوعی پارسا",
    sidebar: {
      chat: "چت",
      imageGen: "ساخت عکس",
      imageEdit: "ویرایش عکس",
      search: "جستجوی وب",
      maps: "جستجوی نقشه",
    },
    chat: {
      placeholder: "هر چیزی از هوش مصنوعی پارسا بپرسید...",
      mode: "حالت",
      fast: "سریع",
      pro: "حرفه‌ای",
      thinking: "تفکر عمیق",
      uploadImage: "آپلود عکس",
      analyzing: "در حال تحلیل...",
      // FIX: Renamed duplicate 'thinking' property to 'thinkingStatus'.
      thinkingStatus: "در حال فکر کردن...",
      sources: "منابع:",
    },
    imageGen: {
      title: "ساخت عکس",
      prompt_placeholder: "عکسی که می‌خواهید بسازید را توصیف کنید...",
      aspect_ratio: "نسبت تصویر",
      size: "اندازه",
      generate: "بساز",
      generating: "در حال ساخت...",
    },
    imageEdit: {
      title: "ویرایش عکس",
      upload_prompt: "برای شروع ویرایش یک عکس آپلود کنید",
      edit_prompt_placeholder: "تغییرات را توصیف کنید...",
      edit: "ویرایش",
      editing: "در حال ویرایش...",
    },
    search: {
      title: "جستجوی وب",
      prompt_placeholder: "با هوش مصنوعی در وب جستجو کنید...",
      search: "جستجو",
      searching: "در حال جستجو...",
    },
    maps: {
      title: "جستجوی نقشه",
      prompt_placeholder: "با هوش مصنوعی مکان‌ها را جستجو کنید...",
      search: "جستجو",
      searching: "در حال جستجو...",
      gettingLocation: "در حال دریافت موقعیت مکانی شما...",
      locationError: "موقعیت مکانی دریافت نشد. لطفاً دسترسی به موقعیت مکانی را فعال کنید.",
    },
  },
};
