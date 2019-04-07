import "./MainApp.css";
import React from "react";
import { Dropdown, Button } from "semantic-ui-react";
import { render as wasmRender } from "../../renderers/mandelbrot-wasm";
import { render as jsRender } from "../../renderers/mandelbrot-js";
import { render as jsWorkerRender } from "../../renderers/mandelbrot-worker";
import RenderView, { RendererOptions } from "../RenderView/RenderView";

export interface MainAppProps { 
  name: string; 
}

export interface MainAppState { 
  renderer: string; 
  options: RendererOptions;
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

const renderOptions: RendererOptions = {
  w: 500,
  h: 500,
  re1: -2.0,
  re2: 1.0,
  img1: -1.5,
  img2: 1.5,
  max_iter: 2048
};

export default class MainApp extends React.Component<MainAppProps, MainAppState> {

  state = {
    renderer: "wasmRender",
    options: renderOptions
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
          <Button onClick={() => this.setState({options: renderOptions})}>Reset</Button>
        </div>
        <RenderView renderer={renderer} options={this.state.options} onClick={this.onClick.bind(this)}/>
      </div>
    );
  }

  private onClick(re: number, img: number) {
    console.log(re, img);

    const { re1, re2, img1, img2, w, h} = this.state.options; 
    const c = { re: (re2 - re1) / 2, img: (img2 - img1) / 2 };
    this.setState({options: {
      ...this.state.options,
      re1: (re - c.re * 0.75) + (re1 + c.re - re) * 0.75,
      re2: (re + c.re * 0.75) + (re1 + c.re - re) * 0.75,
      img1: img - c.img * 0.75 + (img1 + c.img - img) * 0.75,
      img2: img + c.img * 0.75 + (img1 + c.img - img) * 0.75
    }});
  }
}
