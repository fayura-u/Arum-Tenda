var loadmoreStatus = false;
// For limit scroll user
jQuery(document).ready(function() {
    scrollHandler();
});

function scrollHandler() {
    var win = jQuery(window);
    // Each time the user scrolls
    win.scroll(function() {
        var halaman = parseInt(jQuery('#halaman').val());
        // End of the document reached?
        if(halaman < 3){
            var limit = ( jQuery('header').height() + jQuery('.banner').height() + jQuery('.stories').height() ) - win.height();

// alert(limit + ' ' + win.scrollTop());
            
            // limit scroll if halaman < 3
            // var eBottom = limit;
            // var windowScrollTop = win.scrollTop();
            // if(windowScrollTop > eBottom){
            //     win.scrollTop(eBottom);
            // }

            if ( win.scrollTop() >= limit ) {
                jQuery('.loader').css('display', 'block');
                jQuery(window).unbind('scroll');
                ajaxSubmit();
            }
        }else{
            jQuery('.btn--view_more').css('display', 'block');
        }
    });
}

// // Action button on click
jQuery('#load-more').on("click", ajaxSubmit);
function ajaxSubmit(){
    var halaman = parseInt(jQuery('#halaman').val());
    var total_halaman = parseInt(jQuery('#total_halaman').val());

    if(loadmoreStatus) return false;

    loadmoreStatus = true;

    jQuery.ajax({
        type:"POST",
        dataType: 'json',
        url: MyAjax.ajaxurl,
        data: {
            action: 'load_more_posts',
            security: MyAjax.security,
            halaman: halaman,
            total_halaman: total_halaman
        },
        success:function(data){
            if(data.output){
                jQuery('.stories__content .load-more-container').append(data.output);

                // for reset load-more & lazy loading
                var elem = document.querySelector('.load-more-container');
                var msnry = new Masonry( elem, {
                    itemSelector: '.load-more-item',
                    horizontalOrder: true,
                });

                if(jQuery(window).width() > 1023){
                    var card = document.querySelectorAll('.load-more-item > .axioo-card');
                    for (let i = 0; i < card.length; i++) {
                        card[i].onmouseover = function(){
                            msnry.layout();
                        };
                        card[i].onmouseout = function(){
                            msnry.layout();
                        };
                    }
                }

                var myLazyLoad = new LazyLoad({
                    elements_selector: ".lazy"
                });
                // end

                jQuery('#halaman').val(halaman + 1);
                jQuery('.loader').css('display', 'none');
                jQuery(window).bind('scroll', scrollHandler);

                if(halaman + 1 == total_halaman) {
                    jQuery('.btn--view_more').addClass('disabled');
                }
            }

            loadmoreStatus = false;
        },

    });

    return false;
}
