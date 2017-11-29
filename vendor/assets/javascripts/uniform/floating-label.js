(function( $ ) {
 
    $.fn.uniformFloatingLabel = function() {
        return this.each(function(){
            var el = $(this);
            var label = el.find('label');
            var input = $("#" + label.prop('for'));
            var startingHeight;
    
            function render(e) {
                if(!input.is(":visible")) return;
                if(el.hasClass('enabled')) return;
        
                var padding = parseInt(input.css('paddingBottom'));
                startingHeight = input.outerHeight();
                el.addClass('enabled');
                el.addClass('inactive');
        
                input.css({
                    paddingTop: padding + padding/2 + "px",
                    paddingBottom: padding - padding/2 - 2 + "px"
                });

                label.css({
                    position: 'absolute',
                    top: 0,
                    left: label.position().left,
                    paddingLeft: input.css("paddingLeft"),
                    height: startingHeight,
                    lineHeight: startingHeight + "px"
                });
            }

            function activate (e) {
                if (typeof e !== "undefined") el.addClass('active');
                if (el.hasClass('float')) return;
                el.addClass('float');
                el.removeClass('inactive');
                label.css({
                    lineHeight: startingHeight / 2 + "px"
                });
            }

            function deactivate (e) {
                if (typeof e !== "undefined") el.removeClass('active');
                if (input.val() != "") return;
                el.removeClass('float');
                el.addClass('inactive');
                label.css({
                    lineHeight: startingHeight + "px"
                });
            }
    
            render();
            input.focus(activate);
            input.blur(deactivate);
            input.on('revealed', render);
            if (typeof input.val() !== "undefined" && input.val() != "") activate();
            if (input.is(":focus")) activate();
        });
    };
 
}( jQuery ));