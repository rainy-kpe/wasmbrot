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
  options: RendererOptions;
  onClick: (re: number, img: number) => void;
}

export default class RenderView extends React.Component<RenderViewProps> {
  private canvas = React.createRef<HTMLCanvasElement>();

  private async drawMandelbrot() {
    const context = this.canvas.current!.getContext("2d");
    if (context) {
      const t0 = performance.now();
      await this.props.renderer(context, this.props.options);
      const t1 = performance.now();

      context.fillStyle = "#FFF";
      context.font = "24px serif";
      context.fillText(`${Math.round(t1 - t0)} ms`, 10, 30);
   }
  }

  componentDidMount() {
    this.drawMandelbrot();
  }

  componentDidUpdate() {
    this.drawMandelbrot();
  }

  render() {
    return (
      <div>
        <canvas ref={this.canvas} width={500} height={500} onClick={this.clickHandler.bind(this)}></canvas>
      </div>
    );
  }

  private clickHandler(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.pageX - rect.left;
    const y = event.pageY - rect.top;
    if (this.props.onClick) {
      const { re1, re2, img1, img2, w, h} = this.props.options; 
      this.props.onClick(
        (re2 - re1) * x / w + re1, 
        (img2 - img1) * y / h + img1
      );
    }
  }
}
