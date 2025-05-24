export interface Link {
  shortId: string; // Identifiant court
  shortUrl: string; // URL courte
  originalUrl: string; // URL d'origine
  createdAt: Date; // Date de création
  updatedAt: Date; // Date de mise à jour
}

export interface LinkData {
  originalUrl: string; // URL d'origine
}
