import Component from './component';
import TableGrid from './table-grid';
import BoundInput from './bound-input';
import {createElement, addEventListenerFor, offsetTo, remove, append} from 'dolla';

/*  
    Options
    ===

    Column Options
    ===
    type: text|number|date
    options: [] if type=text renders select with options
    input: { options for BoundInput } || function(record, done) call done when ready to rerender cell

    use class -no-selection on cells to not allow selection

    Extendable
    ===
    cellModel

    TODO
    ====
    Highlight selected cells
    Copy/Paste with selected cells

*/
export class SpreadsheetCell {
    
    constructor (options) {
        this.options = options
        this.record = options.record
        this.id = options.id
        this.el = createElement(Object.assign({}, {
            tabindex: '0'
        }, options))
        this.el.classList.add('uniformTableGrid-cell', 'col-' + options.id)
        this.el.model = this;
    }
    
    render () {
        this.el.innerHTML = ''
        let content;
        if (this.options.render){
            content = this.options.render(this.record, this)
        } else if (this.options.input && ['radio', 'checkbox', 'select'].includes(this.options.input.type)) {
            content = new BoundInput(Object.assign({
                record: this.record,
                attribute: (this.options.attribute || this.id),
                load: this.options.load,
                dump: this.options.dump,
                tabindex: '-1'
            }, this.options.input)).el
        } else {
            content = this.record[this.options.attribute || this.id]
        }
        this.el.append(createElement('button', {
            type: 'button',
            class: 'uniformSpreadsheet-cellContent',
            content
        }))
        return this
    }
    
    renderInput () {
        let input;
        if (typeof this.options.input == 'function') {
            input = this.options.input(this.record, this.render.bind(this))
        } else {
            input = createElement({
                class: 'uniformSpreadsheet-cellInput',
                content: new BoundInput(Object.assign({
                    record: this.record,
                    attribute: this.id,
                    style: {
                        minHeight: this.el.offsetHeight + "px"
                    }
                }, this.options.input)).el
            })
        }
        if (input) {
            this.el.append(input);
            input.addEventListener('focusout', this.render.bind(this))
        }
        
        return input
    }
    
    async activate (event) {
        let input = this.el.querySelector('input, select, textarea, button:not(.uniformSpreadsheet-cellContent)')
        if (!input) {
            input = await this.renderInput()
            if (input) input = input.querySelector('input, select, textarea') || input.querySelector('button')
        } else {
            this.el.classList.add('-active');
        }
        if (input) {
            input.focus();
            if (input.tagName == "INPUT") {
                if (input.type == "checkbox") {
                    if (!(event && event.target == input && event.type == "mouseup")) {
                        input.checked = !input.checked
                        input.dispatchEvent(new Event('change'))
                        event.preventDefault()
                    }
                    this.el.focus()
                } else {
                    input.select();
                }
            }
        }
    }
}

export default class Spreadsheet extends TableGrid {
    
    static className = "uniformTableGrid uniformSpreadsheet";
    static cellModel = SpreadsheetCell;

    initialize (options) {
        super.initialize.call(this, options)
        
        addEventListenerFor(this.el, '.uniformTableGrid-cell', 'keydown', this.keydown.bind(this))
        addEventListenerFor(this.el, '.uniformTableGrid-cell', 'keyup', this.keyup.bind(this))
        addEventListenerFor(this.el, '.uniformTableGrid-cell', 'mousedown', this.mousedownCell.bind(this))
        addEventListenerFor(this.el, '.uniformTableGrid-cell', 'mouseup', this.mouseupCell.bind(this))
        addEventListenerFor(this.el, '.uniformTableGrid-cell', 'mouseover', this.updateCellSelection.bind(this))
    }
    
    initColumnModel (model, key) {
        if (model instanceof this.constructor.cellModel) {
            model = {prototype: model}
        } else if (typeof model == "function") {
            model = {render: model, prototype: model}
        } else if (Array.isArray(model)) {
            model = Object.assign({
                render: model[0],
                prototype: this.constructor.cellModel
            }, model[1])
        } else if (typeof model == "object") {
            model.prototype = this.constructor.cellModel
        } else {
            throw 'UniformTable column in inproperly configured. Accepts function or [function, options]';
        }
        
        model.id = key
        return model
    }
    
    renderCell(record, model) {
        const options = Object.assign({
            record
        }, model)
        delete options.prototype
        return new model.prototype(options).render().el
    }
    
    /*
        Mouse Events
    */
    mousedownCell (e) {
        const cell = e.delegateTarget;
        if (cell.matches('.-no-selection')) return;
        
        this.previousFocus = document.activeElement;
        this.selecting = cell;
        
        if (cell != document.activeElement && !cell.querySelector(':focus')) {
            this.deselectCells();
            e.preventDefault()
            e.stopPropagation()
            cell.focus()
        }
        
        window.addEventListener('mouseup', this.endCellSelection.bind(this), {once: true})
    }
    
    mouseupCell (e) {
        const cell = e.delegateTarget;
        if (cell.matches('.-no-selection')) return;
        
        if (this.selecting && this.selecting == cell && this.previousFocus == cell) {
            cell.model.activate(e)
        }
    }
    
    /*
        Cell Selection
    */
    updateCellSelection (e) {
        if (this.selecting) {
            const current = this.el.querySelector('.uniformTableGrid-row > *:focus, .uniformTableGrid-row > *:focus-within') || this.el.querySelector('.uniformTableGrid-row > *')
            const target = e.delegateTarget
            const currentIndex = [indexOf(current), indexOf(current.parentElement)]
            const targetIndex = [indexOf(target), indexOf(target.parentElement)]
            
            this.el.querySelectorAll('.uniformTableGrid-row > *.selecting').forEach(el => el.classList.remove('selecting'))
            
            let i = Math.min(currentIndex[1], targetIndex[1])
            while (i <= Math.max(currentIndex[1], targetIndex[1])) {
                const row = this.el.children[i];
                let x = Math.min(currentIndex[0], targetIndex[0])
                while (x <= Math.max(currentIndex[0], targetIndex[0])) {
                    row.children[x].classList.add('selecting')
                    x += 1
                }
                i += 1
            }
        }
    }
    
    endCellSelection (e) {
        const cell = e.target.closest('.uniformTableGrid-row > *')
        if (this.selecting && cell != this.selecting) {
            this.selecting.focus()
            const selectedCells = this.el.querySelectorAll('.uniformTableGrid-row > *.selecting')
            if (selectedCells.length > 0) {
                selectedCells.forEach(el => el.classList.add('selected'))
                const offset = offsetTo(Array.from(selectedCells), this.el)
                const pad = 1
                this.el.append(createElement('selection', {
                    class: 'uniformSpreadsheet-selectionOutline',
                    style: {
                        left: offset.left - pad + "px",
                        top: offset.top - pad + "px",
                        width: offset.right - offset.left + pad + "px",
                        height: offset.bottom - offset.top + pad + "px"
                    }
                }))
            }
        }
        this.el.querySelectorAll('.uniformTableGrid-row > *.selecting').forEach(el => {
            el.classList.remove('selecting')
        })
        delete this.selecting;
    }
    
    deselectCells () {
        this.el.querySelectorAll('.uniformTableGrid-cell.-active').forEach(el => {
            el.classList.remove('-active')
        })
        this.el.querySelectorAll('.uniformTableGrid-cell.selected').forEach(el => {
            el.classList.remove('selected')
        })
        this.el.querySelectorAll('selection').forEach(el => el.parentNode.removeChild(el));
    }
    
    initiateColumnResize () {
        this.deselectCells()
        return super.initiateColumnResize(...arguments)
    }
    
    /*
        Keyboard Events
    */
    keydown (e) {
        if (document.activeElement == e.delegateTarget) {
            const cell = e.delegateTarget;
            let direction, target;
            switch(e.key) {
                case 'Tab':
                    this.focusCell(e.shiftKey ? "left" : "right")
                    e.preventDefault()
                    e.stopPropagation()
                    return
                case 'ArrowRight':
                    this.focusCell('right')
                    e.preventDefault()
                    return
                case 'ArrowLeft':
                    this.focusCell('left')
                    e.preventDefault()
                    return
                case 'ArrowUp':
                    this.focusCell('up')
                    e.preventDefault()
                    return
                case 'ArrowDown':
                    this.focusCell('down')
                    e.preventDefault()
                    return
            }
            if (![
                e.metaKey,
                e.ctrlKey,
                e.altKey
            ].includes(true) && ![
                'Escape',
                'Meta',
                'Shift',
                'Alt',
                'Control',
                'Tab',
                'ArrowRight',
                'ArrowLeft',
                'ArrowDown',
                'ArrowUp',
                'Enter'
            ].includes(e.key)) {
                this.deselectCells()
                cell.model.activate(e)
            }
        } else if (e.key == "Enter") {
            e.preventDefault()
        }
    }
    
    keyup (e) {
        const cell = e.delegateTarget;
        if (document.activeElement == e.delegateTarget) {
            if (e.key == "Enter") {
                this.deselectCells()
                cell.model.activate(e)
            }
        } else {
            if (e.key == "Enter") {
                this.focusCell('down')
            } else if (e.key == "Escape") {
                cell.classList.remove('-active');
                cell.focus()
            }
        }
    }
    
    focusCell(direction) {
        const current = this.el.querySelector('.uniformTableGrid-cell:focus, .uniformTableGrid-cell:focus-within') || this.el.querySelector('.uniformTableGrid-cell')

        const action = (direction == "up" || direction == "left" ? "previous" : "next") + 'ElementSibling'
        if (direction == "left" || direction == "right") {
            const cell = current[action]
            if (cell) cell.focus()
        } else {
            const index = indexOf(current)
            const row = current.parentElement[action]
            if (row) {
                row.children.item(index).focus()
            } else {
                current.focus()
            }
        }
        this.deselectCells()
    }
}



function indexOf(el) {
    return Array.from(el.parentNode.childNodes).indexOf(el)
}
function isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
}