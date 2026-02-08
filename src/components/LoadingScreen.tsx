import { IonLoading } from '@ionic/react';

interface LoadingScreenProps {
  isOpen: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isOpen }) => {
  return (
    <IonLoading
      isOpen={isOpen}
      message="90s Vibes Loading... 💿✨"
      spinner="dots"
      cssClass="retro-loading"
      duration={3000} // auto-hide after 3s
    />
  );
};

export default LoadingScreen;