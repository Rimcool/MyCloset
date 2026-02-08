import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/react';
import { camera, cloudUpload, colorPalette } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import InterfaceSelector from '../components/InterfaceSelector';
import { useTheme } from '../context/ThemeContext';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showInterfaceSelector, setShowInterfaceSelector] = useState(false);
  const { currentInterface } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // fake 90s load
    return () => clearTimeout(timer);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Welcome 2 MyCloset 💿</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-gradient)' } as React.CSSProperties}>
        <LoadingScreen isOpen={loading} />

        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 100 }}>
          <IonButton fill="solid" size="small" onClick={() => setShowInterfaceSelector(true)} style={{ background: '#ffffff', color: '#ff1493', borderRadius: '50px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(255, 20, 147, 0.4)', padding: '10px 5px' }}>
            <IonIcon slot="start" icon={colorPalette} />
            Vibe
          </IonButton>
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#2d1b3d', textShadow: 'none', fontWeight: 'bold', marginBottom: '15px' }}>
            ✨ Build Ur Closet ✨
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#4a0e4e', textShadow: 'none', marginBottom: '30px', fontWeight: '600' }}>
            Snap or pick clothes & slay any vibe 🐱💕
          </p>

          <IonButton expand="block" size="large" routerLink="/tabs/closet" style={{ margin: '30px 0', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 'bold', background: '#ff1493', boxShadow: '0 8px 20px rgba(255, 20, 147, 0.4)' }}>
            <IonIcon slot="start" icon={camera} />
            Take Photo 📸
          </IonButton>

          <IonButton expand="block" fill="outline" size="large" style={{ margin: '15px 0', borderRadius: '20px', fontSize: '1.1rem', fontWeight: 'bold', borderColor: '#4a0e4e', color: '#4a0e4e' }}>
            <IonIcon slot="start" icon={cloudUpload} />
            Upload from Gallery 🖼️
          </IonButton>

          <p style={{ marginTop: '80px', color: '#4a0e4e', textShadow: 'none', fontSize: '1.1rem', fontWeight: '500' }}>
            90s pink vibes... floppy disk energy 💾🎀✨
          </p>
        </div>

        <InterfaceSelector
          isOpen={showInterfaceSelector}
          onDismiss={() => setShowInterfaceSelector(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;