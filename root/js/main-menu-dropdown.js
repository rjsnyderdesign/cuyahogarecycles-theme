/*
 * Cuyahoga County Solid Waste District
 * CuyahogaRecycles.org
 *
 * Main Menu Dropdown
 */

$(function(){
	$(".dropdown a.trigger").on("click",function(e){	
		var current=$(this).next();
		var grandparent=$(this).parent().parent();
		if($(this).hasClass('selected')) {
			$(this).removeClass('selected');
			grandparent.find('li > a.trigger').removeClass('selected');
		}
		else {
			grandparent.find('li > a.trigger').removeClass('selected');
			$(this).addClass('selected');
		}
		grandparent.find(".sub-menu:visible").not(current).hide();
		current.toggle();
		e.preventDefault()
		e.stopPropagation();
	});
	$(".dropdown-menu > li > a:not(.trigger)").on("click",function(){
		var root=$(this).closest('.dropdown');
		$('.trigger').removeClass('selected');
		root.find('.sub-menu:not(.first)').hide();
	});
	
	$('.dropdown').on('hide.bs.dropdown', function () {
	  $('.dropdown').find('.sub-menu:not(.first)').hide();
		$('.dropdown').find('li > a.trigger').removeClass('selected');
	})
});