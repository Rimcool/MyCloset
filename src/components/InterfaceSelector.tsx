import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
} from '@ionic/react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface InterfaceSelectorProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const InterfaceSelector: React.FC<InterfaceSelectorProps> = ({
  isOpen,
  onDismiss,
}) => {
  const { currentInterface, setCurrentInterface } = useTheme();
  const [selectedInterface, setSelectedInterface] = useState(currentInterface);

  const interfaces = [
    {
      id: 'retro',
      name: '90s Retro Classic',
      description: 'The OG floppy disk vibes 💾',
    },
    {
      id: 'modern',
      name: 'Modern Clean',
      description: 'Sleek and minimalist design',
    },
    {
      id: 'dark',
      name: 'Dark Cyberpunk',
      description: 'Neon goth aesthetic ✨',
    },
    {
      id: 'pastel',
      name: 'Pastel Dreamy',
      description: 'Soft kawaii vibes 🎀',
    },
  ];

  const handleConfirm = () => {
    setCurrentInterface(selectedInterface as 'retro' | 'modern' | 'dark' | 'pastel');
    onDismiss();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Choose Your Vibe ✨</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h3 style={{ marginTop: '20px', marginBottom: '20px', color: '#4a0e4e', fontSize: '1.3rem', fontWeight: 'bold', textShadow: 'none' }}>
          Pick your vibe, babe! ✨💕
        </h3>

        <IonRadioGroup value={selectedInterface} onIonChange={(e) => setSelectedInterface(e.detail.value)}>
          {interfaces.map((iface) => (
            <IonItem key={iface.id} style={{ marginBottom: '15px', border: '3px solid #ff69b4', borderRadius: '15px', background: 'rgba(255, 255, 255, 0.95)' }}>
              <IonLabel>
                <div style={{ fontWeight: 'bold', color: '#4a0e4e', fontSize: '1.1rem' }}>
                  {iface.name}
                </div>
                <div style={{ color: '#8b3a62', fontSize: '0.9rem' }}>
                  {iface.description}
                </div>
              </IonLabel>
              <IonRadio slot="start" value={iface.id} style={{ accentColor: '#ff1493' }} />
            </IonItem>
          ))}
        </IonRadioGroup>

        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
          <IonButton expand="block" color="medium" onClick={onDismiss} style={{ borderRadius: '15px' }}>
            Cancel
          </IonButton>
          <IonButton expand="block" onClick={handleConfirm} style={{ borderRadius: '15px', background: '#ff1493' }}>
            Apply Vibe 💕
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default InterfaceSelector;
