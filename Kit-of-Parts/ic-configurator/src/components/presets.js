// Configuration presets — each preset defines which variant index is active
// per part, and which parts are visible. Matches ids in partsData.js.
export const PRESETS = [
  {
    id: 'studio',
    label: 'Studio',
    description: 'Compact single-room module with lightweight materials',
    variants: {
      Foundation: 2,       // Hollow-core Plank
      Structure: 0,        // Steel BIM Standard
      'Bathroom Pod': 2,   // Compact
      Cladding: 1,         // Aluminum Composite
      'Interface Layer': 0, // Data & Utilities
    },
    visible: {
      Foundation: true,
      Structure: true,
      'Bathroom Pod': true,
      Cladding: true,
      'Interface Layer': true,
    },
  },
  {
    id: '1bed',
    label: '1-Bed',
    description: 'Standard one-bedroom module — glass façade, MEP slab',
    variants: {
      Foundation: 0,        // Pre-cast Type A
      Structure: 0,         // Steel BIM Standard
      'Bathroom Pod': 0,    // Standard
      Cladding: 0,          // Insulated Glass
      'Interface Layer': 1, // MEP Coordinated
    },
    visible: {
      Foundation: true,
      Structure: true,
      'Bathroom Pod': true,
      Cladding: true,
      'Interface Layer': true,
    },
  },
  {
    id: 'corner',
    label: 'Corner',
    description: 'Corner unit — heavy steel, accessible pod, brick façade',
    variants: {
      Foundation: 1,        // Post-tensioned
      Structure: 1,         // Heavy Steel
      'Bathroom Pod': 1,    // Accessible
      Cladding: 2,          // Brick Slip
      'Interface Layer': 2, // Smart Services
    },
    visible: {
      Foundation: true,
      Structure: true,
      'Bathroom Pod': true,
      Cladding: true,
      'Interface Layer': true,
    },
  },
]
