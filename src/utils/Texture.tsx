import { HTMLProps, useEffect, useRef } from 'react'
import initRegl from 'regl'

const attributes = {
  position: [
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, -1],
  ],
}

const frag = `
  precision mediump float;
  uniform sampler2D texture;
  varying vec2 uv;
  void main () {
    gl_FragColor = texture2D(texture, uv);
  }`

const vert = `
  precision mediump float;
  attribute vec2 position;
  varying vec2 uv;
  void main () {
    uv = position;
    gl_Position = vec4(2.0*uv.x - 1.0, 1.0-2.0*uv.y, 0, 1);
  }`

const Texture = ({
  pixels,
  ...canvasProps
}: {
  pixels: number[][][]
} & HTMLProps<HTMLCanvasElement>) => {
  const node = useRef(null)
  const regl: any = useRef(false)

  useEffect(() => {
    if (!regl.current) {
      regl.current = initRegl(node.current as any)
    }
    if (node.current) {
      regl.current({
        vert,
        frag,
        attributes,
        uniforms: {
          // color: [1, 0, 0, 1],
          texture: regl.current.texture(pixels),
        },
        count: attributes.position.length,
      })()
    }
  })
  return <canvas {...canvasProps} ref={node} />
}

export default Texture
