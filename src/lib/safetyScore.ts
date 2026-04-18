import { SafetyData, Owner } from '../types';

export const calculateSafetyScore = (data: SafetyData, owner: Owner): { score: number; label: 'Safe' | 'Moderate' | 'Risky'; breakdown: any } => {
  // Points mapping functions
  const p = (val: boolean) => val ? 5 : 0;
  
  // A. Security (Max 25 pts)
  const securityPts = 
    p(data.hasCCTV) + 
    (data.securityGuard === '24x7' ? 5 : data.securityGuard === 'Night' ? 3 : 0) +
    p(data.isGated) +
    p(data.hasBiometric) +
    p(data.hasVisitorLog);
  const securityScore = (securityPts / 25) * 100;

  // B. Location (Max 20 pts)
  const locationPts = 
    (data.areaType === 'Residential' ? 5 : data.areaType === 'Mixed' ? 3 : 1) +
    (data.streetLighting === 'Good' ? 5 : data.streetLighting === 'Moderate' ? 3 : 0) +
    (data.distPoliceStation === '<1km' ? 5 : data.distPoliceStation === '1-3km' ? 3 : 1) +
    (data.crimePerception === 'Low' ? 5 : data.crimePerception === 'Medium' ? 2 : 0);
  const locationScore = (locationPts / 20) * 100;

  // C. Building (Max 20 pts)
  const buildingPts = 
    (data.buildingAge === '<5' ? 5 : data.buildingAge === '5-15' ? 3 : 1) +
    (data.fireSafety === 'Alarm' ? 5 : data.fireSafety === 'Extinguisher' ? 3 : 0) +
    p(data.hasEmergencyExits) +
    p(data.hasLiftCert);
  const buildingScore = (buildingPts / 20) * 100;

  // D. Tenant Rules (Max 20 pts)
  const rulesPts = 
    (data.tenantType === 'Family' ? 5 : data.tenantType === 'Mixed' ? 3 : 2) +
    p(data.ownerNearby) +
    p(data.policeVerifyRequired) +
    (data.guestPolicy === 'Strict' ? 5 : data.guestPolicy === 'Moderate' ? 3 : 1);
  const rulesScore = (rulesPts / 20) * 100;

  // E. Basic Safety (Max 20 pts)
  const basicPts = 
    p(data.hasPowerBackup) +
    (data.waterSupply === '24x7' ? 5 : 2) +
    p(data.hasLockableRoom) +
    p(data.hasSeparateEntry);
  const basicScore = (basicPts / 20) * 100;

  // F. Trust Layer (Max 20 pts)
  const trustPts = 
    p(owner.verified) + // Property verified
    p(owner.verified) + // Owner KYC verified (simulated with same flag for now)
    (Math.round(owner.rating)) + // Rating 1-5
    (owner.complaints === 'None' ? 5 : owner.complaints === 'Few' ? 2 : 0);
  const trustScore = (trustPts / 20) * 100;

  // Weighted sum
  let finalScore = 
    (securityScore * 0.25) +
    (locationScore * 0.15) +
    (buildingScore * 0.15) +
    (rulesScore * 0.10) +
    (basicScore * 0.10) +
    (trustScore * 0.25);

  // Anti-Fraud Logic
  // Cap at 60 if KYC not verified
  if (!owner.verified) {
    finalScore = Math.min(finalScore, 60);
  }

  // Reduce score if complaints exist
  if (owner.complaints === 'Many') finalScore -= 20;
  if (owner.complaints === 'Few') finalScore -= 5;

  // Tenant feedback override (simulated)
  if (data.tenantRatingOverride) {
    finalScore = (finalScore + (data.tenantRatingOverride * 20)) / 2;
  }

  finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));

  const label = finalScore >= 80 ? 'Safe' : finalScore >= 50 ? 'Moderate' : 'Risky';

  return {
    score: finalScore,
    label,
    breakdown: {
      security: Math.round(securityScore),
      location: Math.round(locationScore),
      building: Math.round(buildingScore),
      rules: Math.round(rulesScore),
      basic: Math.round(basicScore),
      trust: Math.round(trustScore)
    }
  };
};

export const getSafetyBadge = (label: string) => {
  switch (label) {
    case 'Safe': return { text: "Highly Secure", color: "text-emerald-600", bg: "bg-emerald-50", icon: "ShieldCheck" };
    case 'Moderate': return { text: "Moderate Safety", color: "text-amber-600", bg: "bg-amber-50", icon: "ShieldAlert" };
    case 'Risky': return { text: "Risky Area", color: "text-red-600", bg: "bg-red-50", icon: "AlertTriangle" };
    default: return { text: "Unknown", color: "text-slate-400", bg: "bg-slate-50", icon: "Shield" };
  }
};
