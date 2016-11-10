import dat from 'dat-gui';
import d3 from 'd3';

export function drawControls(vis) {
  const gui = new dat.GUI();
  gui.close();
  d3.select('div.dg.ac')
    .style({
      position: 'fixed',
      top: '5px',
      left: '435px',
      width: '250px'
    });

  const opts = {
    showPointIds: true,
    radius: 2
  };

  const idsController = gui.add(opts, 'showPointIds');

  const radiusController = gui.add(opts, 'radius', 1, 8);

  idsController.onFinishChange(value => {
    if (value === true) {
      vis.dots.selectAll('text')
        .style('fill-opacity', 0.7);
    } else {
      vis.dots.selectAll('text')
        .style('fill-opacity', 0);
    }
  });

  radiusController.onFinishChange(value => {
    d3.selectAll('circle')
      .attr('r', value);
  });
}
