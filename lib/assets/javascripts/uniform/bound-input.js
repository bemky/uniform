import Component from './component';
import { uniqueId } from './component';
import { createElement, append } from 'dolla';

// Options
// ----
// record: object to get and set value from
//        if record has addEventListener, it will listen for change and update value
//
// attribute: attribute of record to get and set
// {...}: all html attributes allowed
//
// TODO
// ---
// default type based on value
//
// array: true for checkbox / radio
//
// invalid

export default class BoundInput extends Component {
    
    static tagName = 'input';
    
    constructor (options) {
        let prototype;
        switch (options.type){
            case 'button':
                options.tagName = 'button';
                prototype = BoundButton.prototype;
                break;
            case 'checkbox':
                prototype = BoundCheckbox.prototype;
                break;
            case 'radio':
                prototype = BoundRadio.prototype;
                break;
            case 'select':
                options.tagName = 'select';
                prototype = BoundSelect.prototype;
                break;
            case 'textarea':
                options.tagName = 'textarea';
                break;
            case 'date':
                prototype = BoundDate.prototype;
                break;
        }
        
        options.initialize = false;
        super(options);
        if (prototype) {
            this.__proto__ = prototype
        }
        this.initialize(options)
    }
    
    initialize (options) {
        if (options.load) this.loadRecord = options.load;
        if (options.dump) this.dumpRecord = options.dump;
        this.record = options.record;
        this.attribute = options.attribute;
        
        this.el.id = uniqueId('input');
        
        this.loadEl()
        
        this.el.addEventListener('change', this.dumpEl.bind(this));
        if (this.record.addEventListener) {
            this.record.addEventListener('change', this.loadEl)
        }
    }
    
    remove () {
        this.record.removeEventListener('change', this.loadEl)
        super.remove()
    }
    
    loadRecord (v) {
        return v
    }
    
    dumpRecord (v) {
        return v;
    }
    
    loadEl () {
        if (this.dumping) return
        this.loading = true;
        this.loadElValue();
        this.loading = false;
    }
    
    loadElValue() {
        const value = this.loadRecord(this.record[this.attribute])
        if (value !== undefined) this.el.value = value;
    }
    
    dumpEl (e) {
        if (this.loading) return
        this.dumping = true;
        this.dumpElValue();
        this.dumping = false;
    }
    
    dumpElValue () {
        this.record[this.attribute] = this.dumpRecord(this.el.value);
    }
    
}

export class BoundCheckbox extends BoundInput {

    initialize (options) {
        super.initialize(options);
        if (options.array || options.isArray) {
            this.isArray = true
        }
    }

    loadElValue () {
        // "on" is default, indiciating value has not been set by constructor
        if (this.el.value == "on") {
            this.el.value = "true";
            this.el.checked = this.loadRecord(this.record[this.attribute] === true);
        } else {
            this.el.checked = this.loadRecord(this.record[this.attribute] === this.el.value);
        }
    }
    
    dumpElValue (e) {
        if (this.el.value === "true") {
            this.record[this.attribute] = this.dumpRecord(this.el.checked === true);
        } else if (this.el.checked) {
            this.record[this.attribute] = this.dumpRecord(this.el.value);
        } else {
            this.record[this.attribute] = undefined
        }
    }
}
export class BoundRadio extends BoundCheckbox {}

export class BoundDate extends BoundInput {
    
    loadRecord (value) {
        if (value instanceof Date) {
            var month = value.getMonth()+1 + '';
            if(month.length == 1) month = '0' + month;
            var date = value.getDate()+'';
            if(date.length == 1) date = '0' + date;
            return [value.getUTCFullYear(), month , date].join("-")
        } else {
            return value
        }
    }
}

export class BoundButton extends BoundInput {
    
    static tagName = "button";
    
    initialize (options) {
        // options.content removed by component, TODO fix
        const content = options.content;
        super.initialize(options);
        this.el.addEventListener('click', this.dumpEl.bind(this));
        if (content) {
            append(this.el, content)
        }
    }
    
    loadEl () {}
}

export class BoundSelect extends BoundInput {
    
    static tagName = 'select';
    
    dumpElValue (v) {
        if (v == "null") return null;
        return v
    }
    
    initialize (options) {
        const value = this.loadRecord(options.record[options.attribute]);
        if (options.options) {
            if (options.includeBlank) {
                const el = document.createElement('option');
                el.innerHTML = options.includeBlank === true ? "Unset" : options.includeBlank
                el.selected = value ? false : true
                el.style.fontStyle = 'italic'
                el.setAttribute('value', null)
                this.el.append(el)
            }
            
            options.options.forEach(option => {
                if (option instanceof Element) return this.el.append(option);
                
                const el = document.createElement('option');
                if (Array.isArray(option)){
                    el.setAttribute('value', option[0])
                    el.innerHTML = option[1]
                } else {
                    el.setAttribute('value', option)
                    el.innerHTML = option
                }
                this.el.append(el)
            })
            
            
        }
        super.initialize(options);
    }
    
    loadElValue() {
        const value = this.loadRecord(this.record[this.attribute]) || [];
        if (this.el.multiple) {
            this.el.querySelectorAll('option').forEach(option => {
                if (value.includes(option.value)) {
                    option.setAttribute('selected', true)
                } else {
                    option.removeAttribute('selected')
                }
            })
        } else {
            super.loadElValue()
        }
    }
    
    dumpElValue (e) {
        if (this.el.multiple) {
            const values = Array.from(this.el.options).filter(x => x.selected).map(x => x.value)
            this.record[this.attribute] = this.dumpRecord(values);
        } else {
            super.dumpElValue()
        }
    }
}