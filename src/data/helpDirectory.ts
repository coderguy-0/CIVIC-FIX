import { OfficialHelpChannel } from '../types';

export const OFFICIAL_HELP_DIRECTORY: OfficialHelpChannel[] = [
  {
    id: 'gov-cpgrams',
    authority_name: 'CPGRAMS (Centralized Public Grievance Redress and Monitoring System)',
    short_code: 'CPGRAMS',
    jurisdiction: 'National (Central Ministries & Departments)',
    state_code: 'ALL',
    state_name: 'National / All India',
    categories: ['roads', 'drainage', 'public_safety', 'other'],
    portal_url: 'https://pgportal.gov.in',
    helpline: '1800-11-4000',
    filing_guide: [
      'Register with mobile number and OTP on pgportal.gov.in.',
      'Select relevant Ministry/Department (e.g., Road Transport & Highways, Railways, Urban Affairs).',
      'Provide clear description of civic issue and specific location.',
      'Save the 14-digit Registration Number (e.g., MINOR/E/2026/00123) for private tracking.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Escalation layer for central infrastructure, national highways, and unresolved municipal cases.'
  },
  {
    id: 'gov-swachhata',
    authority_name: 'Swachhata App (Ministry of Housing and Urban Affairs - MoHUA)',
    short_code: 'MoHUA-SWA',
    jurisdiction: 'National (All Urban Local Bodies / Municipalities)',
    state_code: 'ALL',
    state_name: 'National / All India',
    categories: ['sanitation', 'street_lighting', 'drainage', 'public_safety'],
    portal_url: 'https://swachhata.mohua.gov.in',
    helpline: '1969',
    filing_guide: [
      'Upload a clear photo of the garbage dump, overflowing dustbin, dead animal, or uncleaned toilet.',
      'Enable GPS or select your Urban Local Body (ULB) Ward.',
      'Automatic routing to your local Municipal sanitary inspector.',
      'SLA is typically 12 hours for garbage clearance and 48 hours for streetlights.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Directly linked to Swachh Survekshan rankings for 4,000+ Indian cities.'
  },
  {
    id: 'gov-nhai',
    authority_name: 'National Highways Authority of India (NHAI / Sukhad Yatra)',
    short_code: 'NHAI-1033',
    jurisdiction: 'National Highways & Expressways',
    state_code: 'ALL',
    state_name: 'National / All India',
    categories: ['roads', 'public_safety', 'other'],
    portal_url: 'https://nhai.gov.in',
    helpline: '1033 (Toll Free Highway Helpline)',
    filing_guide: [
      'Dial 1033 24x7 for highway potholes, road debris, breakdown, or toll booth grievances.',
      'Note highway stretch (e.g., NH-44, Km milestone or nearest toll plaza).',
      'Receive SMS confirmation with incident ticket code.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Dedicated 24x7 emergency and pothole response helpline for all National Highways.'
  },
  {
    id: 'dl-mcd-311',
    authority_name: 'Municipal Corporation of Delhi (MCD 311 / Citizen Portal)',
    short_code: 'MCD-311',
    jurisdiction: 'Delhi NCT (All MCD Zones)',
    state_code: 'DL',
    state_name: 'Delhi',
    categories: ['roads', 'sanitation', 'street_lighting', 'drainage', 'public_safety'],
    portal_url: 'https://mcdonline.nic.in',
    helpline: '155305 / 011-23220010',
    whatsapp_grievance: '+91-9266155305',
    filing_guide: [
      'Use the MCD 311 App or web portal mcdonline.nic.in.',
      'Select category (e.g., Pothole Repair, Garbage Not Lifted, Non-Functional Street Light).',
      'Provide colony/ward name and nearby landmark.',
      'Track using your Complaint ID (e.g. MCD/2026/W14/892).'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Handles 12 administrative zones in Delhi for municipal maintenance.'
  },
  {
    id: 'dl-djb',
    authority_name: 'Delhi Jal Board (DJB - Water Supply & Sewerage)',
    short_code: 'DJB',
    jurisdiction: 'Delhi NCT',
    state_code: 'DL',
    state_name: 'Delhi',
    categories: ['water', 'drainage'],
    portal_url: 'https://delhijalboard.delhi.gov.in',
    helpline: '1916 (Central Control Room)',
    whatsapp_grievance: '+91-9650291021',
    filing_guide: [
      'Call 1916 or log ticket on the DJB portal for contaminated water, pipeline bursts, or sewer backflow.',
      'State your water K-Number (if billed consumer) or specific street address.',
      'Keep your 8-digit complaint token saved for escalation.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Official utility for potable water supply and sewer pipelines across Delhi.'
  },
  {
    id: 'dl-power-discoms',
    authority_name: 'Delhi Power Distribution (BSES & Tata Power-DDL)',
    short_code: 'DELHI-POWER',
    jurisdiction: 'Delhi NCT (BSES Rajdhani/Yamuna & TPDDL)',
    state_code: 'DL',
    state_name: 'Delhi',
    categories: ['electricity', 'street_lighting'],
    portal_url: 'https://www.bsesdelhi.com',
    helpline: '19123 (BSES BRPL) / 19124 (BSES BYPL) / 19124 (TPDDL)',
    whatsapp_grievance: '+91-9555619123',
    filing_guide: [
      'Send WhatsApp message "STREETLIGHT" with pole number and locality.',
      'Or dial 19123/19124 for hazardous hanging electric cables or blown transformers.',
      'SMS with technician dispatch details is sent within 30 minutes.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Maintenance of street lights on PWD and MCD roads is shared with discoms.'
  },
  {
    id: 'ka-bbmp',
    authority_name: 'Bruhat Bengaluru Mahanagara Palike (BBMP Sahaaya 2.0)',
    short_code: 'BBMP',
    jurisdiction: 'Bengaluru Urban',
    state_code: 'KA',
    state_name: 'Karnataka',
    categories: ['roads', 'sanitation', 'street_lighting', 'drainage', 'public_safety'],
    portal_url: 'https://bbmp.gov.in',
    helpline: '1533 / 080-22660000',
    whatsapp_grievance: '+91-9480685700',
    filing_guide: [
      'Submit grievance on BBMP Sahaaya 2.0 app or portal.',
      'Select category (Pothole - FixPothole, Waste, Rajakaluve/Drainage, Streetlight).',
      'Select Ward number (1-198) and attach photo.',
      'Track with BBMP ticket number.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Covers all 8 zones in Bengaluru. Rapid response team operates for storm water drains.'
  },
  {
    id: 'ka-bwssb',
    authority_name: 'Bangalore Water Supply and Sewerage Board (BWSSB)',
    short_code: 'BWSSB',
    jurisdiction: 'Bengaluru Urban',
    state_code: 'KA',
    state_name: 'Karnataka',
    categories: ['water', 'drainage'],
    portal_url: 'https://bwssb.karnataka.gov.in',
    helpline: '1916 / 080-22238888',
    filing_guide: [
      'Call 1916 round-the-clock or submit on BWSSB grievance portal.',
      'Specify RR number or street location for pipeline repair or sewage blockage.',
      'Note down complaint reference number for assistant executive engineer follow-up.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Handles Cauvery water pipelines and underground drainage infrastructure in Bengaluru.'
  },
  {
    id: 'mh-bmc',
    authority_name: 'Brihanmumbai Municipal Corporation (BMC / myBMC 24x7)',
    short_code: 'BMC-MCGM',
    jurisdiction: 'Mumbai City & Suburban',
    state_code: 'MH',
    state_name: 'Maharashtra',
    categories: ['roads', 'sanitation', 'street_lighting', 'drainage', 'water', 'public_safety'],
    portal_url: 'https://portal.mcgm.gov.in',
    helpline: '1916 / 022-22694725',
    whatsapp_grievance: '+91-8999228999',
    filing_guide: [
      'Send "Hi" to BMC WhatsApp Chatbot (+91-8999228999) or use myBMC 24x7 App.',
      'Select Ward (A to T) and specify issue (pothole, solid waste, debris, contaminated water).',
      'Upload geolocated photo.',
      'Reference number is instantly generated on WhatsApp and SMS.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Pothole complaints via the Pothole FixIT app are mandated to be inspected within 48 hours.'
  },
  {
    id: 'ts-ghmc',
    authority_name: 'Greater Hyderabad Municipal Corporation (MyGHMC Citizen Portal)',
    short_code: 'GHMC',
    jurisdiction: 'Hyderabad & Secunderabad',
    state_code: 'TS',
    state_name: 'Telangana',
    categories: ['roads', 'sanitation', 'street_lighting', 'drainage', 'public_safety'],
    portal_url: 'https://www.ghmc.gov.in',
    helpline: '040-21111111',
    whatsapp_grievance: '+91-9494301111',
    filing_guide: [
      'Download MyGHMC App or dial 040-21111111.',
      'Upload photo and select Circle/Ward in Hyderabad.',
      'Grievance assigned to Assistant Medical Officer of Health (AMOH) or Section Engineer.',
      'Save registration number for status tracking.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Monitors pothole repairs, street dogs, sanitation, and streetlights with public SLA.'
  },
  {
    id: 'tn-gcc',
    authority_name: 'Greater Chennai Corporation (Namma Chennai 1913)',
    short_code: 'GCC',
    jurisdiction: 'Chennai Corporation Area',
    state_code: 'TN',
    state_name: 'Tamil Nadu',
    categories: ['roads', 'sanitation', 'street_lighting', 'drainage', 'water'],
    portal_url: 'https://chennaicorporation.gov.in',
    helpline: '1913 (24x7 Helpline)',
    whatsapp_grievance: '+91-9445190660',
    filing_guide: [
      'Call 1913 or send WhatsApp to +91-9445190660.',
      'State zone number (1-15) and Street/Ward.',
      'Acknowledge SMS confirmation with tracking token.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Rapid escalation system for monsoon waterlogging and road cave-ins.'
  },
  {
    id: 'up-jansunwai',
    authority_name: 'Jan Sunwai - Samadhan Portal (Government of Uttar Pradesh)',
    short_code: 'UP-JANSUNWAI',
    jurisdiction: 'Uttar Pradesh (All Districts & Nagar Nigams)',
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
    categories: ['roads', 'water', 'sanitation', 'electricity', 'drainage', 'public_safety', 'other'],
    portal_url: 'https://jansunwai.up.nic.in',
    helpline: '1076 (Chief Minister Helpline)',
    filing_guide: [
      'Register grievance on jansunwai.up.nic.in or dial CM Helpline 1076.',
      'Select Nagar Nigam / Nagar Palika Parishad or Rural Block.',
      'Grievance is marked with a time-bound Redressal Officer.',
      'Save your Grievance Reference Code.'
    ],
    last_checked_date: 'September 2026',
    verification_status: 'verified',
    accepts_online_complaints: true,
    notes: 'Integrated state portal covering Lucknow, Noida, Ghaziabad, Kanpur, Agra, Varanasi, etc.'
  }
];

export const POPULAR_INDIAN_CITIES = [
  { name: 'Delhi NCT', stateCode: 'DL', lat: 28.6139, lng: 77.2090 },
  { name: 'Bengaluru', stateCode: 'KA', lat: 12.9716, lng: 77.5946 },
  { name: 'Mumbai', stateCode: 'MH', lat: 19.0760, lng: 72.8777 },
  { name: 'Hyderabad', stateCode: 'TS', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', stateCode: 'TN', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', stateCode: 'WB', lat: 22.5726, lng: 88.3639 },
  { name: 'Pune', stateCode: 'MH', lat: 18.5204, lng: 73.8567 },
  { name: 'Noida / Ghaziabad', stateCode: 'UP', lat: 28.5355, lng: 77.3910 },
  { name: 'Jaipur', stateCode: 'RJ', lat: 26.9124, lng: 75.7873 },
  { name: 'Ahmedabad', stateCode: 'GJ', lat: 23.0225, lng: 72.5714 }
];
