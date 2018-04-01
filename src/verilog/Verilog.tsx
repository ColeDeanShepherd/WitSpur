import * as Utils from "../Utils";
import * as React from "react";

declare let ace: any;
const steps = Utils.importAll(require.context("raw-loader!./steps", false, /\.v$/));
//const stepFileNames = Object.keys(steps).sort();
const stepFileNames = [
  "Introduction.v",
  "SingleLineComments.v",
  "MultiLineComments.v",
  "Modules.v",
  "HalfAdderEmpty.v",
  "HalfAdderWithIOPorts.v",
  "HalfAdderAssign.v",
  "HalfAdderTestBench.v",
  "HalfAdderTestBenchRegWire.v",
  "HalfAdderTestBenchInstantiateModule.v",
  "HalfAdderTestBenchInitialBlock.v",
  "HalfAdderTestBenchInitInputs.v",
  "HalfAdderTestBenchAllInputs.v",
  "HalfAdderTestBenchFinish.v",
  "HalfAdderTestBenchMonitor.v",
  "HalfAdderTestBenchComplete.v",
  "FullAdderEmpty.v",
  "FullAdderIOPorts.v",
  "FullAdderEmptyHalfAdders.v",
  "FullAdderHalfAdderWires.v",
  "FullAdderHalfAdderInputs.v",
  "FullAdderOutputs.v",
  "FullAdderTestBenchNoLogic.v"
];

export interface VerilogTutorialProps {}
export interface VerilogTutorialState {
  stepNumber: number;
}
export class VerilogTutorial extends React.Component<VerilogTutorialProps, VerilogTutorialState> {
  private aceEditor: any;

  public constructor(props: VerilogTutorialProps) {
    super(props);

    this.state = {
      stepNumber: 0
    };
  }

  public moveToStep(stepNumber: number) {
    this.setState({
      stepNumber: stepNumber
    }, () => {
      this.aceEditor.setValue(steps[stepFileNames[this.state.stepNumber]], -1);
    });
  }
  public moveToPrevStep() {
    this.moveToStep(Utils.clamp(0, stepFileNames.length - 1, this.state.stepNumber - 1));
  }
  public moveToNextStep() {
    this.moveToStep(Utils.clamp(0, stepFileNames.length - 1, this.state.stepNumber + 1));
  }

  public componentDidMount() {
    let Range = ace.require("ace/range").Range;
    this.aceEditor = ace.edit("editor");
    this.aceEditor.setTheme("ace/theme/monokai");
    this.aceEditor.session.setMode("ace/mode/verilog");
    /*let range = new Range(4, 0, 4, 100);
    this.aceEditor.session.addMarker(range, "added-text-highlight", "text");*/
    this.moveToStep(this.state.stepNumber);
  }
  public render(): JSX.Element {
    const moveToStep = this.moveToStep.bind(this);
    const moveToPrevStep = this.moveToPrevStep.bind(this);
    const moveToNextStep = this.moveToNextStep.bind(this);

    return (
      <div>
        <ul>
          {stepFileNames.map((stepFileName, index) => <li><a href="" onClick={event => { event.preventDefault(); moveToStep(index); }}>{stepFileName}</a></li>)}
        </ul>

        <h3>{stepFileNames[this.state.stepNumber]}</h3>

        <div id="editor" style={{height: "400px"}}></div>

        <div>
          <button onClick={moveToPrevStep}>Prev</button>
          <button onClick={moveToNextStep}>Next</button>
        </div>
      </div>
    );
  }
}