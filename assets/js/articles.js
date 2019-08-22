;(function(window) {

	'use strict';

	var pageContainer = document.querySelector('.page'),
		openCtrl = document.getElementById('btn-search'),
		closeCtrl = document.getElementById('btn-search-close'),
		searchContainer = document.querySelector('.search'),
		inputSearch = searchContainer.querySelector('.search__input');

	function init() {
		initEvents();	
	}

	function initEvents() {
		openCtrl.addEventListener('click', openSearch);
		closeCtrl.addEventListener('click', closeSearch);
		// document.addEventListener('keyup', function(ev) {
		// 	// escape key.
		// 	if( ev.keyCode == 27 ) {
		// 		alert('')
		// 	}
		// });
	}

	function openSearch() {
		searchContainer.classList.add('search--open');
		inputSearch.focus();
		$('.js .search').css({background:"#FFF"})
	}

	function closeSearch() {
		searchContainer.classList.remove('search--open');
		inputSearch.blur();
		inputSearch.value = '';
		$('.js .search').css({background:"none"})
	}

	init();

	/* Clamping text */

	$('.card-block h3').each((index, el) =>{
		$clamp($('.card-block h3')[index], {clamp:2})
	})
	/* trim dashes from category text */
	let elm;
	$('.category-title').each((index, el)=>{
		 elm = $(el).text().split('-').join(' ')
		$(el).text(elm);
	});


})(window);