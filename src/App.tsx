import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// Pages
import Welcome from './pages/Welcome'; // ← NEW
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import StyleMe from './pages/StyleMe';

// Theme
import { ThemeProvider } from './context/ThemeContext';

// Icons
import { home, images, square, sparkles } from 'ionicons/icons';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const AppContent: React.FC = () => (
  <IonReactRouter>
    <IonRouterOutlet>
      {/* Welcome shown first if onboarding not seen */}
      <Route exact path="/" component={Welcome} />
      <Route exact path="/welcome" component={Welcome} />

      {/* Tabs wrapper */}
      <Route path="/tabs" render={() => (
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tabs/home" component={Tab1} />
            <Route exact path="/tabs/closet" component={Tab2} />
            <Route exact path="/tabs/style-me" component={StyleMe} />
            <Route exact path="/tabs">
              <Redirect to="/tabs/home" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/tabs/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="closet" href="/tabs/closet">
              <IonIcon icon={images} />
              <IonLabel>My Closet</IonLabel>
            </IonTabButton>
            <IonTabButton tab="style-me" href="/tabs/style-me">
              <IonIcon icon={sparkles} />
              <IonLabel>Style Me</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      )} />

      {/* Redirect root to tabs after onboarding */}
      <Route exact path="/">
        <Redirect to="/welcome" />
      </Route>
    </IonRouterOutlet>
  </IonReactRouter>
);

const App: React.FC = () => (
  <IonApp>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </IonApp>
);

export default App;