export interface EventVenue {
  name: string;
  address: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
