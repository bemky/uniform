import Component from './component';
import { trigger } from 'dolla';

export default class Resizer extends Component {
    
    initialize () {
        const breakpoints = getComputedStyle(window.document.body).getPropertyValue('--breakpoints')
        this.breakpoints = {}
        breakpoints.split(",").forEach(breakpoint => {
          const [key, value] = breakpoint.split("/")
          this.breakpoints[key.trim()] = value;
        })
        
        this.listenTo(window, 'resize', this.resize);
        this.resize();
    }
    
    resize () {
      const width = this.el.offsetWidth;
      Object.keys(this.breakpoints).forEach(size => {
        const query = this.breakpoints[size]
        const css_class = size + '-container'
        let [attribute, value] = query.split(":")
        if(value.match("px")){
          value = parseInt(value)
        } else {
          throw "unsupported media units"
        }
        
        if(attribute == "min-width") {
          this.el.classList.toggle(css_class, width > value)
        } else if (attribute == "max-width") {
          this.el.classList.toggle(css_class, width < value)
        } else {
          throw "unsupported media feature"
        }
      });
    }
}