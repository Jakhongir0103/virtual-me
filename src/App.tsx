import React from 'react';
import { Chat } from './components/Chat';
import { Sidebar } from './components/Sidebar';
import type { Profile } from './types';

const profile: Profile = {
  name: 'Jakhongir',
  surname: 'Saydaliev',
  bio: 'Software Engineer passionate about building innovative solutions',
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  links: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    website: 'https://yourwebsite.com',
    email: 'your.email@example.com',
    cv: '/path-to-your-cv.pdf'
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