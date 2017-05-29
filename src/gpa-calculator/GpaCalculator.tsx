import * as React from "react";

import * as Utils from "../Utils";
import { NumberInput } from "../NumberInput";

interface GradeValue {
  name: string,
  gradePoints: number
}
class Grade {
  public static aPlus: GradeValue = { name: "A+", gradePoints: 4 };
  public static a: GradeValue = { name: "A", gradePoints: 4 };
  public static aMinus: GradeValue = { name: "A-", gradePoints: 3.667 };
  public static bPlus: GradeValue = { name: "B+", gradePoints: 3.333 };
  public static b: GradeValue = { name: "B", gradePoints: 3 };
  public static bMinus: GradeValue = { name: "B-", gradePoints: 2.667 };
  public static cPlus: GradeValue = { name: "C+", gradePoints: 2.333 };
  public static c: GradeValue = { name: "C", gradePoints: 2 };
  public static cMinus: GradeValue = { name: "C-", gradePoints: 1.667 };
  public static dPlus: GradeValue = { name: "D+", gradePoints: 1.333 };
  public static d: GradeValue = { name: "D", gradePoints: 1 };
  public static dMinus: GradeValue = { name: "D-", gradePoints: 0.667 };
  public static f: GradeValue = { name: "F", gradePoints: 0 };

  public static values = [
    Grade.aPlus,
    Grade.a,
    Grade.aMinus,
    Grade.bPlus,
    Grade.b,
    Grade.bMinus,
    Grade.cPlus,
    Grade.c,
    Grade.cMinus,
    Grade.dPlus,
    Grade.d,
    Grade.dMinus,
    Grade.f,
  ];
};

class GpaRow {
  constructor(public id: string, public grade: GradeValue, public creditHours: number) {}
}

export interface GpaCalculatorProps {}
export interface GpaCalculatorState {
  rows: GpaRow[]
}

export class GpaCalculator extends React.Component<GpaCalculatorProps, GpaCalculatorState> {
  constructor(props: GpaCalculatorProps) {
    super(props);

    this.state = {
      rows: [ new GpaRow(Utils.genUniqueId(), Grade.aPlus, 4) ]
    };
  }

  calculateGpa(): number {
    const totalGradePoints = this.state.rows.reduce((acc: number, value: GpaRow) => acc + (value.grade.gradePoints * value.creditHours), 0);
    const totalCreditHours = this.state.rows.reduce((acc: number, value: GpaRow) => acc + value.creditHours, 0);

    return totalGradePoints / totalCreditHours;
  }

  addRow() {
    this.setState({ rows: Utils.addElementImmutable(this.state.rows, new GpaRow(Utils.genUniqueId(), Grade.aPlus, 0)) });
  }
  removeRow(index: number) {
    this.setState({ rows: Utils.removeElementImmutable(this.state.rows, index) });
  }

  onGradeChange(index: number, event: any) {
    const gradeName = event.target.value;
    const grade = Grade.values.find((grade: GradeValue) => grade.name === gradeName);

    if(grade === undefined) {
      return;
    }

    const oldRow = this.state.rows[index];
    const newRow = new GpaRow(oldRow.id, grade, oldRow.creditHours);
    this.setState({ rows: Utils.setElementImmutable(this.state.rows, index, newRow) });
  }
  onCreditHoursChange(index: number, newValue: number, newValueString: string) {
    const oldRow = this.state.rows[index];
    const newRow = new GpaRow(oldRow.id, oldRow.grade, newValue);
    this.setState({ rows: Utils.setElementImmutable(this.state.rows, index, newRow) });
  }

  renderRow(gpaRow: GpaRow, index: number): JSX.Element {
    const tdStyle = { border: "none" };

    return (
      <tr key={gpaRow.id}>
        <td style={tdStyle}>
          <select value={gpaRow.grade.name} onChange={this.onGradeChange.bind(this, index)}>
            {Grade.values.map((grade: GradeValue) => <option value={grade.name} key={grade.name}>{grade.name}</option>)}
          </select>
        </td>
        <td style={tdStyle}>
          <NumberInput value={gpaRow.creditHours} onChange={this.onCreditHoursChange.bind(this, index)} />
        </td>
        <td style={tdStyle}>
          <button onClick={this.removeRow.bind(this, index)}>X</button>
        </td>
      </tr>
    );
  }
  render(): JSX.Element {
    const gpa = this.calculateGpa();

    return (
      <div style={{marginBottom: "4em"}}>
        <div style={{margin: "3rem 0", fontSize: "3em"}}>{isNaN(gpa) ? "-" : gpa.toFixed(3)}</div>

        <div className="row">
          <div className="col" style={{margin: "0 auto"}}>
            <div className="card">
              <table>
                <thead>
                  <tr>
                    <th style={{width: "100px"}}>Grade</th>
                    <th>Credit Hours</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.rows.map(this.renderRow.bind(this))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{margin: "1em 0"}}><button onClick={this.addRow.bind(this)}>Add Class</button></div>
      </div>
    );
  }
}