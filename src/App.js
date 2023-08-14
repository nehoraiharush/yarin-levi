import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { TrainerProvider } from './components/TrainerContexts.js';

import TrainingPage from './components/Page.js';
//SCREENS
import HomeScreen from './screens/HomeScreen.js';
import Login from './screens/Login.js';
import Signup from './screens/Signup.js';
import Editor from './screens/Editor.js';
import TrainersCards from './screens/TrainersCards.js';
import NotFoundPage from './screens/NotFoundPage.js';
import TrainerDashboard from './screens/TrainerDashboard.js';
import { UserProvider } from './components/UserContext.js';
import { ToastContainer, Zoom } from 'react-toastify';

export const APPNAME = '/yarin-levi'


function App() {
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        transition={Zoom}
        newestOnTop={true}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* <UserProvider> */}
      <TrainerProvider>

        <BrowserRouter>
          <Routes>
            <Route path={`${APPNAME}/login`} element={<Login />} />
            <Route path={`${APPNAME}/signup`} element={<Signup />} />
            <Route path={`${APPNAME}/`} element={<HomeScreen />} />
            <Route path={`${APPNAME}/training-info/:id`} element={<TrainingPage />} />
            <Route path={`${APPNAME}/editor/:id`} element={<Editor />} />
            <Route path={`${APPNAME}/all-trainers`} element={<TrainersCards />} />
            <Route path={`${APPNAME}/trainer-dashboard/:id`} element={<TrainerDashboard />} />

            <Route path={`${APPNAME}/*`} element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>

      </TrainerProvider>
      {/* </UserProvider> */}
    </div>
  );
}

export default App;
