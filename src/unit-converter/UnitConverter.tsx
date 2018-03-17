import * as React from "react";

import { capitalizeWord } from "../Utils";
import { NumberInput } from "../NumberInput";
import * as Units from "../Units";

interface UnitInfo {
  name: string,
  conversionFactor: number
}
const lengthUnits: UnitInfo[] = [
  {
    name: "yoctometer",
    conversionFactor: Units.yoctometersInMeter
  },
  {
    name: "zeptometer",
    conversionFactor: Units.zeptometersInMeter
  },
  {
    name: "attometer",
    conversionFactor: Units.attometersInMeter
  },
  {
    name: "femtometer",
    conversionFactor: Units.femtometersInMeter
  },
  {
    name: "picometer",
    conversionFactor: Units.picometersInMeter
  },
  {
    name: "nanometer",
    conversionFactor: Units.nanometersInMeter
  },
  {
    name: "micrometer",
    conversionFactor: Units.micrometersInMeter
  },
  {
    name: "millimeter",
    conversionFactor: Units.millimetersInMeter
  },
  {
    name: "centimeter",
    conversionFactor: Units.centimetersInMeter
  },
  {
    name: "decimeter",
    conversionFactor: Units.decimetersInMeter
  },
  {
    name: "meter",
    conversionFactor: 1
  },
  {
    name: "decameter",
    conversionFactor: Units.decametersInMeter
  },
  {
    name: "hectometer",
    conversionFactor: Units.hectometersInMeter
  },
  {
    name: "kilometer",
    conversionFactor: Units.kilometersInMeter
  },
  {
    name: "megameter",
    conversionFactor: Units.megametersInMeter
  },
  {
    name: "gigameter",
    conversionFactor: Units.gigametersInMeter
  },
  {
    name: "terameter",
    conversionFactor: Units.terametersInMeter
  },
  {
    name: "petameter",
    conversionFactor: Units.petametersInMeter
  },
  {
    name: "exameter",
    conversionFactor: Units.exametersInMeter
  },
  {
    name: "zettameter",
    conversionFactor: Units.zettametersInMeter
  },
  {
    name: "yottameter",
    conversionFactor: Units.yottametersInMeter
  },

  {
    name: "thou",
    conversionFactor: Units.thousInMeter
  },
  {
    name: "inches",
    conversionFactor: Units.inchesInMeter
  },
  {
    name: "feet",
    conversionFactor: Units.feetInMeter
  },
  {
    name: "yard",
    conversionFactor: Units.yardsInMeter
  },
  {
    name: "chain",
    conversionFactor: Units.chainsInMeter
  },
  {
    name: "furlongs",
    conversionFactor: Units.furlongsInMeter
  },
  {
    name: "miles",
    conversionFactor: Units.milesInMeter
  },
  {
    name: "leagues",
    conversionFactor: Units.leaguesInMeter
  },
  {
    name: "fathoms",
    conversionFactor: Units.fathomsInMeter
  },
  {
    name: "cables",
    conversionFactor: Units.cablesInMeter
  },
  {
    name: "nautical miles",
    conversionFactor: Units.nauticalMilesInMeter
  }
];

const massUnits: UnitInfo[] = [
  {
    name: "yoctogram",
    conversionFactor: Units.yoctogramsInGram
  },
  {
    name: "zeptogram",
    conversionFactor: Units.zeptogramsInGram
  },
  {
    name: "attogram",
    conversionFactor: Units.attogramsInGram
  },
  {
    name: "femtogram",
    conversionFactor: Units.femtogramsInGram
  },
  {
    name: "picogram",
    conversionFactor: Units.picogramsInGram
  },
  {
    name: "nanogram",
    conversionFactor: Units.nanogramsInGram
  },
  {
    name: "microgram",
    conversionFactor: Units.microgramsInGram
  },
  {
    name: "milligram",
    conversionFactor: Units.milligramsInGram
  },
  {
    name: "centigram",
    conversionFactor: Units.centigramsInGram
  },
  {
    name: "decigram",
    conversionFactor: Units.decigramsInGram
  },
  {
    name: "gram",
    conversionFactor: 1
  },
  {
    name: "decagram",
    conversionFactor: Units.decagramsInGram
  },
  {
    name: "hectogram",
    conversionFactor: Units.hectogramsInGram
  },
  {
    name: "kilogram",
    conversionFactor: Units.kilogramsInGram
  },
  {
    name: "megagram",
    conversionFactor: Units.megagramsInGram
  },
  {
    name: "gigagram",
    conversionFactor: Units.gigagramsInGram
  },
  {
    name: "teragram",
    conversionFactor: Units.teragramsInGram
  },
  {
    name: "petagram",
    conversionFactor: Units.petagramsInGram
  },
  {
    name: "exagram",
    conversionFactor: Units.exagramsInGram
  },
  {
    name: "zettagram",
    conversionFactor: Units.zettagramsInGram
  },
  {
    name: "yottagram",
    conversionFactor: Units.yottagramsInGram
  },
  
  {
    name: "grains",
    conversionFactor: Units.grainsInGram
  },
  {
    name: "drachms",
    conversionFactor: Units.drachmsInGram
  },
  {
    name: "ounces",
    conversionFactor: Units.ouncesInGram
  },
  {
    name: "pounds",
    conversionFactor: Units.poundsInGram
  },
  {
    name: "stones",
    conversionFactor: Units.stonesInGram
  },
  {
    name: "quarters",
    conversionFactor: Units.quartersInGram
  },
  {
    name: "hundredweights",
    conversionFactor: Units.hundredweightsInGram
  },
  {
    name: "tons",
    conversionFactor: Units.tonsInGram
  },
  {
    name: "slugs",
    conversionFactor: Units.slugsInGram
  },
];

const energyUnits: UnitInfo[] = [
  {
    name: "yoctojoule",
    conversionFactor: Units.yoctojoulesInJoule
  },
  {
    name: "zeptojoule",
    conversionFactor: Units.zeptojoulesInJoule
  },
  {
    name: "attojoule",
    conversionFactor: Units.attojoulesInJoule
  },
  {
    name: "femtojoule",
    conversionFactor: Units.femtojoulesInJoule
  },
  {
    name: "picojoule",
    conversionFactor: Units.picojoulesInJoule
  },
  {
    name: "nanojoule",
    conversionFactor: Units.nanojoulesInJoule
  },
  {
    name: "microjoule",
    conversionFactor: Units.microjoulesInJoule
  },
  {
    name: "millijoule",
    conversionFactor: Units.millijoulesInJoule
  },
  {
    name: "centijoule",
    conversionFactor: Units.centijoulesInJoule
  },
  {
    name: "decijoule",
    conversionFactor: Units.decijoulesInJoule
  },
  {
    name: "joule",
    conversionFactor: 1
  },
  {
    name: "decajoule",
    conversionFactor: Units.decajoulesInJoule
  },
  {
    name: "hectojoule",
    conversionFactor: Units.hectojoulesInJoule
  },
  {
    name: "kilojoule",
    conversionFactor: Units.kilojoulesInJoule
  },
  {
    name: "megajoule",
    conversionFactor: Units.megajoulesInJoule
  },
  {
    name: "gigajoule",
    conversionFactor: Units.gigajoulesInJoule
  },
  {
    name: "terajoule",
    conversionFactor: Units.terajoulesInJoule
  },
  {
    name: "petajoule",
    conversionFactor: Units.petajoulesInJoule
  },
  {
    name: "exajoule",
    conversionFactor: Units.exajoulesInJoule
  },
  {
    name: "zettajoule",
    conversionFactor: Units.zettajoulesInJoule
  },
  {
    name: "yottajoule",
    conversionFactor: Units.yottajoulesInJoule
  },

  {
    name: "ergs",
    conversionFactor: Units.ergsInJoule
  },
  {
    name: "electron-volt",
    conversionFactor: Units.electronVoltsInJoule
  },
  {
    name: "calorie",
    conversionFactor: Units.caloriesInJoule
  },
  {
    name: "kilocalorie",
    conversionFactor: Units.kilocaloriesInJoule
  },
  {
    name: "British Thermal unit",
    conversionFactor: Units.britishThermalUnitsInJoule
  },
  {
    name: "foot-pound",
    conversionFactor: Units.footPoundsInJoule
  },
  {
    name: "foot-poundal",
    conversionFactor: Units.footPoundalsInJoule
  },
  {
    name: "kilowatt-hour",
    conversionFactor: Units.kilowattHoursInJoule
  },
  {
    name: "watt-hour",
    conversionFactor: Units.wattHoursInJoule
  },
  {
    name: "litre atmosphere",
    conversionFactor: Units.litreAtmospheresInJoule
  },
  {
    name: "grams of mass",
    conversionFactor: Units.gramsOfMassInJoule
  },
  {
    name: "foe",
    conversionFactor: Units.foesInJoule
  },
  {
    name: "thermochemical calorie",
    conversionFactor: Units.thermochemicalCaloriesInJoule
  },
  {
    name: "internationalTable calorie",
    conversionFactor: Units.internationalTableCaloriesInJoule
  },
  {
    name: "watt-second",
    conversionFactor: Units.wattSecondsInJoule
  },
  {
    name: "tons of TNT",
    conversionFactor: Units.tonsOfTntInJoule
  }
];

export interface UnitConverterProps {}
export interface UnitConverterState {
  // SI length units
  yoctometers: number,
  zeptometers: number,
  attometers: number,
  femtometers: number,
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
  yottameters: number,

  // imperial length units
  thous: number,
  inches: number,
  feet: number,
  yards: number,
  chains: number,
  furlongs: number,
  miles: number,
  leagues: number,
  fathoms: number,
  cables: number,
  nauticalMiles: number,

  // SI mass units
  yoctograms: number,
  zeptograms: number,
  attograms: number,
  femtograms: number,
  picograms: number,
  nanograms: number,
  micrograms: number,
  milligrams: number,
  centigrams: number,
  decigrams: number,
  grams: number,
  decagrams: number,
  hectograms: number,
  kilograms: number,
  megagrams: number,
  gigagrams: number,
  teragrams: number,
  petagrams: number,
  exagrams: number,
  zettagrams: number,
  yottagrams: number

  // imperial mass units
  grains: number,
  drachms: number,
  ounces: number,
  pounds: number,
  stones: number,
  quarters: number,
  hundredweights: number,
  tons: number,
  slugs: number

  // SI energy units
  yoctojoules: number;
  zeptojoules: number;
  attojoules: number;
  femtojoules: number;
  picojoules: number;
  nanojoules: number;
  microjoules: number;
  millijoules: number;
  centijoules: number;
  decijoules: number;
  decajoules: number;
  hectojoules: number;
  kilojoules: number;
  megajoules: number;
  gigajoules: number;
  terajoules: number;
  petajoules: number;
  exajoules: number;
  zettajoules: number;
  yottajoules: number;
  
  // other energy units
  ergs: number;
  electronVolts: number;
  calories: number;
  kilocalories: number;
  britishThermalUnits: number;
  footPounds: number;
  footPoundals: number;
  kilowattHours: number;
  wattHours: number;
  litreAtmospheres: number;
  gramsOfMass: number;
  foes: number;
  thermochemicalCalories: number;
  internationalTableCalories: number;
  wattSeconds: number;
  tonsOfTnt: number;
}
export class UnitConverter extends React.Component<UnitConverterProps, UnitConverterState> {

  constructor(props: UnitConverterProps) {
    super(props);

    const unitCategories = [lengthUnits, massUnits, energyUnits];

    let initialState = unitCategories.reduce((acc: {}, unitCategory: UnitInfo[]) => {
      return unitCategory.reduce((acc: {}, unit: UnitInfo) => {
        acc[unit.name + "s"] = 0;
        return acc;
      }, acc)
    }, {});

    this.state = initialState as UnitConverterState;
  }

  setBaseUnitValue(baseUnitValue: number, units: UnitInfo[]) {
    let stateDelta = units.reduce((acc: {}, unit: UnitInfo) => {
      acc[unit.name + "s"] = baseUnitValue * unit.conversionFactor;
      return acc;
    }, {});

    this.setState(stateDelta);
  }

  onUnitValueChange(unit: UnitInfo, units: UnitInfo[], newValue: number, newValueString: string) {
    if(!isNaN(newValue)) {
      this.setBaseUnitValue(newValue / unit.conversionFactor, units);
    }
  }
  renderUnitValueInput(unit: UnitInfo, index: number, units: UnitInfo[]) {
    return (
      <div>
        {capitalizeWord(unit.name)}
        <NumberInput value={this.state[unit.name + "s"]} onChange={this.onUnitValueChange.bind(this, unit, units)} minSliderValue={0} maxSliderValue={10000} />
      </div>
    );
  }

  public render(): JSX.Element {
    return (
      <div style={{textAlign: "center"}}>
        <h2>Length/Position</h2>
        {lengthUnits.map(this.renderUnitValueInput.bind(this))}

        <h2>Mass</h2>
        {massUnits.map(this.renderUnitValueInput.bind(this))}

        <h2>Energy</h2>
        {energyUnits.map(this.renderUnitValueInput.bind(this))}
      </div>
    );
  }
}