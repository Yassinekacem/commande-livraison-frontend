export interface Client {
    id: number;
    nom: string;
    email: string;
    adresse: string;
  }
  
  export interface Produit {
    id: number;
    nom: string;
    stockActuel: number;
    desscription: string;
  }