import { City, Location } from "./City";

export type Schedule = {
  [day: string]: { openingHour: string; closingHour: string };
};

export interface TouristSpot {
  id: string;
  name: string;
  city: City;
  location: Location;
  reviews: any;
  description: string;
  image: any;
  type: string;
  rating: number;
  schedule: Schedule;
}
