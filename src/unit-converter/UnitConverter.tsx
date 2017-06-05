import * as React from "react";

import { capitalizeWord } from "../Utils";
import { NumberInput } from "../NumberInput";

export const yoctometersInMeter = 1e24;
export const zeptometersInMeter = 1e21;
export const attometersInMeter = 1e18;
export const femtometersInMeter = 1e15;
export const picometersInMeter = 1e12;
export const nanometersInMeter = 1e9;
export const micrometersInMeter = 1e6;
export const millimetersInMeter = 1e3;
export const centimetersInMeter = 1e2;
export const decimetersInMeter = 1e1;
export const decametersInMeter = 1e-1;
export const hectometersInMeter = 1e-2;
export const kilometersInMeter = 1e-3;
export const megametersInMeter = 1e-6;
export const gigametersInMeter = 1e-9;
export const terametersInMeter = 1e-12;
export const petametersInMeter = 1e-15;
export const exametersInMeter = 1e-18;
export const zettametersInMeter = 1e-21;
export const yottametersInMeter = 1e-24;

interface UnitInfo {
  name: string,
  conversionFactor: number
}
const lengthUnits: UnitInfo[] = [
  {
    name: "yoctometer",
    conversionFactor: yoctometersInMeter
  },
  {
    name: "zeptometer",
    conversionFactor: zeptometersInMeter
  },
  {
    name: "attometer",
    conversionFactor: attometersInMeter
  },
  {
    name: "femtometer",
    conversionFactor: femtometersInMeter
  },
  {
    name: "picometer",
    conversionFactor: picometersInMeter
  },
  {
    name: "nanometer",
    conversionFactor: nanometersInMeter
  },
  {
    name: "micrometer",
    conversionFactor: micrometersInMeter
  },
  {
    name: "millimeter",
    conversionFactor: millimetersInMeter
  },
  {
    name: "centimeter",
    conversionFactor: centimetersInMeter
  },
  {
    name: "decimeter",
    conversionFactor: decimetersInMeter
  },
  {
    name: "meter",
    conversionFactor: 1
  },
  {
    name: "decameter",
    conversionFactor: decametersInMeter
  },
  {
    name: "hectometer",
    conversionFactor: hectometersInMeter
  },
  {
    name: "kilometer",
    conversionFactor: kilometersInMeter
  },
  {
    name: "megameter",
    conversionFactor: megametersInMeter
  },
  {
    name: "gigameter",
    conversionFactor: gigametersInMeter
  },
  {
    name: "terameter",
    conversionFactor: terametersInMeter
  },
  {
    name: "petameter",
    conversionFactor: petametersInMeter
  },
  {
    name: "exameter",
    conversionFactor: exametersInMeter
  },
  {
    name: "zettameter",
    conversionFactor: zettametersInMeter
  },
  {
    name: "yottameter",
    conversionFactor: yottametersInMeter
  },
];

export interface UnitConverterProps {}
export interface UnitConverterState {
  yoctometer: number,
  zeptometer: number,
  attometer: number,
  femtometer: number,
  picometers: number,
  nanometers: number,
  micrometers: number,
  millimeters: number,
  centimeters: number,
  decimeters: number,
  meters: number,
  decameters: number,
  hectometers: number,
  kilometers: number,
  megameters: number,
  gigameters: number,
  terameters: number,
  petameters: number,
  exameters: number,
  zettameters: number,
  yottameters: number
}
export class UnitConverter extends React.Component<UnitConverterProps, UnitConverterState> {

  constructor(props: UnitConverterProps) {
    super(props);

    let initialState = lengthUnits.reduce((acc: {}, unit: UnitInfo) => {
      acc[unit.name + "s"] = 0;
      return acc;
    }, {});

    this.state = initialState as UnitConverterState;
  }

  onUnitValueChange(unit: UnitInfo, newValue: number, newValueString: string) {
    if(!isNaN(newValue)) {
      this.setMeters(newValue / unit.conversionFactor);
    }
  }
  renderUnitValueInput(unit: UnitInfo) {
    return (
      <div>
        {capitalizeWord(unit.name)}
        <NumberInput value={this.state[unit.name + "s"]} onChange={this.onUnitValueChange.bind(this, unit)} />
      </div>
    );
  }

  setMeters(value: number) {
    let stateDelta = lengthUnits.reduce((acc: {}, unit: UnitInfo) => {
      acc[unit.name + "s"] = value * unit.conversionFactor;
      return acc;
    }, {});

    this.setState(stateDelta);
  }

  public render(): JSX.Element {
    return (
      <div style={{textAlign: "center"}}>
        {lengthUnits.map(this.renderUnitValueInput.bind(this))}
      </div>
    );
  }
}