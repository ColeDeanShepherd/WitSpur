import * as Utils from "../Utils";
import * as React from "react";

declare let ace: any;
const importedSteps = Utils.importAll(require.context("raw-loader!./steps", true, /\.v$/));
const steps = [
  { name: "Introduction.v" },
  {
    name: "Comments",
    children: [
      { name: "SingleLine.v" },
      { name: "MultiLine.v" }
    ]
  },
  { name: "Modules.v" },
  {
    name: "HalfAdder",
    children: [
      { name: "Empty.v" },
      { name: "WithIOPorts.v" },
      { name: "Assign.v" },
      { name: "TestBench.v" },
      { name: "TestBenchRegWire.v" },
      { name: "TestBenchInstantiateModule.v" },
      { name: "TestBenchInitialBlock.v" },
      { name: "TestBenchInitInputs.v" },
      { name: "TestBenchAllInputs.v" },
      { name: "TestBenchFinish.v" },
      { name: "TestBenchMonitor.v" },
      { name: "TestBenchComplete.v" }
    ]
  },
  {
    name: "FullAdder",
    children: [
      { name: "Empty.v" },
      { name: "IOPorts.v" },
      { name: "EmptyHalfAdders.v" },
      { name: "HalfAdderWires.v" },
      { name: "HalfAdderInputs.v" },
      { name: "Outputs.v" },
      { name: "TestBenchNoLogic.v" },
      { name: "TestBenchInitialBlock.v" },
      { name: "TestBenchConcatenation.v" },
      { name: "TestBenchForLoop.v" },
      { name: "Complete.v" }
    ]
  },
].map(step => {
  initStepParents(step, null);
  return step;
});

function initStepParents(step, parent) {
  step.parent = parent;
  
  if(step.children) {
    step.children.forEach(child => initStepParents(child, step));
  }
}

function flattenSteps(steps) {
  return Utils.flatten(steps.map(step => {
    return !step.children ? step : step.children;
  }));
}

function getStepFileName(step) {
  let fileName = step.name;

  let curParent = step.parent;
  while(curParent) {
    fileName = curParent.name + "/" + fileName;
    curParent = curParent.parent;
  }

  return fileName;
}
function getPrevStep(step) {
  let flattenedSteps = flattenSteps(steps);
  let stepIndex = flattenedSteps.indexOf(step);

  return (stepIndex > 0) ? flattenedSteps[stepIndex - 1] : null;
}
function getNextStep(step) {
  let flattenedSteps = flattenSteps(steps);
  let stepIndex = flattenedSteps.indexOf(step);

  return (stepIndex < (flattenedSteps.length - 1)) ? flattenedSteps[stepIndex + 1] : null;
}

export interface VerilogTutorialProps {}
export interface VerilogTutorialState {
  step: any;
}
export class VerilogTutorial extends React.Component<VerilogTutorialProps, VerilogTutorialState> {
  private aceEditor: any;
  
  public constructor(props: VerilogTutorialProps) {
    super(props);
    
    this.state = {
      step: steps[0]
    };
  }
  
  public moveToStep(step: any) {
    this.setState({
      step: step
    }, () => {
      this.aceEditor.setValue(importedSteps[getStepFileName(this.state.step)], -1);
    });
  }
  public moveToPrevStep() {
    let prevStep = getPrevStep(this.state.step);

    if(prevStep) {
      this.moveToStep(prevStep);
    }
  }
  public moveToNextStep() {
    let nextStep = getNextStep(this.state.step);

    if(nextStep) {
      this.moveToStep(getNextStep(this.state.step));
    }
  }
  
  public componentDidMount() {
    let Range = ace.require("ace/range").Range;
    this.aceEditor = ace.edit("editor");
    this.aceEditor.setTheme("ace/theme/monokai");
    this.aceEditor.session.setMode("ace/mode/verilog");
    /*let range = new Range(4, 0, 4, 100);
    this.aceEditor.session.addMarker(range, "added-text-highlight", "text");*/
    this.moveToStep(this.state.step);
  }
  public render(): JSX.Element {
    const moveToStep = this.moveToStep.bind(this);
    const moveToPrevStep = this.moveToPrevStep.bind(this);
    const moveToNextStep = this.moveToNextStep.bind(this);
    const renderStep = (step, index) => {
      if(!step.children) {
        const stepFileName = step.name;
        return <li><a href="" onClick={event => { event.preventDefault(); moveToStep(step); }}>{stepFileName}</a></li>;
      } else {
        return (
          <li>
            {step.name}
            <ul>{step.children.map(renderStep)}</ul>
          </li>
        );
      }
    };
    
    return (
      <div>
        <div className="row">
          <div className="col-md-3" style={{textAlign: "left"}}>
            <ul>
              {steps.map(renderStep)}
            </ul>
          </div>
          
          <div className="col-md">
            <h3>{getStepFileName(this.state.step)}</h3>
            
            <div id="editor" style={{height: "400px"}}></div>
            
            <div>
              <button onClick={moveToPrevStep}>Prev</button>
              <button onClick={moveToNextStep}>Next</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}