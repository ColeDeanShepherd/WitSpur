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

  render(): JSX.Element {
    const characterCount = this.state.text.length;
    const wordCount = Utils.wordCount(this.state.text);
    const lineCount = 1 + Utils.charOccurrenceCount("\n", this.state.text);

    const wordCounts = Utils.wordCounts(this.state.text);
    const wordCountPairs = Utils.reduceObjectPropertyNames((acc: [string, number][], propertyName: string) => {
      acc.push([propertyName, wordCounts[propertyName]]);
      return acc;
    }, wordCounts, []);
    const orderedWordCountPairs = wordCountPairs.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
    const wordCountLis = orderedWordCountPairs.map(wordCountPair => <li>{wordCountPair[0]} - {wordCountPair[1]}</li>);

    return (
      <div>
        <p style={{fontSize: "2em"}}>{characterCount} characters, {wordCount} words, {lineCount} lines</p>
        <p>* Character count includes line breaks. Word count includes numbers and may not work with non-English languages.</p>
        <textarea value={this.state.text} onChange={this.onTextChange.bind(this)} style={{width: "100%", height: "400px"}} />

        <ul>{wordCountLis}</ul>
      </div>
    );
  }
}