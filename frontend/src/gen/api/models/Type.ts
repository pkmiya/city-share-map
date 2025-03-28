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
 * @interface Type
 */
export interface Type {
  /**
   *
   * @type {number}
   * @memberof Type
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof Type
   */
  name: string;
}

/**
 * Check if a given object implements the Type interface.
 */
export function instanceOfType(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'id' in value;
  isInstance = isInstance && 'name' in value;

  return isInstance;
}

export function TypeFromJSON(json: any): Type {
  return TypeFromJSONTyped(json, false);
}

export function TypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): Type {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json['id'],
    name: json['name'],
  };
}

export function TypeToJSON(value?: Type | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    name: value.name,
  };
}
