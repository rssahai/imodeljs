/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
/** @packageDocumentation
 * @module PropertyEditors
 */

import "./TextareaEditor.scss";
import classnames from "classnames";
import * as React from "react";
import {
  InputEditorSizeParams, MultilineTextEditorParams, PrimitiveValue, PropertyEditorParams,
  PropertyEditorParamTypes, PropertyValue, PropertyValueFormat,
} from "@bentley/ui-abstract";
import { Textarea, TextareaProps } from "@bentley/ui-core";
import { TypeConverterManager } from "../converters/TypeConverterManager";
import { PropertyEditorProps, TypeEditor } from "./EditorContainer";
import { PropertyEditorBase, PropertyEditorManager } from "./PropertyEditorManager";
import { StandardTypeNames } from "../common/StandardTypeNames";
import { StandardEditorNames } from "./StandardEditorNames";
import { PopupButton, PopupContent, PopupOkCancelButtons } from "./PopupButton";

/** @internal */
interface TextareaEditorState {
  inputValue: string;
  readonly: boolean;
  isDisabled?: boolean;
  size?: number;
  maxLength?: number;
  rows: number;
}

const DEFAULT_ROWS = 3;

/** TextareaEditor React component that is a property editor with text input
 * @beta
 */
export class TextareaEditor extends React.PureComponent<PropertyEditorProps, TextareaEditorState> implements TypeEditor {
  private _isMounted = false;

  /** @internal */
  public readonly state: Readonly<TextareaEditorState> = {
    inputValue: "",
    readonly: false,
    rows: DEFAULT_ROWS,
  };

  public async getPropertyValue(): Promise<PropertyValue | undefined> {
    const record = this.props.propertyRecord;
    let propertyValue: PropertyValue | undefined;

    // istanbul ignore else
    if (record && record.value.valueFormat === PropertyValueFormat.Primitive) {
      propertyValue = await TypeConverterManager.getConverter(record.property.typename).convertFromStringToPropertyValue(this.state.inputValue, record);
      (propertyValue as PrimitiveValue).displayValue = this.state.inputValue;
    }

    return propertyValue;
  }

  private _updateTextareaValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // istanbul ignore else
    if (this._isMounted)
      this.setState({
        inputValue: e.target.value,
      });
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
    const record = this.props.propertyRecord;
    let initialValue = "";

    // istanbul ignore else
    if (record && record.value.valueFormat === PropertyValueFormat.Primitive) {
      const value = (record.value as PrimitiveValue).value;
      initialValue = await TypeConverterManager.getConverter(record.property.typename).convertPropertyToString(record.property, value);
    }

    const readonly = record && undefined !== record.isReadonly ? record.isReadonly : false;
    let size: number | undefined;
    let maxLength: number | undefined;
    let rows: number = DEFAULT_ROWS;

    const isDisabled = record ? record.isDisabled : undefined;

    if (record && record.property && record.property.editor && record.property.editor.params) {
      const editorSizeParams = record.property.editor.params.find((param: PropertyEditorParams) => param.type === PropertyEditorParamTypes.InputEditorSize) as InputEditorSizeParams;
      if (editorSizeParams) {
        // istanbul ignore else
        if (editorSizeParams.size)
          size = editorSizeParams.size;
        // istanbul ignore else
        if (editorSizeParams.maxLength)
          maxLength = editorSizeParams.maxLength;
      }

      const multilineParams = record.property.editor.params.find((param: PropertyEditorParams) => param.type === PropertyEditorParamTypes.MultilineText) as MultilineTextEditorParams;
      if (multilineParams) {
        rows = multilineParams.rows;
      }
    }

    // istanbul ignore else
    if (this._isMounted)
      this.setState({ inputValue: initialValue, readonly, size, maxLength, isDisabled, rows });
  }

  private _handleOk = async (_event: React.MouseEvent): Promise<void> => {
    // istanbul ignore else
    if (this.props.propertyRecord && this.props.onCommit) {
      const propertyValue = await this.getPropertyValue();
      // istanbul ignore else
      if (propertyValue !== undefined) {
        this.props.onCommit({ propertyRecord: this.props.propertyRecord, newValue: propertyValue });
      }
    }
  }

  private _handleCancel = (_event: React.MouseEvent): void => {
    // istanbul ignore else
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  /** @internal */
  public render(): React.ReactNode {
    const className = classnames("components-cell-editor", "components-textarea-editor", this.props.className);
    const minSize = this.state.size ? this.state.size : 8;
    const style: React.CSSProperties = {
      ...this.props.style,
      minWidth: `${minSize * 0.75}em`,
    };
    const textareaProps: TextareaProps = {
      className: "components-textarea-editor-textarea",
      style,
      rows: this.state.rows,
      readOnly: this.state.readonly,
      disabled: this.state.isDisabled,
      maxLength: this.state.maxLength,
      defaultValue: this.state.inputValue,
      onBlur: this.props.onBlur,
      onChange: this._updateTextareaValue,
      setFocus: this.props.setFocus && !this.state.isDisabled,
    };

    return (
      <div className={className}>
        <PopupButton label={this.state.inputValue}>
          <PopupContent>
            <Textarea
              {...textareaProps}
              data-testid="components-textarea-editor"
            />
            <PopupOkCancelButtons onOk={this._handleOk} onCancel={this._handleCancel} />
          </PopupContent>
        </PopupButton>
      </div>
    );
  }
}

/** Textarea Property Editor registered for the "text" and "string" type names and "multi-line" editor name.
 * It uses the [[ToggleEditor]] React component.
 * @beta
 */
export class TextareaPropertyEditor extends PropertyEditorBase {

  public get reactNode(): React.ReactNode {
    return <TextareaEditor />;
  }
}

PropertyEditorManager.registerEditor(StandardTypeNames.Text, TextareaPropertyEditor, StandardEditorNames.MultiLine);
PropertyEditorManager.registerEditor(StandardTypeNames.String, TextareaPropertyEditor, StandardEditorNames.MultiLine);
