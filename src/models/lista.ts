import { Guest } from "./guest";

export interface GuestList {
  _id:string,
    name: string;
    event: {
      id: string,
      name: string
    } 
    guests: Guest[];
    createdBy: {name: string, id: string, email: string};
  }