import React from 'react';
import { Github, Linkedin, Globe, Mail, FileText, GraduationCap, Briefcase } from 'lucide-react';
import type { Profile } from '../types';

interface SidebarProps {
  profile: Profile;
}

export function Sidebar({ profile }: SidebarProps) {
  return (
    <div className="w-72 bg-[#e8e5d8] h-screen p-6 overflow-y-auto flex flex-col font-[var(--font-styrene-b)] border-r">
      <div className="flex flex-col items-center mb-6">
        <img
          src={profile.image}
          alt={`${profile.name} ${profile.surname}`}
          className="w-32 h-32 rounded-full mb-4"
        />
        <h2 className="text-xl font-bold text-[#3d3929]">{profile.name}</h2>
        <h3 className="text-lg text-[#3d3929]">{profile.surname}</h3>
      </div>
      
      <p className="text-[#3d3929] mb-6">
        MSc. student at EPFL in Data Science and Research Student Assistant at NLP lab
      </p>

      {/* Education Section */}
      <div className="mb-6">
        <h4 className="flex items-center font-bold text-[#3d3929] mb-2">
          <GraduationCap className="w-5 h-5 mr-2" />
          Current Education
        </h4>
        <div className="ml-7 space-y-2 text-sm text-[#3d3929]">
          <div>
            <p className="font-semibold">MSc. in Data Science</p>
            <p>EPFL, Switzerland</p>
            <p className="text-[#666]">2023 - Present</p>
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="mb-6">
        <h4 className="flex items-center font-bold text-[#3d3929] mb-2">
          <Briefcase className="w-5 h-5 mr-2" />
          Current Role
        </h4>
        <div className="ml-7 space-y-2 text-sm text-[#3d3929]">
          <div>
            <p className="font-semibold">Research Student Assistant</p>
            <p>NLP lab, EPFL</p>
            <p className="text-[#666]">Jun 2024 - Present</p>
          </div>
        </div>
      </div>
      
      {/* Links Section */}
      <div className="flex flex-col space-y-4 mt-auto">
        <a href={profile.links.github} className="flex items-center text-[#3d3929] hover:text-[#bd5d3a]">
          <Github className="w-5 h-5 mr-2" />
          GitHub
        </a>
        <a href={profile.links.linkedin} className="flex items-center text-[#3d3929] hover:text-[#bd5d3a]">
          <Linkedin className="w-5 h-5 mr-2" />
          LinkedIn
        </a>
        <a href={profile.links.website} className="flex items-center text-[#3d3929] hover:text-[#bd5d3a]">
          <Globe className="w-5 h-5 mr-2" />
          Website
        </a>
        <a href={`mailto:${profile.links.email}`} className="flex items-center text-[#3d3929] hover:text-[#bd5d3a]">
          <Mail className="w-5 h-5 mr-2" />
          Email
        </a>
        <a href={profile.links.cv} className="flex items-center text-[#3d3929] hover:text-[#bd5d3a]">
          <FileText className="w-5 h-5 mr-2" />
          CV
        </a>
      </div>
    </div>
  );
}