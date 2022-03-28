import Component from './component';
import Popover from './popover';
import Modal from './modal';
import { createElement, addEventListenerFor, innerWidth, listenerElement } from 'dolla';
import DragOrder from 'dragorder';
import { titleize } from './support';

/*  
    Options
    ===
    columns: ƒ || [ƒ, {}]
        defaultWidth: integer
        header: string
        class: string
        sort: boolean || ƒ(records, "asc"||"desc") 
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
    
    static tagName = 'table'
    static className = 'uniformTable'
    static columns = []
    static defaultColumns = null
    static defaultSort = null
    
    initialize (options) {
        this.records = options.records
        this._storeKey = options.storeKey
        
        // Column Models
        this.columnModels = (options.columns || this.constructor.columns)
        Object.keys(this.columnModels).forEach(key => {
            let model = this.columnModels[key]
            if (typeof model == "function") {
                model = {render: model}
            } else if (Array.isArray(model)) {
                model[1].render = model[0]
                model = model[1]
            } else if (typeof model == "Object") {

            } else {
                throw 'UniformTable column in inproperly configured. Accepts function or [function, options]';
            }
            this.columnModels[key] = model
        })
        
        // Default Columns
        this.defaultColumns = options.defaultColumns || this.constructor.defaultColumns || Object.keys(this.columnModels)
        this.defaultSort = options.defaultSort || this.constructor.defaultSort || this.defaultColumns[0]
        if (typeof this.defaultSort != 'object') this.defaultSort = {[this.defaultSort]: 'asc'}
    
        this.columnResize = this.columnResize.bind(this);
        this.endColumnResize = this.endColumnResize.bind(this);
    
        this.initColumns()
        
        this.el.classList.add(this.constructor.className)
    
        addEventListenerFor(this.el, '.uniformTable-settings-action', 'click', this.showColumnPopover.bind(this))
        addEventListenerFor(this.el, '.uniformTable-sort-action', 'click', this.selectSort.bind(this))
        addEventListenerFor(this.el, '.uniformTable-resize-handle', 'mousedown', this.initiateColumnResize.bind(this))
    }
    
    render () {
        this.el.innerHTML = '';
        this.el.append(createElement('thead', {
            content: this.renderHead()
        }))
        this.el.append(createElement('tbody', {
            content: this.sortedRecords().map(this.renderRow, this)
        }));
        
        return this;
    }
    
    renderHead () {
        return createElement('tr', {
            content: this.columns.map(column => {
                const model = this.columnModels[column.id]
                const cell = createElement('th', {
                    class: "col-" + column.id + " " + model.class,
                    id: column.id,
                    style: {
                        width: column.width || model.defaultWidth
                    },
                    content: [
                        {
                            class: 'uniformTable-th-header',
                            content: [{
                                class: 'uniformTable-th-spacer'
                            },{
                                class: 'uniformTable-settings-action',
                                content: downCaretIcon
                            }]
                        },
                        {
                            class: 'uniformTable-resize-handle'
                        },
                        {
                            tag: 'span',
                            content: model.header || titleize(column.id)
                        }
                    ]
                })
                if (model.sort) {
                    cell.querySelector('span').classList.add('uniformTable-sort-action');
                    if (column.sort) {
                        cell.querySelector('span').classList.add('-active', "-active-" + column.sort);
                    }
                }
                return cell
            })
        })
    }
    
    renderRow (record) {
        return createElement('tr', {
            content: this.columns.map(column => {
                const model = this.columnModels[column.id]
                return createElement('td', {
                    content: model.render(record),
                    class: "col-" + column.id + " " + model.class || ""
                })
            })
        })
    }
    
    sortedRecords() {
        const sortingColumn = this.columns.find(x => x.sort);
        const model = this.columnModels[sortingColumn.id];
        if (typeof model.sort == "function") {
            return model.sort(this.records, sortingColumn.sort);
        } else if (model.sort) {
            const key = sortingColumn.id
            return this.records.sort((r1, r2) => {
                if (sortingColumn.sort == "asc") {
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
            Object.keys(this.columnModels).join("-"),
        ].join('/')
    }
    
    readSettings () {
        let savedSettings = localStorage.getItem(this.storeKey())
        savedSettings = savedSettings ? JSON.parse(savedSettings) : {};
        const settings = Object.assign(this.defaultSettings(), savedSettings)
        
        // Remove columns that are no longer in columnModels, because LocalStorage can persist code changes
        settings.columns = settings.columns.filter(x => this.columnModels[x.id])
        
        let sortingColumn = settings.columns.find(x => x.sort);
        if (!sortingColumn) {
            sortingColumn = settings.columns.find(x => x.id == Object.keys(this.defaultSort)[0])
            sortingColumn.sort = this.defaultSort[sortingColumn.id]
        }
        
        return settings;
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
    
    initColumns () {
        this.columns = this.readSettings().columns;
    }
    
    selectSort (e, direction) {
        const sortKey = e.delegateTarget.closest('th').id;
        const sortColumn = this.columns.find(x => x.id == sortKey)
        if (direction) {
            delete this.columns.find(x => x.sort).sort
            sortColumn.sort = direction
        } else {
            if (sortColumn.sort) {
                sortColumn.sort = sortColumn.sort == 'asc' ? 'desc' : 'asc'
            } else {
                delete this.columns.find(x => x.sort).sort
                sortColumn.sort = 'asc'
            }
        }

        this.saveSettings({columns: this.columns});
        this.render();
    }
    
    showColumnPopover (e) {
        const button = e.delegateTarget;
        button.closest('thead').classList.add('-active');
        button.closest('th').classList.add('-active');
        button.classList.add('-active');
        
        if (!button.popover) {
            const headerCell = button.closest('th');
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
            
            if (columnModel.sort) {
                actions.unshift(
                    listenerElement({
                        class: 'block hover:text-blue hover:bg-blue-10 rounded pad-1/2x cursor-pointer',
                        content: 'Sort A to Z'
                    }, e => {
                        button.popover.hide();
                        this.selectSort({delegateTarget: button}, 'asc');
                    }),
                    listenerElement({
                        class: 'block hover:text-blue hover:bg-blue-10 rounded pad-1/2x cursor-pointer',
                        content: 'Sort Z to A'
                    }, e => {
                        button.popover.hide();
                        this.selectSort({delegateTarget: button}, 'desc');
                    })
                )
            }
            
            button.popover = new Popover({
                anchor: button,
                align: '0px bottom',
                content: createElement({
                    class: 'shadow shadow-opacity-40 bg-white rounded pad-1/2x text-sm',
                    content: actions
                })
            }).render()
        
            button.popover.addEventListener('hidden', () => {
                button.closest('thead').classList.remove('-active');
                button.closest('th').classList.remove('-active');
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
                    class: 'js-move cursor-move opacity-0 group-hover:opacity-100',
                    children: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.28 20" style="width:9px"><path d="M4.27,13.05a.54.54,0,0,0-.75,0,.53.53,0,0,0,0,.75l6.1,6a.54.54,0,0,0,.76,0l6.1-6a.53.53,0,0,0,0-.75.54.54,0,0,0-.75,0L10,18.56Z" transform="translate(-3.36 0)"/><path d="M15.73,6.94a.53.53,0,0,0,.75-.75l-6.1-6a.54.54,0,0,0-.76,0l-6.1,6a.53.53,0,1,0,.75.75L10,1.43Z" transform="translate(-3.36 0)"/></svg>`
                }]
            }))
        })
    }
    
    showSettingsModal () {
        let modal;
        let settings = this.readSettings();
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
                        this.initColumns();
                        this.render()
                        modal.close()
                    })
                ]
            }]
        })
        
        addEventListenerFor(container, 'input', 'change', e => {
            if(e.delegateTarget.checked) {
                settings.columns.push({id: e.delegateTarget.value})
                includedEl.append(e.delegateTarget.closest('div'))
            } else {
                settings.columns = settings.columns.filter(x => x.id != e.delegateTarget.value)
                excludedEl.append(e.delegateTarget.closest('div'))
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
    }
    
    /*
        Column Resizing
    */
    initiateColumnResize (e) {
        e.delegateTarget.closest('th').classList.add('-active');
        e.delegateTarget.closest('thead').classList.add('-active');
        e.delegateTarget.classList.add('-hover');
        
        window.addEventListener('mousemove', this.columnResize)
        window.addEventListener('mouseup', this.endColumnResize)
        
        this.el.querySelectorAll('thead th').forEach((el, i) => {
            el.style.width = el.offsetWidth + "px"
            const column = this.columns.find(x => x.id == el.id)
            if (column) {
                column.width = innerWidth(el) + "px"
            }
        })
        
        this.resizingColumn = e.delegateTarget.closest('th').previousElementSibling
        this.startPageX = e.pageX
        this.startWidth = this.resizingColumn.offsetWidth
        
        this.el.querySelectorAll(`.col-${this.resizingColumn.id}`).forEach(el => {
            el.classList.add('-resizing')
        })
    }
    
    columnResize (e) {
        let newWidth = this.startWidth + (e.pageX - this.startPageX)
        this.resizingColumn.style.width = newWidth + "px"
    }
  
    endColumnResize (e) {
        window.removeEventListener('mousemove', this.columnResize)
        window.removeEventListener('mouseup', this.endColumnResize)
        this.columns.find(x => x.id == this.resizingColumn.id).width = this.resizingColumn.style.width
        this.el.querySelectorAll(`.-resizing`).forEach(el => {
            el.classList.remove('-resizing')
        })
        this.el.querySelector('.uniformTable-resize-handle.-hover').classList.remove('-hover')
        this.el.querySelector('thead.-active').classList.remove('-active')
        this.el.querySelector('th.-active').classList.remove('-active')
        this.saveSettings({columns: this.columns});
    }
    
}

const gearIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-settings\"><circle cx=\"12\" cy=\"12\" r=\"3\"></circle><path d=\"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z\"></path></svg>"
const downCaretIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"28\" height=\"28\" viewBox=\"0 0 28 28\" fill=\"currentColor\" stroke=\"none\"><path d=\"M22,10.5c0,0.271-0.1,0.505-0.297,0.703l-7,7C14.505,18.4,14.271,18.5,14,18.5s-0.505-0.1-0.703-0.297l-7-7  C6.099,11.005,6,10.771,6,10.5s0.099-0.505,0.297-0.703C6.495,9.599,6.729,9.5,7,9.5h14c0.271,0,0.505,0.099,0.703,0.297  C21.9,9.995,22,10.229,22,10.5z\"/></svg>"