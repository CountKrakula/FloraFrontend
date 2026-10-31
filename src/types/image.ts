export type ImageDTO = {
  imageId: number;
  url: string;
  hash: string;
  isProfilePicture: boolean;
  plantId: number;
};

export type CreateImageDTO = {
   url: string;
  hash: string;
  isProfilePicture: boolean;
  plantId: number;
}