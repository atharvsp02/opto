import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import MainPage from './Components/Main/MainPage';
import Profile from './Components/Profile/Profile';
import './App.css'

function App() {
  return (
    <>
      <div className="">
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

export default App;



