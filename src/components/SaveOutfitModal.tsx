import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
} from '@ionic/react';
import { useState } from 'react';

interface SaveOutfitModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSave: (data: {
    name: string;
    occasion?: string;
    styleTips?: string;
  }) => void;
}

const SaveOutfitModal: React.FC<SaveOutfitModalProps> = ({ isOpen, onDismiss, onSave }) => {
  const [outfitName, setOutfitName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [styleTips, setStyleTips] = useState('');

  const handleSave = () => {
    if (!outfitName.trim()) {
      alert('Please give your outfit a cute name!');
      return;
    }
    onSave({
      name: outfitName,
      occasion: occasion || undefined,
      styleTips: styleTips || undefined,
    });
    setOutfitName('');
    setOccasion('');
    setStyleTips('');
    onDismiss();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Save This Slay! 💁‍♀️</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h3 style={{ color: '#4a0e4e', marginBottom: '20px', fontWeight: 'bold' }}>
          Name Your Outfit
        </h3>

        <IonItem>
          <IonLabel position="stacked">Outfit Name *</IonLabel>
          <IonInput
            type="text"
            value={outfitName}
            onIonChange={(e) => setOutfitName(e.detail.value || '')}
            placeholder="e.g., Monday Vibes, Party Ready, Date Night"
          />
        </IonItem>

        <IonItem>
          <IonLabel>Occasion</IonLabel>
          <IonSelect value={occasion} onIonChange={(e) => setOccasion(e.detail.value || '')}>
            <IonSelectOption value="">Not specified</IonSelectOption>
            <IonSelectOption value="Casual">Casual</IonSelectOption>
            <IonSelectOption value="Work">Work</IonSelectOption>
            <IonSelectOption value="Party">Party</IonSelectOption>
            <IonSelectOption value="Date">Date</IonSelectOption>
            <IonSelectOption value="Gym">Gym</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Style Notes</IonLabel>
          <IonTextarea
            value={styleTips}
            onIonChange={(e) => setStyleTips(e.detail.value || '')}
            placeholder="e.g., Wore to brunch, got compliments! Add heels for height"
            rows={3}
          />
        </IonItem>

        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
          <IonButton expand="block" color="medium" onClick={onDismiss}>
            Cancel
          </IonButton>
          <IonButton expand="block" color="primary" onClick={handleSave}>
            Save Outfit 💕
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default SaveOutfitModal;
