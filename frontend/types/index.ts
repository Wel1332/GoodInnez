export interface Hotel {
    id: string;
    name: string;
    location: string;
    image: string;
    category?: string;
  }
  
  export interface Activity {
    id: string;
    title: string;
    category: string;
    image: string;
  }
  
  export interface SearchParams {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }
  
  export interface Booking {
    hotel: Hotel;
    searchParams: SearchParams;
  }
  