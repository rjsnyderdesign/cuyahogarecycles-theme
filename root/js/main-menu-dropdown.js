/*
 * Cuyahoga County Solid Waste District
 * CuyahogaRecycles.org
 *
 * Main Menu Dropdown
 */




$(function(){
		
	$(".mega-menu .dropdown a.trigger").on("click",function(e){	
		var current=$(this).next();
		menuDropdown.desktop();
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
	
	
	//Mobile Nav
	$("#panel-menu .dropdown a.trigger").on("click",function(e){	
		var current = $(this).next();			
		var grandparent = $(this).parent().parent();
		
		if($(this).hasClass('selected')) {
			$(this).removeClass('selected');
			if($(this).parent().hasClass('dropdown')) {
				grandparent = $(this).parent();
			}
			grandparent.find('li > a.trigger').removeClass('selected');
			grandparent.find(".sub-menu:visible").not(current).slideUp(400);
			current.slideUp(400);
			
		}
		else {
			$(this).addClass('selected');
			current.slideDown(400);
		}

		e.preventDefault()
		e.stopPropagation();
	});
	$(".dropdown-menu > li > a:not(.trigger)").on("click",function(){
		var root=$(this).closest('.dropdown');
		$('.trigger').removeClass('selected');
		root.find('.sub-menu:not(.first)').slideUp(400);
	});
	
	var closeMobileDropdown = function() {
		$("#panel-menu .dropdown").find('.trigger').removeClass('selected');
		$("#panel-menu .dropdown").find('.sub-menu').hide();
	}
	//Close all when menu is closed
	//$('.dropdown').on('hide.bs.dropdown', function () {
	  //$('.dropdown').find('.sub-menu:not(.first)').slideUp(400);
		//$('.dropdown').find('li > a.trigger').removeClass('selected');
	//})
	
});