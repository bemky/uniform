import * as Uniform from 'uniform';

window.Uniform = Uniform;
 
$(document).ready(function(){
    $('.uniformDropdown').uniformDropdown();
    $('.uniformCheckbox').uniformCheckbox();
    $('.uniformRadio').uniformRadio();
    $('.uniformSelect').uniformSelect();
    $('.uniformTooltip').uniformTooltip();
    $('.uniformResizer').uniformResizer();
    $('.launchUniformModal').uniformModal();
    $('.uniformFloatingLabel').uniformFloatingLabel();
    $('.uniformTristate').uniformTristate()

    $('.uniformCardToggle').click(function(){
        $(this).parents('.uniformCard').toggleClass('expanded').trigger('expand-toggle');
    });

    $(window).on('expand-toggle', function (e){
        var target = $(e.target).find('.uniformCard-collapse');
        target.toggle(target.parents('.expanded').length == 0);
        target.slideToggle(100);
    })

    $('.uniformInputGroup').on('focus', 'input', function (e) {
        $(this).closest('.uniformInputGroup').addClass('focus');
    })
    $('.uniformInputGroup').on('blur', 'input', function (e) {
        $(this).closest('.uniformInputGroup').removeClass('focus');
    });
})