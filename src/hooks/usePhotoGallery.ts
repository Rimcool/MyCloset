import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Preferences } from '@capacitor/preferences';

export interface ClosetItem {
  id: string;
  photoBase64: string;
  tags: { category: string; color?: string; occasion?: string; size?: string; fitNotes?: string };
  isFavorite: boolean;
  styleTips?: string;
}

export interface SavedOutfit {
  id: string;
  name: string;
  itemIds: string[];
  occasion?: string;
  date: string;
  styleTips?: string;
  rating?: number; // 1-5 stars
  wornCount?: number; // How many times worn
}

const STORAGE_KEY = 'mycloset_items';
const OUTFITS_STORAGE_KEY = 'mycloset_outfits';

export function useCloset() {
  const [items, setItems] = useState<ClosetItem[]>([]);
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);

  useEffect(() => {
    const load = async () => {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      if (value) {
        setItems(JSON.parse(value));
      }
      const { value: outfitsValue } = await Preferences.get({ key: OUTFITS_STORAGE_KEY });
      if (outfitsValue) {
        setOutfits(JSON.parse(outfitsValue));
      }
    };
    load();
  }, []);

  const takeAndSavePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      return `data:image/jpeg;base64,${photo.base64String}`;
    } catch (err) {
      console.error('Camera failed:', err);
      return null;
    }
  };

  const addItem = async (
    photoBase64: string,
    tags: { category: string; color?: string; occasion?: string; size?: string; fitNotes?: string },
    styleTips?: string
  ) => {
    if (!photoBase64) return;

    const newItem: ClosetItem = {
      id: Date.now().toString(),
      photoBase64,
      tags,
      isFavorite: false,
      styleTips,
    };

    const updated = [newItem, ...items];
    setItems(updated);

    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(updated),
    });
  };

  const deleteItem = async (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);

    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(updated),
    });
  };

  const toggleFavorite = async (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setItems(updated);

    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(updated),
    });
  };

  const saveOutfit = async (outfitData: Omit<SavedOutfit, 'id' | 'date'>) => {
    const newOutfit: SavedOutfit = {
      ...outfitData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const updated = [newOutfit, ...outfits];
    setOutfits(updated);

    await Preferences.set({
      key: OUTFITS_STORAGE_KEY,
      value: JSON.stringify(updated),
    });
  };

  const deleteOutfit = async (id: string) => {
    const updated = outfits.filter((outfit) => outfit.id !== id);
    setOutfits(updated);

    await Preferences.set({
      key: OUTFITS_STORAGE_KEY,
      value: JSON.stringify(updated),
    });
  };

  const rateOutfit = async (id: string, rating: number) => {
    const updated = outfits.map((outfit) =>
      outfit.id === id ? { ...outfit, rating: Math.max(1, Math.min(5, rating)) } : outfit
    );
    setOutfits(updated);

    await Preferences.set({
      key: OUTFITS_STORAGE_KEY,
      value: JSON.stringify(updated),
    });
  };

  const logOutfitWear = async (id: string) => {
    const updated = outfits.map((outfit) =>
      outfit.id === id ? { ...outfit, wornCount: (outfit.wornCount || 0) + 1 } : outfit
    );
    setOutfits(updated);

    await Preferences.set({
      key: OUTFITS_STORAGE_KEY,
      value: JSON.stringify(updated),
    });
  };

  return {
    items,
    outfits,
    takeAndSavePhoto,
    addItem,
    deleteItem,
    toggleFavorite,
    saveOutfit,
    deleteOutfit,
    rateOutfit,
    logOutfitWear,
  };
}