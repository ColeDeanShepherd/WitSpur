import * as React from "react";

import * as Utils from "../Utils";
import * as Text from "../Text";

export interface CharWordLineCounterProps {}
export interface CharWordLineCounterState {
  text: string,
  showTablesAsTextAreas: boolean,
  includeNumbersInCharCount: boolean,
  includeWhiteSpaceInCharCount: boolean,
  includeOtherCharsInCharCount: boolean,
  showingAllWordCountRows: boolean
}

export class CharWordLineCounter extends React.Component<CharWordLineCounterProps, CharWordLineCounterState> {
  constructor(props: CharWordLineCounterProps) {
    super(props);

    this.state = {
      text: "",
      showTablesAsTextAreas: false,
      includeNumbersInCharCount: false,
      includeWhiteSpaceInCharCount: false,
      includeOtherCharsInCharCount: false,
      showingAllWordCountRows: false
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
  toggleIncludeNumbersInCharCount(event: any) {
    this.setState({ includeNumbersInCharCount: !this.state.includeNumbersInCharCount });
  }
  toggleIncludeWhiteSpaceInCharCount(event: any) {
    this.setState({ includeWhiteSpaceInCharCount: !this.state.includeWhiteSpaceInCharCount });
  }
  toggleIncludeOtherCharsInCharCount(event: any) {
    this.setState({ includeOtherCharsInCharCount: !this.state.includeOtherCharsInCharCount });
  }
  toggleShowTablesAsTextAreas(event: any) {
    this.setState({ showTablesAsTextAreas: !this.state.showTablesAsTextAreas });
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

  getOverallCountsTsv(characterCount: number, characterCountExcludingNewLines: number, characterCountExcludingWhiteSpace: number, characterCountExcludingWhiteSpaceAndOtherChars: number, wordCount: number, lineCount: number): string {
    const separator = "\t";
    let lines: string[] = [];

    lines.push(["Characters", characterCount.toString()].join(separator));
    lines.push(["Characters (no line-breaks)", characterCountExcludingNewLines.toString()].join(separator));
    lines.push(["Characters (no white-space)", characterCountExcludingWhiteSpace.toString()].join(separator));
    lines.push(["Characters (no white-space or symbols)", characterCountExcludingWhiteSpaceAndOtherChars.toString()].join(separator));
    lines.push(["Words", wordCount.toString()].join(separator));
    lines.push(["Lines", lineCount.toString()].join(separator));

    return lines.join("\n");
  }

  getOrderedCharCountPairs(): [string, number][] {
    const charCounts = Text.charCounts(this.state.text);
    const charCountPairs = Utils.reduceObjectPropertyNames((acc: [string, number][], propertyName: string) => {
      acc.push([propertyName, charCounts[propertyName]]);
      return acc;
    }, charCounts, []);
    return charCountPairs.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  }
  getCharCountTrs(orderedCharCountPairs: [string, number][]): JSX.Element[] {
    const characterRegex = Text.charFilteringRegex(true, this.state.includeNumbersInCharCount, this.state.includeWhiteSpaceInCharCount, this.state.includeOtherCharsInCharCount);
    const orderedCharCountPairsToDisplay = orderedCharCountPairs.filter(charCountPair => characterRegex.test(charCountPair[0]));
    const charsToDisplayCount = orderedCharCountPairsToDisplay.reduce((acc, charCountPair) => acc + charCountPair[1], 0);
    return orderedCharCountPairsToDisplay.map(charCountPair => (
      <tr key={charCountPair[0]}>
        <td style={{width: "50%"}}>{this.charToVisibleString(charCountPair[0])}</td>
        <td style={{width: "50%"}}>{charCountPair[1]}</td>
        <td style={{width: "50%"}}>{(100 * (charCountPair[1] / charsToDisplayCount)).toFixed(2)}%</td>
      </tr>
    ));
  }
  getCharCountTsv(orderedCharCountPairs: [string, number][]): string {
    const characterRegex = Text.charFilteringRegex(true, this.state.includeNumbersInCharCount, this.state.includeWhiteSpaceInCharCount, this.state.includeOtherCharsInCharCount);
    const orderedCharCountPairsToDisplay = orderedCharCountPairs.filter(charCountPair => characterRegex.test(charCountPair[0]));
    const charsToDisplayCount = orderedCharCountPairsToDisplay.reduce((acc, charCountPair) => acc + charCountPair[1], 0);

    const separator = "\t";
    let lines: string[] = orderedCharCountPairsToDisplay.map(charCountPair => [
      this.charToVisibleString(charCountPair[0]),
      charCountPair[1].toString(),
      (charCountPair[1] / charsToDisplayCount).toFixed(5).toString()
    ].join(separator));

    return lines.join("\n");
  }

  getOrderedWordCountPairs(): [string, number][] {
    const wordCounts = Text.wordCounts(this.state.text);
    const wordCountPairs = Utils.reduceObjectPropertyNames((acc: [string, number][], propertyName: string) => {
      acc.push([propertyName, wordCounts[propertyName]]);
      return acc;
    }, wordCounts, []);
    return wordCountPairs.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  }
  getWordCountTrs(wordCount: number, orderedWordCountPairs: [string, number][], visibleWordCountRowCount: number): JSX.Element[] {
    const orderedWordCountPairsToDisplay = !this.state.showingAllWordCountRows ? orderedWordCountPairs.slice(0, visibleWordCountRowCount) : orderedWordCountPairs;
    
    return orderedWordCountPairsToDisplay.map(wordCountPair => (
      <tr key={wordCountPair[0]}>
        <td style={{width: "50%"}}>{wordCountPair[0]}</td>
        <td style={{width: "50%"}}>{wordCountPair[1]}</td>
        <td style={{width: "50%"}}>{(100 * (wordCountPair[1] / wordCount)).toFixed(2)}%</td>
      </tr>
    ));
  }
  getWordCountTsv(wordCount: number, orderedWordCountPairs: [string, number][], visibleWordCountRowCount: number): string {
    const orderedWordCountPairsToDisplay = !this.state.showingAllWordCountRows ? orderedWordCountPairs.slice(0, visibleWordCountRowCount) : orderedWordCountPairs;

    const separator = "\t";
    let lines: string[] = orderedWordCountPairsToDisplay.map(wordCountPair => [
        wordCountPair[0],
        wordCountPair[1].toString(),
        (wordCountPair[1] / wordCount).toFixed(4).toString()
    ].join(separator));

    return lines.join("\n");
  }

  render(): JSX.Element {
    const characterCount = this.state.text.length;
    const characterCountExcludingNewLines = Text.charCountExcludingNewLines(this.state.text);
    const characterCountExcludingWhiteSpace = Text.charCount(this.state.text, Text.charFilteringRegex(true, true, false, true));
    const characterCountExcludingWhiteSpaceAndOtherChars = Text.charCount(this.state.text, Text.charFilteringRegex(true, true, false, false));

    const wordCount = Text.wordCount(this.state.text);
    const lineCount = 1 + Text.charOccurrenceCount("\n", this.state.text);

    const orderedWordCountPairs = this.getOrderedWordCountPairs();
    const visibleWordCountRowCount = 100;
    const wordCountTrs = this.getWordCountTrs(wordCount, orderedWordCountPairs, visibleWordCountRowCount);

    const orderedCharCountPairs = this.getOrderedCharCountPairs();
    const charCountTrs = this.getCharCountTrs(orderedCharCountPairs);

    const columnTextAreaStyle = {
      width: "100%",
      height: "200px"
    };

    const renderOverallCountsColumn = () => {
      const countsElement = !this.state.showTablesAsTextAreas ? (
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
              <td style={{width: "50%"}}>Characters (no white-space or symbols)</td>
              <td>{characterCountExcludingWhiteSpaceAndOtherChars}</td>
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
      ) : <textarea
            value={this.getOverallCountsTsv(characterCount, characterCountExcludingNewLines, characterCountExcludingWhiteSpace, characterCountExcludingWhiteSpaceAndOtherChars, wordCount, lineCount)}
            readOnly
            style={columnTextAreaStyle} />;

      return (
        <div className="col-1-3">
          <h4>Overall Character &amp; Word Counts</h4>
          {countsElement}
        </div>
      );
    };

    const renderCharacterCountsColumn = () => {
      const countsElementStyle = { ...columnTextAreaStyle, marginTop: "1em" };
      const countsElement = !this.state.showTablesAsTextAreas ?
        <table style={{margin: "1em 0"}}><tbody>{charCountTrs}</tbody></table> :
        <textarea value={this.getCharCountTsv(orderedCharCountPairs)} readOnly style={countsElementStyle} />;

      return (
        <div className="col-1-3">
          <h4>Character Counts &amp; Frequencies</h4>
          <span>
            Include Numbers <input type="checkbox" checked={this.state.includeNumbersInCharCount} onClick={this.toggleIncludeNumbersInCharCount.bind(this)} /><br />
            Include White-space <input type="checkbox" checked={this.state.includeWhiteSpaceInCharCount} onClick={this.toggleIncludeWhiteSpaceInCharCount.bind(this)} /><br />
            Include Symbols <input type="checkbox" checked={this.state.includeOtherCharsInCharCount} onClick={this.toggleIncludeOtherCharsInCharCount.bind(this)} /><br />
          </span>
          {countsElement}
        </div>
      );
    };

    const renderWordCountsColumn = () => {
      const countsElement = !this.state.showTablesAsTextAreas ?
        <table style={{margin: "1em 0"}}><tbody>{wordCountTrs}</tbody></table> :
        <textarea value={this.getWordCountTsv(wordCount, orderedWordCountPairs, visibleWordCountRowCount)} readOnly style={columnTextAreaStyle} />;
      const showMoreOrLessLink = (orderedWordCountPairs.length > visibleWordCountRowCount) ? <a href="" onClick={this.toggleShowAllWordCountRows.bind(this)}>{!this.state.showingAllWordCountRows ? "Show More" : "Show Less"}</a> : null;
        
      return (
        <div className="col-1-3">
          <h4>Word Counts &amp; Frequencies</h4>
          {countsElement}
          {!this.state.showTablesAsTextAreas ? showMoreOrLessLink : null}
        </div>
      );
    };

    return (
      <div>
        <textarea value={this.state.text} onChange={this.onTextChange.bind(this)} placeholder="Enter text here." style={{margin: "1em 0", width: "100%", height: "200px"}} />

        <div>View As Copyable Spreadsheet Text <input type="checkbox" checked={this.state.showTablesAsTextAreas} onClick={this.toggleShowTablesAsTextAreas.bind(this)} /></div>

        <div className="row">
          {renderOverallCountsColumn()}
          {renderCharacterCountsColumn()}
          {renderWordCountsColumn()}
        </div>
      </div>
    );
  }
}