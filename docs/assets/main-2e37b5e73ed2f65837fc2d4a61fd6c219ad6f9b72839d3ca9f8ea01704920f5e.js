!function(){"use strict";$(document).ready(function(){hljs.initHighlightingOnLoad(),$(".uniformDropdown").uniformDropdown(),$(".uniformCheckbox").uniformCheckbox(),$(".uniformRadio").uniformRadio(),$(".uniformSelect").uniformSelect(),$(".uniformTooltip").uniformTooltip(),$(".uniformResizer").uniformResizer(),$(".launchUniformModal").uniformModal(),$(".uniformFloatingLabel").uniformFloatingLabel(),$(".uniformCardToggle").click(function(){$(this).parents(".uniformCard").toggleClass("expanded").trigger("expand-toggle")}),$(window).on("expand-toggle",function(o){var n=$(o.target).find(".uniformCard-collapse");n.toggle(0==n.parents(".expanded").length),n.slideToggle(100)}),$(".uniformInputGroup").on("focus","input",function(o){$(this).closest(".uniformInputGroup").addClass("focus")}),$(".uniformInputGroup").on("blur","input",function(o){$(this).closest(".uniformInputGroup").removeClass("focus")})})}();