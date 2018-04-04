$(document).ready(function () {
    $('.uniformFloatingLabel').uniformFloatingLabel();
    $('.uniformSelect').uniformSelect();
    $('.uniformDropdown').uniformDropdown();
    $('.uniformTooltip').uniformTooltip();
    $('.uniformResizer').uniformResizer();
    $('.uniformCheckbox').uniformCheckbox();
    $('.uniformRadio').uniformRadio();
    $('.launchUniformModal').click(function () {
        $(this).uniformModal();
    });

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

    hljs.initHighlightingOnLoad();
});