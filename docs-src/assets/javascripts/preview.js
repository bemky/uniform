import {
    Dropdown,
    Checkbox,
    Modal,
    Select,
    FloatingLabel,
    Resizer,
    Tooltip,
    Plugins
} from 'uniform';

$(document).ready(function(){
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
    })
})