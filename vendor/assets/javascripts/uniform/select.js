/*
    options
    class: String, appended to uniformSelect-edit button as class
    limit: int | false - number of options to limit to, or false to not limit
    showAll: function(select_options) to run if/when "Show All" is clicked
*/
(function( $ ) {
    $.fn.fixedParents = function (selector) {
        return this.parents().filter(function (){
            return $(this).css('position') == 'fixed';
        })
    }
    
    $.fn.uniformSelect = function(options) {
        options = $.extend({
            class: "",
            showAll: function (select_options){
                select_options.find('.uniformSelect-show-all').remove();
                select_options.find('button.hidden').removeClass('hidden');
                return false;
            },
            limit: 8
        }, options);
        
        return this.each(function(){
            var showing, lastScrollPosition, select_options;
            var select = $(this);
            var container = $("<div class='uniformSelect-container'></div>")
            var edit_button = $("<button type='button' class='uniformSelect-edit uniformInput outline block" + options.class + "'></button>");
            container.append(edit_button);
            if (select.attr('name')) {
                container.addClass(select.attr('name').toLowerCase().replace(/[^a-z0-9\-_]+/g, seperator || '-'));
            }

            select.hide();
            select.before(container);


            function updateSelectValue() {
                if (!select.prop('multiple')) hideOptions();
                var value = $.map(select.find('option:selected'), function(el){
                    return $(el).text();
                }).join(", ");
                if (value == "") value = "&nbsp;"
                edit_button.html(value);
            }
            
            function resize () {
                // to keep button from extending beyond available width
                var text = edit_button.text();
                edit_button.text('');
                edit_button.css({
                    width: 'auto'
                })
                edit_button.css({
                    width: container.outerWidth()
                })
                edit_button.text(text);
        
                if(typeof select_options === "undefined") return;
                select_options.css({
                    position: 'absolute',
                    top: container.offset().top + container.outerHeight(),
                    left: container.offset().left,
                    minWidth: container.outerWidth()
                });
            }
            
            function renderOptions() {
                select_options = $("<div class='uniformSelect-options'>");
                if (select.attr('name')) {
                    select_options.addClass(select.attr('name').toLowerCase().replace(/[^a-z0-9\-_]+/g, seperator || '-'));
                }
                select_options.css({
                    fontSize: select.css('font-size')
                })
                select_options.hide();
                select_options.appendTo('body');
                select.find('option').each(function(index, el){
                    var button = $("<button type='button' class='uniformSelect-option block outline text-left'>");
                    button[0].option = $(el);
                    button.text($(el).text());
                    button.attr('value', $(el).val());
                    if (button.text() == "") button.html("<span class='text-italic text-muted'>None</span>");
                    if($(el).prop('selected')){
                        button.addClass('active');
                    } else if (options.limit && index > options.limit) {
                        button.addClass('hidden');
                    }
                    select_options.append(button);
                    button.click(selectOption);
                });
        
                var actions_el = $('<div class="uniformSelect-options-actions">');
                if (options.limit && select.find('option').length > options.limit) {
                    var show_all_button = $("<button type='button' class='uniformSelect-show-all block outline blue' style='border: none'>Show All</button>");
                    show_all_button.click(function(e){
                        options.showAll(select_options);
                        return false;
                    });
                    actions_el.append(show_all_button);
                }
                if (select.prop('multiple')) {
                    var done_button = $("<button type='button' class='uniformSelect-done block outline blue'>Done</button>")
                    done_button.click(hideOptions);
                    actions_el.append(done_button);
                }
                if (!actions_el.is(':empty')) {
                    select_options.append(actions_el);
                }
        
                select.trigger('rendered', select_options);
            }
            
            function hideOptions () {
                if(typeof select_options === "undefined") return;
                showing = false;
                select_options.hide();
                select_options.removeClass('fixed');
                $('body').removeClass('uniformModal-hideBody');
                if(lastScrollPosition) $(window).scrollTop(lastScrollPosition);
                select.trigger('hidden:options');
            }
            
            function showOptions() {
                if (showing){
                    hideOptions();
                    return false;
                }
                showing = true;
                if(!select_options) renderOptions();
                resize();
                select_options.show();
        
                lastScrollPosition = $(window).scrollTop();
                updatePosition();
                $('body').addClass('uniformModal-hideBody');
            }
            
            function selectOption(e) {
                if (!select.prop('multiple')) {
                    select.find("option:selected").prop('selected', false);
                    select_options.find('.uniformSelect-option.active').removeClass('active');
                }
                $(e.currentTarget).toggleClass('active');
                e.currentTarget.option.prop('selected', $(e.currentTarget).hasClass('active'));
                select.trigger('change');
            }
            
            function updatePosition () {
                if(!select_options) return;
        
                if (select_options.hasClass('fixed')) {
                    if (container.fixedParents().length == 0) {
                        select_options.css({
                            position: 'absolute',
                            top: container.offset().top + container.outerHeight(),
                        });
                        select_options.removeClass('fixed');
                    }
                } else if(container.fixedParents().length > 0) {
                    lastScrollPosition = false;
                    select_options.css({
                        position: 'fixed',
                    });
                    select_options.offset({
                        top: container.offset().top + container.outerHeight(),
                        left: container.offset().left
                    })
                    select_options.addClass('fixed');
                }
            }
            
            
            updateSelectValue();
            resize();
            
            edit_button.on('click', showOptions);
            
            select.on('change', updateSelectValue);
            select.on('close', hideOptions);
            select.on('revealed', resize);
            select[0].uniformSelect = container;

            $(window).on('resize', resize);
            $(window).on('scroll', updatePosition);
            $(document).on('click', function(e){
                if (!showing) return;
                if (e.target === select_options[0]) return;
                if ($.contains(container[0], e.target)) return;
                if ($.contains(select_options[0], e.target)) return;
                hideOptions();
            });
            $(document).on('keyup', function(e) {
                if(e.which === 27) hideOptions();
            });
        });
    };
 
}( jQuery ));