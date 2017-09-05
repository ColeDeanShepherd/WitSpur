declare function require(name: string): any;

import * as React from "react";

import * as Jotted from "jotted";

const step1Js = require("raw-loader!./steps/step1.js");
const step1Html = require("raw-loader!./steps/step1.html");

export interface PongTutorialProps {}
export interface PongTutorialState {}
export class PongTutorial extends React.Component<PongTutorialProps, PongTutorialState> {
  editorDomElement: HTMLElement;

  constructor(props: PongTutorialProps) {
    super(props);

    this.state = {};
  }
  componentDidMount() {
    new Jotted(this.editorDomElement, {
      files: [
        {
          type: 'js',
          content: step1Js
        },
        {
          type: 'html',
          content: step1Html
        }
      ],
      plugins: [
        {
          name: 'console'
        }
      ]
    })
  }

  public render(): JSX.Element {
    return (
      <div ref={editorDomElement => this.editorDomElement = editorDomElement} />
    );
  }
}