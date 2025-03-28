/* tslint:disable */
/* eslint-disable */
/**
 * fk-mitou-2024
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from '../runtime';
import type { HTTPValidationError, LoginRequest, UserToken } from '../models';
import {
  HTTPValidationErrorFromJSON,
  HTTPValidationErrorToJSON,
  LoginRequestFromJSON,
  LoginRequestToJSON,
  UserTokenFromJSON,
  UserTokenToJSON,
} from '../models';

export interface LoginOperationRequest {
  loginRequest: LoginRequest;
}

export interface SwaggerLoginRequest {
  password: string;
  username: string;
  clientId?: string | null;
  clientSecret?: string | null;
  grantType?: string | null;
  scope?: string;
}

/**
 * LoginApi - interface
 *
 * @export
 * @interface LoginApiInterface
 */
export interface LoginApiInterface {
  /**
   * Token login, get an access token for future requests
   * @summary Login
   * @param {LoginRequest} loginRequest
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof LoginApiInterface
   */
  loginRaw(
    requestParameters: LoginOperationRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<UserToken>>;

  /**
   * Token login, get an access token for future requests
   * Login
   */
  login(
    requestParameters: LoginOperationRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<UserToken>;

  /**
   * Token login, get an access token for future requests
   * @summary Swagger Login
   * @param {string} password
   * @param {string} username
   * @param {string} [clientId]
   * @param {string} [clientSecret]
   * @param {string} [grantType]
   * @param {string} [scope]
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof LoginApiInterface
   */
  swaggerLoginRaw(
    requestParameters: SwaggerLoginRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<UserToken>>;

  /**
   * Token login, get an access token for future requests
   * Swagger Login
   */
  swaggerLogin(
    requestParameters: SwaggerLoginRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<UserToken>;
}

/**
 *
 */
export class LoginApi extends runtime.BaseAPI implements LoginApiInterface {
  /**
   * Token login, get an access token for future requests
   * Login
   */
  async loginRaw(
    requestParameters: LoginOperationRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<UserToken>> {
    if (
      requestParameters.loginRequest === null ||
      requestParameters.loginRequest === undefined
    ) {
      throw new runtime.RequiredError(
        'loginRequest',
        'Required parameter requestParameters.loginRequest was null or undefined when calling login.',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'application/json';

    const response = await this.request(
      {
        path: `/api/v1/login/`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: LoginRequestToJSON(requestParameters.loginRequest),
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserTokenFromJSON(jsonValue),
    );
  }

  /**
   * Token login, get an access token for future requests
   * Login
   */
  async login(
    requestParameters: LoginOperationRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<UserToken> {
    const response = await this.loginRaw(requestParameters, initOverrides);
    return await response.value();
  }

  /**
   * Token login, get an access token for future requests
   * Swagger Login
   */
  async swaggerLoginRaw(
    requestParameters: SwaggerLoginRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<UserToken>> {
    if (
      requestParameters.password === null ||
      requestParameters.password === undefined
    ) {
      throw new runtime.RequiredError(
        'password',
        'Required parameter requestParameters.password was null or undefined when calling swaggerLogin.',
      );
    }

    if (
      requestParameters.username === null ||
      requestParameters.username === undefined
    ) {
      throw new runtime.RequiredError(
        'username',
        'Required parameter requestParameters.username was null or undefined when calling swaggerLogin.',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const consumes: runtime.Consume[] = [
      { contentType: 'application/x-www-form-urlencoded' },
    ];
    // @ts-ignore: canConsumeForm may be unused
    const canConsumeForm = runtime.canConsumeForm(consumes);

    let formParams: { append(param: string, value: any): any };
    let useForm = false;
    if (useForm) {
      formParams = new FormData();
    } else {
      formParams = new URLSearchParams();
    }

    if (requestParameters.clientId !== undefined) {
      formParams.append('client_id', requestParameters.clientId as any);
    }

    if (requestParameters.clientSecret !== undefined) {
      formParams.append('client_secret', requestParameters.clientSecret as any);
    }

    if (requestParameters.grantType !== undefined) {
      formParams.append('grant_type', requestParameters.grantType as any);
    }

    if (requestParameters.password !== undefined) {
      formParams.append('password', requestParameters.password as any);
    }

    if (requestParameters.scope !== undefined) {
      formParams.append('scope', requestParameters.scope as any);
    }

    if (requestParameters.username !== undefined) {
      formParams.append('username', requestParameters.username as any);
    }

    const response = await this.request(
      {
        path: `/api/v1/login/swagger/`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: formParams,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserTokenFromJSON(jsonValue),
    );
  }

  /**
   * Token login, get an access token for future requests
   * Swagger Login
   */
  async swaggerLogin(
    requestParameters: SwaggerLoginRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<UserToken> {
    const response = await this.swaggerLoginRaw(
      requestParameters,
      initOverrides,
    );
    return await response.value();
  }
}
