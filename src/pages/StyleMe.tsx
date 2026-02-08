import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useCloset } from '../hooks/usePhotoGallery';

const StyleMe: React.FC = () => {
  const { items } = useCloset(); // user's saved clothes
  const [eventDescription, setEventDescription] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const suggestOutfit = () => {
    if (!eventDescription.trim()) {
      setSuggestions(['Please describe the occasion! (party, office, date, wedding...)']);
      return;
    }

    setLoading(true);
    setSuggestions([]);

    // Offline outfit suggestion engine - no API needed!
    setTimeout(() => {
      // Categorize user's items
      const dresses = items.filter(i => i.tags.category === 'Dress');
      const shalwarKameez = items.filter(i => i.tags.category === 'Shalwar Kameez');
      const kurtas = items.filter(i => i.tags.category === 'Kurta');
      const lehengas = items.filter(i => i.tags.category === 'Lehenga');
      const sarees = items.filter(i => i.tags.category === 'Saree');
      const tops = items.filter(i => ['Top', 'Kurta'].includes(i.tags.category));
      const bottoms = items.filter(i => ['Bottom', 'Salwar'].includes(i.tags.category));
      const shoes = items.filter(i => i.tags.category === 'Shoes');
      const accessories = items.filter(i => ['Jewelry', 'Accessories', 'Dupatta', 'Chunni', 'Shawl'].includes(i.tags.category));

      const occasion = eventDescription.toLowerCase();
      const isFormal = /wedding|formal|office|corporate|dinner|gala/.test(occasion);
      const isCasual = /casual|coffee|lunch|brunch|hangout|chill/.test(occasion);
      const isFestive = /party|birthday|celebration|festive|festival|night|dance/.test(occasion);

      const outfits: string[] = [];

      // Suggest outfits from what user has - even if limited!
      if (items.length === 0) {
        setSuggestions(["Add some items to your closet first! 📸"]);
        setLoading(false);
        return;
      }

      // Outfit 1: Any single item or mix
      if (items.length >= 1) {
        const item1 = items[Math.floor(Math.random() * items.length)];
        outfits.push(`1. ${item1.tags.category}${item1.tags.color ? ` (${item1.tags.color})` : ''} - Perfect choice!`);
      }

      // Outfit 2: Two items mixed
      if (items.length >= 2) {
        const idx1 = Math.floor(Math.random() * items.length);
        let idx2 = Math.floor(Math.random() * items.length);
        while (idx2 === idx1) idx2 = Math.floor(Math.random() * items.length);
        const item1 = items[idx1];
        const item2 = items[idx2];
        outfits.push(`2. ${item1.tags.category}${item1.tags.color ? ` (${item1.tags.color})` : ''} + ${item2.tags.category}${item2.tags.color ? ` (${item2.tags.color})` : ''} - Great combo!`);
      }

      // Outfit 3: Another mix
      if (items.length >= 3) {
        let idx1 = Math.floor(Math.random() * items.length);
        let idx2 = Math.floor(Math.random() * items.length);
        while (idx2 === idx1) idx2 = Math.floor(Math.random() * items.length);
        const item1 = items[idx1];
        const item2 = items[idx2];
        outfits.push(`3. ${item1.tags.category}${item1.tags.color ? ` (${item1.tags.color})` : ''} + ${item2.tags.category}${item2.tags.color ? ` (${item2.tags.color})` : ''} with style!`);
      } else if (items.length === 2) {
        outfits.push(`3. Mix & match your items! Add more clothes to unlock more outfit ideas 💫`);
      }

      setSuggestions(outfits.length > 0 ? outfits : ["Add more items to your closet so I can make better suggestions! 💫"]);
      setLoading(false);
    }, 800); // Simulate thinking time
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Style Me 🐱✨</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <LoadingScreen isOpen={loading} />

        <IonCard style={{ margin: '20px', background: '#ffff99', border: '4px dashed #ff69b4' }}>
          <IonCardHeader>
            <IonCardTitle>What's the occasion?</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              placeholder="party tonight... office meeting... wedding guest... casual coffee..."
              value={eventDescription}
              onIonChange={(e) => setEventDescription(e.detail.value || '')}
              style={{
                border: '3px inset #000080',
                background: '#ffffff',
                padding: '12px',
                fontSize: '1.2rem',
              }}
            />

            <IonButton
              expand="block"
              color="secondary"
              onClick={suggestOutfit}
              disabled={loading}
              style={{ marginTop: '20px' }}
            >
              {loading ? 'Asking the AI...' : 'Get Outfit Ideas'}
            </IonButton>


          </IonCardContent>
        </IonCard>

        {items.length === 0 && !loading && (
          <IonNote color="medium" style={{ display: 'block', textAlign: 'center', margin: '20px' }}>
            Your closet is empty! Go to "My Closet" and add some items first 💿
          </IonNote>
        )}

        {suggestions.length > 0 && (
          <IonCard style={{ margin: '20px', background: '#c0c0c0', border: '4px outset #ffffff' }}>
            <IonCardHeader>
              <IonCardTitle>Suggested Outfits</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonList>
                {suggestions.map((idea, index) => (
                  <IonItem key={index} style={{ margin: '12px 0' }}>
                    <IonLabel>{idea}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default StyleMe;