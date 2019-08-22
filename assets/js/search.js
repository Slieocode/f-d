/**
 * A simple JSON search
 * Requires jQuery (v 1.7+)
 *
 * @author  Mat Hayward - Erskine Design
 * @version  0.1
 */


 /* ==========================================================================
    Initialisation
    ========================================================================== */

var q, jsonFeedUrl = "/feeds/feed.json",
    $searchForm = $("[data-search-form]"),
    $searchInput = $("[data-search-input]"),
    $resultTemplate = $("#search-result"),
    $resultsPlaceholder = $("[data-search-results]"),
    $foundContainer = $("[data-search-found]"),
    $foundTerm = $("[data-search-found-term]"),
    $foundCount = $("[data-search-found-count]"),
    allowEmpty = true,
    showLoader = true,
    loadingClass = "is--loading";
    // Input field variables
var pageContainer = document.querySelector('.page'),
    openCtrl = document.getElementById('btn-search'),
    closeCtrl = document.getElementById('btn-search-close'),
    searchContainer = document.querySelector('.search'),
    inputSearch = searchContainer.querySelector('.search__input');


$(document).ready( function() {
    // hide items found string
    $foundContainer.hide();

    // initiate search functionality
    initSearch();
});




 /* ==========================================================================
    Search functions
    ========================================================================== */
 

/**
 * Initiate search functionality.
 * Shows results based on querystring if present.
 * Binds search function to form submission.
 */
 function clampingTitle(){
     // clamping the blog title
   $('.js .search').css({background:"none"})
   $('.card-block h3').each((index, el) =>{
      $clamp($('.card-block h3')[index], {clamp:2})
    })
    /* trim dashes from category text */
    let elm;
    $('.category-title').each((index, el)=>{
       elm = $(el).text().split('-').join(' ')
      $(el).text(elm);
    });  
 }
function loading(){
  if ($("#progress").length === 0) {
    // inject the bar..
    $("body").append($("<div><b></b><i></i></div>").attr("id", "progress"));
    
    // animate the progress..
    $("#progress").width("101%").delay(800).fadeOut(1000, function() {
      // ..then remove it.
      $(this).remove();
    });  
  }
} 


function closeSearch() {
    loading();
    searchContainer.classList.remove('search--open');
    inputSearch.blur();
    inputSearch.value = '';
    document.querySelectorAll('.page__folder--dummy').forEach((el)=>{
      el.style.display = 'none';  
  })
}
    let header_height = $('header').css('height');


function initSearch() {
  
  // document.addEventListener('keyup', function(ev) {
  //     // escape key.
  //     if( ev.keyCode == 27 ) {
  //       alert('')
  //     }
  //   });

    // Get search results if q parameter is set in querystring
    if (getParameterByName('q')) {
        q = decodeURIComponent(getParameterByName('q'));
        $searchInput.val(q);
        execSearch(q);
    }

    // Get search results on submission of form
    $("[data-search-form]").on("submit", function(e) {
        $('.search-res').css({display:'flex'})
        $('header').css({height:0})
        $('.search-container').fadeIn()
        $('.container').css({display:'none'})
        $('section:not(.card-holder)').css({display:'none'})
        $('footer').css({display:'none'})
        if($('.search__input').val().length === 0){
          return false;
        }
        e.preventDefault();
        q = $searchInput.val();
        execSearch(q);
        closeSearch();
    });


}
$('.close-search-i').on('click', function(){
    $('.search-container').fadeOut(500);
    $('.container, section, footer').fadeIn(700);
    $('header').css({height:header_height})
})

/**
 * Executes search
 * @param {String} q 
 * @return null
 */
function execSearch(q) {
    if (q != '' || allowEmpty) {
        if (showLoader) {
            toggleLoadingClass();
        }

        getSearchResults(processData());
    }
}


/**
 * Toggles loading class on results and found string
 * @return null
 */
function toggleLoadingClass() {
    $resultsPlaceholder.toggleClass(loadingClass);
    $foundContainer.toggleClass(loadingClass);
}


/**
 * Get Search results from JSON
 * @param {Function} callbackFunction 
 * @return null
 */
function getSearchResults(callbackFunction) {
    $.get(jsonFeedUrl, callbackFunction, 'json');
}


/**
 * Process search result data
 * @return null
 */
function processData() {
    $results = [];
    
    return function(data) {
        
        var resultsCount = 0,
            results = "";

        $.each(data, function(index, item) {
            // check if search term is in content or title 
            if (item.search_omit != "true" && (item.content.toLowerCase().indexOf(q.toLowerCase()) > -1 || 
                item.title.toLowerCase().indexOf(q.toLowerCase()) > -1) ||
                item.category.toLowerCase().indexOf(q.toLowerCase()) > -1) {
                var result = populateResultContent($resultTemplate.html(), item);
                resultsCount++;
                results += result;
            }
        });

        if (showLoader) {
            toggleLoadingClass();
        }

        populateResultsString(resultsCount);
        showSearchResults(results);

    }
}


/**
 * Add search results to placeholder
 * @param {String} results
 * @return null
 */
function showSearchResults(results) {
    // Add results HTML to placeholder
    $resultsPlaceholder.html(results);
    clampingTitle();
    let categoriesFound = [];
    let searchResSpan = $('.search-cont').find('span:first-child');
    let numberFound =  Number(searchResSpan.text());

        /* Search filter */
        $('.card-link').each((i, el)=>{
            if($(el).find('.category-title').text() == 'International' || $(el).find('.category-title').text() === 'AussieSpecific'){
                categoriesFound.push($(this).attr('class'))
                $(el).remove()
              }
        });    
        $(searchResSpan).text(numberFound - categoriesFound.length);
}


/**
 * Add results content to item template
 * @param {String} html 
 * @param {object} item
 * @return {String} Populated HTML
 */
function populateResultContent(html, item) {
    html = injectContent(html, item.title, '##Title##');
    html = injectContent(html, item.link, '##Url##');
    html = injectContent(html, item.category, '##categories##');
    html = injectContent(html, item.featImg, '##featImg##');
    html = injectContent(html, item.excerpt, '##Excerpt##');
    html = injectContent(html, item.date, '##Date##');
    return html;
}


/**
 * Populates results string
 * @param {String} count 
 * @return null
 */
function populateResultsString(count) {
    $foundTerm.text(q);
    $foundCount.text(count);
    $foundContainer.show();
}




 /* ==========================================================================
    Helper functions
    ========================================================================== */


/**
 * Gets query string parameter - taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 * @param {String} name 
 * @return {String} parameter value
 */
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


/**
 * Injects content into template using placeholder
 * @param {String} originalContent
 * @param {String} injection
 * @param {String} placeholder 
 * @return {String} injected content
 */
function injectContent(originalContent, injection, placeholder) {
    var regex = new RegExp(placeholder, 'g');
    return originalContent.replace(regex, injection);
}
