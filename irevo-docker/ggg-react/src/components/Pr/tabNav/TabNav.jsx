import React, { useState } from 'react';
import Skill from '../pr/skill/Skill';
import Study from '../pr/study/Study';
import Data  from '../pr/basic/BasicData';
import DB from '../pr/db/DB'
import FrameWork  from '../pr/framework/FrameWork'
import Cloud from '../pr/cloud/Cloud'
import Support from '../pr/supporttool/Supporttool'
import Other from '../pr/other/OtherDevelopment'
import './tab.css';
import Content from '../pr/StudyContent/StudyContent';
import Albite from '../pr/albite/Albite'
import Intern from '../pr/Intern/Intern'

import Choose from '../pr/Choose/Choose.jsx'
import Type from '../pr/type/Type.jsx'
import Location from '../pr/Location/Location.jsx'
import JobType from '../pr/JobType/JobType.jsx'
import Industry from '../pr/industry/Industry.jsx'
import Desiredskill from '../pr/DesiredSkill/DesiredSkill.jsx'
import DesiredOther from '../pr/DesiredOther/DesiredOther.jsx'


const TabNav = ({ user }) => {
  // アクティブなタブの状態を管理
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="container mt-5">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home"
            type="button"
            role="tab"
            aria-controls="home"
            aria-selected={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          >
            基本情報
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile"
            type="button"
            role="tab"
            aria-controls="profile"
            aria-selected={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          >
            スキルPR
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
            id="contact-tab"
            data-bs-toggle="tab"
            data-bs-target="#contact"
            type="button"
            role="tab"
            aria-controls="contact"
            aria-selected={activeTab === 'contact'}
            onClick={() => setActiveTab('contact')}
          >
            経歴情報
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
          className={`nav-link ${activeTab === 'test' ? 'active' : ''}`} 
          id="test-tab" 
          data-bs-toggle="tab" 
          data-bs-target="#test" 
          type="button" 
          role="tab" 
          aria-controls="test" 
          aria-selected="false"
          onClick={() => setActiveTab('test')}
          >
            希望条件
          </button>
        </li>

      </ul>

      <div className="tab-content" id="myTabContent">
        <div
          className={`tab-pane fade ${activeTab === 'home' ? 'show active' : ''} p-3`}
          id="home"
          role="tabpanel"
          aria-labelledby="home-tab"
        >
          <Data user={user} />
        </div>
        <div
          className={`tab-pane fade ${activeTab === 'profile' ? 'show active' : ''} p-3`}
          id="profile"
          role="tabpanel"
          aria-labelledby="profile-tab"
        >
        {/* スキルPRの内容 */}
        <Skill />
        <FrameWork />
        <DB />
        <Cloud />
        <Support />
        <Other />
        </div>
        <div
          className={`tab-pane fade ${activeTab === 'contact' ? 'show active' : ''} p-3`}
          id="contact"
          role="tabpanel"
          aria-labelledby="contact-tab"
        >
        {/* 経歴情報の内容 */}
        {/* <Study /> */}
        <Content />
        <Albite />
        <Intern />
        </div>
        <div
          className={`tab-pane fade ${activeTab === 'test' ? 'show active' : ''} p-3`}
          id="test"
          role="tabpanel"
          aria-labelledby="test-tab"
        >
        <Choose />
        <Type />
        <Location />
        <JobType />
        <Industry />
        <Desiredskill />
        <DesiredOther />
        </div>
      </div>
    </div>
  );
};

export default TabNav;