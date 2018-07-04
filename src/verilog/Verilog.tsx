import * as Utils from "../Utils";
import * as React from "react";
import * as diff from "diff";

/*
TODO
====
-async assign
-always @(*)
-$display (use for test bench tables)
-tasks
-functions
-block labels
-explain test benches
-include
-signed/unsigned integers
-float
-case
*/

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
      { name: "Complete.v" }
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
  {
    name: "4BitRippleCarryAdder",
    children: [
      { name: "Empty.v" },
      { name: "IOPorts.v" },
      { name: "FullAdders.v" },
      { name: "FullAdderConnections.v" },
      { name: "Outputs.v" },
      { name: "TestBench.v" },
      { name: "Complete.v" },
    ]
  },
  {
    name: "Counter",
    children: [
      { name: "Empty.v" },
      { name: "AlwaysBlock.v" },
      { name: "ConditionalAssignment.v" },
      { name: "TestBench.v" },
      { name: "Complete.v" }
    ]
  },
  {
    name: "4BitMultiplexer",
    children: [
      { name: "Empty.v" },
      { name: "AlwaysBlock.v" },
      { name: "Case.v" },
      { name: "TestBench.v" },
      { name: "Complete.v" }
    ]
  },
  {
    name: "RAM",
    children: [
      { name: "Module.v" },
      { name: "TestBench.v" },
      { name: "Complete.v" }
    ]
  }
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

function clearAceMarkers(aceEditSession: any) {
  const backMarkers = aceEditSession.getMarkers(false);

  for(let key in backMarkers) {
    let backMarker = backMarkers[key];
    aceEditSession.removeMarker(backMarker.id);
  }
}
function addAdditionMarkersToAceEditor(aceEditor: any, oldText: string, newText: string) {
  const textChanges = diff.diffLines(oldText, newText, {
    ignoreWhitespace: true,
    newlineIsToken: true,
    ignoreCase: false
  });

  let lineIndex = 0;
  textChanges.forEach(change => {
    if(change.removed) return;

    if(change.added) {
      const startLineNumber = lineIndex;
      const endLineNumber = startLineNumber + Utils.unwrapValueOrUndefined(change.count);

      let range = new ace.Range(startLineNumber, 0, endLineNumber, 99999);
      aceEditor.session.addMarker(range, "added-text-highlight", "text");
    }

    lineIndex += Utils.unwrapValueOrUndefined(change.count);
  });
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
      const prevStep = getPrevStep(this.state.step);
      const prevStepSourceCode = prevStep ? importedSteps[getStepFileName(prevStep)] : "";

      const stepSourceCode = importedSteps[getStepFileName(this.state.step)];

      clearAceMarkers(this.aceEditor.session);
      this.aceEditor.setValue(stepSourceCode, -1);
      this.aceEditor.scrollToLine(0, false, false, () => {});
      //addAdditionMarkersToAceEditor(this.aceEditor, prevStepSourceCode, stepSourceCode);
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
    this.moveToStep(this.state.step);
  }
  public render(): JSX.Element {
    const moveToStep = this.moveToStep.bind(this);
    const moveToPrevStep = this.moveToPrevStep.bind(this);
    const moveToNextStep = this.moveToNextStep.bind(this);
    const renderStep = (step, index) => {
      if(!step.children) {
        const stepFileName = step.name;
        const onClick = event => {
          event.preventDefault();
          moveToStep(step);
        };
        return <li><a onClick={onClick}>{stepFileName}</a></li>;
      } else {
        const onClick = event => {
          event.preventDefault();

          if(step.children.length > 0) {
            moveToStep(step.children[0]);
          }
        };
        return (
          <li>
            <a onClick={onClick}>{step.name}</a>
            <ul>{step.children.map(renderStep)}</ul>
          </li>
        );
      }
    };
    
    return (
      <div>
        <div className="row">
          <div className="col-md-3" style={{textAlign: "left"}}>
            <div>
              <button onClick={moveToPrevStep}>Prev</button>
              <button onClick={moveToNextStep}>Next</button>
            </div>
            
            <ul>
              {steps.map(renderStep)}
            </ul>
          </div>
          
          <div className="col-md">
            <h3>{getStepFileName(this.state.step)}</h3>
            
            <div id="editor" style={{height: "600px"}}></div>
          </div>
        </div>
      </div>
    );
  }
}