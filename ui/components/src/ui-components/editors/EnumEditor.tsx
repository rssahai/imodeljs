/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module PropertyEditors
 */

import "./EnumEditor.scss";
import classnames from "classnames";
import * as React from "react";
import { EnumerationChoice, PrimitiveValue, PropertyValue, PropertyValueFormat } from "@bentley/ui-abstract";
import { Select } from "@bentley/ui-core";
import { PropertyEditorProps, TypeEditor } from "./EditorContainer";
import { PropertyEditorBase, PropertyEditorManager } from "./PropertyEditorManager";
import { StandardTypeNames } from "../common/StandardTypeNames";

/** @internal */
interface EnumEditorState {
  selectValue: string | number;
  valueIsNumber: boolean;
}

/** EnumEditor React component that is a property editor with select input
 * @beta
 */
export class EnumEditor extends React.PureComponent<PropertyEditorProps, EnumEditorState> implements TypeEditor {
  private _isMounted = false;

  /** @internal */
  public readonly state: Readonly<EnumEditorState> = {
    selectValue: "",
    valueIsNumber: false,
  };

  public async getPropertyValue(): Promise<PropertyValue | undefined> {
    const record = this.props.propertyRecord;
    let propertyValue: PropertyValue | undefined;

    // istanbul ignore else
    if (record && record.value.valueFormat === PropertyValueFormat.Primitive) {
      propertyValue = {
        valueFormat: PropertyValueFormat.Primitive,
        value: this.state.selectValue,
        displayValue: "",
      };
    }

    return propertyValue;
  }

  private _updateSelectValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // istanbul ignore else
    if (this._isMounted) {
      let selectValue: string | number;

      if (this.state.valueIsNumber)
        selectValue = parseInt(e.target.value, 10);
      else
        selectValue = e.target.value;

      this.setState({
        selectValue,
      }, async () => {
        // istanbul ignore else
        if (this.props.propertyRecord && this.props.onCommit) {
          const propertyValue = await this.getPropertyValue();
          // istanbul ignore else
          if (propertyValue) {
            this.props.onCommit({ propertyRecord: this.props.propertyRecord, newValue: propertyValue });
          }
        }
      });
    }
  }

  /** @internal */
  public componentDidMount() {
    this._isMounted = true;
    this.setStateFromProps(); // tslint:disable-line:no-floating-promises
  }

  /** @internal */
  public componentWillUnmount() {
    this._isMounted = false;
  }

  /** @internal */
  public componentDidUpdate(prevProps: PropertyEditorProps) {
    if (this.props.propertyRecord !== prevProps.propertyRecord) {
      this.setStateFromProps(); // tslint:disable-line:no-floating-promises
    }
  }

  private async setStateFromProps() {
    const { propertyRecord } = this.props;
    let initialValue: string | number = "";
    let valueIsNumber: boolean = false;

    // istanbul ignore else
    if (propertyRecord && propertyRecord.value.valueFormat === PropertyValueFormat.Primitive) {
      const primitiveValue = (propertyRecord.value as PrimitiveValue).value;
      if (typeof primitiveValue === "string") {
        initialValue = primitiveValue as string;
        valueIsNumber = false;
      } else {
        initialValue = primitiveValue as number;
        valueIsNumber = true;
      }
    }

    // istanbul ignore else
    if (this._isMounted)
      this.setState({ selectValue: initialValue, valueIsNumber });
  }

  /** @internal */
  public render() {
    const className = classnames("components-cell-editor", "components-enum-editor", this.props.className);
    const { propertyRecord } = this.props;
    const selectValue = this.state.selectValue ? this.state.selectValue.toString() : undefined;
    let choices: EnumerationChoice[] | undefined;

    if (propertyRecord && propertyRecord.property.enum)
      choices = propertyRecord.property.enum.choices;

    const options: { [key: string]: string } = {};
    if (choices) {
      choices.forEach((choice: EnumerationChoice) => {
        options[choice.value.toString()] = choice.label;
      });
    }

    // set min-width to show about 4 characters + down arrow
    const minWidthStyle: React.CSSProperties = {
      minWidth: `${6 * 0.75}em`,
    };

    return (
      <Select
        onBlur={this.props.onBlur}
        className={className}
        style={this.props.style ? this.props.style : minWidthStyle}
        value={selectValue}
        onChange={this._updateSelectValue}
        data-testid="components-select-editor"
        options={options}
        setFocus={this.props.setFocus} />
    );
  }
}

/** Enum Property Button Group Editor registered for the "enum" type name.
 * It uses the [[EnumEditor]] React component.
 * @beta
 */
export class EnumPropertyEditor extends PropertyEditorBase {

  public get reactNode(): React.ReactNode {
    return <EnumEditor />;
  }
}

PropertyEditorManager.registerEditor(StandardTypeNames.Enum, EnumPropertyEditor);
