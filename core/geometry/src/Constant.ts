/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/

/** @module CartesianGeometry */

/** Commonly used constant values.
 * @alpha
 */
export class Constant {
  /** symbolic name for 1 millimeter:  0.001 meter */
  public static readonly oneMillimeter: number = 0.001;
  /** symbolic name for 1 centimeter:  0.01 meter */
  public static readonly oneCentimeter: number = 0.01;
  /** symbolic name for 1 meter:  1.0 meter */
  public static readonly oneMeter: number = 1.0;
  /** symbolic name for 1 kilometer: 1000 meter */
  public static readonly oneKilometer: number = 1000.0;
  /** Diameter of the earth in kilometers. */
  public static readonly diameterOfEarth: number = 12742.0 * Constant.oneKilometer;
  /** circumference of the earth in meters. */
  public static readonly circumferenceOfEarth: number = 40075.0 * Constant.oneKilometer;
}
