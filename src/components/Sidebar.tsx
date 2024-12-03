import React from 'react';
import { Github, Linkedin, Globe, Mail, FileText } from 'lucide-react';
import type { Profile } from '../types';

interface SidebarProps {
  profile: Profile;
}

export function Sidebar({ profile }: SidebarProps) {
  return (
    <div className="w-64 bg-gray-900 h-screen p-6 flex flex-col">
      <div className="flex flex-col items-center mb-6">
        <img
          src={profile.image}
          alt={`${profile.name} ${profile.surname}`}
          className="w-32 h-32 rounded-full mb-4"
        />
        <h2 className="text-xl font-bold text-white">{profile.name}</h2>
        <h3 className="text-lg text-white">{profile.surname}</h3>
      </div>
      
      <p className="text-gray-300 mb-6">{profile.bio}</p>
      
      <div className="flex flex-col space-y-4">
        <a href={profile.links.github} className="flex items-center text-gray-300 hover:text-white">
          <Github className="w-5 h-5 mr-2" />
          GitHub
        </a>
        <a href={profile.links.linkedin} className="flex items-center text-gray-300 hover:text-white">
          <Linkedin className="w-5 h-5 mr-2" />
          LinkedIn
        </a>
        <a href={profile.links.website} className="flex items-center text-gray-300 hover:text-white">
          <Globe className="w-5 h-5 mr-2" />
          Website
        </a>
        <a href={`mailto:${profile.links.email}`} className="flex items-center text-gray-300 hover:text-white">
          <Mail className="w-5 h-5 mr-2" />
          Email
        </a>
        <a href={profile.links.cv} className="flex items-center text-gray-300 hover:text-white">
          <FileText className="w-5 h-5 mr-2" />
          CV
        </a>
      </div>
    </div>
  );
}