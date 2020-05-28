import { AxiosInstance } from 'axios';
import { BadRequest } from 'http-errors';
import { Config } from '../config';
import express, { Router, Request, Response, NextFunction } from 'express';

export class AuthController {

  public constructor (private readonly _axios: AxiosInstance, private readonly _config: Config) { }

  public route (): Router {
    const router: Router = express.Router();
    router.get('/', this.getAuth.bind(this));
    router.get('/redirect', this.getAuthRedirect.bind(this));
    return router;
  }

  public getAuth (req: Request, res: Response): void {
    const url: string = this._axios.getUri({
      method: 'get',
      url: 'https://github.com/login/oauth/authorize',
      params: {
        client_id: this._config.githubClientId,
        redirect_url: this._getBaseUrl(req) + '/redirect'
      }
    });

    res.redirect(url);
  }

  public getAuthRedirect (req: Request, res: Response, next: NextFunction): void {
    // If code aka request token not provided, throw Bad Request.
    if (!req.query.code || typeof req.query.code !== 'string') throw new BadRequest();

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
      .then(() => this._axios.post('https://github.com/login/oauth/access_token', {
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
      .then(() => this._axios.put(this._config.putTokenUrl, {
        params: {
          client_secret: this._config.githubClientSecret,
          token: accessToken
        }
      }))
      .then(() => accessToken);
  }

  private _getBaseUrl (req: Request): string {
    return req.headers.host + req.baseUrl;
  }
}
