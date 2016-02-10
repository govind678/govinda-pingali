/*
$(function() {

    var newHash      = "",
        $mainContent = $("#main-content"),
        $pageWrap    = $("#page-wrap"),
        baseHeight   = 0,
        $el;
        
    $pageWrap.height($pageWrap.height());
    baseHeight = $pageWrap.height() - $mainContent.height();
    
    $("nav").delegate("a", "click", function() {
        window.location.hash = $(this).attr("href");
        return false;
    });
    
    $(window).bind('hashchange', function(){
    
        newHash = window.location.hash.substring(1);
        
        if (newHash) {
            $mainContent
                .find("#guts")
                .fadeOut(200, function() {
                    $mainContent.hide().load(newHash + " #guts", function() {
                        $mainContent.fadeIn(200, function() {
                            $pageWrap.animate({
                                height: baseHeight + $mainContent.height() + "px"
                            });
                        });
                        $("nav a").removeClass("current");
                        $("nav a[href='"+newHash+"']").addClass("current");
                    });
                });
        };
        
    });
    
    $(window).trigger('hashchange');

});
*/
/*
$('a[id*="link"]').mouseenter(function(){
  // get the div id out of this
  var id = this.id.replace('link', '');
  // hide all other divs
  $('div[id^="li"]').hide();
  // show the needed div now
  $('#' + id).show();
});

// hide when mouse moves away
$('a[id*="link"]').mouseout(function(){
  var id = this.id.replace('link', '');
  $('#' + id).hide();
});
*/