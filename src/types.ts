export interface Owner {
  name: string;
  avatar: string;
  responseTime: string;
  verified: boolean;
  rating: number;
  listings: number;
  upiId?: string;
  plan?: 'free' | 'standard' | 'premium' | 'broker';
  complaints?: 'None' | 'Few' | 'Many';
  reviews?: Review[];
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface Occupant {
  name: string;
  avatar: string;
  occupation: string;
  age: number;
  gender: string;
}

export interface SafetyData {
  // A. Security
  hasCCTV: boolean;
  securityGuard: '24x7' | 'Night' | 'None';
  isGated: boolean;
  hasBiometric: boolean;
  hasVisitorLog: boolean;
  // B. Location
  areaType: 'Residential' | 'Mixed' | 'Isolated';
  streetLighting: 'Good' | 'Moderate' | 'Poor';
  distPoliceStation: '<1km' | '1-3km' | '>3km';
  crimePerception: 'Low' | 'Medium' | 'High';
  // C. Building
  buildingAge: '<5' | '5-15' | '>15';
  fireSafety: 'Extinguisher' | 'Alarm' | 'None';
  hasEmergencyExits: boolean;
  hasLiftCert: boolean;
  // D. Tenant Rules
  tenantType: 'Family' | 'Bachelor' | 'Mixed';
  ownerNearby: boolean;
  policeVerifyRequired: boolean;
  guestPolicy: 'Strict' | 'Moderate' | 'Open';
  // E. Basic Safety
  hasPowerBackup: boolean;
  waterSupply: '24x7' | 'Limited';
  hasLockableRoom: boolean;
  hasSeparateEntry: boolean;
  // F. Trust (Dynamic)
  tenantRatingOverride?: number;
}

export interface Room {
  id: number;
  title: string;
  address: string;
  rent: number;
  deposit: number;
  type: string;
  furnished: boolean;
  ac: boolean;
  wifi: boolean;
  parking: boolean;
  bath: string;
  water: string;
  elec: string;
  rating: number;
  reviews: number;
  verified: boolean;
  instant: boolean;
  gender: string;
  occ: string;
  avail: string;
  imgs: string[];
  owner: Owner;
  safety: number; // Final calculated score 0-100
  safetyData?: SafetyData;
  amenities: string[];
  near: string[];
  extra: number;
  moveIn: number;
  pets: boolean;
  food: boolean;
  laundry: boolean;
  kitchen: boolean;
  desc: string;
  ph: number[];
  risk: 'low' | 'medium' | 'high';
  bg: boolean;
  city: string;
  isSharingAvailable?: boolean;
  currentOccupant?: Occupant;
  totalOccupancy?: number;
  occupiedCount?: number;
  lat?: number;
  lng?: number;
  // Monetization fields
  boostUntil?: string;
  isFeatured?: boolean;
  isUrgent?: boolean;
  rankingScore?: number;
  views?: number;
  clicks?: number;
}

export interface Lead {
  id: string;
  name: string;
  room: string;
  time: string;
  status: string;
  img: number;
  phone?: string;
  isUnlocked?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'subscription' | 'boost' | 'featured' | 'urgent' | 'lead_unlock';
  date: string;
  status: 'success' | 'failed';
}

export interface ChatMessage {
  id: number;
  from: 'owner' | 'user';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}
