this.uniform = this.uniform || {};
this.uniform.js = (function (exports) {
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
                console.log(object[key], key);
                if (object[key]) newObject[key] = object[key];
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
                square: false,
                content: "[content required]"
            };

            console.log(this.pick(options, Object.keys(this.options)), Object.keys(this.options));
            Object.assign(this.options, this.pick(options, Object.keys(this.options)));
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

var plugins$$1 = (function ($) {
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
            if (el.data('dropdown-content') !== undefined) options.content = "<div class='pad'>`el.data('dropdown-content'))`</div>";
            if (el.data('dropdown-target') !== undefined) options.content = $(el.data('dropdown-target'));
            var dropdown = new Dropdown(options);
            dropdown.on('*', function (event_key, dropdown) {
                el.trigger('dropdown-' + event_key, dropdown);
            });
            dropdown.render();
        });
    };
})($);

exports.Dropdown = Dropdown;
exports.Plugins = plugins$$1;

return exports;

}({}));
