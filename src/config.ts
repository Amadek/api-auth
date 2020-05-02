import dotenv from 'dotenv';
dotenv.config();

export class Config {
  port: string;
  githubClientId: string;
  githubClientSecret: string;
  putTokenUrl: string;
}

export const config : Config = {
  port: process.env.PORT,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  putTokenUrl: process.env.PUT_TOKEN_URL
}
