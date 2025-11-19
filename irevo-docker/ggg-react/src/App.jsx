import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Home from './pages/Home/Home';
import Company from './pages/Company/Company';
import ModalButton from './components/ModalButton/ModalButton';
import Mypage from './pages/Mypage/Mypage';
import Faq from './pages/Faq/Faq';
import Chat from './pages/Chat/Chat';
import Resumeform from './pages/Resumeform/Resumeform.jsx';
import Offer from './company/Offer/Offer.jsx';
import Login from './pages/Login/Login';
import Favorite from './pages/Favorite/FavoritePage.jsx';
import NewReg from './pages/NewReg/NewReg.jsx';
// import Pr from './components/Pr/tabNav/TabNav.jsx'

import Map from './pages/Map/Map';
import Mytype from './pages/Mytype/Mytype';
import Test from './pages/Test/Test';
import About from './pages/About/About';
import Terms from './pages/Terms/Terms.jsx';
import Privacy from './pages/Privacy/Privacy.jsx';
import Resume from './pages/Resume/Resume.jsx';
import TestChat from './pages/TestChat/Testchat.jsx';
import Pr from './components/Pr/tabNav/TabNav.jsx'
// import Map from './pages/Map/Map';
import Admin from './admin/gggadmin';
import GggAdmin from './admin/gggadmin';
import Contact from './pages/Contact/Contact.jsx';
import ChatAPIPage from './pages/ChatBot/ChatPage.jsx'
import Gas from './pages/gas/Gas.jsx';
import Jobmap from './pages/Jobmap/Jobmap.jsx';
import ApplyPage from './pages/Apply/Apply.jsx'; // 追加
import ResumeBot from './pages/ResumeBot/ResumeBot.jsx';
import C_Login from'./company/C_Login/C_Login.jsx';
import C_Dashboard from'./company/C_Dashboard/C_Dashboard';
import C_NewReg from'./company/C_NewReg/C_NewReg.jsx';
import C_Chat from './company/C_Chat/C_Chat.jsx';
import C_Aplicant from './company/C_Applicant/C_Applicant.jsx';
import TestMytype from './pages/TestMytype/TestMytype.jsx';

function App() {

  return (
    <>
      {<BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Company" element={<Company />} />
          <Route path="/Mypage" element={<Mypage />}/>
          <Route path="/Faq" element={<Faq />}/>
          <Route path="/Chat" element={<Chat />}/>
          <Route path="/Resumeform" element={<Resumeform />}/>
          <Route path="/Offer" element={<Offer />}/>
          <Route path="/Login" element={<Login />} />
          <Route path="/Map" element={<Map />} />
          <Route path="/Mytype" element={<Mytype />}/>
          <Route path="/Test" element={<Test />} />
          <Route path="/About" element={<About />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/Privacy" element={<Privacy />} />
          <Route path="/Favorite" element={<Favorite />} />
          <Route path="/Resume" element={<Resume />} />
          <Route path="/NewReg" element={<NewReg />} />
          <Route path="/chat-api" element={<ChatAPIPage />} /> 
          <Route path="/Testchat" element={<TestChat />} /> 
          <Route path="/Jobmap" element={<Jobmap />} />
          <Route path="/Admin/*" element={<GggAdmin />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Gas" element={<Gas />} />
          <Route path="/apply/:id" element={<ApplyPage />} />
          <Route path="/apply" element={<ApplyPage />} /> {/* id なしでも対応させたい場合 */}
          <Route path="/ResumeBot" element={<ResumeBot />} />
          <Route path="/C_Login" element={<C_Login />} />
          <Route path="/C_Dashboard" element={<C_Dashboard />} />
          <Route path="/C_NewReg" element={<C_NewReg />} />
          <Route path="/C_Chat" element={<C_Chat />} />
          <Route path="/C_Applicant" element={<C_Aplicant />} />
          <Route path="/TestMytype" element={<TestMytype />} />
        </Routes>
      </BrowserRouter>}
    </>
  )
}

export default App
