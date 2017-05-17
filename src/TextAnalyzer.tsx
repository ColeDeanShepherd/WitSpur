import * as React from "react";

import * as Utils from "./utils";

export interface TextAnalyzerProps {}
export interface TextAnalyzerState {
  text: string
}

export class TextAnalyzer extends React.Component<TextAnalyzerProps, TextAnalyzerState> {
  constructor(props: TextAnalyzerProps) {
    super(props);

    this.state = { text: "" };
  }
  onTextChange(event: any) {
    this.setState({ text: event.target.value });
  }
  charToVisibleString(char: string): string {
    Utils.assert(char.length === 1);

    switch(char) {
      case " ":
        return "space";
      case "\t":
        return "tab";
      case "\r":
        return "carriage return";
      case "\n":
        return "newline";
      default:
        return char;
    }
  }

  render(): JSX.Element {
    const characterCount = this.state.text.length;
    const characterCountExcludingNewLines = Utils.charCountExcludingNewLines(this.state.text);
    const characterCountExcludingWhiteSpace = Utils.charCountExcludingWhiteSpace(this.state.text);

    const wordCount = Utils.wordCount(this.state.text);
    const lineCount = 1 + Utils.charOccurrenceCount("\n", this.state.text);

    const wordCounts = Utils.wordCounts(this.state.text);
    const wordCountPairs = Utils.reduceObjectPropertyNames((acc: [string, number][], propertyName: string) => {
      acc.push([propertyName, wordCounts[propertyName]]);
      return acc;
    }, wordCounts, []);
    const orderedWordCountPairs = wordCountPairs.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
    const wordCountTrs = orderedWordCountPairs.map(wordCountPair => (
      <tr>
        <td style={{width: "50%"}}>{wordCountPair[0]}</td>
        <td style={{width: "50%"}}>{wordCountPair[1]} ({(100 * (wordCountPair[1] / wordCount)).toFixed(2)}%)</td>
      </tr>
    ));

    const charCounts = Utils.charCounts(this.state.text);
    const charCountPairs = Utils.reduceObjectPropertyNames((acc: [string, number][], propertyName: string) => {
      acc.push([propertyName, charCounts[propertyName]]);
      return acc;
    }, charCounts, []);
    const orderedCharCountPairs = charCountPairs.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
    const charCountTrs = orderedCharCountPairs.map(charCountPair => (
      <tr>
        <td style={{width: "50%"}}>{this.charToVisibleString(charCountPair[0])}</td>
        <td style={{width: "50%"}}>{charCountPair[1]} ({(100 * (charCountPair[1] / characterCountExcludingWhiteSpace)).toFixed(2)}%)</td>
      </tr>
    ));

    return (
      <div>
        <p>* Character count includes line breaks. Word count includes numbers and may not work with non-English languages.</p>
        
        <textarea value={this.state.text} onChange={this.onTextChange.bind(this)} style={{margin: "1em 0", width: "100%", height: "200px"}} />

        <div className="row">
          <div className="column">
            <table style={{margin: "1em 0"}}>
            <tbody>
              <tr>
                <td style={{width: "50%"}}>Characters</td>
                <td>{characterCount}</td>
              </tr>
              <tr>
                <td style={{width: "50%"}}>Characters (no line-breaks)</td>
                <td>{characterCountExcludingNewLines}</td>
              </tr>
              <tr>
                <td style={{width: "50%"}}>Characters (no white-space)</td>
                <td>{characterCountExcludingWhiteSpace}</td>
              </tr>
              <tr>
                <td style={{width: "50%"}}>Words</td>
                <td>{wordCount}</td>
              </tr>
              <tr>
                <td style={{width: "50%"}}>Lines</td>
                <td>{lineCount}</td>
              </tr>
            </tbody>
          </table>
          </div>

          <div className="column">
            <table style={{margin: "1em 0"}}><tbody>{wordCountTrs}</tbody></table>
          </div>

          <div className="column">
            <table style={{margin: "1em 0"}}><tbody>{charCountTrs}</tbody></table>
          </div>
        </div>
      </div>
    );
  }
}