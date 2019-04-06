import React from "react";

export type RendererOptions = {
  w: number; 
  h: number;
  re1: number; 
  re2: number;
  img1: number; 
  img2: number;
  max_iter: number
};

export type Renderer = (context: CanvasRenderingContext2D, options: RendererOptions) => Promise<void>;

export interface RenderViewProps { 
  renderer: Renderer;
}

export default class RenderView extends React.Component<RenderViewProps> {
  private canvas = React.createRef<HTMLCanvasElement>();

  async componentDidUpdate() {
    const options: RendererOptions = {
      w: 500,
      h: 500,
      re1: -2.0,
      re2: 1.0,
      img1: -1.5,
      img2: 1.5,
      max_iter: 2048
    };
    const context = this.canvas.current!.getContext("2d");
    if (context) {
      const t0 = performance.now();
      await this.props.renderer(context, options);
      const t1 = performance.now();

      context.fillStyle = "#FFF";
      context.font = "24px serif";
      context.fillText(`${Math.round(t1 - t0)} ms`, 10, 30);
   }
  }

  render() {
    return (
      <div>
        <canvas ref={this.canvas} width={500} height={500}></canvas>
      </div>
    );
  }
}
