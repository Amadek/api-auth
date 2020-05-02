const Ensure = require('@amadek/js-sdk/Ensure');
import axios from 'axios';
import createError from 'http-errors';
import { Config } from '../config';

export class AuthController {
  private _config: Config;

  constructor (config: Config) {
    Ensure.notNull(config);
    this._config = config;
  }

  route (router: any) {
    router.get('/', this.getAuth.bind(this));
    router.get('/redirect', this.getAuthRedirect.bind(this));
    return router;
  }

  getAuth (req: any, res: any) {
    const url: string = axios.getUri({
      method: 'get',
      url: 'https://github.com/login/oauth/authorize',
      params: {
        client_id: this._config.githubClientId,
        redirect_url: this._getBaseUrl(req) + '/redirect'
      }
    });

    res.redirect(url);
  }

  getAuthRedirect (req: any, res: any, next: any) {
    // If code aka request token not provided, throw Bad Request.
    if (!req.query.code) throw createError[400];

    const requestToken: string = req.query.code;

    Promise.resolve()
      .then(() => this._getAccessToken(requestToken))
      .then(response => this._putAccessToken(response.data.access_token))
      .then(accessToken => res.send(accessToken))
      .then(next)
      .catch(next);
  }

  _getAccessToken (requestToken: string) {
    return axios({
      method: 'post',
      url: 'https://github.com/login/oauth/access_token',
      params: {
        client_id: this._config.githubClientId,
        client_secret: this._config.githubClientSecret,
        code: requestToken
      },
      headers: {
        accept: 'application/json'
      }
    });
  }

  _putAccessToken (accessToken: string) {
    return Promise.resolve()
      .then(() => axios({
        method: 'put',
        url: this._config.putTokenUrl,
        params: {
          client_secret: this._config.githubClientSecret,
          token: accessToken
        }
      }))
      .then(() => accessToken);
  }

  _getBaseUrl (req: any) {
    return req.headers.host + req.baseUrl;
  }
}
