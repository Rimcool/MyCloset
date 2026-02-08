import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonButton,
  IonBadge,
} from '@ionic/react';
import { addCircle, checkmark, trash, heart, heartOutline, save, star, starOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LoadingScreen from '../components/LoadingScreen';
import CategorizeModal from '../components/CategorizeModal';
import SaveOutfitModal from '../components/SaveOutfitModal';
import { useCloset } from '../hooks/usePhotoGallery';
import { useTheme } from '../context/ThemeContext';

// Color matching algorithm
const getColorHarmony = (colors: string[]): { score: number; message: string } => {
  if (colors.length <= 1) return { score: 100, message: '✨ Keep building!' };

  const colorMap: Record<string, string[]> = {
    pink: ['purple', 'white', 'black', 'gold'],
    purple: ['pink', 'white', 'gold', 'silver'],
    blue: ['white', 'orange', 'gold', 'black'],
    white: ['any', 'any', 'any', 'any'],
    black: ['any', 'any', 'any', 'any'],
    gold: ['pink', 'purple', 'white', 'black'],
    red: ['white', 'black', 'gold', 'silver'],
  };

  let harmonyScore = 0;
  for (const color of colors) {
    const normalized = (color || '').toLowerCase();
    for (const otherColor of colors) {
      if (otherColor === color) continue;
      const otherNormalized = (otherColor || '').toLowerCase();
      if (colorMap[normalized]?.includes(otherNormalized)) {
        harmonyScore += 20;
      }
    }
  }

  const score = Math.min(100, harmonyScore + 60);
  const message =
    score >= 80
      ? '💕 Perfect Match!'
      : score >= 60
        ? '💗 Good Harmony'
        : score >= 40
          ? '🎀 Okay Vibes'
          : '❓ Try different colors';

  return { score, message };
};

const categoryIcons: Record<string, string> = {
  Top: 'https://i.etsystatic.com/48702902/r/il/ff6fd2/6866535002/il_570xN.6866535002_15zq.jpg',
  Bottom: 'https://i.etsystatic.com/44338620/r/il/d70713/4991977266/il_570xN.4991977266_iywk.jpg',
  Dress: 'https://media.craiyon.com/2025-08-25/D3LPBN-lQ8KItVysteYUHA.webp',
  Shoes: 'https://i.etsystatic.com/25364213/r/il/64a13d/6987788336/il_570xN.6987788336_heh6.jpg',
  Accessory: 'https://media.craiyon.com/2025-07-28/yzQGvFx1REKClLRpXkSinQ.webp',
  Outerwear: 'https://i.etsystatic.com/55667517/r/il/df8369/6838277275/il_570xN.6838277275_5xao.jpg',
  Other: 'https://via.placeholder.com/100?text=🐱',
};

const MyCloset: React.FC = () => {
  const { items, outfits, takeAndSavePhoto, addItem, deleteItem, toggleFavorite, saveOutfit, deleteOutfit, rateOutfit, logOutfitWear } = useCloset();
  const { currentInterface, setCurrentInterface } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [showSaveOutfitModal, setShowSaveOutfitModal] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [outfit, setOutfit] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'closet' | 'outfits'>('closet');
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddClick = async () => {
    setLoading(true);
    const photoBase64 = await takeAndSavePhoto();
    if (photoBase64) {
      setPendingPhoto(photoBase64);
      setShowModal(true);
    }
    setLoading(false);
  };

  const handleSaveTags = (
    tags: {
      category: string;
      color?: string;
      occasion?: string;
      size?: string;
      fitNotes?: string;
    },
    styleTips?: string
  ) => {
    if (pendingPhoto) {
      addItem(pendingPhoto, tags, styleTips);
      setPendingPhoto(null);
    }
    setShowModal(false);
  };

  const handleSaveOutfit = async (data: {
    name: string;
    occasion?: string;
    styleTips?: string;
  }) => {
    await saveOutfit({
      ...data,
      itemIds: outfit,
    });
    setOutfit([]);
    setShowSaveOutfitModal(false);
    alert(`✨ Saved "${data.name}" to your favorites!`);
  };

  const filteredItems = items.filter((item) => {
    const categoryMatch = !selectedCategory || item.tags.category === selectedCategory;
    const colorMatch = !selectedColor || item.tags.color?.toLowerCase() === selectedColor.toLowerCase();
    return categoryMatch && colorMatch;
  });
  
  const categories = [
    'Shalwar Kameez',
    'Kurta',
    'Salwar',
    'Dupatta',
    'Lehenga',
    'Saree',
    'Shawl',
    'Chunni',
    'Sharara',
    'Gharara',
    'Shoes',
    'Jewelry',
    'Accessories',
    'Top',
    'Bottom',
    'Dress',
    'Outerwear'
  ];
  const colors: string[] = [...new Set(items.map((item) => item.tags.color).filter((c): c is string => Boolean(c)))].sort();

  const toggleOutfitItem = (itemId: string) => {
    setOutfit((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const outfitColors = outfit
    .map((id) => items.find((item) => item.id === id)?.tags.color || '')
    .filter((c) => c);
  const harmony = getColorHarmony(outfitColors);

  return (
    <DndProvider backend={HTML5Backend}>
      <IonPage style={{ background: 'linear-gradient(135deg, #fff5f9 0%, #f0e6ff 100%)' }}>
        <IonHeader>
          <IonToolbar style={{ background: 'linear-gradient(135deg, #ffa0d0 0%, #ffb6e1 100%)', boxShadow: '0 8px 20px rgba(255, 105, 180, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 15px', width: '100%' }}>
              <IonTitle style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffffff', textShadow: '0 0 10px rgba(255, 20, 147, 0.3)', letterSpacing: '2px', flex: 1 }}>
                ✨ PICK UR FIT ✨
              </IonTitle>
              <button
                onClick={() => setShowThemeSelector(!showThemeSelector)}
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                  border: '2px solid #ffffff',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                🎨
              </button>
            </div>
            
            {/* THEME SELECTOR DROPDOWN */}
            {showThemeSelector && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '10px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                borderBottomLeftRadius: '15px',
                borderBottomRightRadius: '15px'
              }}>
                {(['retro', 'modern', 'dark', 'pastel'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => {
                      setCurrentInterface(theme);
                      setShowThemeSelector(false);
                    }}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: currentInterface === theme ? '3px solid #ff1493' : '2px solid #ffb6e1',
                      background: currentInterface === theme ? 'rgba(255, 20, 147, 0.1)' : 'transparent',
                      color: '#4a0e4e',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    {theme === 'retro' && '💖 Retro'}
                    {theme === 'modern' && '✨ Modern'}
                    {theme === 'dark' && '🌙 Dark'}
                    {theme === 'pastel' && '🎀 Pastel'}
                  </button>
                ))}
              </div>
            )}
          </IonToolbar>
        </IonHeader>

        <IonContent style={{ '--background': 'transparent' }}>
          <LoadingScreen isOpen={loading} />

          {/* TAB BUTTONS */}
          <div style={{
            display: 'flex',
            gap: '10px',
            padding: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('closet')}
              style={{
                padding: '12px 25px',
                borderRadius: '25px',
                border: 'none',
                background: activeTab === 'closet' ? '#ff1493' : 'rgba(255, 255, 255, 0.7)',
                color: activeTab === 'closet' ? '#ffffff' : '#ff1493',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(255, 20, 147, 0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              My Closet 👗
            </button>
            <button
              onClick={() => setActiveTab('outfits')}
              style={{
                padding: '12px 25px',
                borderRadius: '25px',
                border: 'none',
                background: activeTab === 'outfits' ? '#ff1493' : 'rgba(255, 255, 255, 0.7)',
                color: activeTab === 'outfits' ? '#ffffff' : '#ff1493',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(255, 20, 147, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              Saved Outfits 💾
              {outfits.length > 0 && (
                <IonBadge color="danger" style={{ position: 'absolute', top: '-8px', right: '-8px' }}>
                  {outfits.length}
                </IonBadge>
              )}
            </button>
          </div>

          {/* CLOSET TAB */}
          {activeTab === 'closet' && (
            <>
              {/* OUTFIT PREVIEW SECTION */}
              <div style={{
                margin: '20px',
                padding: '30px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 245, 0.95) 100%)',
                border: '4px solid #ff1493',
                boxShadow: '0 15px 40px rgba(255, 20, 147, 0.25)',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#4a0e4e', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Today's Vibe 💕
                </h3>

                {/* COLOR HARMONY SCORE */}
                {outfit.length > 0 && (
                  <div style={{
                    marginBottom: '20px',
                    padding: '12px',
                    borderRadius: '15px',
                    background: 'rgba(255, 20, 147, 0.1)',
                    border: '2px solid #ff69b4'
                  }}>
                    <div style={{ fontSize: '1.2rem', color: '#ff1493', fontWeight: 'bold' }}>
                      {harmony.message}
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e0b0d0',
                      borderRadius: '5px',
                      overflow: 'hidden',
                      marginTop: '8px'
                    }}>
                      <div style={{
                        width: `${harmony.score}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, #ff69b4, #ff1493)',
                      }} />
                    </div>
                  </div>
                )}

                {/* OUTFIT PREVIEW GRID */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '15px',
                  minHeight: '180px',
                  alignItems: 'center',
                  justifyItems: 'center',
                  marginBottom: '20px'
                }}>
                  {outfit.length === 0 ? (
                    <div style={{
                      gridColumn: '1 / -1',
                      fontSize: '1.2rem',
                      color: '#4a0e4e',
                      fontWeight: 'bold'
                    }}>
                      Click items below to build ur look 👗✨
                    </div>
                  ) : (
                    items
                      .filter((item) => outfit.includes(item.id))
                      .slice(0, 3)
                      .map((item) => (
                        <div key={item.id} style={{
                          position: 'relative',
                          width: '100px',
                          height: '100px',
                          borderRadius: '15px',
                          overflow: 'hidden',
                          border: '3px solid #ff69b4',
                          boxShadow: '0 8px 20px rgba(255, 20, 147, 0.3)',
                          cursor: 'pointer'
                        }} onClick={() => toggleOutfitItem(item.id)}>
                          <IonImg src={item.photoBase64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))
                  )}
                </div>

                {outfit.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <IonButton
                      expand="block"
                      style={{
                        background: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
                        borderRadius: '20px',
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        boxShadow: '0 8px 20px rgba(255, 20, 147, 0.4)',
                        color: '#ffffff'
                      }}
                      onClick={() => setShowSaveOutfitModal(true)}
                    >
                      <IonIcon slot="start" icon={save} />
                      Save This Outfit 💕
                    </IonButton>
                    <IonButton
                      expand="block"
                      fill="outline"
                      style={{
                        borderColor: '#ff69b4',
                        color: '#ff1493',
                        borderRadius: '20px',
                        fontSize: '0.95rem',
                        fontWeight: 'bold'
                      }}
                      onClick={() => setOutfit([])}
                    >
                      Clear Selection
                    </IonButton>
                  </div>
                )}
              </div>

              {/* CATEGORY FILTERS */}
              <div style={{
                display: 'flex',
                overflowX: 'auto',
                gap: '10px',
                padding: '20px',
                paddingBottom: '10px',
                background: 'transparent'
              }}>
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '25px',
                    border: 'none',
                    background: selectedCategory === null ? '#ff1493' : 'rgba(255, 255, 255, 0.8)',
                    color: selectedCategory === null ? '#ffffff' : '#ff1493',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 15px rgba(255, 20, 147, 0.2)',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ALL 💁‍♀️
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '25px',
                      border: 'none',
                      background: selectedCategory === cat ? '#ff1493' : 'rgba(255, 255, 255, 0.8)',
                      color: selectedCategory === cat ? '#ffffff' : '#ff1493',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 15px rgba(255, 20, 147, 0.2)',
                      fontSize: '0.9rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* COLOR FILTERS */}
              {colors.length > 0 && (
                <div style={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: '10px',
                  padding: '10px 20px 20px 20px',
                  background: 'transparent'
                }}>
                  <button
                    onClick={() => setSelectedColor(null)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '20px',
                      border: 'none',
                      background: selectedColor === null ? '#ff69b4' : 'rgba(255, 255, 255, 0.8)',
                      color: selectedColor === null ? '#ffffff' : '#ff1493',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 15px rgba(255, 20, 147, 0.2)',
                      fontSize: '0.8rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    All Colors 🌈
                  </button>
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '20px',
                        border: 'none',
                        background: selectedColor === color ? '#ff69b4' : 'rgba(255, 255, 255, 0.8)',
                        color: selectedColor === color ? '#ffffff' : '#ff1493',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 15px rgba(255, 20, 147, 0.2)',
                        fontSize: '0.8rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              )}

              {/* CLOTHES GRID */}
              <div style={{ padding: '0 15px 100px 15px' }}>
                {filteredItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4a0e4e' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px', color: '#4a0e4e' }}>
                      As if! 💋
                    </h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#4a0e4e' }}>
                      No clothes in this category yet...
                    </p>
                    <p style={{ fontSize: '0.95rem', color: '#4a0e4e' }}>
                      Click + below to snap your first item! 📷
                    </p>
                  </div>
                ) : (
                  <IonGrid>
                    <IonRow>
                      {filteredItems.map((item) => (
                        <IonCol size="6" key={item.id} style={{ marginBottom: '20px' }}>
                          <div style={{
                            position: 'relative',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transform: outfit.includes(item.id) ? 'scale(0.95)' : 'scale(1)',
                            transition: 'all 0.3s ease',
                            border: outfit.includes(item.id) ? '4px solid #ff1493' : '3px solid #ffb6e1',
                            boxShadow: outfit.includes(item.id)
                              ? '0 0 30px rgba(255, 20, 147, 0.6), inset 0 0 20px rgba(255, 65, 145, 0.2)'
                              : '0 8px 20px rgba(255, 105, 180, 0.25)'
                          }}>
                            <IonImg
                              src={item.photoBase64}
                              style={{
                                width: '100%',
                                aspectRatio: '1 / 1',
                                objectFit: 'cover',
                                display: 'block',
                                opacity: outfit.includes(item.id) ? 0.9 : 1
                              }}
                            />

                            {/* CATEGORY & COLOR & SIZE LABEL */}
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)',
                              padding: '15px 10px 10px',
                              textAlign: 'center',
                              cursor: 'pointer'
                            }} onClick={() => toggleOutfitItem(item.id)}>
                              <div style={{
                                fontWeight: 'bold',
                                color: '#ffffff',
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                              }}>
                                {item.tags.category}
                                {item.tags.size && ` (${item.tags.size})`}
                              </div>
                              {item.tags.color && (
                                <div style={{
                                  color: '#ffb6e1',
                                  fontSize: '0.75rem',
                                  marginTop: '3px'
                                }}>
                                  {item.tags.color} 💕
                                </div>
                              )}
                              {item.tags.occasion && (
                                <div style={{
                                  color: '#ffd700',
                                  fontSize: '0.7rem',
                                  marginTop: '2px'
                                }}>
                                  {item.tags.occasion}
                                </div>
                              )}
                            </div>

                            {/* DELETE BUTTON */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(item.id);
                              }}
                              style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                background: 'rgba(255, 20, 147, 0.9)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#ffffff',
                                fontSize: '1.2rem',
                                boxShadow: '0 4px 15px rgba(255, 20, 147, 0.5)',
                                transition: 'all 0.3s ease',
                                zIndex: 10
                              }}
                              onMouseEnter={(e) => {
                                (e.target as HTMLButtonElement).style.background = 'rgba(255, 20, 147, 1)';
                                (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.background = 'rgba(255, 20, 147, 0.9)';
                                (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                              }}
                            >
                              <IonIcon icon={trash} />
                            </button>

                            {/* FAVORITE BUTTON */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(item.id);
                              }}
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: item.isFavorite ? '#ff1493' : '#ff69b4',
                                fontSize: '1.4rem',
                                boxShadow: '0 4px 15px rgba(255, 20, 147, 0.4)',
                                transition: 'all 0.3s ease',
                                zIndex: 10
                              }}
                              onMouseEnter={(e) => {
                                (e.target as HTMLButtonElement).style.transform = 'scale(1.15)';
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                              }}
                            >
                              <IonIcon icon={item.isFavorite ? heart : heartOutline} />
                            </button>

                            {/* SELECTED CHECKMARK */}
                            {outfit.includes(item.id) && (
                              <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                background: '#ff1493',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                boxShadow: '0 4px 15px rgba(255, 20, 147, 0.5)',
                                color: '#ffffff'
                              }}>
                                ✓
                              </div>
                            )}

                            {/* STYLE TIPS TOOLTIP */}
                            {item.styleTips && (
                              <div style={{
                                position: 'absolute',
                                top: '55px',
                                right: '10px',
                                background: 'rgba(0, 0, 0, 0.9)',
                                color: '#ffb6e1',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                fontSize: '0.7rem',
                                maxWidth: '120px',
                                display: 'none',
                                zIndex: 20
                              }} className="style-tip">
                                💡 {item.styleTips}
                              </div>
                            )}
                          </div>
                        </IonCol>
                      ))}
                    </IonRow>
                  </IonGrid>
                )}
              </div>
            </>
          )}

          {/* SAVED OUTFITS TAB */}
          {activeTab === 'outfits' && (
            <div style={{ padding: '20px 15px 100px 15px' }}>
              {outfits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4a0e4e' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>
                    No Saved Outfits Yet 💙
                  </h2>
                  <p style={{ fontSize: '1rem' }}>
                    Build an outfit and save it to collect your favs!
                  </p>
                </div>
              ) : (
                <IonGrid>
                  <IonRow>
                    {outfits.map((savedOutfit) => (
                      <IonCol size="12" key={savedOutfit.id} style={{ marginBottom: '20px' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 245, 0.95) 100%)',
                          border: '3px solid #ff69b4',
                          borderRadius: '20px',
                          padding: '20px',
                          boxShadow: '0 8px 20px rgba(255, 105, 180, 0.25)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ color: '#ff1493', margin: '0 0 5px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                {savedOutfit.name} 💕
                              </h3>
                              {savedOutfit.occasion && (
                                <p style={{ color: '#ff69b4', margin: '0', fontSize: '0.9rem' }}>
                                  Perfect for: {savedOutfit.occasion}
                                </p>
                              )}
                              
                              {/* RATING STARS */}
                              <div style={{ display: 'flex', gap: '5px', marginTop: '8px', alignItems: 'center' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => rateOutfit(savedOutfit.id, star)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      fontSize: '1.2rem',
                                      padding: '0',
                                      color: star <= (savedOutfit.rating || 0) ? '#ffd700' : '#ddd'
                                    }}
                                  >
                                    ★
                                  </button>
                                ))}
                                {(savedOutfit.rating || 0) > 0 && (
                                  <span style={{ fontSize: '0.85rem', color: '#ff69b4', marginLeft: '5px' }}>
                                    {savedOutfit.rating} stars
                                  </span>
                                )}
                              </div>

                              {/* WEAR COUNT */}
                              {(savedOutfit.wornCount || 0) > 0 && (
                                <p style={{ color: '#4a0e4e', fontSize: '0.85rem', margin: '5px 0 0 0', fontWeight: 'bold' }}>
                                  👗 Worn {savedOutfit.wornCount} time{(savedOutfit.wornCount || 0) !== 1 ? 's' : ''}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteOutfit(savedOutfit.id);
                              }}
                              style={{
                                background: 'rgba(255, 20, 147, 0.8)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '35px',
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#ffffff',
                                fontSize: '1.1rem',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                (e.target as HTMLButtonElement).style.background = 'rgba(255, 20, 147, 1)';
                              }}
                              onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.background = 'rgba(255, 20, 147, 0.8)';
                              }}
                            >
                              ✕
                            </button>
                          </div>

                          {/* SAVED OUTFIT ITEMS */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '10px',
                            marginBottom: '15px'
                          }}>
                            {savedOutfit.itemIds
                              .slice(0, 3)
                              .map((itemId) => {
                                const item = items.find((i) => i.id === itemId);
                                return (
                                  item && (
                                    <div key={itemId} style={{
                                      width: '100%',
                                      aspectRatio: '1 / 1',
                                      borderRadius: '12px',
                                      overflow: 'hidden',
                                      border: '2px solid #ffb6e1'
                                    }}>
                                      <IonImg src={item.photoBase64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                  )
                                );
                              })}
                          </div>

                          {savedOutfit.styleTips && (
                            <p style={{ color: '#4a0e4e', fontSize: '0.9rem', fontStyle: 'italic', margin: '0 0 15px 0' }}>
                              💡 {savedOutfit.styleTips}
                            </p>
                          )}

                          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                            <IonButton
                              expand="block"
                              size="small"
                              style={{
                                background: '#ff69b4',
                                color: '#ffffff',
                                borderRadius: '15px',
                                fontWeight: 'bold'
                              }}
                              onClick={() => setOutfit(savedOutfit.itemIds)}
                            >
                              Load This Outfit 💁‍♀️
                            </IonButton>
                            <IonButton
                              expand="block"
                              size="small"
                              fill="outline"
                              style={{
                                borderColor: '#ff69b4',
                                color: '#ff69b4',
                                borderRadius: '15px',
                                fontWeight: 'bold'
                              }}
                              onClick={() => logOutfitWear(savedOutfit.id)}
                            >
                              Wore It Today! 🎉
                            </IonButton>
                          </div>
                        </div>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              )}
            </div>
          )}

          {/* ADD BUTTON */}
          <IonFab vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton
              color="secondary"
              onClick={handleAddClick}
              style={{
                background: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
                boxShadow: '0 8px 25px rgba(255, 20, 147, 0.4)',
                width: '70px',
                height: '70px'
              }}
            >
              <IonIcon icon={addCircle} style={{ fontSize: '2.5rem' }} />
            </IonFabButton>
          </IonFab>

          <CategorizeModal
            isOpen={showModal}
            onDismiss={() => setShowModal(false)}
            onSave={handleSaveTags}
          />

          <SaveOutfitModal
            isOpen={showSaveOutfitModal}
            onDismiss={() => setShowSaveOutfitModal(false)}
            onSave={handleSaveOutfit}
          />
        </IonContent>
      </IonPage>
    </DndProvider>
  );
};

// Keep your DraggableItem and DropZone components

export default MyCloset;