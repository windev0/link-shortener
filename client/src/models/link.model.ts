export interface Link {
  shortId: string; // Identifiant court
  shortUrl: string; // URL courte
  originalUrl: string; // URL d'origine
  createdAt: Date; // Date de création
  updatedAt: Date; // Date de mise à jour
}

export interface LinkData {
  originalUrl: string; // URL d'origine
  userID?: string;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  email: string;
  token?: string; // Optionnel, utilisé pour l'authentification
  isLoggedIn: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
