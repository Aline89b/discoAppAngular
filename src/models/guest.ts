export interface Guest {
  _id:string,
    name: string;
    surname: string;
    email: string;
    phone?: string;
    noOfFriends: number
    status: 'invited' | 'confirmed' | 'declined' | 'attended';
    
  }
  
  