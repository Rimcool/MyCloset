import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
} from '@ionic/react';
import { useState } from 'react';

interface CategorizeModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSave: (
    tags: {
      category: string;
      color?: string;
      occasion?: string;
      size?: string;
      fitNotes?: string;
    },
    styleTips?: string
  ) => void;
}

const CategorizeModal: React.FC<CategorizeModalProps> = ({ isOpen, onDismiss, onSave }) => {
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#ff69b4');
  const [occasion, setOccasion] = useState('');
  const [size, setSize] = useState('');
  const [fitNotes, setFitNotes] = useState('');
  const [styleTips, setStyleTips] = useState('');

  const handleSave = () => {
    if (!category) {
      alert('Please select a category!');
      return;
    }
    onSave(
      {
        category,
        color: color || undefined,
        occasion: occasion || undefined,
        size: size || undefined,
        fitNotes: fitNotes || undefined,
      },
      styleTips || undefined
    );
    onDismiss();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Tag Your Piece 🎀</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel>Category *</IonLabel>
          <IonSelect value={category} onIonChange={(e) => setCategory(e.detail.value)}>
            <IonSelectOption value="Shalwar Kameez">Shalwar Kameez</IonSelectOption>
            <IonSelectOption value="Kurta">Kurta</IonSelectOption>
            <IonSelectOption value="Salwar">Salwar</IonSelectOption>
            <IonSelectOption value="Dupatta">Dupatta</IonSelectOption>
            <IonSelectOption value="Lehenga">Lehenga</IonSelectOption>
            <IonSelectOption value="Saree">Saree</IonSelectOption>
            <IonSelectOption value="Shawl">Shawl</IonSelectOption>
            <IonSelectOption value="Chunni">Chunni</IonSelectOption>
            <IonSelectOption value="Sharara">Sharara</IonSelectOption>
            <IonSelectOption value="Gharara">Gharara</IonSelectOption>
            <IonSelectOption value="Shoes">Shoes</IonSelectOption>
            <IonSelectOption value="Jewelry">Jewelry</IonSelectOption>
            <IonSelectOption value="Accessories">Accessories</IonSelectOption>
            <IonSelectOption value="Top">Top</IonSelectOption>
            <IonSelectOption value="Bottom">Bottom</IonSelectOption>
            <IonSelectOption value="Dress">Dress</IonSelectOption>
            <IonSelectOption value="Outerwear">Outerwear</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Color</IonLabel>
          <IonInput
            type="text"
            value={color}
            onIonChange={(e) => setColor(e.detail.value || '')}
            placeholder="e.g., Pink, Blue"
          />
        </IonItem>

        <IonItem>
          <IonLabel>Best For (Occasion)</IonLabel>
          <IonSelect value={occasion} onIonChange={(e) => setOccasion(e.detail.value || '')}>
            <IonSelectOption value="">None</IonSelectOption>
            <IonSelectOption value="Casual">Casual</IonSelectOption>
            <IonSelectOption value="Work">Work</IonSelectOption>
            <IonSelectOption value="Party">Party</IonSelectOption>
            <IonSelectOption value="Date">Date</IonSelectOption>
            <IonSelectOption value="Gym">Gym</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Size</IonLabel>
          <IonSelect value={size} onIonChange={(e) => setSize(e.detail.value || '')}>
            <IonSelectOption value="">Not specified</IonSelectOption>
            <IonSelectOption value="XS">XS</IonSelectOption>
            <IonSelectOption value="S">S</IonSelectOption>
            <IonSelectOption value="M">M</IonSelectOption>
            <IonSelectOption value="L">L</IonSelectOption>
            <IonSelectOption value="XL">XL</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Fit Notes (e.g., runs small, flowy)</IonLabel>
          <IonInput
            type="text"
            value={fitNotes}
            onIonChange={(e) => setFitNotes(e.detail.value || '')}
            placeholder="How does it fit?"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Style Tips</IonLabel>
          <IonTextarea
            value={styleTips}
            onIonChange={(e) => setStyleTips(e.detail.value || '')}
            placeholder="e.g., Layer with blazer for work, tuck in for fitted look"
            rows={3}
          />
        </IonItem>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <IonButton expand="block" color="medium" onClick={onDismiss}>
            Cancel
          </IonButton>
          <IonButton expand="block" color="primary" onClick={handleSave}>
            Save 💕
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default CategorizeModal;