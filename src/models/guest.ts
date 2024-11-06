export interface Guest {
    name: string;
    email: string;
    phone?: string;
    status: 'invited' | 'confirmed' | 'declined' | 'attended';
    
  }
  
  