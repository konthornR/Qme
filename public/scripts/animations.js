/* ======= Animations ======= */
jQuery(document).ready(function ($) {

    //Only animate elements when using non-mobile devices    
    if (isMobile.any === false) {

        /* Animate elements in #Promo */
        $('#promo .title').css('opacity', 0).one('inview', function (isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp1'); }
        });
        $('#promo .summary').css('opacity', 0).one('inview', function (isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp2'); }
        });

        $('#promo .ipad').css('opacity', 0).one('inview', function (isInView) {
            if (isInView) { $(this).addClass('animated fadeInRight delayp3'); }
        });

        $('.phone-holder').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInRight delayp4'); }
        });

        $('.promo-landscape .phone-holder').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp4'); }
        });

        /* Animate elements in #Features */
        $('#features .icon').each(function () {
            $(this).css('opacity', 0).one('inview', function (event, isInView) {
                if (isInView) { $(this).addClass('animated fadeInUp delayp1'); }
            });
        });

        /* Animate elements in #How */
        $('#how .container').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp2'); }
        });

        /* Animate elements in #faq */
        $('#faq .title').each(function () {
            $(this).css('opacity', 0).one('inview', function (event, isInView) {
                if (isInView) { $(this).addClass('animated fadeInUp delayp1'); }
            });
        });

        /* Animate elements in #story */
        $('#story .content').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInLeft delayp1'); }
        });

        $('#story .member').each(function () {
            $(this).css('opacity', 0).one('inview', function (event, isInView) {
                if (isInView) { $(this).addClass('animated fadeInRight delayp2'); }
            });
        });

        /* Animate elements in #testimonials */
        $('#testimonials .title').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp1'); }
        });

        $('#testimonials .people').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp3'); }
        });

        /* Animate elements in #customers */
        $('#customers h2.title').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp1'); }
        });

        $('#customers .customer-image').each(function () {
            $(this).css('opacity', 0).one('inview', function (event, isInView) {
                if (isInView) { $(this).addClass('animated fadeInRight delayp2'); }
            });
        });

        /* Animate elements in #Pricing */
        $('#pricing h2.title').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp1'); }
        });

        $('#pricing .price-1').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInLeft delayp2'); }
        });

        $('#pricing .price-2').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp4'); }
        });

        $('#pricing .price-3').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInRight delayp2'); }
        });

        /* Animate elements in #contact */
        $('#contact .title').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp1'); }
        });

        $('#contact .intro').css('opacity', 0).one('inview', function (event, isInView) {
            if (isInView) { $(this).addClass('animated fadeInUp delayp2'); }
        });

    }


});