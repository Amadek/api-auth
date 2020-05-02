const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  api: {
    port: process.env.PORT,
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    },
    putTokenUrl: process.env.PUT_TOKEN_URL
  }
}