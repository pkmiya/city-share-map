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
 * @interface ProblemForPost
 */
export interface ProblemForPost {
  /**
   *
   * @type {number}
   * @memberof ProblemForPost
   */
  id: number;
  /**
   *
   * @type {boolean}
   * @memberof ProblemForPost
   */
  isOpen: boolean;
  /**
   *
   * @type {string}
   * @memberof ProblemForPost
   */
  name: string;
}

/**
 * Check if a given object implements the ProblemForPost interface.
 */
export function instanceOfProblemForPost(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'id' in value;
  isInstance = isInstance && 'isOpen' in value;
  isInstance = isInstance && 'name' in value;

  return isInstance;
}

export function ProblemForPostFromJSON(json: any): ProblemForPost {
  return ProblemForPostFromJSONTyped(json, false);
}

export function ProblemForPostFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ProblemForPost {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: json['id'],
    isOpen: json['is_open'],
    name: json['name'],
  };
}

export function ProblemForPostToJSON(value?: ProblemForPost | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    is_open: value.isOpen,
    name: value.name,
  };
}
