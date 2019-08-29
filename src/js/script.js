$(document).ready(function(){
    $(document).on('click', 'a.link_to_page', function(e){
        e.preventDefault();
        var href = $(this).attr('href');
        getContent(href, true);
    });
});

window.addEventListener("popstate", function(e) {
   getContent(location.pathname, false);
});

function getContent(url, addEntry) {
    $.get(url).done(function(data) {
        $('#main_content').html($(data).find("#main_content").html());
        if(addEntry === true) {
            history.pushState(null, null, url); 
        }
    });
}