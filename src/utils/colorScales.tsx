import * as d3 from 'd3'

export const colorScales = {
  "Rodrigo's": d3.interpolateHclLong('#012', '#ff6'),
  Cividis: d3.interpolateCividis,
  Inferno: d3.interpolateInferno,
  Viridis: d3.interpolateViridis,
  Turbo: d3.interpolateTurbo,
  Warm: d3.interpolateWarm,
  Cool: d3.interpolateCool,
  CubeHelix: d3.interpolateCubehelixDefault,
}
