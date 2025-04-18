export interface SearchType {
  type: "geo" | "name";
}

export interface Location {
  id: number;
  name: string;
  region: string;
  state: string;
  postcode: string;
  timeZone: string;
  lat: number;
  lng: number;
  typeId: number;
  distance?: number;
}
