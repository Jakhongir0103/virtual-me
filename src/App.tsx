import React from 'react';
import { Chat } from './components/Chat';
import { Sidebar } from './components/Sidebar';
import type { Profile } from './types';

const profile: Profile = {
  name: 'Jakhongir',
  surname: 'Saydaliev',
  bio: 'MSc in Data Science at EPFL',
  image: 'https://raw.githubusercontent.com/Jakhongir0103/virtual-me/main/img/profile.png',
  links: {
    github: 'https://github.com/Jakhongir0103',
    linkedin: 'https://www.linkedin.com/in/jakhongir-saydaliev-0103',
    website: 'https://jakhongir0103.github.io/',
    email: 'jakhongir.saydaliev@epfl.ch',
    cv: 'https://jakhongir0103.github.io/cv.pdf'
  }
};

function App() {
  return (
    <div className="flex">
      <Sidebar profile={profile} />
      <Chat profile={profile} />
    </div>
  );
}

export default App;