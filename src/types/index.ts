export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  image: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  quote: string;
  rating: number;
}

export interface NavLink {
  label: string;
  href: string;
}
