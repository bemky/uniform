import Component from './component';
import { check as checkIcon, arrow_down as arrowIcon } from './icons';
import * as Helpers from './dom-helpers';

/*
    options
    class: String, appended to uniformSelect-edit button as class
    limit: int | false - number of options to limit to, or false to not limit
    showAll: function(select_options) to run if/when "Show All" is clicked
    label: string, used for mobile menu
*/
export default class Select extends Component {

    initialize (options = {}) {
        this.options = {
            label: false,
            class: "",
            showAll: function (select_options){
                Helpers.removeClass(select_options.querySelectorAll('button.hide'), 'hide');
                var button = select_options.querySelector('.uniformSelect-show-all');
                button.parentNode.removeChild(button);
                
                return false;
            },
            limit: 8
        }
        
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));

        var showing, lastScrollPosition, select_options;

        this.el.addEventListener('change', this.updateSelect.bind(this));
        this.el.addEventListener('close', this.hideOptions.bind(this));
        this.el.addEventListener('revealed', this.resize.bind(this));
        this.el.uniformSelect = this;
        
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('scroll', this.updatePosition.bind(this));
        document.addEventListener('click', this.outsideClick.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
        
        this.activeIcon = document.createElement('span');
        Helpers.addClass(this.activeIcon, 'uniformSelect-option-icon');
        this.activeIcon.innerHTML = checkIcon;
    }
    
    outsideClick (e) {
        if (!this.showing) return;
        if (e.target === this.select_options) return;
        if (this.container.contains(e.target)) return;
        if (this.select_options.contains(e.target)) return;
        this.hideOptions();
    }
    
    keyup (e) {
        if(e.which === 27) this.hideOptions();
    }
    
    render () {
        this.container = document.createElement('div');
        Helpers.addClass(this.container, 'uniformSelect-container');
        
        this.edit_button = Helpers.createElement(`<button type='button' class='uniformSelect-edit uniformInput outline block ${this.options.class}'><span class="text-js"></span><span class="uniformSelect-edit-icon">${arrowIcon}</span></button>`);
        this.container.appendChild(this.edit_button);
        
        if (this.el.name) {
            Helpers.addClass(this.container, this.name.toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
        }
        this.el.style.display = "none";
        this.el.insertAdjacentElement('beforebegin', this.container);
        this.updateSelect();
        this.resize();
        
        this.edit_button.addEventListener('click', this.showOptions.bind(this));
    }

    resize () {
        // to keep button from extending beyond available width
        var children = [];
        var childrenCount = this.edit_button.children.length;
        for(var i = 0; i < childrenCount; i++){
            children.push(this.edit_button.children[0]);
            this.edit_button.children[0].parentNode.removeChild(this.edit_button.children[0]);
        }
        
        this.edit_button.innerHTML = '';
        this.edit_button.style.width = "auto";
        this.edit_button.style.width = this.container.offsetWidth + "px";
        
        Helpers.each(children, function(child){
            this.edit_button.appendChild(child);
        }.bind(this));

        if(typeof this.select_options === "undefined") return;
        if(window.innerWidth < 720) return;

        this.select_options.style.position = 'absolute';
        this.select_options.style.top = Helpers.offset(this.container).top + this.container.offsetHeight + "px";
        this.select_options.style.left = Helpers.offset(this.container).left + 1 + "px";
        this.select_options.style.minWidth = this.container.offsetWidth - 1 + "px";
    }

    renderOptions () {
        this.select_options = Helpers.createElement("<div class='uniformSelect-options'>");
        if (this.options.label) {
            this.select_options.append(`<div class="uniformSelect-label hide show-sm margin-bottom text-bold">${this.options.label}</div>`)
        }
        if (this.el.name) {
            Helpers.addClass(this.select_options, this.el.name.toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
        }
        this.select_options.style.fontSize = Helpers.css(this.el, 'font-size');
        this.select_options.style.display = 'none';
        document.body.appendChild(this.select_options);
        
        Helpers.each(this.el.querySelectorAll('option'), function(el, index){
            var button = Helpers.createElement("<button type='button' class='uniformSelect-option block outline text-left'>");
            button.option = el;
            button.textContent = el.textContent;
            button.value = el.value;
            if (button.textContent == "") button.innerHTML("<span class='text-italic text-muted'>None</span>");
            if(el.selected){
                Helpers.addClass(button, 'active');
                button.append(this.activeIcon.cloneNode(true));
            } else if (this.options.limit && index > this.options.limit) {
                Helpers.addClass(button, 'hide');
            }
            this.select_options.append(button);
            button.addEventListener('click', this.selectOption.bind(this));
        }.bind(this));

        var actions_el = Helpers.createElement('<div class="uniformSelect-options-actions"></div>');
        if (this.options.limit && this.el.querySelectorAll('option').length > this.options.limit) {
            var show_all_button = Helpers.createElement("<button type='button' class='uniformSelect-show-all outline blue' style='display: block; border: none'>Show All</button>");
            show_all_button.addEventListener('click', function(e){
                Helpers.trigger(this.el, 'show_all');
                if (this.options.showAll) this.options.showAll(this.select_options);
                e.preventDefault();
                e.stopPropagation();
            }.bind(this));
            actions_el.appendChild(show_all_button);
        }
        if (this.el.multiple) {
            var done_button = Helpers.createElement("<button type='button' class='uniformSelect-done block outline blue'>Done</button>");
            done_button.addEventListener('click', this.hideOptions.bind(this));
            actions_el.appendChild(done_button);
        }
        if (!Helpers.is_empty(actions_el)) {
            this.select_options.appendChild(actions_el);
        }

        Helpers.trigger(this.el, 'rendered');
    }

    hideOptions () {
        if(typeof this.select_options === "undefined") return;
        this.showing = false;
        this.select_options.style.display = "none";
        Helpers.removeClass(this.select_options, 'fixed');
        Helpers.removeClass(this.edit_button, 'active');
        Helpers.removeClass(document.body, 'uniformModal-hideBody');
        if(this.lastScrollPosition && window.innerWidth < 720) window.scrollTo(0, this.lastScrollPosition);
        Helpers.trigger(this.el, 'hidden:options');
    }

    showOptions() {
        if (this.showing){
            this.hideOptions();
            return false;
        }
        this.showing = true;
        if(!this.select_options) this.renderOptions();
        this.resize();
        this.select_options.style.display = "block";
        Helpers.addClass(this.edit_button, 'active');
        this.lastScrollPosition = window.scrollY;
        this.updatePosition();
        Helpers.addClass(document.body, 'uniformModal-hideBody');
    }

    selectOption(e) {
        if (!this.el.multiple) {
            Helpers.each(Helpers.filter(this.el.querySelectorAll("option"), function(el){
                return el.selected;
            }), function (child) {
                child.selected = false;
            });
            Helpers.each(this.select_options.querySelectorAll('.uniformSelect-option.active .uniformSelect-option-icon'), Helpers.remove);
            Helpers.removeClass(this.select_options.querySelectorAll('.uniformSelect-option.active'), 'active');
        }
        Helpers.toggleClass(e.currentTarget, 'active');
        e.currentTarget.option.selected = Helpers.hasClass(e.currentTarget, 'active');
        if (Helpers.hasClass(e.currentTarget, 'active')) {
            e.currentTarget.append(this.activeIcon.cloneNode(true));
        } else {
            Helpers.each(e.currentTarget.querySelectorAll('.uniformSelect-option-icon'), Helpers.remove);
        }
        Helpers.trigger(this.el, 'change');
    }
    
    updateSelect () {
        if (!this.el.multiple) this.hideOptions();
        var value = Helpers.map(Helpers.filter(this.el.querySelectorAll("option"), function(el){
            return el.selected;
        }), function(el){
            return el.textContent;
        }).join(", ");
        
        if (value == "") value = "&nbsp;";
        this.edit_button.querySelector('.text-js').innerHTML = value;
    }

    updatePosition () {
        if(!this.select_options) return;
        
        var fixedParents = Helpers.filter(Helpers.ancestors(this.container), function (el){
            return Helpers.css(el, 'position') == 'fixed';
        });

        if (Helpers.hasClass(this.select_options, 'fixed')) {
            if (fixedParents.length == 0) {
                this.select_options.style.position = 'absolute';
                this.select_options.style.top = Helpers.offset(this.container).top + this.container.offsetHeight + "px";
                Helpers.removeClass(this.select_options, 'fixed');
            }
        } else if(fixedParents.length > 0) {
            if (window.innerWidth > 720) {
                this.lastScrollPosition = false;
            }
            this.select_options.style.position = 'fixed';
            this.select_options.style.top = Helpers.offset(this.container).top + this.container.offsetHeight + "px";
            this.select_options.style.left = Helpers.offset(this.container).left + "px";
            Helpers.addClass(this.select_options, 'fixed');
        }
    }
}