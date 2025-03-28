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
 * @interface ProblemItemBase
 */
export interface ProblemItemBase {
  /**
   *
   * @type {string}
   * @memberof ProblemItemBase
   */
  name: string;
  /**
   *
   * @type {boolean}
   * @memberof ProblemItemBase
   */
  required?: boolean;
  /**
   *
   * @type {number}
   * @memberof ProblemItemBase
   */
  typeId?: number;
}

/**
 * Check if a given object implements the ProblemItemBase interface.
 */
export function instanceOfProblemItemBase(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'name' in value;

  return isInstance;
}

export function ProblemItemBaseFromJSON(json: any): ProblemItemBase {
  return ProblemItemBaseFromJSONTyped(json, false);
}

export function ProblemItemBaseFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ProblemItemBase {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    name: json['name'],
    required: !exists(json, 'required') ? undefined : json['required'],
    typeId: !exists(json, 'type_id') ? undefined : json['type_id'],
  };
}

export function ProblemItemBaseToJSON(value?: ProblemItemBase | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    name: value.name,
    required: value.required,
    type_id: value.typeId,
  };
}
