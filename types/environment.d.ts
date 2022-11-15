export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: number;
      USER_DB?: string;
      HOST_DB?: string;
      PASSWORD_DB?: string;
      DATABASE_DB?: string;
      PORT_DB?: number;
      SECRET_JWT?: string | Secret;
      SALTROUNDS: number | string;
      USER_MAIL?: string;
      PASSWORD_MAIL?: string;
      GOOGLE_CLIENT_ID?: string | any;
      GOOGLE_CLIENT_SECRET?: string | any;
      CALLBACKURL?: string;
    }
  }
}