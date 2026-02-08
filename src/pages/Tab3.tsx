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
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useCloset } from '../hooks/usePhotoGallery';  // Reuse the hook

const StyleMe: React.FC = () => {
  const { items } = useCloset();  // Get all saved user clothes
  const [eventDescription, setEventDescription] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const suggestOutfit = async () => {
    if (!eventDescription.trim()) {
      setSuggestions(['Please describe the occasion first! (party, office, wedding, casual date...)']);
      return;
    }

    setLoading(true);

    // Build list of user's clothes for AI prompt
    const userCloset = items.map(item => 
      `${item.tags.category}${item.tags.color ? ` (${item.tags.color})` : ''}`
    ).join(', ');

    // Simple fake logic for now (replace with real Gemini/OpenAI later)
    const fakeIdeas = [
      `For "${eventDescription}": Try your ${userCloset.split(', ')[0] || 'favorite top'} + ${userCloset.split(', ')[1] || 'jeans'}. Classic combo!`,
      `Alternative: ${userCloset.includes('Dress') ? 'Your dress' : 'Layer a top and bottom'} — perfect for this vibe.`,
      `Quick option: ${userCloset.split(', ').slice(0,2).join(' + ')} — super easy and stylish.`,
    ];

    // Simulate AI delay
    setTimeout(() => {
      setSuggestions(fakeIdeas);
      setLoading(false);
    }, 1500);
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
            <IonCardTitle>Describe the occasion</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              placeholder="e.g. party tonight, office meeting, casual coffee..."
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
              style={{ marginTop: '20px' }}
            >
              Get Outfit Ideas
            </IonButton>
          </IonCardContent>
        </IonCard>

        {items.length === 0 && (
          <IonNote color="medium" style={{ display: 'block', textAlign: 'center', margin: '20px' }}>
            No clothes saved yet. Go to "My Closet" and add some items first!
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