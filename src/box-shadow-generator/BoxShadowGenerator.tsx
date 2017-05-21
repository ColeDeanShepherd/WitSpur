import * as React from "react";

import * as Utils from "../Utils";
import * as Text from "../Text";

export interface CssBoxShadowGeneratorProps {}
export interface CssBoxShadowGeneratorState {
}

export class CssBoxShadowGenerator extends React.Component<CssBoxShadowGeneratorProps, CssBoxShadowGeneratorState> {
  constructor(props: CssBoxShadowGeneratorProps) {
    super(props);
  }

  render(): JSX.Element {
    return <div>test</div>;
  }
}