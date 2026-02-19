export type TenantConnection = {
  mygServer: string;
  mygDatabase: string;
  mygUserName: string;
  mygPassword: string;
};

export type MyGDevice = {
  id: string;
  serialNumber: string;
  name: string;
};

export type MyGUser = {
  id: string;
  name: string;
  email?: string;
};

export type MyGDriver = {
  id: string;
  userId?: string;
  name?: string;
  email?: string;
};

export type EligibleUser = {
  id: string;
  source: "driver" | "group" | "both";
  name: string;
  email?: string;
  userReference: string;
  isDriver: boolean;
  inKeylessGroup: boolean;
};
