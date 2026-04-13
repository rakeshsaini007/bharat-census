export type CensusRecord = {
  id: string;
  lineNumber: number;
  buildingNumber: string;
  censusHouseNumber: string;
  floorMaterial: string;
  wallMaterial: string;
  roofMaterial: string;
  houseUse: string;
  houseCondition: string;
  householdNumber: string;
  totalPersons: number;
  headName: string;
  headSex: 'Male' | 'Female' | 'Other';
  scStStatus: 'SC' | 'ST' | 'None';
  ownershipStatus: 'Owned' | 'Rented' | 'Other';
  dwellingRooms: number;
  marriedCouples: number;
  drinkingWaterSource: string;
  drinkingWaterAvailability: string;
  lightingSource: string;
  latrineAvailability: string;
  latrineType: string;
  wasteWaterOutlet: string;
  bathingFacility: string;
  kitchenFacility: string;
  cookingFuel: string;
  hasRadio: boolean;
  hasTelevision: boolean;
  hasLaptop: boolean;
  hasTelephone: boolean;
  hasBicycle: boolean;
  hasScooter: boolean;
  hasCar: boolean;
  incomeSource: string;
  mobileNumber: string;
  timestamp?: string;
};

export const MATERIAL_OPTIONS = [
  'Mud/Unburnt Brick',
  'Wood/Bamboo',
  'Stone',
  'G.I./Metal/Asbestos Sheets',
  'Burnt Brick',
  'Concrete',
  'Other'
];

export const HOUSE_USE_OPTIONS = [
  'Residence',
  'Residence-cum-other use',
  'Shop/Office',
  'School/College',
  'Hotel/Lodge/Guest House',
  'Hospital/Dispensary',
  'Factory/Workshop/Workshed',
  'Place of Worship',
  'Other non-residential',
  'Vacant'
];

export const FUEL_OPTIONS = [
  'Firewood',
  'Crop Residue',
  'Cowdung Cake',
  'Coal/Lignite/Charcoal',
  'Kerosene',
  'LPG/PNG',
  'Electricity',
  'Biogas',
  'Other'
];
