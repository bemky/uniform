import Component from './component';
import { isVisible, isFocus, css, createElement } from 'dolla';

export default class FloatingLabel extends Component {
    
    initialize(options){
        if(options.input instanceof Element) {
          this.input = options.input
        } else {
          this.input = createElement('input', Object.assign({}, {
            type: this.constructor.type
          }, options.input)) // TODO filter options to dolla.HTML_ATTRIBUTES
        }
        this.label = createElement('label', {
          for: this.input.id,
          children: [options.label]
        });
        this.input.setAttribute('aria-label', options.label);
        
        this.el.classList.add('uniformFloatingLabelInput');
        
        this.listenTo(this.input, 'focus', this.focus);
        this.listenTo(this.input, 'blur', this.blur);
        this.listenTo(this.input, 'revealed', this.render);
    }
    
    render () {
        if(!isVisible(this.input)) return;

        let internalHeight = parseInt(css(this.input, 'height')) - parseInt(css(this.input, 'borderTopWidth')) - parseInt(css(this.input, 'borderBottomWidth'));
        this.input.style.lineHeight = 1;
        let lineHeight = parseInt(css(this.input, 'lineHeight'));
        let fontSize = parseInt(css(this.input, 'fontSize'));
        let padding = internalHeight - lineHeight;
        
        this.label.style.setProperty('--font-size', css(this.input, 'fontSize'))
        this.label.style.paddingLeft = css(this.input, 'paddingLeft');
        this.label.style.lineHeight = lineHeight + "px";
        this.label.style.paddingTop = (internalHeight/2 - lineHeight) + "px";
        this.label.style.paddingBottom = (internalHeight/2 - lineHeight) + "px";
        
        this.input.style.paddingTop = internalHeight/2 - (lineHeight - fontSize) + "px";
        this.input.style.paddingBottom = (internalHeight/2 - lineHeight) + (lineHeight - fontSize) + "px";
        
        this.input.parentNode.insertBefore(this.el, this.input.nextSibling);
        this.el.append(this.input);
        this.el.append(this.label);
        
        if(this.input.value != ""){
          this.focus()
        }
        
        return this;
    }
    
    focus (e) {
        this.el.classList.add('present');
    }
    
    blur (e) {
        if(this.input.value == ""){
          this.el.classList.remove('present');
        }
    }
}