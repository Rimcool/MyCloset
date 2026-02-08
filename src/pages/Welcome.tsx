import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonImg,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { useEffect, useState } from 'react';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Optional: nice icons for slides
import { shirtOutline, cameraOutline, sparklesOutline } from 'ionicons/icons';

const Welcome: React.FC = () => {
  const history = useHistory();
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const { value } = await Preferences.get({ key: 'hasSeenOnboarding' });
      if (value === 'true') {
        setIsFirstLaunch(false);
        history.replace('/tabs/closet'); // Important: use the correct tab path
      }
    };
    checkFirstLaunch();
  }, [history]);

  const finishOnboarding = async () => {
    await Preferences.set({ key: 'hasSeenOnboarding', value: 'true' });
    history.replace('/tabs/closet');
  };

  if (!isFirstLaunch) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome to MyCloset</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={1}
          className="welcome-swiper"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <IonCard className="ion-text-center">
              <IonCardHeader>
                <IonIcon icon={shirtOutline} size="large" color="primary" />
                <IonCardTitle>Welcome!</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  MyCloset is your personal digital wardrobe.<br />
                  Take photos of the clothes you own, organize them, and get smart AI suggestions for any occasion — party, office, wedding, casual date, and more!
                </p>
                <IonImg
                  src="https://via.placeholder.com/320x240?text=Your+Closet+Grid"
                  alt="Closet example"
                  style={{ margin: '20px auto', maxWidth: '80%' }}
                />
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <IonCard className="ion-text-center">
              <IonCardHeader>
                <IonIcon icon={cameraOutline} size="large" color="primary" />
                <IonCardTitle>Start Building Your Closet</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  Let's begin! Take or upload photos of your clothes now.<br />
                  The more items you add, the better the outfit ideas will be.
                </p>
                <IonButton expand="block" color="primary" routerLink="/tabs/closet">
                  Add My First Clothes
                </IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <IonCard className="ion-text-center">
              <IonCardHeader>
                <IonIcon icon={sparklesOutline} size="large" color="primary" />
                <IonCardTitle>Ready?</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>
                  Go to the "Style Me" tab anytime to describe an event<br />
                  and get personalized outfit ideas from your own clothes.
                </p>
                <IonButton expand="block" color="success" onClick={finishOnboarding}>
                  Get Started!
                </IonButton>
              </IonCardContent>
            </IonCard>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;