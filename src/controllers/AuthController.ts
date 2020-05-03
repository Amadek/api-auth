const Ensure = require('@amadek/js-sdk/Ensure');
import axios from 'axios';
import createError from 'http-errors';
import { Config } from '../config';
import { Router } from 'express';

export class AuthController {
  private readonly _config: Config;

  constructor (config: Config) {
    Ensure.notNull(config);
    this._config = config;
  }

  public route (router: Router): Router {
    router.get('/', this.getAuth.bind(this));
    router.get('/redirect', this.getAuthRedirect.bind(this));
    return router;
  }

  public getAuth (req: any, res: any): void {
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

  public getAuthRedirect (req: any, res: any, next: any): void {
    // If code aka request token not provided, throw Bad Request.
    if (!req.query.code) throw createError[400];

    const requestToken: string = req.query.code;

    Promise.resolve()
      .then(() => this._getAccessToken(requestToken))
      .then(accessToken => this._putAccessToken(accessToken))
      .then(accessToken => res.send(accessToken))
      .then(next)
      .catch(next);
  }

  private _getAccessToken (requestToken: string): Promise<string> {
    return Promise.resolve()
      .then(() => axios({
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
      }))
    .then(response => response.data.access_token);
  }

  private _putAccessToken (accessToken: string): Promise<string> {
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

  private _getBaseUrl (req: any): string {
    return req.headers.host + req.baseUrl;
  }
}
