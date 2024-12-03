export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Profile {
  name: string;
  surname: string;
  bio: string;
  image: string;
  links: {
    github: string;
    linkedin: string;
    website: string;
    email: string;
    cv: string;
  };
}