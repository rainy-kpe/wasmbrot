import "./MainApp.css";
import React from "react";
import { Dropdown, Button } from "semantic-ui-react";
import { render as wasmRender } from "../../renderers/mandelbrot-wasm";
import { render as jsRender } from "../../renderers/mandelbrot-js";
import { render as jsWorkerRender } from "../../renderers/mandelbrot-worker";
import RenderView, { Renderer } from "../RenderView/RenderView";

export interface MainAppProps { 
  name: string; 
}

export interface MainAppState { 
  renderer: string; 
}

const options = [
  {
    key: "wasm",
    text: "Webassembly",
    value: "wasmRender"
  },
  {
    key: "js",
    text: "Javascript",
    value: "jsRender"
  },
  {
    key: "ww",
    text: "Javascript + Webworkers",
    value: "jsWorkerRender"
  }
];

export default class MainApp extends React.Component<MainAppProps, MainAppState> {

  state = {
    renderer: "wasmRender"
  };

  render() {
    let renderer = undefined;
    switch (this.state.renderer) {
      case "jsRender":
        renderer = jsRender;
        break;
      case "jsWorkerRender":
        renderer = jsWorkerRender;
        break;
      case "wasmRender":
      default:
        renderer = wasmRender;
        break;
    }

    return (
      <div className="container">
        <h1>WasmBrot</h1>
        <div>
          <Dropdown 
            defaultValue={options[0].value} 
            selection 
            options={options} 
            onChange={(event: React.SyntheticEvent, data: any) => { this.setState({renderer: data.value}) }}/>
          <Button onClick={() => this.forceUpdate()}>Render</Button>
        </div>
        <RenderView renderer={renderer} />
      </div>
    );
  }
}
