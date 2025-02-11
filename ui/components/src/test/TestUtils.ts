/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { ColorByName } from "@bentley/imodeljs-common";
import { I18N } from "@bentley/imodeljs-i18n";
import {
  ArrayValue, BasePropertyEditorParams, ButtonGroupEditorParams, ColorEditorParams, CustomFormattedNumberParams, ParseResults, PrimitiveValue,
  PropertyDescription, PropertyEditorInfo, PropertyEditorParamTypes, PropertyRecord, PropertyValueFormat, StructValue,
} from "@bentley/ui-abstract";
import { ColumnDescription, CompositeFilterDescriptorCollection, FilterableTable, UiComponents } from "../ui-components";
import { TableFilterDescriptorCollection } from "../ui-components/table/columnfiltering/TableFilterDescriptorCollection";
import { StandardEditorNames } from "../ui-components/editors/StandardEditorNames";
import { StandardTypeNames } from "../ui-components/common/StandardTypeNames";

// cSpell:ignore buttongroup

// tslint:disable: completed-docs

export class TestUtils {
  private static _i18n?: I18N;
  private static _uiComponentsInitialized = false;

  public static get i18n(): I18N {
    if (!TestUtils._i18n) {
      // const port = process.debugPort;
      // const i18nOptions = { urlTemplate: "http://localhost:" + port + "/locales/{{lng}}/{{ns}}.json" };
      TestUtils._i18n = new I18N();
    }
    return TestUtils._i18n;
  }

  public static async initializeUiComponents() {
    if (!TestUtils._uiComponentsInitialized) {
      // This is required by our I18n module (specifically the i18next package).
      (global as any).XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; // tslint:disable-line:no-var-requires

      await UiComponents.initialize(TestUtils.i18n);
      TestUtils._uiComponentsInitialized = true;
    }
  }

  public static terminateUiComponents() {
    UiComponents.terminate();
    TestUtils._uiComponentsInitialized = false;
  }

  /** Waits until all async operations finish */
  public static async flushAsyncOperations() {
    return new Promise((resolve) => setTimeout(resolve));
  }

  public static createPropertyRecord(value: any, column: ColumnDescription, typename: string) {
    const v: PrimitiveValue = {
      valueFormat: PropertyValueFormat.Primitive,
      value,
      displayValue: value,
    };
    const pd: PropertyDescription = {
      typename,
      name: column.key,
      displayLabel: column.label,
    };
    column.propertyDescription = pd;
    return new PropertyRecord(v, pd);
  }

  public static createPrimitiveStringProperty(name: string, rawValue: string, displayValue: string = rawValue.toString(), editorInfo?: PropertyEditorInfo) {
    const value: PrimitiveValue = {
      displayValue,
      value: rawValue,
      valueFormat: PropertyValueFormat.Primitive,
    };

    const description: PropertyDescription = {
      displayLabel: name,
      name,
      typename: StandardTypeNames.String,
    };

    if (editorInfo)
      description.editor = editorInfo;

    const property = new PropertyRecord(value, description);
    property.isReadonly = false;
    return property;
  }

  public static createArrayProperty(name: string, items?: PropertyRecord[]) {
    if (!items)
      items = [];

    const value: ArrayValue = {
      items,
      valueFormat: PropertyValueFormat.Array,
      itemsTypeName: items.length !== 0 ? items[0].property.typename : "string",
    };

    const description: PropertyDescription = {
      displayLabel: name,
      name,
      typename: StandardTypeNames.Array,
    };
    const property = new PropertyRecord(value, description);
    property.isReadonly = false;
    return property;
  }

  public static createStructProperty(name: string, members?: { [name: string]: PropertyRecord }) {
    if (!members)
      members = {};

    const value: StructValue = {
      members,
      valueFormat: PropertyValueFormat.Struct,
    };

    const description: PropertyDescription = {
      displayLabel: name,
      name,
      typename: StandardTypeNames.Struct,
    };
    const property = new PropertyRecord(value, description);
    property.isReadonly = false;
    return property;
  }

  public static createEnumProperty(name: string, index: string | number, column?: ColumnDescription) {
    const value: PrimitiveValue = {
      displayValue: "",
      value: index,
      valueFormat: PropertyValueFormat.Primitive,
    };

    const description: PropertyDescription = {
      displayLabel: name,
      name,
      typename: StandardTypeNames.Enum,
    };

    const propertyRecord = new PropertyRecord(value, description);
    propertyRecord.isReadonly = false;
    propertyRecord.property.enum = { choices: [], isStrict: false };
    propertyRecord.property.enum.choices = [
      { label: "Yellow", value: 0 },
      { label: "Red", value: 1 },
      { label: "Green", value: 2 },
      { label: "Blue", value: 3 },
    ];

    if (column)
      column.propertyDescription = description;

    return propertyRecord;
  }

  public static blueEnumValueIsEnabled = true;
  public static toggleBlueEnumValueEnabled() { TestUtils.blueEnumValueIsEnabled = !TestUtils.blueEnumValueIsEnabled; }
  public static addEnumButtonGroupEditorSpecification(propertyRecord: PropertyRecord) {
    propertyRecord.property.editor = {
      name: "enum-buttongroup",
      params: [{
        type: PropertyEditorParamTypes.ButtonGroupData,
        buttons: [
          { iconSpec: "icon-yellow" },
          { iconSpec: "icon-red" },
          { iconSpec: "icon-green" },
          {
            iconSpec: "icon-blue",
            isEnabledFunction: () => TestUtils.blueEnumValueIsEnabled,
          },
        ],
      } as ButtonGroupEditorParams,
      ],
    };
  }

  public static createBooleanProperty(name: string, booleanValue: boolean, editor?: string) {
    const value: PrimitiveValue = {
      displayValue: "",
      value: booleanValue,
      valueFormat: PropertyValueFormat.Primitive,
    };

    const description: PropertyDescription = {
      displayLabel: name,
      name,
      typename: StandardTypeNames.Boolean,
      editor: editor ? { name: editor } : undefined,
    };

    const propertyRecord = new PropertyRecord(value, description);
    propertyRecord.isReadonly = false;

    return propertyRecord;
  }

  public static createColorProperty(propertyName: string, colorValue: number) {

    const value: PrimitiveValue = {
      displayValue: "",
      value: colorValue,
      valueFormat: PropertyValueFormat.Primitive,
    };

    const description: PropertyDescription = {
      name: propertyName,
      displayLabel: propertyName,
      typename: StandardTypeNames.Number,
      editor: {
        name: "color-picker",
        params: [
          {
            type: PropertyEditorParamTypes.ColorData,
            colorValues: [
              ColorByName.blue as number,
              ColorByName.red as number,
              ColorByName.green as number,
              ColorByName.yellow as number,
              ColorByName.black as number,
              ColorByName.gray as number,
              ColorByName.purple as number,
              ColorByName.pink as number,
            ],
            numColumns: 2,
          } as ColorEditorParams,
        ],
      },
    };

    const propertyRecord = new PropertyRecord(value, description);
    propertyRecord.isReadonly = false;
    return propertyRecord;
  }

  public static createWeightProperty(propertyName: string, weight: number) {

    const value: PrimitiveValue = {
      displayValue: "",
      value: weight,
      valueFormat: PropertyValueFormat.Primitive,
    };

    const description: PropertyDescription = {
      name: propertyName,
      displayLabel: propertyName,
      typename: StandardTypeNames.Number,
      editor: {
        name: StandardEditorNames.WeightPicker,
      },
    };

    const propertyRecord = new PropertyRecord(value, description);
    propertyRecord.isReadonly = false;
    return propertyRecord;
  }

  private static _formatLength = (numberValue: number): string => numberValue.toFixed(2);

  public static createCustomNumberProperty(propertyName: string, numVal: number, displayVal?: string, editorParams?: BasePropertyEditorParams[]) {

    const value: PrimitiveValue = {
      displayValue: displayVal,
      value: numVal,
      valueFormat: PropertyValueFormat.Primitive,
    };

    const description: PropertyDescription = {
      name: propertyName,
      displayLabel: propertyName,
      typename: StandardTypeNames.Number,
      editor: {
        name: StandardEditorNames.NumberCustom,
        params: [
          {
            type: PropertyEditorParamTypes.CustomFormattedNumber,
            formatFunction: TestUtils._formatLength,
            parseFunction: (stringValue: string): ParseResults => {
              const rtnValue = Number.parseFloat(stringValue);
              if (Number.isNaN(rtnValue)) {
                return { parseError: `Unable to parse ${stringValue} into a valid length` };
              } else {
                return { value: rtnValue };
              }
            },
          } as CustomFormattedNumberParams,
        ],
      },
    };

    if (editorParams) {
      editorParams.forEach((params: BasePropertyEditorParams) => {
        description.editor!.params!.push(params);
      });
    }

    const propertyRecord = new PropertyRecord(value, description);
    propertyRecord.isReadonly = false;
    return propertyRecord;
  }

  public static createNumericProperty(propertyName: string, numericValue: number, editorName: string, editorParams?: BasePropertyEditorParams[]) {

    const value: PrimitiveValue = {
      displayValue: "",
      value: numericValue,
      valueFormat: PropertyValueFormat.Primitive,
    };

    const description: PropertyDescription = {
      name: propertyName,
      displayLabel: propertyName,
      typename: StandardTypeNames.Number,
      editor: {
        name: editorName,
        params: editorParams,
      },
    };

    const propertyRecord = new PropertyRecord(value, description);
    propertyRecord.isReadonly = false;
    return propertyRecord;
  }

  /** Sleeps a specified number of milliseconds */
  public static sleep(milliseconds: number) {
    const start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }
  }

  /** Sleeps a specified number of milliseconds then flushes async operations */
  public static async tick(milliseconds: number) {
    TestUtils.sleep(milliseconds);
    await TestUtils.flushAsyncOperations();
  }

}

/** @internal */
export class TestFilterableTable implements FilterableTable {
  private _filterDescriptors = new TableFilterDescriptorCollection();
  private _columnDescriptions: ColumnDescription[];

  constructor(colDescriptions: ColumnDescription[]) {
    this._columnDescriptions = colDescriptions;
  }

  /** Gets the description of a column within the table. */
  public getColumnDescription(columnKey: string): ColumnDescription | undefined {
    return this._columnDescriptions.find((v: ColumnDescription) => v.key === columnKey);
  }

  /** Gets the filter descriptors for the table. */
  public get filterDescriptors(): CompositeFilterDescriptorCollection {
    return this._filterDescriptors;
  }

  /** Gets ECExpression to get property display value. */
  public getPropertyDisplayValueExpression(property: string): string {
    return property;
  }
}

export default TestUtils;   // tslint:disable-line: no-default-export
