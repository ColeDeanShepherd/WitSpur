import * as React from "react";

export interface NumberInputProps {
  value: number,
  onChange: (newValue: number | null, newValueString: string) => void
}
export interface NumberInputState {
  valueString: string
}
export class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
  constructor(props: NumberInputProps) {
    super(props);

    this.state = { valueString: (props.value != null) ? props.value.toString() : "" };
  }
  onValueStringChange(event: any) {
    const newValueString = event.target.value;
    this.setState({ valueString: newValueString });

    if(this.props.onChange) {
      this.props.onChange(this.tryParseValue(newValueString), newValueString);
    }
  }
  tryParseValue(valueString: string): number {
    return parseInt(valueString);
  }
  // on props updated update valuestring

  componentWillReceiveProps(nextProps: NumberInputProps) {
    // Only update the state if the new parsed value differs from the current parsed value.
    const oldValue = this.tryParseValue(this.state.valueString);
    const newValue = nextProps.value;

    if(newValue !== oldValue) {
      this.setState({ valueString: nextProps.value.toString() });
    }
  }
  render() {
    const style = isNaN(this.tryParseValue(this.state.valueString)) ? { borderColor: "red" } : {};
    //const style = isNaN(this.tryParseValue(this.state.valueString)) ? { backgroundColor: "#FFB3B3" } : {};

    return <input type="number" value={this.state.valueString} onChange={this.onValueStringChange.bind(this)} style={style} />;
  }
}