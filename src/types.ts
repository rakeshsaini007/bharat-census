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
  'मिट्टी/कच्ची ईंट (Mud/Unburnt Brick)',
  'लकड़ी/बांस (Wood/Bamboo)',
  'पत्थर (Stone)',
  'जी.आई./धातु/एस्बेस्टस चादरें (G.I./Metal/Asbestos Sheets)',
  'पक्की ईंट (Burnt Brick)',
  'कंक्रीट (Concrete)',
  'अन्य (Other)'
];

export const HOUSE_USE_OPTIONS = [
  'आवास (Residence)',
  'आवास-सह-अन्य उपयोग (Residence-cum-other use)',
  'दुकान/कार्यालय (Shop/Office)',
  'स्कूल/कॉलेज (School/College)',
  'होटल/लॉज/गेस्ट हाउस (Hotel/Lodge/Guest House)',
  'अस्पताल/डिस्पेंसरी (Hospital/Dispensary)',
  'फैक्ट्री/कार्यशाला (Factory/Workshop/Workshed)',
  'पूजा स्थल (Place of Worship)',
  'अन्य गैर-आवासीय (Other non-residential)',
  'खाली (Vacant)'
];

export const FUEL_OPTIONS = [
  'लकड़ी (Firewood)',
  'फसल अवशेष (Crop Residue)',
  'उपले (Cowdung Cake)',
  'कोयला/लिग्नाइट/चारकोल (Coal/Lignite/Charcoal)',
  'मिट्टी का तेल (Kerosene)',
  'एलपीजी/पीएनजी (LPG/PNG)',
  'बिजली (Electricity)',
  'बायोगैस (Biogas)',
  'अन्य (Other)'
];
