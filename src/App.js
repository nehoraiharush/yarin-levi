import { Routes, Route, HashRouter } from 'react-router-dom';

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
import TrainerTrack from './screens/TrainerTrack.js';
import Rectangle from './components/Rectangle.js';


import { ToastContainer, Zoom } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
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
      <TrainerProvider>

        <HashRouter basename='/'>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<HomeScreen />} />
            <Route path='/training-info/:id/:type' element={<TrainingPage />} />
            <Route path='/editor/:id/:type' element={<Editor />} />
            <Route path='/all-trainers' element={<TrainersCards />} />
            <Route path='/trainer-dashboard/:id' element={<TrainerDashboard />} />
            <Route path='/trainer-track/:id' element={<TrainerTrack />} />

            <Route path='/*' element={<NotFoundPage />} />
          </Routes>
        </HashRouter>

      </TrainerProvider>
      <Rectangle />
    </div>
  );
}

export default App;