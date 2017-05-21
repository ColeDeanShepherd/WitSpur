import * as React from "react";

import * as Utils from "../Utils";
import * as Text from "../Text";

export interface TextAnalyzerProps {}
export interface TextAnalyzerState {
  text: string,
  showingAllWordCountRows: boolean,
  includeWhiteSpaceInCharCount: boolean,
  includePunctuationInCharCount: boolean
}

export class TextAnalyzer extends React.Component<TextAnalyzerProps, TextAnalyzerState> {
  constructor(props: TextAnalyzerProps) {
    super(props);

    this.state = {
      text: "",
      showingAllWordCountRows: false,
      includeWhiteSpaceInCharCount: false,
      includePunctuationInCharCount: false
    };
  }
  onTextChange(event: any) {
    this.setState({ text: event.target.value });
  }
  toggleShowAllWordCountRows(event: any) {
    event.preventDefault();
    event.stopPropagation();
    
    this.setState({ showingAllWordCountRows: !this.state.showingAllWordCountRows });
  }
  toggleIncludePunctuationCharCount(event: any) {
    this.setState({ includePunctuationInCharCount: !this.state.includePunctuationInCharCount });
  }
  toggleIncludeWhiteSpaceInCharCount(event: any) {
    this.setState({ includeWhiteSpaceInCharCount: !this.state.includeWhiteSpaceInCharCount });
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
    const characterCountExcludingNewLines = Text.charCountExcludingNewLines(this.state.text);
    const characterCountExcludingWhiteSpace = Text.charCount(this.state.text, true, false);
    const characterCountExcludingPunctuationAndWhiteSpace = Text.charCount(this.state.text, false, false);
    const characterRegex = Text.getCharRegex(this.state.includePunctuationInCharCount, this.state.includeWhiteSpaceInCharCount);

    const wordCount = Text.wordCount(this.state.text);
    const lineCount = 1 + Text.charOccurrenceCount("\n", this.state.text);

    const visibleWordCountRowCount = 100;
    const wordCounts = Text.wordCounts(this.state.text);
    const wordCountPairs = Utils.reduceObjectPropertyNames((acc: [string, number][], propertyName: string) => {
      acc.push([propertyName, wordCounts[propertyName]]);
      return acc;
    }, wordCounts, []);
    const orderedWordCountPairs = wordCountPairs.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
    const orderedWordCountPairsToDisplay = !this.state.showingAllWordCountRows ? orderedWordCountPairs.slice(0, visibleWordCountRowCount) : orderedWordCountPairs;
    const wordCountTrs = orderedWordCountPairsToDisplay.map(wordCountPair => (
      <tr key={wordCountPair[0]}>
        <td style={{width: "50%"}}>{wordCountPair[0]}</td>
        <td style={{width: "50%"}}>{wordCountPair[1]}</td>
        <td style={{width: "50%"}}>{(100 * (wordCountPair[1] / wordCount)).toFixed(2)}%</td>
      </tr>
    ));

    const charCounts = Text.charCounts(this.state.text);
    const charCountPairs = Utils.reduceObjectPropertyNames((acc: [string, number][], propertyName: string) => {
      acc.push([propertyName, charCounts[propertyName]]);
      return acc;
    }, charCounts, []);
    const orderedCharCountPairs = charCountPairs.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
    const orderedCharCountPairsToDisplay = orderedCharCountPairs.filter(charCountPair => characterRegex.test(charCountPair[0]));
    const charsToDisplayCount = orderedCharCountPairsToDisplay.reduce((acc, charCountPair) => acc + charCountPair[1], 0);
    const charCountTrs = orderedCharCountPairsToDisplay.map(charCountPair => (
      <tr key={charCountPair[0]}>
        <td style={{width: "50%"}}>{this.charToVisibleString(charCountPair[0])}</td>
        <td style={{width: "50%"}}>{charCountPair[1]}</td>
        <td style={{width: "50%"}}>{(100 * (charCountPair[1] / charsToDisplayCount)).toFixed(2)}%</td>
      </tr>
    ));

    return (
      <div>
        <textarea value={this.state.text} onChange={this.onTextChange.bind(this)} placeholder="Enter text here." style={{margin: "1em 0", width: "100%", height: "200px"}} />

        <div className="row">
          <div className="column">
            <h4>Overall Character &amp; Word Counts</h4>
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
                <td style={{width: "50%"}}>Characters (no punctuation or white-space)</td>
                <td>{characterCountExcludingPunctuationAndWhiteSpace}</td>
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
            <h4>Character Counts &amp; Frequencies</h4>
            <span>
              <input type="checkbox" checked={this.state.includePunctuationInCharCount} onClick={this.toggleIncludePunctuationCharCount.bind(this)} /> Include Punctuation<br /><br />
              <input type="checkbox" checked={this.state.includeWhiteSpaceInCharCount} onClick={this.toggleIncludeWhiteSpaceInCharCount.bind(this)} /> Include White-space
            </span>
            <table style={{margin: "1em 0"}}><tbody>{charCountTrs}</tbody></table>
          </div>

          <div className="column">
            <h4>Word Counts &amp; Frequencies</h4>
            <table style={{margin: "1em 0"}}><tbody>{wordCountTrs}</tbody></table>
            {(orderedWordCountPairs.length > visibleWordCountRowCount) ? <a href="" onClick={this.toggleShowAllWordCountRows.bind(this)}>{!this.state.showingAllWordCountRows ? "Show More" : "Show Less"}</a> : null}
          </div>
        </div>
      </div>
    );
  }
}