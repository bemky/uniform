$(document).ready(function(){
    $('.uniformFloatingLabel').uniformFloatingLabel();
    $('.uniformSelect').uniformSelect();
    $('.uniformDropdown').uniformDropdown();
    $('.uniformTooltip').uniformTooltip();
    $('.uniformCheckbox').uniformCheckbox();
    $('.uniformRadio').uniformRadio();
    $('.launchUniformModal').click(function(){
        $(this).uniformModal();
    });
    
    hljs.initHighlightingOnLoad();
})