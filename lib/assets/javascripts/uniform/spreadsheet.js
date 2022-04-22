import Component from './component';
import Table from './table';
import {createElement, addEventListenerFor, offsetTo} from 'dolla';

/*  
    Options
    ===

    Extendable
    ===

    TODO
    ====
    Highlight selected cells
    Copy/Paste with selected cells

*/
export default class Spreadsheet extends Table {
    
    static className = "uniformTable uniformSpreadsheet";

    initialize (options) {
        super.initialize.call(this, options)
        
        addEventListenerFor(this.el, 'td', 'keydown', this.keydown.bind(this))
        addEventListenerFor(this.el, 'td', 'mousedown', this.initiateCellSelection.bind(this))
        addEventListenerFor(this.el, 'td', 'mouseover', this.updateCellSelection.bind(this))
    }
    
    defaultColumnRender (record, model) {
        const input = createElement('input', {
            value: model.load ? model.load(record[model.id]) : record[model.id]
        })

        input.addEventListener('change', e => {
            record[model.id] = model.dump ? model.dump(e.target.value) : e.target.value
        })
        
        return input
    }
    
    renderRow (record) {
        return createElement('tr', {
            content: this.columns.map(async column => {
                const model = this.columnModels[column.id]
                const input = await model.render(record, model);
                if (input) input.setAttribute('tabindex', '-1')
                return createElement('td', {
                    tabindex: input ? '0' : '-1',
                    content: input,
                    class: "col-" + column.id + " " + model.class || ""
                })
            })
        })
    }
    
    initiateCellSelection (e) {
        const cell = e.delegateTarget;
        this.selecting = cell;
        
        this.deselectCells();
        if (cell != document.activeElement && !cell.querySelector(':focus')) {
            e.preventDefault()
            cell.focus()
        }
        
        window.addEventListener('mouseup', this.endCellSelection.bind(this), {once: true})
    }
    
    updateCellSelection (e) {
        if (this.selecting) {
            const current = this.el.querySelector('td:focus, td:focus-within') || this.el.querySelector('td')
            const target = e.delegateTarget
            const currentIndex = [current.cellIndex, current.parentElement.rowIndex]
            const targetIndex = [target.cellIndex, target.parentElement.rowIndex]
            
            this.el.querySelectorAll('td.selecting').forEach(el => el.classList.remove('selecting'))
            
            let i = Math.min(current.parentElement.rowIndex, target.parentElement.rowIndex)
            while (i <= Math.max(current.parentElement.rowIndex, target.parentElement.rowIndex)) {
                const row = current.closest('table').rows[i];
                let x = Math.min(current.cellIndex, target.cellIndex)
                while (x <= Math.max(current.cellIndex, target.cellIndex)) {
                    row.cells[x].classList.add('selecting')
                    x += 1
                }
                i += 1
            }
        }
    }
    
    endCellSelection (e) {
        const cell = e.target.closest('td')
        if (this.selecting && cell != this.selecting) {
            this.selecting.focus()
            const selectedCells = this.el.querySelectorAll('td.selecting')
            selectedCells.forEach(el => el.classList.add('selected'))
            const offset = offsetTo(Array.from(selectedCells), this.el)
            const pad = 1
            const stroke = 1
            // left
            this.el.append(createElement('selection', {
                class: 'uniformSpreadsheet-selectionOutline',
                style: {
                    left: offset.left - pad + "px",
                    top: offset.top - pad + "px",
                    width: stroke + "px",
                    height: offset.bottom - offset.top + pad + "px"
                }
            }))
            // Right
            this.el.append(createElement('selection', {
                class: 'uniformSpreadsheet-selectionOutline',
                style: {
                    left: offset.right - pad + "px",
                    top: offset.top - pad + "px",
                    width: stroke + "px",
                    height: offset.bottom - offset.top + pad + "px"
                }
            }))
            // Top
            this.el.append(createElement('selection', {
                class: 'uniformSpreadsheet-selectionOutline',
                style: {
                    left: offset.left - pad + "px",
                    top: offset.top - pad + "px",
                    width: offset.right - offset.left + pad + "px",
                    height: stroke + "px"
                }
            }))
            // Bottom
            this.el.append(createElement('selection', {
                class: 'uniformSpreadsheet-selectionOutline',
                style: {
                    left: offset.left - pad + "px",
                    top: offset.bottom - pad + "px",
                    width: offset.right - offset.left + pad + "px",
                    height: stroke + "px"
                }
            }))
        }
        this.el.querySelectorAll('td.selecting').forEach(el => {
            el.classList.remove('selecting')
        })
        delete this.selecting;
    }
    
    deselectCells () {
        this.el.querySelectorAll('td.selected').forEach(el => {
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
                    if (e.key != 'Shift') {
                        e.delegateTarget.querySelector('input, select, textarea').focus();
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
        const current = this.el.querySelector('td:focus, td:focus-within') || this.el.querySelector('td')
        const action = (direction == "up" || direction == "left" ? "previous" : "next") + 'ElementSibling'
        if (direction == "left" || direction == "right") {
            const cell = current[action]
            if (cell) cell.focus()
        } else {
            const index = current.cellIndex
            const row = current.parentElement[action]
            if (row) row.cells[index].focus()
        }
        this.deselectCells()
    }
}