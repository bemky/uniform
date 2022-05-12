import Component from './component';
import TableGrid from './table-grid';
import BoundInput from './bound-input';
import {createElement, addEventListenerFor, offsetTo} from 'dolla';

/*  
    Options
    ===

    Column Options
    ===
    type: text|number|date
    options: [] if type=text renders select with options
    input: { options for BoundInput }

    use class -no-selection on cells to not allow selection

    Extendable
    ===

    TODO
    ====
    Highlight selected cells
    Copy/Paste with selected cells

*/
export default class Spreadsheet extends TableGrid {
    
    static className = "uniformTableGrid uniformSpreadsheet";

    initialize (options) {
        super.initialize.call(this, options)
        
        addEventListenerFor(this.el, '.uniformTableGrid-row > *', 'keydown', this.keydown.bind(this))
        addEventListenerFor(this.el, '.uniformTableGrid-row > *', 'mousedown', this.initiateCellSelection.bind(this))
        addEventListenerFor(this.el, '.uniformTableGrid-row > *', 'mouseover', this.updateCellSelection.bind(this))
    }
    
    defaultColumnRender (record, model) {
        let el = new BoundInput(Object.assign({
            record: record,
            attribute: model.attribute || model.id,
            load: model.load,
            dump: model.dump,
        }, model.input)).el;
        
        if (el.type == "checkbox") {
            el = createElement('label', {
                class: 'input',
                content: el
            })
        }
        
        return el
    }
    
    renderRow (record) {
        return createElement({
            class: 'uniformTableGrid-row',
            content: this.columns.map(async column => {
                const model = this.columnModels[column.id]
                const input = await model.render(record, model);
                if (input) input.setAttribute('tabindex', '-1');
                return createElement({
                    tabindex: input ? '0' : '-1',
                    content: input,
                    class: "col-" + column.id + " " + model.class || ""
                })
            })
        })
    }
    
    initiateCellSelection (e) {
        const cell = e.delegateTarget;
        if (cell.matches('.-no-selection')) return;
        
        this.selecting = cell;
        
        this.deselectCells();
        if (cell != document.activeElement && !cell.querySelector(':focus')) {
            e.preventDefault()
            e.stopPropagation()
            cell.focus()
        }
        
        window.addEventListener('mouseup', this.endCellSelection.bind(this), {once: true})
    }
    
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
        this.el.querySelectorAll('.uniformTableGrid-row > *.selected').forEach(el => {
            el.classList.remove('selected')
        })
        this.el.querySelectorAll('selection').forEach(el => el.parentNode.removeChild(el));
    }
    
    initiateColumnResize () {
        this.deselectCells()
        return super.initiateColumnResize(...arguments)
    }
    
    keydown (e) {
        if (document.activeElement == e.delegateTarget) {
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
                default:
                    if (!['Shift', 'Meta', 'Alt', 'Control'].includes(e.key)) {
                        const target = e.delegateTarget.querySelector('input, select, textarea, button')
                        target.focus()
                        if (target.matches('[type="file"]')) {
                            setTimeout(() => target.click(), 100)
                        } else if (target.matches('input')) {
                            target.select()
                        }
                        this.deselectCells()
                    }
            }
        } else {
            switch(e.key) {
                case 'Enter':
                    this.focusCell('down')
                    return
                case 'Escape':
                    e.delegateTarget.focus();
            }
        }
    }
    
    focusCell(direction) {
        const current = this.el.querySelector('.uniformTableGrid-row > *:focus, .uniformTableGrid-row > *:focus-within') || this.el.querySelector('.uniformTableGrid-row > *')
        const action = (direction == "up" || direction == "left" ? "previous" : "next") + 'ElementSibling'
        if (direction == "left" || direction == "right") {
            const cell = current[action]
            if (cell) cell.focus()
        } else {
            const index = indexOf(current)
            const row = current.parentElement[action]
            if (row) row.children.item(index).focus()
        }
        this.deselectCells()
    }
}

function indexOf(el) {
    return Array.from(el.parentNode.childNodes).indexOf(el)
}