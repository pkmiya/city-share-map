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
 * @interface ValidationErrorLocInner
 */
export interface ValidationErrorLocInner {}

/**
 * Check if a given object implements the ValidationErrorLocInner interface.
 */
export function instanceOfValidationErrorLocInner(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function ValidationErrorLocInnerFromJSON(
  json: any,
): ValidationErrorLocInner {
  return ValidationErrorLocInnerFromJSONTyped(json, false);
}

export function ValidationErrorLocInnerFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ValidationErrorLocInner {
  return json;
}

export function ValidationErrorLocInnerToJSON(
  value?: ValidationErrorLocInner | null,
): any {
  return value;
}
