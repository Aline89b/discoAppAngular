import { Guest } from "./guest";

export interface GuestList {
    name: string;
    event: string; // event ID or event name
    guests: Guest[];
    createdBy: string
  }