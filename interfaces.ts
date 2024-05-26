export interface Owner {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
  }
  
  export interface Cat {
    id: number;
    name: string;
    description: string;
    age: number;
    activeStatus: boolean;
    birthDate: string; 
    profileImageUrl: string;
    breed: string; 
    hobbies: string[];
    owner: Owner;
  }
  