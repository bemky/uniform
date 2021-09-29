import Component from './component';
import Popover from './popover';
import Modal from './modal';
import { check as checkIcon, arrow_down as arrowIcon, x as xIcon } from './icons';
import { createElement, HTML_ATTRIBUTES, filter, css, isEmpty, trigger } from 'dolla';

/*
  options: array of html options, each item can be string | array | object
    ex. ["Employee", "Manager", "General Manager"]
    ex. [
      ["Employee", "employee", false],
      ["Manager", "manager", false],
      ["General Manager", "general_manager", true],
    ]
    ex. [
      {value: "employee", text: 'Employee', selected: false},
      {value: "manager", text: 'Manager', selected: false},
      {value: "general_manager", text: 'General Manager', selected: true}
    ]
  limit: int | false - number of options to limit to, or false to not limit
  container: selector for where to render dropdown
  multiple: false
*/
export default class Select extends Component {

  initialize (options = {}) {
    this.htmlOptions = options.options.map(option => {
      if(typeof option == "string") {
        return {
          value: option,
          text: option
        }
      } else if (Array.isArray(option)){
        return {
          value: option[1],
          text: option[0],
          selected: option[2]
        }
      } else if (typeof option == "object") {
        return option
      } else {
        throw "option of unexpected type"
      }
    });
    this.options = {
      multiple: false,
      limit: 8,
      container: false
    }
    Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        
    this.el_options = Object.assign({}, this.pick(options, HTML_ATTRIBUTES));
    this.el = createElement('button', this.el_options);
    this.el.classList.add('uniformSelect');

    this.listenTo(this.el, 'click', this.toggleOptions);
    this.listenTo(this.el, 'click', '.uniformSelect-remove', this.removeSelection);
    this.listenTo(this.el, 'change', 'select', this.renderValue);
    this.listenTo(this.el, 'close', 'select', this.removeOptions);
  }
    
  render () {
    this.valueEl = createElement('span');
    this.valueEl.classList.add('uniformSelect-value')
    this.el.append(this.valueEl);
        
    this.indicatorEl = createElement('span', {children: arrowIcon})
    this.indicatorEl.classList.add('uniformSelect-indicator')
    this.el.append(this.indicatorEl);

    this.select = createElement('select', this.el_options);
    this.htmlOptions.forEach(option => {
      this.select.append(createElement('option', Object.assign({}, {children: option.text}, option)))
    });
    this.el.append(this.select);
        
        
    // Append placeholder of longest option, to set width
    const longestText = this.htmlOptions.map(x => x.text).sort((a, b) => a.length < b.length)[0]
    const placeholder = createElement('span', {class: 'uniformSelect-placeholder', children: longestText})
    this.el.append(placeholder);
        
    this.renderValue();
    return this;
  }
    
  renderValue () {
    const selectedOptions = filter(this.select.querySelectorAll("option"), el => el.selected);
    const html = selectedOptions.map(el => this.options.multiple ? `
      <span class="uniformSelect-selection">
        <span>${el.textContent}</span><span class="uniformSelect-remove">${xIcon}</span>
      </span>
    ` : el.textContent).join(" ");
        
    this.valueEl.innerHTML = html;
  }
    
  selectOption (e) {
    const makeActive = !e.target.option.selected;
    if (!this.options.multiple && makeActive) {
      e.target.offsetParent.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
    }
    e.target.classList.toggle('active', makeActive);
    e.target.option.selected = makeActive;
        
    if (!this.options.multiple) {
      this.removeOptions();
    }
        
    trigger(this.select, 'change');
  }
    
  removeSelection (e) {
    e.preventDefault();
    e.stopPropagation();
    var option = filter(this.select.querySelectorAll("option"), function(el){
      return el.innerText.trim() == e.target.closest('.uniformSelect-selection').innerText.trim();
    })[0];
    if(!option) return;
    option.selected = false;
    option.button.classList.remove('active');
        
    trigger(this.select, 'change');
  }
  
  toggleOptions (e) {
    if(e && (e.target.matches('.uniformSelect-remove') || e.target.closest('.uniformSelect-remove'))){
      return;
    }
    this.el.classList.toggle('active')
    if(this.el.classList.contains('active')){
      this.renderOptions()
    } else {
      this.popover.toggle(false)
    }
  }

  renderOptions () {
    const options = createElement("div", {
      class: 'uniformSelect-options'
    });
      
    options.style.fontSize = css(this.el, 'font-size')
      
    this.select.querySelectorAll('option').forEach(function(option, index){
      var button = createElement("button", {
        type: 'button',
        class: 'uniformSelect-option'
      });
      button.option = option;
      option.button = button;
      button.textContent = option.textContent;
      button.value = option.value;
      if (button.textContent == "") button.innerHTML = "<span class='text-italic text-muted'>None</span>";
      button.classList.toggle('active', option.selected);
      
      console.log(this.options.limit, index);
      if (this.options.limit && (index + 1) > this.options.limit) {
        button.classList.add('hide')
      }
      options.append(button);
    }, this);
    
    this.listenTo(options, 'click', '.uniformSelect-option', this.selectOption);


    const actions = createElement('div', {
      class: 'uniformSelect-actions'
    });
    
    if (this.options.limit && this.htmlOptions.length > this.options.limit) {
      const button = createElement('button', {
        type: 'button',
        class: 'uniformSelect-show-all',
        children: 'Show All'
      });
      this.listenTo(button, 'click', this.showAllOptions.bind(this))
      actions.append(button);
    }
    if (this.options.multiple) {
      const button = createElement('button', {
        type: 'button',
        class: 'uniformSelect-done',
        children: ['Done']
      });
      this.listenTo(button, 'click', this.removeOptions.bind(this));
      actions.append(button);
    }
    if (!isEmpty(actions)) {
      options.append(actions);
    }
    
    this.popover = new Popover({
      offset: {top: 1},
      align: '0px bottom',
      anchor: this.el,
      content: options,
      container: this.options.container,
      transition: 'transition-fade-up' 
    }).render()
    
    this.listenTo(this.popover, 'hidden', this.removeOptions);
  }
    
  removeOptions () {
    this.el.classList.remove('active')
    if (!this.popover) return;
    this.popover.remove()
  }
    
  showAllOptions (e) {
    e.preventDefault();
    e.stopPropagation();
    if(!this.popover) return;
    this.popover.el.querySelectorAll('button.hide').forEach(el => el.classList.remove('hide'));
    var button = this.popover.el.querySelector('.uniformSelect-show-all');
    button.parentNode.removeChild(button);
  }
}