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

import { exists, mapValues } from '../runtime';
/**
 *
 * @export
 * @interface Latitude
 */
export interface Latitude {}

/**
 * Check if a given object implements the Latitude interface.
 */
export function instanceOfLatitude(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function LatitudeFromJSON(json: any): Latitude {
  return LatitudeFromJSONTyped(json, false);
}

export function LatitudeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): Latitude {
  return json;
}

export function LatitudeToJSON(value?: Latitude | null): any {
  return value;
}
