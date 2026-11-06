import './Background.scss';

// strips of the front layer: they set the depth of the cylinder.
const STRIPS = 15;
// strips of each layer. the back one is further away, so it looks narrower
// and needs more strips to reach the edges of the screen.
const LAYERS = {back: 19, front: STRIPS};

export function Background() {
  return (
    <div className="background" style={{'--count': STRIPS}} aria-hidden="true">
      {Object.entries(LAYERS).map(([layer, strips]) => (
        <div key={layer} className={`background-layer background-layer-${layer}`} style={{'--strips': strips}}>
          {Array.from({length: strips}, (_, index) => (
            <div key={index} className="background-strip" style={{'--i': index}}>
              <div className="background-tiles" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
