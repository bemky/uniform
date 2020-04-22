import Component from './component';
import Popover from './popover';
import Modal from './modal';
import { check as checkIcon, arrow_down as arrowIcon } from './icons';
import * as Helpers from './dom-helpers';

/*
    options
    class: String, appended to uniformSelect-edit button as class
    limit: int | false - number of options to limit to, or false to not limit
    showAll: function(button_options) to run if/when "Show All" is clicked
    label: string, used for mobile menu
    container: selector for where to render dropdown
*/
export default class Select extends Component {

    initialize (options = {}) {
        this.options = {
            label: false,
            class: "",
            showAll: function (button_options){
                Helpers.removeClass(button_options.querySelectorAll('button.hide'), 'hide');
                var button = button_options.querySelector('.uniformSelect-show-all');
                button.parentNode.removeChild(button);
                
                return false;
            },
            limit: 8,
            container: document.body
        }
        
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));

        this.listenTo(this.el, 'change', this.renderSelected);
        this.listenTo(this.el, 'close', this.hideOptions);
        this.el.uniformSelect = this;
        
        this.activeIcon = document.createElement('span');
        this.activeIcon.innerHTML = checkIcon;
        Helpers.addClass(this.activeIcon, 'uniformSelect-option-icon');
    }

    remove () {
        Component.prototype.remove.apply(this, arguments);
        this.edit_button.parentNode.removeChild(this.edit_button);
        delete this.this.edit_button;
        
        this.activeIcon.parentNode.removeChild(this.activeIcon);
        delete this.activeIcon;
        
        if(this.button_options_popover) this.button_options_popover.remove();
        if(this.button_options_modal) this.button_options_modal.remove();
        
        if(this.button_options) {
            this.button_options.parentNode.removeChild(this.button_options);
            delete this.button_options;
        }
    }
    
    render () {
        this.edit_button = Helpers.createElement(`
          <button type='button' class='uniformSelect-edit uniformInput outline block ${this.options.class}'>
            <span class="text-js"></span>
            <span class="uniformSelect-edit-icon">${arrowIcon}</span>
          </button>
        `);
        
        if (this.el.name) {
            Helpers.addClass(this.edit_button, this.el.name.toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
        }
        this.el.style.display = "none";
        this.el.insertAdjacentElement('beforebegin', this.edit_button);
        
        // Set Min-Width for when empty
        const option = this.el.querySelectorAll("option")[0];
        this.edit_button.querySelector('.text-js').style.opacity = 0;
        this.edit_button.querySelector('.text-js').innerHTML = option.textContent;
        const min_width = this.edit_button.querySelector('.text-js').offsetWidth;
        this.edit_button.style.minWidth = min_width + "px";
        this.edit_button.querySelector('.text-js').innerHTML = "";
        this.edit_button.querySelector('.text-js').style.opacity = null;
        
        this.renderSelected();
        
        this.listenTo(this.edit_button, 'click', this.showOptions);
        this.listenTo(this.edit_button, 'click', '.uniformSelect-remove', this.removeSelection);
        
        return this;
    }

    renderOptions () {
        this.button_options = Helpers.createElement("<div class='uniformSelect-options'>");
        if (this.el.name) {
            Helpers.addClass(this.button_options, this.el.name.toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
        }
        this.button_options.style.fontSize = Helpers.css(this.el, 'font-size');
        
        Helpers.each(this.el.querySelectorAll('option'), function(el, index){
            var button = Helpers.createElement("<button type='button' class='uniformSelect-option block outline text-left'>");
            button.option = el;
            button.textContent = el.textContent;
            button.value = el.value;
            if (button.textContent == "") button.innerHTML = "<span class='text-italic text-muted'>None</span>";
            if(el.selected){
                Helpers.addClass(button, 'active');
                button.append(this.activeIcon.cloneNode(true));
            } else if (this.options.limit && index > this.options.limit) {
                Helpers.addClass(button, 'hide');
            }
            this.button_options.append(button);
        }.bind(this));

        this.listenTo(this.button_options, 'click', '.uniformSelect-option', this.selectOption);

        const actions_el = Helpers.createElement('<div class="uniformSelect-options-actions"></div>');
        if (this.options.limit && this.el.querySelectorAll('option').length > this.options.limit) {
            const show_all_button = Helpers.createElement("<button type='button' class='uniformSelect-show-all outline blue' style='display: block; border: none'>Show All</button>");
            this.listenTo(show_all_button, 'click', function(e){
                Helpers.trigger(this.el, 'show_all');
                if (this.options.showAll) this.options.showAll(this.button_options);
                e.preventDefault();
                e.stopPropagation();
            })
            actions_el.appendChild(show_all_button);
        }
        if (this.el.multiple) {
            var done_button = Helpers.createElement("<button type='button' class='uniformSelect-done block outline blue'>Done</button>");
            this.listenTo(done_button, 'click', this.hideOptions);
            actions_el.appendChild(done_button);
        }
        if (!Helpers.is_empty(actions_el)) {
            this.button_options.appendChild(actions_el);
        }
    }

    renderSelected () {
        const selected_options = Helpers.filter(this.el.querySelectorAll("option"), function(el){
            return el.selected;
        });
        const html = Helpers.map(selected_options, function(el){
            return this.el.multiple ? `<span class="uniformSelect-selection">${el.textContent}<span class="uniformSelect-remove"></span></span>` : el.textContent;
        }.bind(this)).join(" ");
        
        if (html == "") {
            this.edit_button.querySelector('.text-js').innerHTML = "&nbsp;"
        } else {
            this.edit_button.querySelector('.text-js').innerHTML = html;
        }
        
        if(this.button_options) {
            Helpers.each(this.button_options.querySelectorAll('.uniformSelect-option'), function(el) {
                if(el.option.selected){
                    Helpers.addClass(el, 'active');
                    el.append(this.activeIcon.cloneNode(true));
                } else {
                    Helpers.removeClass(el, 'active');
                    Helpers.each(el.querySelectorAll('.uniformSelect-option-icon'), Helpers.remove);
                }
            }.bind(this))
        }
    }

    hideOptions () {
        if(!this.button_options) return;
        if(this.button_options_modal) this.button_options_modal.close();
        if(this.button_options_popover) {
            this.button_options_popover.remove();
            delete this.button_options_popover;
        }
        Helpers.removeClass(this.edit_button, 'active');
    }

    showOptions(e) {
        if(Helpers.hasClass(e.target, 'uniformSelect-remove')) return;
        if(this.button_options_modal) return this.hideOptions();
        if(this.button_options_popover) return this.hideOptions();
        if(!this.button_options) this.renderOptions();
        Helpers.addClass(this.edit_button, 'active');
        // For Mobile: Render Full Screen
        if(window.innerWidth < 720) {
            const content = Helpers.createElement('<div class="uniformSelect-modal">');
            content.append(this.button_options);
            if (this.options.label) {
                content.append(`<div class="uniformSelect-label margin-bottom text-bold">${this.options.label}</div>`);
            }
            this.button_options_modal = new Modal({
                content: content,
                klass: '-reset'
            }).render();
            this.button_options_modal.on('closed', () => {
                Helpers.removeClass(this.edit_button, 'active');
                delete this.button_options_modal;
            });
            this.listenTo(content, 'click', function(e){
                if(e.target == content) {
                    this.button_options_modal.close()
                }
            });
        // For Larger: Render Popover
        } else {
            this.button_options.style.minWidth = this.edit_button.offsetWidth + "px";
            this.button_options_popover = new Popover({
                offset: {top: 1},
                anchor: this.edit_button,
                align: '0px bottom',
                content: this.button_options,
                container: this.options.container
            }).render()
            this.button_options_popover.on('hidden', () => {
                Helpers.removeClass(this.edit_button, 'active');
                this.button_options_popover.remove();
                delete this.button_options_popover;
            })
        }
    }

    selectOption(e) {
        if (!this.el.multiple) {
            Helpers.each(Helpers.filter(this.el.querySelectorAll("option"), function(el){
                return el.selected;
            }), function (child) {
                child.selected = false;
            });
            Helpers.each(this.button_options.querySelectorAll('.uniformSelect-option.active .uniformSelect-option-icon'), Helpers.remove);
            Helpers.removeClass(this.button_options.querySelectorAll('.uniformSelect-option.active'), 'active');
        }
        Helpers.toggleClass(e.target, 'active');
        e.target.option.selected = Helpers.hasClass(e.target, 'active');
        Helpers.each(this.button_options.querySelectorAll("button"), function(button) {
            if(!button.option) return;
            Helpers.toggleClass(button, 'active', button.option.selected);
            if (Helpers.hasClass(button, 'active')) {
                button.append(this.activeIcon.cloneNode(true));
            } else {
                Helpers.each(button.querySelectorAll('.uniformSelect-option-icon'), Helpers.remove);
            }
        }.bind(this))
        Helpers.trigger(this.el, 'change');
    }
    
    removeSelection(e) {
        e.preventDefault();
        var target = Helpers.filter(this.el.querySelectorAll("option"), function(el){
            return el.innerText.trim() == e.target.parentNode.innerText.trim();
        })[0];
        if(!target) return;
        target.selected = false;
        Helpers.trigger(this.el, 'change');
    }
}