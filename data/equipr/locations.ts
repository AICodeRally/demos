export interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  assetCount: number;
  manager: string;
}

export const LOCATIONS: Location[] = [
  {
    id: 'orl',
    name: 'Orlando Central',
    city: 'Orlando',
    state: 'FL',
    address: '4210 W Colonial Dr, Orlando, FL 32808',
    phone: '(407) 555-0142',
    assetCount: 20,
    manager: 'Dave Richardson',
  },
  {
    id: 'tpa',
    name: 'Tampa Bay Yard',
    city: 'Tampa',
    state: 'FL',
    address: '8901 N Florida Ave, Tampa, FL 33604',
    phone: '(813) 555-0198',
    assetCount: 18,
    manager: 'Lisa Nakamura',
  },
  {
    id: 'jax',
    name: 'Jacksonville Depot',
    city: 'Jacksonville',
    state: 'FL',
    address: '5530 Philips Hwy, Jacksonville, FL 32207',
    phone: '(904) 555-0267',
    assetCount: 12,
    manager: 'Carlos Vega',
  },
];
