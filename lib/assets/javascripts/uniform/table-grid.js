import Component from './component';
import Popover from './popover';
import Modal from './modal';
import { createElement, addEventListenerFor, innerWidth, listenerElement } from 'dolla';
import DragOrder from 'dragorder';
import { titleize } from './support';
import { dots as dotsIcon, caretUp, caretDown} from './icons';

/*  
    Options
    ===
    columns: ƒ || [ƒ, {}]
        width: integer
        header: string
        class: string
        order: boolean || ƒ(records, "asc"||"desc") 
    records:
    storeKey: string || ƒ // used to store settings in LocalStorage

    Extendable
    ===
    columns
    defaultColumns
    tagName
    records
    className

*/
export default class Table extends Component {

    static className = 'uniformTableGrid'
    static columns = []
    static defaultColumns = null
    static defaultOrder = null
    static _storeKey = null
    
    async initialize (options) {
        this.records = options.records
        this._storeKey = options.storeKey || this.constructor._storeKey
        await this.initColumns(options);
    
        // Bind Instance Methods
        this.columnResize = this.columnResize.bind(this);
        this.endColumnResize = this.endColumnResize.bind(this);
    
        // Events
        addEventListenerFor(this.el, '.uniformTableGrid-column-menu', 'click', this.showColumnPopover.bind(this))
        addEventListenerFor(this.el, '.uniformTableGrid-order-action', 'click', this.selectOrder.bind(this))
        addEventListenerFor(this.el, '.uniformTableGrid-resize-handle', 'mousedown', this.initiateColumnResize.bind(this))
        
        this.render()
    }
    
    initColumns (options={}) {
        // Column Models
        this.columnModels = (options.columns || this.constructor.columns)
        Object.keys(this.columnModels).forEach(key => {
            let model = this.columnModels[key]
            model.id = key
            if (typeof model == "function") {
                model = {render: model}
            } else if (Array.isArray(model)) {
                model[1].render = model[0]
                model = model[1]
            } else if (typeof model == "object") {
                if (!model.render) {
                    model.render = this.defaultColumnRender
                }
            } else {
                throw 'UniformTable column in inproperly configured. Accepts function or [function, options]';
            }
            this.columnModels[key] = model
        })
        
        // Default Columns
        this.defaultColumns = options.defaultColumns || this.defaultColumns || this.constructor.defaultColumns || Object.keys(this.columnModels)
        this.defaultOrder = options.defaultOrder || this.defaultOrder || this.constructor.defaultOrder || this.defaultColumns.find(key => this.columnModels[key].order)
        if (this.defaultOrder) {
            if (typeof this.defaultOrder != 'object') this.defaultOrder = {[this.defaultOrder]: 'asc'}
        }
        
        this.columns = this.getSettings().columns;
        
        this.columns.forEach(col => {
            const model = this.columnModels[col.id]
            if (!col.width && model.width) col.width = model.width
        })
    }
    
    defaultColumnRender (record, model) {
        return r[model.id]
    }
    
    render () {
        this.setTemplate(this.columns.map(col => col.width || "1fr"))
        this.el.innerHTML = '';
        this.el.append(this.renderHead())
        this.el.append(...this.orderedRecords().map(this.renderRow, this));
        
        return this;
    }
    
    setTemplate (widths) {
        this.el.style.gridTemplateColumns = widths.map(width => typeof width == "number" ? width + "px" : width).join(" ");
    }
    
    renderHead () {
        return createElement({
            class: 'uniformTableGrid-header',
            content: this.columns.map((column, index) => {
                const model = this.columnModels[column.id]
                const cell = createElement({
                    class: "uniformTableGrid-header-cell col-" + column.id + " " + (model.class ? model.class : ""),
                    id: column.id,
                    content: [{
                        tag: 'span',
                        content: model.header || titleize(column.id)
                    }, {
                        class: 'uniformTableGrid-header-action',
                        content: {
                            class: 'uniformTableGrid-column-menu',
                            content: dotsIcon
                        }
                    }, {
                        class: 'uniformTableGrid-resize-handle'
                    }]
                })
                if (this.columns.length - 1 == index) {
                    cell.append(createElement({
                        class: 'uniformTableGrid-resize-handle -end'
                    }))
                }
                if (model.order) {
                    cell.querySelector('span').classList.add('uniformTableGrid-order-action');
                    cell.querySelector('span').append(createElement({
                        tag: 'span',
                        class: 'uniformTableGrid-order-indicator',
                        content: [
                            caretUp,
                            caretDown
                        ]
                    }))
                    if (column.order) {
                        cell.querySelector('span').classList.add('-active', "-active-" + column.order);
                    }
                }
                return cell
            })
        })
    }
    
    renderRow (record) {
        return createElement({
            class: 'uniformTableGrid-row',
            content: this.columns.map(column => {
                const model = this.columnModels[column.id]
                return createElement({
                    content: model.render(record, model),
                    class: "col-" + column.id + " " + model.class || ""
                })
            })
        })
    }
    
    orderedRecords() {
        const orderingColumn = this.columns.find(x => x.order);
        if (!orderingColumn) {
            return this.records
        }
        const model = this.columnModels[orderingColumn.id];
        if (typeof model.order == "function") {
            return model.order(this.records, orderingColumn.order);
        } else if (model.order) {
            const key = orderingColumn.id
            return this.records.sort((r1, r2) => {
                if (orderingColumn.order == "asc") {
                    return r1[key] > r2[key]
                } else {
                    return r1[key] < r2[key]
                }
            })
        }
    }
    
    storeKey() {
        return this._storeKey || [
            'uniform/table',
            Object.keys(this.columnModels).map(x => x.slice(0,1)).join(''),
        ].join('/')
    }
    
    getSettings () {
        let savedSettings = this.readSettings()
        savedSettings = savedSettings ? JSON.parse(savedSettings) : {};
        const settings = Object.assign(this.defaultSettings(), savedSettings)
        
        // Remove columns that are no longer in columnModels, because LocalStorage can persist code changes
        settings.columns = settings.columns.filter(x => this.columnModels[x.id])
        
        let orderingColumn = settings.columns.find(x => x.order);
        if (!orderingColumn && this.defaultOrder) {
            orderingColumn = settings.columns.find(x => x.id == Object.keys(this.defaultOrder)[0])
            orderingColumn.order = this.defaultOrder[orderingColumn.id]
        }
        
        return settings;
    }
    
    readSettings () {
        return localStorage.getItem(this.storeKey());
    }
    
    saveSettings (settings) {
        localStorage.setItem(this.storeKey(), JSON.stringify(settings));
    }
    
    defaultSettings () {
        return {
            columns: this.defaultColumns.map(col => {
                return {id: col}
            })
        }
    }
    
    selectOrder (e, direction) {
        const orderKey = e.delegateTarget.closest('.uniformTableGrid-header-cell').id;
        const orderColumn = this.columns.find(x => x.id == orderKey)
        const currentOrderColumn = this.columns.find(x => x.order)
        if (direction) {
            if (currentOrderColumn){
                delete currentOrderColumn.order
            }
            orderColumn.order = direction
        } else {
            if (orderColumn.order) {
                orderColumn.order = orderColumn.order == 'asc' ? 'desc' : 'asc'
            } else {
                if (currentOrderColumn) {
                    delete currentOrderColumn.order
                }
                orderColumn.order = 'asc'
            }
        }

        this.saveSettings({columns: this.columns});
        this.render();
    }
    
    showColumnPopover (e) {
        const button = e.delegateTarget;
        this.el.querySelectorAll('.uniformTableGrid-header-cell').forEach(el => el.classList.add('-disabled'));
        button.closest('.uniformTableGrid-header').classList.add('-active');
        button.closest('.uniformTableGrid-header-cell').classList.add('-active');
        button.closest('.uniformTableGrid-header-cell').classList.remove('-disabled');
        button.classList.add('-active');
        
        if (!button.popover) {
            const headerCell = button.closest('[id]');
            const columnModel = this.columnModels[headerCell.id]
            const actions = [
                listenerElement({
                    class: 'block hover:text-blue hover:bg-blue-10 rounded pad-1/2x cursor-pointer',
                    content: 'Remove Column'
                }, e => {
                    button.popover.hide();
                    this.columns = this.columns.filter(x => x.id != headerCell.id)
                    this.saveSettings({columns: this.columns});
                    this.render();
                }),
                listenerElement({
                    class: 'block hover:text-blue hover:bg-blue-10 rounded pad-1/2x cursor-pointer',
                    content: 'Table Settings'
                }, e => {
                    button.popover.hide();
                    this.showSettingsModal();
                })
            ]
            
            if (columnModel.order) {
                actions.unshift(
                    listenerElement({
                        class: 'block hover:text-blue hover:bg-blue-10 rounded pad-1/2x cursor-pointer',
                        content: 'Order A to Z'
                    }, e => {
                        button.popover.hide();
                        this.selectOrder({delegateTarget: button}, 'asc');
                    }),
                    listenerElement({
                        class: 'block hover:text-blue hover:bg-blue-10 rounded pad-1/2x cursor-pointer',
                        content: 'Order Z to A'
                    }, e => {
                        button.popover.hide();
                        this.selectOrder({delegateTarget: button}, 'desc');
                    })
                )
            }
            
            button.popover = new Popover({
                anchor: button,
                align: '0px bottom',
                content: createElement({
                    class: 'shadow shadow-opacity-40 bg-white rounded pad-1/2x text-sm text-nowrap',
                    content: actions
                })
            }).render()
        
            button.popover.addEventListener('hidden', () => {
                this.el.querySelectorAll('.-disabled').forEach(el => el.classList.remove('-disabled'))
                button.closest('.uniformTableGrid-header-cell').classList.remove('-active');
                button.classList.remove('-active');
            })
        } else {
            button.popover.toggle()
        }
    }
    
    renderSettingsModalColumns(includedEl, excludedEl, columns) {
        includedEl.innerHTML = '';
        excludedEl.innerHTML = '';
        columns.forEach(column => {
            const model = this.columnModels[column.id]
            includedEl.append(createElement({
                class: 'text-nowrap pad-1/4x flex space-h-1/2x align-center group',
                children: [{
                    tag: 'label',
                    class: 'flex-fill',
                    children: [{
                        tag: 'input',
                        type: 'checkbox',
                        class: 'margin-right-1/4x',
                        value: column.id,
                        checked: true
                        }, model.header || titleize(column.id)]
                }, {
                    tag: 'span',
                    class: 'js-move cursor-move opacity-0 group-hover:opacity-100',
                    children: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.28 20" style="width:9px"><path d="M4.27,13.05a.54.54,0,0,0-.75,0,.53.53,0,0,0,0,.75l6.1,6a.54.54,0,0,0,.76,0l6.1-6a.53.53,0,0,0,0-.75.54.54,0,0,0-.75,0L10,18.56Z" transform="translate(-3.36 0)"/><path d="M15.73,6.94a.53.53,0,0,0,.75-.75l-6.1-6a.54.54,0,0,0-.76,0l-6.1,6a.53.53,0,1,0,.75.75L10,1.43Z" transform="translate(-3.36 0)"/></svg>`
                }]
            }))
        })
        Object.keys(this.columnModels).forEach(key => {
            if (columns.find(c => key == c.id)) return
            const model = this.columnModels[key];
            excludedEl.append(createElement({
                class: 'text-nowrap pad-1/4x flex space-h-1/2x align-center group',
                children: [{
                    tag: 'label',
                    class: 'flex-fill',
                    children: [{
                        tag: 'input',
                        type: 'checkbox',
                        class: 'margin-right-1/4x',
                        value: key
                        }, model.header || titleize(key)]
                }, {
                    tag: 'span',
                    class: 'js-move cursor-move opacity-0 group-hover:opacity-100 hide',
                    children: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.28 20" style="width:9px"><path d="M4.27,13.05a.54.54,0,0,0-.75,0,.53.53,0,0,0,0,.75l6.1,6a.54.54,0,0,0,.76,0l6.1-6a.53.53,0,0,0,0-.75.54.54,0,0,0-.75,0L10,18.56Z" transform="translate(-3.36 0)"/><path d="M15.73,6.94a.53.53,0,0,0,.75-.75l-6.1-6a.54.54,0,0,0-.76,0l-6.1,6a.53.53,0,1,0,.75.75L10,1.43Z" transform="translate(-3.36 0)"/></svg>`
                }]
            }))
        })
    }
    
    showSettingsModal () {
        let modal;
        let settings = this.getSettings();
        const includedEl = createElement({
            class: 'border rounded flex-fill'
        })

        const excludedEl = createElement({
            class: 'border rounded flex-fill'
        })
        
        this.renderSettingsModalColumns(includedEl, excludedEl, settings.columns)
        
        const container = createElement('div', {
            class: 'pad-top bg-white rounded overflow-hidden min-width-300-px border-gray-20',
            children: [{
                tag: 'h2',
                class: "text-center margin-bottom",
                children: 'Customize Columns'
            }, {
                class: 'flex space-h-1/2x pad-h-1/2x',
                children: [
                    includedEl,
                    excludedEl
                ]
            },{
                class: 'text-xs text-uppercase text-center text-bold text-gray-30 hover:text-blue',
                content: listenerElement('button', {
                    class: "reset pad-v-1/2x",
                    content: "Restore Defaults"
                }, e => {
                    settings = this.defaultSettings();
                    this.renderSettingsModalColumns(includedEl, excludedEl, settings.columns);
                })
            },{
                class: "flex pad bg-gray-10 bg-opacity-50 justify-content-end space-h",
                children: [
                    listenerElement('button', {
                        class: 'uniformButton -clear -gray-50',
                        content: 'Cancel'
                    }, e => {
                        modal.close()
                    }),
                    listenerElement('button', {
                        class: 'uniformButton -green',
                        content: 'Update'
                    }, e => {
                        this.saveSettings(settings);
                        this.columns = settings.columns;
                        this.render()
                        modal.close()
                    })
                ]
            }]
        })
        
        addEventListenerFor(container, 'input', 'change', e => {
            const container = e.delegateTarget.closest('div')
            if (e.delegateTarget.checked) {
                settings.columns.push({id: e.delegateTarget.value})
                includedEl.append(container)
                container.querySelector('.js-move').classList.remove('hide')
            } else {
                settings.columns = settings.columns.filter(x => x.id != e.delegateTarget.value)
                excludedEl.append(container)
                container.querySelector('.js-move').classList.add('hide')
            }
        })
        
        const dragorder = new DragOrder({
            el: includedEl,
            handleSelector: '.js-move',
            itemSelector: 'div',
            placeholder: item => {
                const el = item.cloneNode(true);
                el.style.display = item.style.display;
                el.style.opacity = 0.5
                return el
            },
            dragholder: item => {
                const el = item.cloneNode(true);
                el.style.display = item.style.display;
                el.style.width = item.offsetWidth + "px";
                el.style.height = item.offsetHeight + "px";
                el.style.minWidth = 'auto';
                el.style.maxWidth = 'auto';
                el.style.minHeight = 'auto';
                el.style.maxHeight = 'auto';
                el.style.position = 'fixed';
                el.style.cursor = "grabbing";
                el.style.background = 'rgba(255,255,255,0.8)';
                el.style.border = '1px dashed rgba(0, 0, 0, 0.5)'
                return el
            },
            drop: (items) => {
                const keys = Array.from(items).map(item => item.querySelector('input').value)
                settings.columns.sort((a, b) => keys.indexOf(a.id) - keys.indexOf(b.id))
            }
        })
        
        modal = new Modal({
            content: container
        }).render()
        
        return modal;
    }
    
    /*
        Column Resizing
    */
    initiateColumnResize (e) {
        this.el.querySelectorAll('.uniformTableGrid-header-cell').forEach(el => el.classList.add('-disabled'));
        e.delegateTarget.closest('.uniformTableGrid-header-cell').classList.remove('-disabled');
        e.delegateTarget.closest('.uniformTableGrid-header-cell').classList.add('-active');
        e.delegateTarget.classList.add('-hover');
        
        window.addEventListener('mousemove', this.columnResize)
        window.addEventListener('mouseup', this.endColumnResize)
        
        this.columnTemplate = []
        this.el.querySelectorAll('.uniformTableGrid-header-cell').forEach((el, i) => {
            this.columnTemplate.push(el.offsetWidth)
        })

        this.setTemplate(this.columnTemplate)
        
        let resizingColumn = e.delegateTarget.closest('.uniformTableGrid-header-cell').previousElementSibling
        if (e.delegateTarget.classList.contains('-end')) {
            resizingColumn = e.delegateTarget.closest('.uniformTableGrid-header-cell')
        }
        
        this.resizingIndex = Array.from(this.el.querySelectorAll('.uniformTableGrid-header-cell')).indexOf(resizingColumn)
        this.startPageX = e.pageX
        this.startWidth = this.columnTemplate[this.resizingIndex]
        
        this.el.querySelectorAll(`.col-${resizingColumn.id}`).forEach(el => {
            el.classList.add('-resizing')
        })
    }
    
    columnResize (e) {
        let newWidth = this.startWidth + (e.pageX - this.startPageX);
        this.columnTemplate[this.resizingIndex] = newWidth < 0 ? 0 : newWidth;
        this.setTemplate(this.columnTemplate)
    }
  
    endColumnResize (e) {
        window.removeEventListener('mousemove', this.columnResize)
        window.removeEventListener('mouseup', this.endColumnResize)
        this.el.querySelectorAll('.uniformTableGrid-header-cell').forEach((cell, i) => {
            this.columns.find(x => x.id == cell.id).width = this.columnTemplate[i] + "px"
        })
        this.el.querySelectorAll(`.-resizing`).forEach(el => {
            el.classList.remove('-resizing')
        })
        this.el.querySelector('.uniformTableGrid-resize-handle.-hover').classList.remove('-hover')
        this.el.querySelectorAll('.-disabled').forEach(el => el.classList.remove('-disabled'));
        this.el.querySelector('.uniformTableGrid-header-cell.-active').classList.remove('-active')
        this.saveSettings({columns: this.columns});
    }
    
}
