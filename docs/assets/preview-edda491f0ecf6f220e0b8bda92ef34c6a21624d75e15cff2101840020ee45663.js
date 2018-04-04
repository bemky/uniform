this.preview = this.preview || {};
(function () {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
    function Component(options) {
        _classCallCheck(this, Component);

        this.eventListeners = new Array();
        if (options.el) {
            this.$el = options.el instanceof $ ? options.el : $(options.el);
        } else {
            this.$el = $('<div>');
        }
        this.el = this.$el[0];

        this.on = function (type, handler) {
            this.eventListeners.push({
                type: type,
                handler: handler
            });
        };

        this.trigger = function (event_key) {
            for (var i = 0; i < this.eventListeners.length; i++) {
                if (this.eventListeners[i].type == "*" || this.eventListeners[i].type == "all" || event_key == this.eventListeners[i].type) {
                    this.eventListeners[i].handler(event_key, this);
                }
            }
        };

        this.initialize(options);
    }

    _createClass(Component, [{
        key: "pick",
        value: function pick(object, keys) {
            var newObject = {};
            keys.forEach(function (key) {
                if (object[key] !== undefined) newObject[key] = object[key];
            });

            return newObject;
        }
    }, {
        key: "initialize",
        value: function initialize() {}
    }]);

    return Component;
}();

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*. Dropdown.initialize
    content:    string|$el - content rendered in dropdown
    align:      'center'|'left'|'right| - how dropdown aligns to trigger el
    trigger:    'click'|'focus'|'mouseover' - what triggers showDropdown
    show_arrow: true\false - show dropdown arrow
    hide_sm:    true|false - don't show dropdown on mobile browsers
    square:     true|false - round corners on dropdown
*/

var Dropdown = function (_Component) {
    _inherits(Dropdown, _Component);

    function Dropdown() {
        _classCallCheck$1(this, Dropdown);

        return _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).apply(this, arguments));
    }

    _createClass$1(Dropdown, [{
        key: 'initialize',
        value: function initialize(options) {
            options = options || {};
            this.options = {
                align: 'center',
                trigger: 'click focus',
                show_arrow: true,
                hide_sm: false,
                square: false
            };

            Object.assign(this.options, this.pick(options, Object.keys(this.options)));
            this.content = options.content;
            this.$el[0].dropdown = this;

            this.$el.on(this.options.trigger, this.toggle.bind(this));
            $(window).on('resize', this.resize.bind(this));
            $(document).on(this.options.trigger, this.outsideClick.bind(this));
            $(document).on('keyup', this.keyup.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            this.dropdown = $("<div class='uniformDropdown-dropdown absolute'>");
            this.dropdown.css({
                minWidth: this.$el.outerWidth()
            });
            if (this.options.show_arrow) {
                this.dropdown.addClass('has-pointer');
                this.dropdown.append("<div class='uniformDropdown-pointer'></div>");
            }
            this.dropdown.toggleClass('square', this.options.square);
            this.dropdown.hide();
            this.dropdown.append(this.content);
            this.dropdown.appendTo($('body'));
            this.dropdown.find('.hidden').removeClass('hidden');

            this.resize();
            return this;
        }
    }, {
        key: 'resize',
        value: function resize() {
            if (!this.dropdown) return;
            var position = {
                top: this.$el.offset().top + this.$el.outerHeight()
            };
            if (this.options.align == "center") {
                position.left = this.$el.offset().left + this.$el.outerWidth() / 2 - this.dropdown.outerWidth() / 2;
            } else if (this.options.align == "right") {
                position.right = $(window).width() - (this.$el.offset().left + this.$el.outerWidth());
            } else {
                position.left = this.$el.offset().left;
            }
            if (position.left && position.left + this.dropdown.outerWidth() > $(window).width()) {
                position.left = $(window).width() - this.dropdown.outerWidth();
            }
            this.dropdown.css(position);
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.$el.remove();
            this.$el.off(this.options.trigger);
            $(window).off('resize', this.resize.bind(this));
            $(document).off(this.options.trigger, this.outsideClick.bind(this));
            $(document).off('keyup', this.keyup.bind(this));
        }
    }, {
        key: 'toggle',
        value: function toggle() {
            if (this.$el.hasClass('active')) {
                this.hide();
            } else {
                this.show();
            }
        }
    }, {
        key: 'show',
        value: function show() {
            if (this.options.hide_sm && $(window).width() < 720) return;
            if (!this.dropdown) this.render();

            this.dropdown.show();
            this.$el.addClass('active');

            this.overlay = $("<div class='uniformOverlay'>");
            $('body').append(this.overlay);

            if ($(window).width() < 720) {
                this.lastScrollPosition = $(window).scrollTop();
                $('body').addClass('uniformModal-hideBody');
            }

            this.overlay.click(this.hide.bind(this));
            this.trigger('shown');
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (!this.dropdown) return;
            this.dropdown.hide();
            this.$el.removeClass('active');
            if (this.overlay) this.overlay.remove();
            if ($(window).width() < 720) {
                $('body').removeClass('uniformModal-hideBody');
                $(window).scrollTop(this.lastScrollPosition);
            }
            this.trigger('hidden');
        }
    }, {
        key: 'outsideClick',
        value: function outsideClick(e) {
            if (!this.dropdown || !this.dropdown.is(":visible")) return;
            if (e.target === this.$el[0]) return;
            if (e.target === this.overlay) return;
            if ($.contains(this.$el[0], e.target)) return;
            if ($.contains(this.dropdown[0], e.target)) return;
            this.hide();
        }
    }, {
        key: 'keyup',
        value: function keyup(e) {
            if (e.which != 27) return;
            this.hide();
        }
    }]);

    return Dropdown;
}(Component);

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Checkbox = function (_Component) {
    _inherits$1(Checkbox, _Component);

    function Checkbox() {
        _classCallCheck$2(this, Checkbox);

        return _possibleConstructorReturn$1(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
    }

    _createClass$2(Checkbox, [{
        key: 'initialize',
        value: function initialize(options) {
            this.$el.on('change', this.change.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var type = this.$el.hasClass('uniformRadio') ? 'uniformRadio' : 'uniformCheckbox';
            this.checkbox = $('<div class="' + type + '-indicator">');
            this.checkbox.addClass(this.$el.attr('class').replace(type, ''));
            this.checkbox.toggleClass('checked', this.$el.prop('checked'));
            this.$el.after(this.checkbox);
            this.checkbox.click(this.click.bind(this));
            return this;
        }
    }, {
        key: 'click',
        value: function click() {
            if (this.$el.prop('disabled')) return;
            this.$el.prop('checked', !this.$el.prop('checked'));
            this.$el.trigger('change');
            e.preventDefault();
        }
    }, {
        key: 'change',
        value: function change() {
            this.checkbox.toggleClass('checked', this.$el.prop('checked'));
        }
    }]);

    return Checkbox;
}(Component);

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$2(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*  UniformModal.initialize
    Options
    content:    string|$el|function
    klass:      string - classes to append to modal container
*/

var Modal = function (_Component) {
    _inherits$2(Modal, _Component);

    function Modal() {
        _classCallCheck$3(this, Modal);

        return _possibleConstructorReturn$2(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).apply(this, arguments));
    }

    _createClass$3(Modal, [{
        key: 'initialize',
        value: function initialize(options) {
            this.options = {
                klass: false
            };
            $.extend(this.options, this.pick(options, ['klass']));
            this.content = options.content;

            this.$el.addClass('uniformModal');
            $(document).on('keyup', this.keyup.bind(this));
            this.$el.on('click', '.uniformModal-close', this.close.bind(this));
        }
    }, {
        key: 'keyup',
        value: function keyup(e) {
            if (e.which != 27) return;
            this.close();
        }
    }, {
        key: 'render',
        value: function render() {
            var content = typeof this.content == 'function' ? this.content() : this.content;
            if (!(content instanceof jQuery)) content = $("<div>").html(content);

            this.highest_z_index = 0;
            this.overlay = $('<div class="uniformModal-overlay"></div>');
            this.blur = $('<div class="uniformModal-blur"></div>');
            this.original_scroll = window.scrollY;
            this.blur.css('top', 0 - this.original_scroll + "px");

            if ($('.uniformModal').length > 0) {
                this.highest_z_index = Math.max($('.uniformModal').map(function () {
                    return parseInt($(this).css('zIndex'));
                }));
                this.$el.css('zIndex', this.highest_z_index + 2);
            }
            this.$el.append(this.overlay);
            this.blur.append($('body').children());

            $('body').addClass('uniformModal-active');
            $('body').append(this.blur);
            $('body').append(this.$el);

            var container = $('<div class="uniformModal-container">');
            container.append(content);

            container.append('<div class="uniformModal-close"></div>');
            this.$el.css('top', $(window).scrollTop());
            this.overlay.click(this.close.bind(this));
            this.$el.append(container);

            if (this.options.klass) container.addClass(this.options.klass);
            if (content instanceof $) content.trigger('rendered');
            this.trigger('rendered');

            return this;
        }
    }, {
        key: 'close',
        value: function close() {
            $('.uniformModal-active').removeClass('uniformModal-active');
            $('body').append(this.blur.children());
            this.blur.remove();
            $(window).scrollTop(this.original_scroll);
            this.trigger('closed');
            this.remove();
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.overlay.remove();
            this.$el.remove();
            this.$el.off('click');
            this.overlay.off('click');
            $(document).off('keyup', this.keyup.bind(this));
        }
    }]);

    return Modal;
}(Component);

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$3(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$3(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
    options
    class: String, appended to uniformSelect-edit button as class
    limit: int | false - number of options to limit to, or false to not limit
    showAll: function(select_options) to run if/when "Show All" is clicked
*/

var Select = function (_Component) {
    _inherits$3(Select, _Component);

    function Select() {
        _classCallCheck$4(this, Select);

        return _possibleConstructorReturn$3(this, (Select.__proto__ || Object.getPrototypeOf(Select)).apply(this, arguments));
    }

    _createClass$4(Select, [{
        key: 'initialize',
        value: function initialize() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.options = {
                class: "",
                showAll: function showAll(select_options) {
                    select_options.find('.uniformSelect-show-all').remove();
                    select_options.find('button.hidden').removeClass('hidden');
                    return false;
                },
                limit: 8
            };

            Object.assign(this.options, this.pick(options, Object.keys(this.options)));

            this.$el.on('change', this.updateSelect.bind(this));
            this.$el.on('close', this.hideOptions.bind(this));
            this.$el.on('revealed', this.resize.bind(this));
            this.el.uniformSelect = this.container;

            $(window).on('resize', this.resize.bind(this));
            $(window).on('scroll', this.updatePosition.bind(this));
            $(document).on('click', this.outsideClick.bind(this));
            $(document).on('keyup', this.keyup.bind(this));
        }
    }, {
        key: 'outsideClick',
        value: function outsideClick(e) {
            if (!this.showing) return;
            if (e.target === this.select_options[0]) return;
            if ($.contains(this.container[0], e.target)) return;
            if ($.contains(this.select_options[0], e.target)) return;
            this.hideOptions();
        }
    }, {
        key: 'keyup',
        value: function keyup(e) {
            if (e.which === 27) this.hideOptions();
        }
    }, {
        key: 'render',
        value: function render() {
            this.container = $("<div class='uniformSelect-this.container'></div>");
            this.edit_button = $('<button type=\'button\' class=\'uniformSelect-edit uniformInput outline block ' + this.options.class + '\'></button>');
            this.container.append(this.edit_button);

            if (this.$el.attr('name')) {
                this.container.addClass(this.$el.attr('name').toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
            }
            this.$el.hide();
            this.$el.before(this.container);
            this.updateSelect();
            this.resize();

            this.edit_button.on('click', this.showOptions.bind(this));
        }
    }, {
        key: 'resize',
        value: function resize() {
            // to keep button from extending beyond available width
            var text = edit_button.text();
            this.edit_button.text('');
            this.edit_button.css({
                width: 'auto'
            });
            this.edit_button.css({
                width: this.container.outerWidth()
            });
            this.edit_button.text(text);

            if (typeof this.select_options === "undefined") return;
            this.select_options.css({
                position: 'absolute',
                top: this.container.offset().top + this.container.outerHeight(),
                left: this.container.offset().left,
                minWidth: this.container.outerWidth()
            });
        }
    }, {
        key: 'renderOptions',
        value: function renderOptions() {
            this.select_options = $("<div class='uniformSelect-options'>");
            if (this.$el.attr('name')) {
                this.select_options.addClass(this.$el.attr('name').toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
            }
            this.select_options.css({
                fontSize: this.$el.css('font-size')
            });
            this.select_options.hide();
            this.select_options.appendTo('body');
            this.$el.find('option').each(function (index, el) {
                var button = $("<button type='button' class='uniformSelect-option block outline text-left'>");
                button[0].option = $(el);
                button.text($(el).text());
                button.attr('value', $(el).val());
                if (button.text() == "") button.html("<span class='text-italic text-muted'>None</span>");
                if ($(el).prop('selected')) {
                    button.addClass('active');
                } else if (this.options.limit && index > this.options.limit) {
                    button.addClass('hidden');
                }
                this.select_options.append(button);
                button.click(this.selectOption.bind(this));
            });

            var actions_el = $('<div class="uniformSelect-options-actions">');
            if (this.options.limit && this.$el.find('option').length > this.options.limit) {
                var show_all_button = $("<button type='button' class='uniformSelect-show-all block outline blue' style='border: none'>Show All</button>");
                show_all_button.click(function (e) {
                    this.options.showAll(this.select_options);
                    return false;
                });
                actions_el.append(show_all_button);
            }
            if (this.$el.prop('multiple')) {
                var done_button = $("<button type='button' class='uniformSelect-done block outline blue'>Done</button>");
                done_button.click(this.hideOptions.bind(this));
                actions_el.append(done_button);
            }
            if (!actions_el.is(':empty')) {
                this.select_options.append(actions_el);
            }

            this.$el.trigger('rendered', this.select_options);
        }
    }, {
        key: 'hideOptions',
        value: function hideOptions() {
            if (typeof this.select_options === "undefined") return;
            this.showing = false;
            this.select_options.hide();
            this.select_options.removeClass('fixed');
            $('body').removeClass('uniformModal-hideBody');
            if (this.lastScrollPosition) $(window).scrollTop(this.lastScrollPosition);
            this.$el.trigger('hidden:options');
        }
    }, {
        key: 'showOptions',
        value: function showOptions() {
            if (this.showing) {
                hideOptions();
                return false;
            }
            this.showing = true;
            if (!this.select_options) this.renderOptions();
            this.resize();
            this.select_options.show();

            this.lastScrollPosition = $(window).scrollTop();
            updatePosition();
            $('body').addClass('uniformModal-hideBody');
        }
    }, {
        key: 'selectOption',
        value: function selectOption(e) {
            if (!this.$el.prop('multiple')) {
                this.$el.find("option:selected").prop('selected', false);
                this.select_options.find('.uniformSelect-option.active').removeClass('active');
            }
            $(e.currentTarget).toggleClass('active');
            e.currentTarget.option.prop('selected', $(e.currentTarget).hasClass('active'));
            this.$el.trigger('change');
        }
    }, {
        key: 'updateSelect',
        value: function updateSelect() {
            if (!this.$el.prop('multiple')) hideOptions();
            var value = $.map(this.$el.find('option:selected'), function (el) {
                return $(el).text();
            }).join(", ");
            if (value == "") value = "&nbsp;";
            this.edit_button.html(value);
        }
    }, {
        key: 'updatePosition',
        value: function updatePosition() {
            if (!this.select_options) return;

            if (this.select_options.hasClass('fixed')) {
                if (this.container.fixedParents().length == 0) {
                    this.select_options.css({
                        position: 'absolute',
                        top: this.container.offset().top + this.container.outerHeight()
                    });
                    this.select_options.removeClass('fixed');
                }
            } else if (this.container.fixedParents().length > 0) {
                this.lastScrollPosition = false;
                this.select_options.css({
                    position: 'fixed'
                });
                this.select_options.offset({
                    top: this.container.offset().top + this.container.outerHeight(),
                    left: this.container.offset().left
                });
                this.select_options.addClass('fixed');
            }
        }
    }]);

    return Select;
}(Component);

var _createClass$5 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$4(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$4(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FloatingLabel = function (_Component) {
    _inherits$4(FloatingLabel, _Component);

    function FloatingLabel() {
        _classCallCheck$5(this, FloatingLabel);

        return _possibleConstructorReturn$4(this, (FloatingLabel.__proto__ || Object.getPrototypeOf(FloatingLabel)).apply(this, arguments));
    }

    _createClass$5(FloatingLabel, [{
        key: 'initialize',
        value: function initialize() {
            this.label = this.$el.find('label');
            this.input = $("#" + this.label.prop('for'));
            this.startingHeight;

            this.input.focus(this.activate.bind(this));
            this.input.blur(this.deactivate.bind(this));
            this.input.on('revealed', this.render.bind(this));
            if (typeof this.input.val() !== "undefined" && this.input.val() != "") this.activate();
            if (this.input.is(":focus")) this.activate();
        }
    }, {
        key: 'render',
        value: function render() {
            if (!this.input.is(":visible")) return;
            if (this.$el.hasClass('enabled')) return;

            var padding = parseInt(this.input.css('paddingBottom'));
            this.startingHeight = this.input.outerHeight();
            this.$el.addClass('enabled');
            this.$el.addClass('inactive');

            this.input.css({
                paddingTop: padding + padding / 2 + "px",
                paddingBottom: padding - padding / 2 - 2 + "px"
            });

            this.label.css({
                position: 'absolute',
                top: 0,
                left: this.label.position().left,
                paddingLeft: this.input.css("paddingLeft"),
                height: this.startingHeight,
                lineHeight: this.startingHeight + "px"
            });
        }
    }, {
        key: 'activate',
        value: function activate(e) {
            if (typeof e !== "undefined") this.$el.addClass('active');
            if (this.$el.hasClass('float')) return;
            this.$el.addClass('float');
            this.$el.removeClass('inactive');
            this.label.css({
                lineHeight: this.startingHeight / 2 + "px"
            });
        }
    }, {
        key: 'deactivate',
        value: function deactivate(e) {
            if (typeof e !== "undefined") this.$el.removeClass('active');
            if (this.input.val() != "") return;
            this.$el.removeClass('float');
            this.$el.addClass('inactive');
            this.label.css({
                lineHeight: this.startingHeight + "px"
            });
        }
    }]);

    return FloatingLabel;
}(Component);

var _createClass$6 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$5(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$5(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Resizer = function (_Component) {
    _inherits$5(Resizer, _Component);

    function Resizer() {
        _classCallCheck$6(this, Resizer);

        return _possibleConstructorReturn$5(this, (Resizer.__proto__ || Object.getPrototypeOf(Resizer)).apply(this, arguments));
    }

    _createClass$6(Resizer, [{
        key: 'initialize',
        value: function initialize() {
            $(window).resize(this.resize.bind(this));
            $(window).trigger('resize');
        }
    }, {
        key: 'resize',
        value: function resize() {
            // breakpoints at 720, 1080, 1440
            var width = this.$el.width();

            if (width > 720 && !this.$el.hasClass('md-size')) {
                this.$el.addClass('md-size');
            } else if (width < 720 && this.$el.hasClass('md-size')) {
                this.$el.removeClass('md-size');
            }

            if (width > 1080 && !this.$el.hasClass('lg-size')) {
                this.$el.addClass('lg-size');
            } else if (width < 1080 && this.$el.hasClass('lg-size')) {
                this.$el.removeClass('lg-size');
            }

            if (width > 1440 && !this.$el.hasClass('xl-size')) {
                this.$el.addClass('xl-size');
            } else if (width < 1440 && this.$el.hasClass('xl-size')) {
                this.$el.removeClass('xl-size');
            }

            console.log(width);
            if (width < 720 && !this.$el.hasClass('sm-size')) {
                this.$el.addClass('sm-size');
            } else if (width > 720 && this.$el.hasClass('sm-size')) {
                this.$el.removeClass('sm-size');
            }
        }
    }]);

    return Resizer;
}(Component);

var _createClass$7 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn$6(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits$6(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tooltip = function (_Component) {
    _inherits$6(Tooltip, _Component);

    function Tooltip() {
        _classCallCheck$7(this, Tooltip);

        return _possibleConstructorReturn$6(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).apply(this, arguments));
    }

    _createClass$7(Tooltip, [{
        key: 'initialize',
        value: function initialize(options) {
            this.enabled = true;
            this.message = options.message;
            options.el.tooltip = this;

            this.$el.on('mouseenter', this.show.bind(this));
            this.$el.on('mouseleave', this.hide.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            this.popup = $('<div class="' + UniformComponent.namespace + 'uniformTooltip-popup">' + this.message + '</div>');
            this.popup.prepend("<div class='" + UniformComponent.namespace + "uniformTooltip-pointer'></div>");
            this.$el.append(this.popup);
            if (this.message.length > 100) {
                this.popup.css({
                    minWidth: "200px"
                });
            } else {
                this.popup.css({
                    whiteSpace: "nowrap"
                });
            }
            if (this.popup.outerWidth(true) + this.popup.offset().left > $(window).width()) {
                this.popup.css({
                    left: $(window).width() - this.popup.outerWidth(true) - this.popup.offset().left
                });
            }
            return this;
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.$el.remove();
        }
    }, {
        key: 'show',
        value: function show() {
            if (!this.popup) this.render();
            if (!this.enabled) return;

            if (this.hiding) return this.show_after_hide = true;
            if (this.showing || this.shown) return;
            this.popup.css('display', 'block');
            this.showing = true;
            this.hidden = false;
            this.popup.animate({
                bottom: "100%",
                opacity: 1
            }, 200, function () {
                this.showing = false;
                this.shown = true;
                if (this.hide_after_show) this.hide();
                this.hide_after_show = false;
            }.bind(this));

            if (this.popup.offset().left < 0) {
                this.popup.css({
                    left: 0
                });
            }
            this.trigger('shown');
        }
    }, {
        key: 'hide',
        value: function hide() {
            if (this.showing) return this.show_after_hide = true;
            if (this.hiding || this.hidden) return;
            this.hiding = true;
            this.shown = false;
            this.popup.animate({
                bottom: 0,
                opacity: 0
            }, 200, function () {
                this.popup.css('display', 'none');
                this.hiding = false;
                this.hidden = true;
                this.trigger('hidden');
                if (this.show_after_hide) this.show();
                this.show_after_hide = false;
            }.bind(this));
        }
    }, {
        key: 'disable',
        value: function disable() {
            this.enabled = false;
        }
    }, {
        key: 'enabled',
        value: function enabled() {
            this.enabled = true;
        }
    }]);

    return Tooltip;
}(Component);

(function ($) {

    /*
        Dropdown
    */
    $.fn.uniformDropdown = function () {
        return this.each(function () {
            var el = $(this);
            var options = {
                el: this
            };

            if (el.data('dropdown-align') !== undefined) options.align = el.data('dropdown-align');
            if (el.data('dropdown-trigger') !== undefined) options.trigger = el.data('dropdown-trigger');
            if (el.data('dropdown-show_arrow') !== undefined) options.show_arrow = el.data('dropdown-show_arrow');
            if (el.data('dropdown-square') !== undefined) options.square = el.data('dropdown-square');
            if (el.data('dropdown-hide_sm') !== undefined) options.hide_sm = el.data('dropdown-hide_sm');
            if (el.data('dropdown-content') !== undefined) options.content = '<div class=\'pad\'>' + el.data('dropdown-content') + '</div>';
            if (el.data('dropdown-target') !== undefined) options.content = $(el.data('dropdown-target'));
            var dropdown = new Dropdown(options);
            dropdown.on('*', function (event_key, dropdown) {
                el.trigger('dropdown-' + event_key, dropdown);
            });
            dropdown.render();
        });
    };

    /*
        Checkbox
    */
    $.fn.uniformCheckbox = function () {
        return this.each(function () {
            var el = $(this);
            var checkbox = new Checkbox({
                el: this
            });
            checkbox.render();
        });
    };
    $.fn.uniformRadio = $.fn.uniformCheckbox;

    /*
        FloatingLabel
    */
    $.fn.uniformFloatingLabel = function () {
        return this.each(function () {
            new FloatingLabel({
                el: this
            }).render();
        });
    };

    /*
        Modal
    */
    $.fn.uniformModal = function () {
        return this.each(function () {
            var el = $(this);
            var options = {
                klass: el.data('modal-klass'),
                content: el.data('modal-content')
            };
            if (el.data('modal-target')) {
                options.content = $(el.data('modal-target')).clone();
                options.content.removeClass('hidden');
            }
            var modal = new Modal(options);
            modal.on('*', function (event_type, modal) {
                el.trigger('modal-' + type, modal);
            });
            modal.render();
        });
    };

    /*
        Resizer
    */
    $.fn.uniformResizer = function () {
        return this.each(function () {
            new Resizer({
                el: this
            });
        });
    };

    /*
        Select
    */
    $.fn.uniformSelect = function () {
        return this.each(function () {
            new Select({
                el: this
            }).render();
        });
    };

    /*
        Tooltip
    */
    $.fn.uniformTooltip = function () {
        return this.each(function () {
            var el = $(this);
            var tooltip = new UniformTooltip({
                message: el.data('tooltip-message'),
                el: this
            });
            tooltip.on('*', function (event_type, tooltip) {
                el.trigger('tooltip-' + event_type, tooltip);
            });
            tooltip.render();
        });
    };
})($);

$(document).ready(function () {
    hljs.initHighlightingOnLoad();
    $('.uniformDropdown').uniformDropdown();
    $('.uniformCheckbox').uniformCheckbox();
    $('.uniformRadio').uniformRadio();
    $('.uniformFloatingLabel').uniformFloatingLabel();
    $('.uniformSelect').uniformSelect();
    $('.uniformDropdown').uniformDropdown();
    $('.uniformTooltip').uniformTooltip();
    $('.uniformResizer').uniformResizer();
    $('.launchUniformModal').uniformModal();

    $('.uniformCardToggle').click(function () {
        $(this).parents('.uniformCard').toggleClass('expanded').trigger('expand-toggle');
    });

    $(window).on('expand-toggle', function (e) {
        var target = $(e.target).find('.uniformCard-collapse');
        target.toggle(target.parents('.expanded').length == 0);
        target.slideToggle(100);
    });

    $('.uniformInputGroup').on('focus', 'input', function (e) {
        $(this).closest('.uniformInputGroup').addClass('focus');
    });
    $('.uniformInputGroup').on('blur', 'input', function (e) {
        $(this).closest('.uniformInputGroup').removeClass('focus');
    });
});

}());
