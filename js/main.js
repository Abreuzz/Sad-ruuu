(function($){
    $.fn.changeElementType = function(newType) {
        var attrs = {};

        $.each(this[0].attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function() {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    };

    Number.prototype.formatMoney = function(precision = 2, decimal = '.', thousands = ',', withCurrency = false) {
        const placeholderRegex = /{{\s*(\w+)\s*}}/;
        const format           = 'R$ {{amount}}';

        let number = this.toFixed(precision);

        let parts         = number.split('.');
        let dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`);
        let centsAmount   = parts[1] ? decimal + parts[1] : '';
        let value         = dollarsAmount + centsAmount;

        return (withCurrency) ? format.replace(placeholderRegex, value) : value;
    };
    
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    window.theme = {

        ...window.theme,

        settings :{
            lastScrollPosition        : 0,
            storeId                   : 0,
            offerInfiniteCron         : false,
            productVariantsQuantities : null,
            productThumbs             : null,
            productGallery            : null
        },

        recoveryStoreId: function(){
            this.settings.storeId = $('html').data('store');
        },
        
        resets: function(){

            // modal remove id duplcate
            $('[role="dialog"] .modal-title').removeAttr('id');

            /* Advanced search page */
            $('.page-search #Vitrine input[type="image"]').after('<button type="submit" class="botao-commerce">BUSCAR</button>')
            $('.page-search #Vitrine input[type="image"]').remove();
            $('.advancedSearchFormBTimg').addClass('botao-commerce');

            $('.page-central_senha input[type="image"]').after('<button type="submit" class="botao-commerce">CONTINUAR</button>').remove();
            $('.caixa-cadastro #email_cadastro').attr('placeholder', 'Seu e-mail');

            $('#imagem[src*="filtrar.gif"]').after('<button type="submit" class="botao-commerce">Filtrar</button>');
            $('#imagem[src*="filtrar.gif"]').remove();

            $('input[src*="gerarordem.png"]').after('<button type="submit" class="botao-commerce">Gerar ordem de devolu&ccedil;&atilde;o</button>');
            $('input[src*="gerarordem.png"]').remove();
            
            if ($('#form_comprar').length) {
                setInterval(function(){
                    if ($('#form_comprar #quantidade > label').length && !$('#form_comprar #quantidade > label').hasClass('loaded')) {
                        $('#form_comprar #quantidade > label').addClass('loaded');
                        $('#form_comprar #quantidade > label').append('<span id="quantidade-menos">-</span><span id="quantidade-mais">+</span>');
                    }
                    
                    if ($('.modal .detalhesBrinde').length && !$('.modal .detalhesBrinde').hasClass('loaded')) {
                        $('.modal .detalhesBrinde').addClass('loaded');
                        
                        setTimeout(function() {
                            $(window).trigger('resize');
                        }, 1000);
                    }
                }, 100);
                
                $(document).delegate('#quantidade-menos', 'click', function(){
                    if ($('.page-product #quant').val()) {
                        var quantidade = parseInt($('.page-product #quant').val());
                    } else {
                        var quantidade = 0;
                    }
                    
                    var nova_quantidade = quantidade - 1;
                    
                    if (nova_quantidade < 1) {
                        nova_quantidade = 1;
                    }
                    
                    $('.page-product #quant').val(nova_quantidade);
                });
                
                $(document).delegate('#quantidade-mais', 'click', function(){
                    if ($('.page-product #quant').val()) {
                        var quantidade = parseInt($('.page-product #quant').val());
                    } else {
                        var quantidade = 0;
                    }
                    
                    var nova_quantidade = quantidade + 1;
                    
                    if (nova_quantidade > 99999) {
                        nova_quantidade = 99999;
                    }
                    
                    $('.page-product #quant').val(nova_quantidade);
                });
            }
            
            if ($('.product-wrapper #estoque_variacao').length && typeof $('.product-wrapper #estoque_variacao').text().split('/')[1] != 'undefined') {
                var estoque_variacao = $.trim($('.product-wrapper #estoque_variacao').text().split('/')[1]);
                
                $('.product-wrapper #estoque_variacao').text(estoque_variacao);
                $('.product-wrapper #estoque_variacao').addClass('active');
            }
            
            if ($('#coments').length && $('.product-rating').length) {
                $('.product-rating').addClass('active');
            }
            
            var $pswp = $('.pswp')[0];
            var image = [];
            
            $('.tabela-medidas').each(function() {
                var $pic = $(this),
                getItems = function() {
                    var items = [];
                    
                    $pic.find('a').each(function() {
                        var picLink = $(this);
                        var tmpImg = new Image();
                        
                        tmpImg.src = $(this).attr('href');
                        
                        $(tmpImg).one('load',function(){
                            orgWidth = tmpImg.width;
                            orgHeight = tmpImg.height;

                            picLink.attr('data-size', orgWidth + 'x' + orgHeight);
                            
                            var $href = picLink.attr('href'),
                            $size = picLink.data('size').split('x'),
                            $width = $size[0],
                            $height = $size[1];
                            
                            var item = {
                                src: $href,
                                w: $width,
                                h: $height
                            }
                            
                            items.push(item);
                        });
                    });
                    
                    return items;
                }
                  
                var items = getItems();
                
                $.each(items, function(index, value) {
                    image[index] = new Image();
                    image[index].src = value['src'];
                });
                
                $pic.on('click', 'figure', function(event) {
                    event.preventDefault();
            
                    var $index = $(this).index();
                    
                    var options = {
                        index: $index,
                        bgOpacity:0.85,
                        showHideOpacity: true,
                        shareEl: false,
                        history: false,
                        focus: true,
                        closeOnScroll: false,
                        galleryPIDs:false
                    }
                    
                    var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
                    
                    lightBox.init();
                });
            });
            
            if ($('#listaCategoriasNoticias li').length > 1) {
                $('#listaCategoriasNoticias').addClass('active');
            }
            
            if ($('.page-busca_noticias .board + .container3 .right .btns-paginator').length) {
                var page_total = parseInt($('.page-busca_noticias .board + .container3 .right .btns-paginator:not(.btn-pagina-anterior):not(.btn-primeira-pagina):not(.btn-proxima-pagina):not(.btn-ultima-pagina)').length);
                var pagination_html = '';
                
                if ($('.page-busca_noticias .board + .container3 .right .btn-pagina-anterior').length) {
                    pagination_html += '<span class="pagination-arrow pagination-prev"><a href="' + $('.page-busca_noticias .board + .container3 .right .btn-pagina-anterior').attr('href') + '" rel="prev" title="P&aacute;gina anterior"><svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" style="transform: rotate(180deg);"><path data-name="chevron-right" d="M10.586,5.929l1-1,5,5-5,5-1-1,4-4Z" transform="translate(-10.586 -4.929)"></path></svg></a></span>';
                }
                
                pagination_html += '<ul class="pagination-numbers">';
                
                $('.page-busca_noticias .board + .container3 .right .btns-paginator:not(.btn-pagina-anterior):not(.btn-primeira-pagina):not(.btn-proxima-pagina):not(.btn-ultima-pagina)').each(function(){
                    if ($(this).attr('href')) {
                        pagination_html += '<li><a href="' + $(this).attr('href') + '">' + $.trim($(this).text()) + '</a></li>';
                    } else {
                        pagination_html += '<li class="current">' + $.trim($(this).text()) + '</li>';
                    }
                });
                
                pagination_html += '</ul>';
                pagination_html += '<select class="pagination-select">';
                
                $('.page-busca_noticias .board + .container3 .right .btns-paginator:not(.btn-pagina-anterior):not(.btn-primeira-pagina):not(.btn-proxima-pagina):not(.btn-ultima-pagina)').each(function(){
                    if ($(this).attr('href')) {
                        pagination_html += '<option>' + $.trim($(this).text()) + '</option>';
                    } else {
                        pagination_html += '<option class="current">' + $.trim($(this).find('b').text()) + '</option>';
                    }
                });
                
                pagination_html += '</select>';
                pagination_html += '<span class="pagination-text">de ' + page_total + '</span>';
                
                if ($('.page-busca_noticias .board + .container3 .right .btn-proxima-pagina').length) {
                    pagination_html += '<span class="pagination-arrow pagination-next"><a href="' + $('.page-busca_noticias .board + .container3 .right .btn-proxima-pagina').attr('href') + '" rel="next" title="Pr&oacute;xima p&aacute;gina"><svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10"><path data-name="chevron-right" d="M10.586,5.929l1-1,5,5-5,5-1-1,4-4Z" transform="translate(-10.586 -4.929)"></path></svg></a></span>';
                }
                
                $('.page-busca_noticias .board + .container3 .right').append(pagination_html);
                $('.page-busca_noticias .board + .container3 .right').addClass('pagination');
            }
            
            if ($('.page-depoimentos .board + .container3 .right .btns-paginator').length) {
                var page_total = parseInt($('.page-depoimentos .board + .container3 .right .btns-paginator:not(.btn-pagina-anterior):not(.btn-primeira-pagina):not(.btn-proxima-pagina):not(.btn-ultima-pagina)').length);
                var pagination_html = '';
                
                if ($('.page-depoimentos .board + .container3 .right .btn-pagina-anterior').length) {
                    pagination_html += '<span class="pagination-arrow pagination-prev"><a href="' + $('.page-depoimentos .board + .container3 .right .btn-pagina-anterior').attr('href') + '" rel="prev" title="P&aacute;gina anterior"><svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" style="transform: rotate(180deg);"><path data-name="chevron-right" d="M10.586,5.929l1-1,5,5-5,5-1-1,4-4Z" transform="translate(-10.586 -4.929)"></path></svg></a></span>';
                }
                
                pagination_html += '<ul class="pagination-numbers">';
                
                $('.page-depoimentos .board + .container3 .right .btns-paginator:not(.btn-pagina-anterior):not(.btn-primeira-pagina):not(.btn-proxima-pagina):not(.btn-ultima-pagina)').each(function(){
                    if ($(this).attr('href')) {
                        pagination_html += '<li><a href="' + $(this).attr('href') + '">' + $.trim($(this).text()) + '</a></li>';
                    } else {
                        pagination_html += '<li class="current">' + $.trim($(this).text()) + '</li>';
                    }
                });
                
                pagination_html += '</ul>';
                pagination_html += '<select class="pagination-select">';
                
                $('.page-depoimentos .board + .container3 .right .btns-paginator:not(.btn-pagina-anterior):not(.btn-primeira-pagina):not(.btn-proxima-pagina):not(.btn-ultima-pagina)').each(function(){
                    if ($(this).attr('href')) {
                        pagination_html += '<option>' + $.trim($(this).text()) + '</option>';
                    } else {
                        pagination_html += '<option class="current">' + $.trim($(this).find('b').text()) + '</option>';
                    }
                });
                
                pagination_html += '</select>';
                pagination_html += '<span class="pagination-text">de ' + page_total + '</span>';
                
                if ($('.page-depoimentos .board + .container3 .right .btn-proxima-pagina').length) {
                    pagination_html += '<span class="pagination-arrow pagination-next"><a href="' + $('.page-depoimentos .board + .container3 .right .btn-proxima-pagina').attr('href') + '" rel="next" title="Pr&oacute;xima p&aacute;gina"><svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10"><path data-name="chevron-right" d="M10.586,5.929l1-1,5,5-5,5-1-1,4-4Z" transform="translate(-10.586 -4.929)"></path></svg></a></span>';
                }
                
                $('.page-depoimentos .board + .container3 .right').append(pagination_html);
                $('.page-depoimentos .board + .container3 .right').addClass('pagination');
            }
            
            if ($('.pagination-select').length) {
                var current_page = $('.pagination-select option.current').text();
                
                $('.pagination-select').val(current_page);
            }

        },
        
        setNavWidth: function(){
            var nav_left = (parseFloat($('.header-logo-menu .nav').offset().left) * 2) - 10;
            
            $('.nav .list .second-level > ul').css('max-width', 'calc(100% - (' + nav_left + 'px))');
        },
        
        instagramFeed: function(){
            
            if ($('.section-instagram-content li').length) {
                $('.section-instagram').addClass('active');
                
                theme.instagramFeedSlide();
            } else {
                var instagramToken = ($('input[name="data-token"]').val()).split('*').join('');
                var instagramFields = 'id,media_type,media_url,thumbnail_url,timestamp,permalink,caption';
                var instagramLimit = 5;

                $.ajax ({
                    url: 'https://graph.instagram.com/me/media?fields=' + instagramFields + '&access_token=' + instagramToken + '&limit=' + instagramLimit,
                    type: 'GET',
                    success: function(instagramResponse) {
                        var instagramGallery__images = $('.section-instagram-content');

                        $.each(instagramResponse.data, function(instagramResponse_key, instagramResponse_item) {
                            if (instagramResponse_item.media_type == 'VIDEO') {
                                instagramGallery__images.append('<li><a href="' + instagramResponse_item.permalink + '" target="_blank" aria-label="Post do Instagram"><img src="' + instagramResponse_item.thumbnail_url + '" alt="Post do Instagram"></a></li>');
                            } else {
                                instagramGallery__images.append('<li><a href="' + instagramResponse_item.permalink + '" target="_blank" aria-label="Post do Instagram"><img src="' + instagramResponse_item.media_url + '" alt="Post do Instagram"></a></li>');
                            }
                        });
                        
                        $('.section-instagram').addClass('active');
                        
                        theme.instagramFeedSlide();
                    },
                    error: function(data) {
                      console.log('Instagram error:');
                      console.log(data);
                    }
                });
            }
            
        },
        
        instagramFeedSlide: function(){
            
            if (window.matchMedia('screen and (max-width: 767px)').matches && $('.section-instagram-content li').length) {
                var instagram_html = $('.section-instagram').html();
                
                $('.section-instagram').addClass('swiper-container');
                $('.section-instagram').html(instagram_html.replace('<ul', '<div class="swiper"><ul').replace('</ul>', '</ul></div>'));
                $('.section-instagram-content').addClass('swiper-wrapper');
                $('.section-instagram-content li').addClass('swiper-slide');

                new Swiper('.section-instagram .swiper', {
                    loop: true,
                    spaceBetween: 10,
                    slidesPerView: 3,
                    slidesPerGroup: 3
                });    
            }
            
        },

        initMasks: function(){

            let phoneMaskBehavior = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            };

            let phoneMaskOptions = {
                onKeyPress: function(val, e, field, options) {
                    field.mask(phoneMaskBehavior.apply({}, arguments), options);
                }
            };

            $('.phone-mask').mask(phoneMaskBehavior, phoneMaskOptions);
            $('.zip-code-mask').mask('00000-000');

        },

        initCookieAlert: function(){

            if ($('#msg-cookie').length) {
                if (!getCookie('msg_cookie_close')) {
                    $('body').addClass('msg-cookie');
                    $('#msg-cookie').addClass('active');
                }

                $('#msg-cookie > a').click(function(){
                  setCookie('msg_cookie_close', '1', 7);

                  $('#msg-cookie').remove();
                  $('body').removeClass('msg-cookie');
                });

                $('#msg-cookie p a').click(function(element){
                  element.preventDefault();

                  setCookie('msg_cookie_close', '1', 7);

                  window.location = $(this).attr('href');
                });
            }

        },
        
        initPopupNewsletter: function(){

            if ($('#popup-news').length) {
                if (!getCookie('popup_news_close')) {
                    $('#popup-news').addClass('active');
                }
                
                $(document).delegate('.popup-news-close', 'click', function(element){
                    if ($(element.target).hasClass('popup-news-close')) {
                        $('#popup-news').remove();
                        setCookie('popup_news_close', '1', 2);
                    }
                });
            }

        },
        
        initLazyload: function(selector = '.lazyload'){
            new LazyLoad({
                elements_selector: selector
            });
        },

        getLoader: function(message = null){
            return `
                <div class="loader show">
                    <div class="spinner">
                        <div class="double-bounce-one"></div>
                        <div class="double-bounce-two"></div>
                    </div>
                    ${ message ? `<div class="message">${message}</div>` : ''}
                </div>`;
        },

        scrollToElement: function (target, adjust = 0) {
            if(target && target !== "#"){

                $("html,body").animate({
                    scrollTop : Math.round($(target).offset().top) - adjust
                }, 600);

            }
        },

        toggleModalTheme: function(){

            $('body').on('click', '[data-toggle="modal-theme"]', function(){
                $($(this).data('target')).addClass('show');
            });

            $('.modal-theme:not(.no-action) .modal-shadow, .modal-theme:not(.no-action) .close-icon').on('click', function(){
                $('.modal-theme').removeClass('show');
            });

        },

        generateBreadcrumb: function(local = ''){

            let items;
            let breadcrumb = '';
            let pageName   = document.title.split(' - ')[0];

            if(local == 'news-page'){
                items = [
                    { text: 'Home',            link: '/'         },
                    { text: 'Not&iacute;cias', link: '/noticias' },
                    { text: pageName }
                ];
            } else {
                items = [
                    { text: 'Home',  link: '/' },
                    { text: pageName }
                ];
            }

            $.each(items, function (index, item){
                if(this.link){

                    breadcrumb += `
                        <li class="breadcrumb-item flex align-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <a itemprop="item" class="t-color" href="${ item.link }">
                                <span itemprop="name">${ item.text }</span>
                            </a>
                            <meta itemprop="position" content="${ index + 1 }" />
                        </li>   
                    `;

                } else {

                    breadcrumb += `
                        <li class="breadcrumb-item flex align-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <span itemprop="name">${ item.text }</span>
                            <meta itemprop="position" content="${ index + 1 }" />
                        </li>          
                    `;

                }
            });

            $('.page-content > .container').prepend(`
                <ol class="breadcrumb flex f-wrap" itemscope itemtype="https://schema.org/BreadcrumbList">
                    ${breadcrumb}
                </ol>
            `);

        },

        processRteElements: function(){

            $(`.col-panel .tablePage, 
               .page-extra .page-content table, 
               .page-extras .page-content table, 
               .board_htm table,
               .rte table,
               .page-noticia table
            `).wrap('<div class="table-overflow"></div>');

            $(`.page-noticia iframe[src*="youtube.com/embed"], 
               .page-noticia iframe[src*="player.vimeo"],
               .board_htm iframe[src*="youtube.com/embed"],
               .board_htm iframe[src*="player.vimeo"],
               .rte iframe[src*="youtube.com/embed"],
               .rte iframe[src*="player.vimeo"]
            `).wrap('<div class="rte-video-wrapper"></div>');

        },

        loadThemeVersion: function(){

            const themeVersion = Cookies.get('theme-version');
            const localPath = $('.local-path').attr('data-path');

            if(themeVersion){
                $('html').attr('data-tray-theme-version', themeVersion);
                return;
            }            

            $.getJSON(localPath + `js/version.json?t=${Date.now()}`, function(data){
                Cookies.set('theme-version', data.version, { expires: 7 });
                $('html').attr('data-tray-theme-version', data.version);
            });

        },

        /* Index */

        bannerHome: function(){
            if($('.banner-home').length){

                let slideshow  = $('.banner-home');
                let size       = $('.swiper-slide', slideshow).length;
                let settings   = slideshow.data('settings');

                if(size > 0){

                    new Swiper('.banner-home .swiper-container', {
                        preloadImages : false,
                        loop          : true,
                        autoHeight    : true,
                        effect        : 'slide',
                        autoplay :{
                            delay: settings.timer,
                            disableOnInteraction : false
                        },
                        lazy :{
                            loadPrevNext: true,
                        },
                        navigation: {
                            nextEl: '.banner-home .next',
                            prevEl: '.banner-home .prev',
                        },
                        pagination: {
                            el                : '.banner-home .dots',
                            bulletClass       : 'dot',
                            bulletActiveClass : 'dot-active',
                            clickable         : !settings.isMobile
                        },
                    });

                    if(settings.stopOnHover){

                        $('.banner-home .swiper-container').on('mouseenter', function(){
                            (this).swiper.autoplay.stop();
                        });

                        $('.banner-home .swiper-container').on('mouseleave', function(){
                            (this).swiper.autoplay.start();
                        });

                    }
                }

            }
        },

        storeReviewsIndex: function(){
            
            if (!$('.section-avaliacoes .dep_lista').length){
                $('.section-avaliacoes').remove();
            } else {
                $('.dep_lista').changeElementType('div');
                $('.dep_item').changeElementType('div');
                $('.dep_lista > li').remove();
            }
            
        },

        loadNews: function(){
            if($('.section-news').length){

                let dataFiles = $('html').data('files');

                $.ajax({
                    url     : `/loja/busca_noticias.php?loja=${this.settings.storeId}&${dataFiles}`,
                    method  : 'get',
                    success : function(response){

                        let target;
                        let news;

                        if(!$(response).find('.noticias').length){
                            $('.section-news').remove();
                            return;
                        }

                        target = $('.section-news .news-content .swiper-wrapper');
                        news   = $($(response).find('.noticias'));

                        news.find('li:nth-child(n+4)').remove();
                        news.find('li').wrapInner('<div class="swiper-slide"><div class="box-noticia"></div></div>');
                        news.find('.swiper-slide').unwrap();
                        news = news.contents();

                        news.each(function (index, news){
                            let image  = $(news).find('img').closest('div').remove();
                        });

                        target.append(news);

                        new Swiper('.section-news .news-content', {
                            lazy : {
                                loadPrevNext: true,
                            },
                            pagination: {
                                el                : '.news-content .dots',
                                bulletClass       : 'dot',
                                bulletActiveClass : 'dot-active',
                                clickable         : false
                            },
                            breakpoints: {
                                0: {
                                    slidesPerView: 1
                                },
                                550: {
                                    slidesPerView: 2,
                                },
                                768: {
                                    slidesPerView: 3,
                                    allowTouchMove: false,
                                   
                                }
                            }
                        });

                    }
                });

            }
        },


        /* Category and search pages */

        slideCatalog: function(){
            if($('.slide-catalog').length){

                new Swiper('.slide-catalog', {
                    slidesPerView : 1,
                    loop          : true,
                    autoHeight    : true,
                    effect        : 'slide',
                    preloadImages : false,
                    lazy :{
                        loadPrevNext: true,
                    },
                    navigation: {
                      nextEl: '.slide-catalog .next',
                      prevEl: '.slide-catalog .prev'
                    }
                });

            }
        },

        sortMobile: function(){

            let options      = $();
            let selectedValue = $('#select_ordem').val();

            $('#select_ordem option').each(function(){
                options = options.add(
                    `<li ${ selectedValue === $(this).val() ? 'class="active"' : ''} data-option="${$(this).val()}">
                        ${$(this).text()}
                    </li>
                `);
            });

            $('.catalog-header .sort-mobile .sort-panel .sort-options').append(options);

            $('.catalog-header .sort-mobile .sort-panel .sort-options').on('click', 'li', function(){
                let option = $(this).data('option');
                $('#select_ordem').val(option).trigger('change');
            });

        },


        /* Product page */

        initProductGallery: function(){
            let zoomActive = $('.product-gallery').hasClass('zoom-true');
            let productGalleryQty = $('.product-gallery .swiper-slide').length;
            
            if (productGalleryQty > 1) {
                $('.product-wrapper .product-box').removeClass('product-box-one-image');
                
                if (!$('.product-wrapper .product-gallery .product-images .swiper-button').length) {
                    $('.product-wrapper .product-gallery .product-images').append('<div class="swiper-button prev"><svg xmlns="http://www.w3.org/2000/svg" width="12.125" height="22.666" viewBox="0 0 12.125 22.666"><path d="M21.109.265a.917.917,0,0,1,1.29,0,.9.9,0,0,1,0,1.277L11.978,11.86a.917.917,0,0,1-1.29,0L.267,1.542a.9.9,0,0,1,0-1.277.917.917,0,0,1,1.29,0l9.776,9.41L21.108.265Z" transform="translate(12.125) rotate(90)" fill="#151414"/></svg></div>');
                    $('.product-wrapper .product-gallery .product-images').append('<div class="swiper-button next"><svg xmlns="http://www.w3.org/2000/svg" width="12.125" height="22.666" viewBox="0 0 12.125 22.666"><path d="M21.109.265a.917.917,0,0,1,1.29,0,.9.9,0,0,1,0,1.277L11.978,11.86a.917.917,0,0,1-1.29,0L.267,1.542a.9.9,0,0,1,0-1.277.917.917,0,0,1,1.29,0l9.776,9.41L21.108.265Z" transform="translate(0 22.666) rotate(-90)" fill="#151414"/></svg></div>');
                    $('.product-wrapper .product-gallery .product-images').append('<div class="dots"></div>');
                }
                
                if ($('.product-wrapper .product-box').hasClass('product-box-kit')) {
                    var desktopSlidesPerView = 1;
                } else {
                    var desktopSlidesPerView = 2;
                }
                
                let gallerySettings = {
                    loop: true,
                    spaceBetween: 10,
                    breakpoints :{
                        0 :{
                            slidesPerView: 1,
                            slidesPerGroup: 1
                        },
                        550 :{
                            slidesPerView: desktopSlidesPerView,
                            slidesPerGroup: 1
                        }
                    },
                    navigation: {
                        nextEl: '.product-gallery .product-images .next',
                        prevEl: '.product-gallery .product-images .prev',
                    },
                    pagination: {
                        el                : '.product-gallery .product-images .dots',
                        bulletClass       : 'dot',
                        bulletActiveClass : 'dot-active',
                        clickable         : true
                    },
                    on: {
                        init: function () {
                            if(!zoomActive) return;
    
                            if(this.slides.length === 1){
                                this.unsetGrabCursor();
                                this.allowTouchMove = false;
                            }
    
                            let wrapper1 = $('.product-wrapper .product-gallery').find(`.image[data-index="1"] .zoom`);
    
                            if(!wrapper1.find('img:first').next().length){
                                wrapper1.zoom({
                                    touch : false,
                                    url   : wrapper1.find('img').attr('src')
                                });
                            }
                            
                            let wrapper2 = $('.product-wrapper .product-gallery').find(`.image[data-index="2"] .zoom`);
    
                            if(!wrapper2.find('img:first').next().length){
                                wrapper2.zoom({
                                    touch : false,
                                    url   : wrapper2.find('img').attr('src')
                                });
                            }
    
                        },
                        slideChange: function () {
                            if(!zoomActive) return;
                            
                            let index = this.activeIndex + 1;
                            
                            let wrapper1 = $('.product-wrapper .product-gallery').find(`.image[data-index="${index}"] .zoom`);
    
                            if(!wrapper1.find('img:first').next().length){
                                wrapper1.zoom({
                                    touch : false,
                                    url   : wrapper1.find('img').attr('src')
                                });
                            }
                            
                            index = index + 1;
                            
                            let wrapper2 = $('.product-wrapper .product-gallery').find(`.image[data-index="${index}"] .zoom`);
    
                            if(!wrapper2.find('img:first').next().length){
                                wrapper2.zoom({
                                    touch : false,
                                    url   : wrapper2.find('img').attr('src')
                                });
                            }
    
                        }
                    }
                };
    
                this.settings.productGallery = new Swiper('.product-wrapper .product-gallery .product-images', gallerySettings);
            } else {
                $('.product-wrapper .product-box').addClass('product-box-one-image');
                
                let wrapper1 = $('.product-wrapper .product-gallery .image .zoom');
    
                if(!wrapper1.find('img:first').next().length){
                    wrapper1.zoom({
                        touch : false,
                        url   : wrapper1.find('img').attr('src')
                    });
                }
            }
            
            if (product_discount_html) {
                var product_discount_time = setInterval(function(){
                    if ($('#produto_preco .PrecoPrincipal').length && !$('#produto_preco .PrecoPrincipal').hasClass('loaded')) {
                        clearInterval(product_discount_time);
                        
                        $('.tag-price-discount').remove();
                        $('#produto_preco .PrecoPrincipal').addClass('loaded');
                        $('#produto_preco .PrecoPrincipal').append('<div class="tag-price-discount">' + product_discount_html + '</div>');
                    }
                }, 100);
            }
        },

        recreateProductGallery: function(images){

            let productName = $('.product-wrapper .product-form .product-name').text();
            let htmlThumbs  = ``;
            let htmlImages  = ``;

            $.each(images, function (index, item){

                let slideIndex = index + 1;

                htmlImages += `
                    <div class="image swiper-slide ${ slideIndex === 1 ? 'active' : '' }" data-index="${slideIndex}">
                        <div class="zoom">
                            <img src="${item.https}" alt="${productName}">
                        </div>
                    </div>
                `;

                htmlThumbs +=
                    `<li class="swiper-slide ${ slideIndex === 1 ? 'active' : '' }" data-index="${slideIndex}">
                        <div class="thumb">
                            <img src="${item.thumbs[90].https}" alt="${productName}">
                        </div>
                    </li>
                `;

            });

            if(theme.settings.productThumbs){
                theme.settings.productThumbs.destroy();
            }

            if(theme.settings.productGallery){
                theme.settings.productGallery.destroy();
            }

            $('.product-wrapper .product-gallery .product-images .image').remove();
            $('.product-wrapper .product-gallery .product-thumbs .swiper-slide').remove();
            $('.product-wrapper .product-gallery .product-images .swiper-wrapper').html(htmlImages);

            if (images.length > 1) {
                $('.product-wrapper .product-gallery .product-thumbs').addClass('show');
                $('.product-wrapper .product-gallery .product-thumbs .thumbs-list .swiper-wrapper').html(htmlThumbs);
            } else {
                $('.product-wrapper .product-gallery .product-thumbs').removeClass('show');
            }

            theme.initProductGallery();

        },

        toggleProductVideo: function(){

            let internal = this;

            $('.product-wrapper .product-box .product-video').on('click', function(){

                $('.modal-video').find('iframe').attr('data-src', $(this).data('url'));
                $('.modal-video').addClass('show');

                internal.initLazyload('.iframe-lazy');

            });

            $('.modal-video, .modal-video .close-icon').on('click', function(event){
                if(!$(event.target).hasClass('modal-info')){
                    setTimeout(function () {
                        $('.modal-video .video iframe').removeAttr('src').removeClass('loaded').removeAttr('data-was-processed data-ll-status');
                    },300);
                }
            });

        },

        goToProductReviews: function(){

            let internal = this;

            $('.product-wrapper .product-box .product-form .product-rating .total').on('click', function(){
                internal.scrollToElement('#coments', 50);
            });

            setTimeout(() => {
                $("#form-comments .submit-review").on("click", function(e){

                    if(!$("#form-comments .stars .starn.star-on").length) {
                        var textError = 'Avalia&ccedil;&atilde;o do produto obrigat&oacute;ria, d&ecirc; sua avalia&ccedil;&atilde;o por favor';
                        
                        $("#div_erro .blocoAlerta").text(textError).show();
                        setTimeout(() => {
                            $("#div_erro .blocoAlerta").hide();
                        }, 5000);
                    }

                });
            }, 3000);

        },

        getShippingRates: function(){

            let internal = this;
            var quantity = 1;
            
            function loadShippingRates() {
                let variant  = $('#form_comprar').find('input[type="hidden"][name="variacao"]');
                let url      = $('#shippingSimulatorButton').data('url');                
                let cep      = $('.shipping-form .input').val().split('-');

                if ($('#quant:visible').is(':visible')) {
                    quantity = $('#quant:visible').val();
                }

                if(variant.length && variant.val() === ''){
                    $('.product-shipping .result').addClass('loaded').html(`<div class="error-message">Por favor, selecione as varia&ccedil;&otilde;es antes de calcular o frete.</div>`);
                    return;
                }

                variant = variant.val() || 0;

                url = url.replace('cep1=%s', `cep1=${cep[0]}`  )
                         .replace('cep2=%s', `cep2=${cep[1]}`  )
                         .replace('acao=%s', `acao=${variant}` )
                         .replace('dade=%s', `dade=${quantity}`);


                $('.product-shipping .result').removeClass('loaded').addClass('loading').html(internal.getLoader('Carregando fretes...'));

                /* Validate zip code first using viacep web service */
                $.ajax({
                    'url'      : `https://viacep.com.br/ws/${cep[0]+cep[1]}/json/`,
                    'method'   : 'get',
                    'dataType' : 'json',
                    'success'  : function (viacepResponse) {

                        if(viacepResponse.erro){

                            let message = 'Cep inv&aacute;lido. Verifique e tente novamente.'
                            $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                            return;

                        }

                        $.ajax({
                            'url'    : url,
                            'method' : 'get',
                            'success' : function (response) {

                                if(response.includes('N&atilde;o foi poss&iacute;vel estimar o valor do frete')){

                                    let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarte.'
                                    $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                                    return;

                                }

                                let shippingRates = $(response.replace(/Prazo de entrega: /gi, ''));
                                let local = shippingRates.find('p .color').html().replace(/\s\s\\\s/g, '').replace(/ \\/g, ',');

                                //shippingRates.find('table:first-child, p, table tr td:first-child').remove();
                                shippingRates.find('table:first-child, p').remove();
                                shippingRates.find('table, table th, table td').removeAttr('align class width border cellpadding cellspacing height colspan');

                                shippingRates.find('table').addClass('shipping-rates-table');

                                var frete = shippingRates.find('table th:first-child').text();
                                if (frete == 'Forma de Envio:'){
                                    shippingRates.find('table th:first-child').html('Frete').attr("colspan", "2");
                                }

                                var valor = shippingRates.find('table th:nth-child(2)').text();
                                if (valor == 'Valor:'){
                                    shippingRates.find('table th:nth-child(2)').html('Valor');
                                }

                                var prazo = shippingRates.find('table th:last-child').text();
                                if (prazo == 'Prazo de Entrega e Observa&ccedil;&otilde;es:'){
                                    shippingRates.find('table th:last-child').html('Prazo');
                                }
                                shippingRates = shippingRates.children();

                                $('.product-shipping .result').removeClass('loading').addClass('loaded').html('').append(shippingRates);

                            },
                            'error' : function (request, status, error) {

                                console.error(`[Theme] Could not recover shipping rates. Error: ${error}`);

                                if(request.responseText !== ''){
                                    console.error(`[Theme] Error Details: ${request.responseText}`);
                                }

                                let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarde.'
                                $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                            }
                        });

                    },
                    'error': function (request, status, error) {

                        console.error(`[Theme] Could not validate cep. Error: ${error}`);
                        console.error(`[Theme] Error Details: ${request.responseJSON}`);

                        let message = 'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarde.'
                        $('.product-shipping .result').removeClass('loading').addClass('loaded').html(`<div class="error-message">${message}</div>`);

                    }
                });
            }

            $('#form_comprar').on('submit', function(event){
                if ($(this).hasClass('shipping-submit')) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    $(this).removeClass('shipping-submit');
                    
                    return false;
                }
            });
            
            $('.shipping-form .submit-shipping').on('click', function(event){
                loadShippingRates();
            });
            
            $('.shipping-form .input').on('keydown', function(event){
                
                var key = event.which || event.keyCode;
                
                if (key == 13) {
                    $('#form_comprar').addClass('shipping-submit');
                    
                    loadShippingRates();
                }

            });

        },

        productBuyTogether: function(){

            let internal = this;

            $('.compreJunto form .fotosCompreJunto').append('<div class="plus color to">=</div>');

            $('.compreJunto .produto img').each(function(){

                let imagUrl = $(this).attr('src').replace('/90_', '/180_');
                let link    = $(this).parent().attr('href') || '';
                let name    = $(this).attr('alt');

                $(this).addClass('lazyload-buy-together').attr('src', '').attr('data-src', imagUrl);
                internal.initLazyload('.lazyload-buy-together');

                if(link !== ''){
                    $(this).unwrap();
                    $(this).parents('span').after(`<a class="product-name" href="${link}">${name}</a>`);
                } else {
                    $(this).parents('span').after(`<span class="product-name">${name}</span>`);
                }

            });

        },

        loadProductPaymentOptionsTab: function(){

            let productId     = $('#form_comprar').data('id');
            let price         = $('#preco_atual').val();
            let paymentTab    = $('.product-tabs .tabs-content .payment-tab');
            let previousPrice = paymentTab.attr('data-loaded-price');

            if (previousPrice !== price) {

                $.ajax({
                    'url'     : `/mvc/store/product/payment_options?loja=${theme.settings.storeId}&IdProd=${productId}&preco=${price}`,
                    'method'  : 'get',
                    'success' : function (response){

                        let html = $(response);

                        html = html.find('#atualizaFormas').unwrap();
                        html = html.find('ul.Forma1').unwrap();

                        html.find('li').each(function () {
                            let image = $('img', this).remove();
                            $('a', this).prepend(image);
                        });

                        html.find('table br').remove();
                        html.find('table td:first-child').remove();

                        html.find('table').removeAttr('id class width cellpadding cellspacing border style');
                        html.find('table td, table th').removeAttr('class width style');
                        html.find('li').removeAttr('id style');
                        html.find('li a').removeAttr('id class name');
                        html.find('li a img').removeAttr('border');

                        html.removeClass().addClass('payment-options');
                        html.find('li').addClass('option');
                        html.find('li a').attr('href', 'javascript:void(0)');
                        html.find('li a').attr('rel', 'noreferrer noopener');
                        html.find('table').wrap('<div class="option-details"></div>');
                        html.find('.option-details').css('display', 'none');

                        paymentTab.attr('data-loaded-price', price);
                        paymentTab.html('').append(html);

                    }
                });

            }

        },

        productTabsAction: function(){

            let internal = this;

            $('.tab-link-mobile[href*="AbaPersonalizada"]').each(function(){

                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                $(target).detach().insertAfter(this);

            });

            $('.product-tabs .tabs-content .tab:not(.product-sku)[data-url]').each(function(){

                let tab = $(this);
                let url = tab.data('url');

                if(tab.hasClass('payment-tab')){

                    internal.loadProductPaymentOptionsTab();

                } else {
                    $.ajax({
                        'url'     : url,
                        'method'  : 'get',
                        'success' : function (response){
                            tab.html(response);
                        }
                    });
                }

            });

            $('.product-tabs .tabs-content .tab.payment-tab').on('click', '.option a', function (){

                let parent = $(this).parent();
                let table  = $(this).next();

                if (parent.hasClass('show')){
                    parent.removeClass('show');
                    table.slideUp();
                } else {
                    parent.addClass('show');
                    table.slideDown();
                }

            });

            $('.product-tabs .tabs-nav .tab-link').on('click', function (event) {

                let tabs = $(this).closest('.product-tabs');

                if(!$(this).hasClass('active')){

                    let target = $(this).attr('href').split('#')[1];
                    target = $(`#${target}`);

                    $('.tab-link', tabs).removeClass('active');
                    $(this).addClass('active');

                    $('.tabs-content .tab', tabs).fadeOut();

                    setTimeout(function (){
                        target.fadeIn();
                    }, 300);

                }

                event.preventDefault();
                event.stopPropagation();
                return false;

            });

            $('.product-tabs .tabs-content .tab-link-mobile').on('click', function (event){

                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                if($(this).hasClass('active')){

                    $(this).removeClass('active');
                    target.removeClass('active').slideUp();

                } else {

                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    $('.product-tabs .tabs-content .tab').removeClass('active').slideUp();

                    $(this).addClass('active');
                    target.addClass('active').slideDown();

                }

                event.preventDefault();
                event.stopPropagation();
                return false;

            });

            internal.productTabActionsOnResize();

            $(window).on('resize', function () {
                internal.productTabActionsOnResize();
            });

        },

        productTabActionsOnResize: function(){
            if($('.product-tabs .tabs-nav li').length){

                if($(window).width() < 768 && $('.product-tabs .tabs-nav .tab-link.active').length > 0){

                    $('.product-tabs .tabs-nav .tab-link').removeClass('active');
                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    $('.product-tabs .tabs-content .tab').removeClass('active').slideUp();

                } else if($(window).width() >= 768 && $('.product-tabs .tabs-nav .tab-link.active').length == 0) {

                    let firstLink = $('.product-tabs .tabs-nav .tab-link').first();
                    let target    = firstLink.attr('href').split('#')[1];

                    $('.product-tabs .tabs-content .tab-link-mobile').removeClass('active');
                    firstLink.addClass('active');

                    $(`#${target}`).show();

                }

            }
        },

        productReviews: function(){

            let commentsBlock = $(`<div class="product-comments">${window.commentsBlock}</div>`);

            commentsBlock.find('.hreview-comentarios + .tray-hide').remove();

            $.ajax({
                url: '/mvc/store/greeting',
                method: 'get',
                dataType: 'json',
                success: function(response){

                    if(!Array.isArray(response.data)){

                        commentsBlock.find('#comentario_cliente form.tray-hide').removeClass("tray-hide");

                        commentsBlock.find('#form-comments #nome_coment').val(response.data.name);
                        commentsBlock.find('#form-comments #email_coment').val(response.data.email);

                        commentsBlock.find('#form-comments [name="ProductComment[customer_id]"]').val(response.data.id);


                    } else {

                        commentsBlock.find('#comentario_cliente a.tray-hide').removeClass("tray-hide");
                    }

                    $('#tray-comment-block').before(commentsBlock);

                    $('#form-comments #bt-submit-comments').before('<button type="submit" class="submit-review">Enviar</button>').remove();

                    $('.ranking .rating').each(function() {

                        let review = Number($(this).attr('class').replace(/[^0-9]/g,''));

                        for (i = 1; i <= 5; i++){
                            if(i <= review){
                                $(this).append('<div class="icon active"></div>');
                            } else {
                                $(this).append('<div class="icon"></div>');
                            }
                        }

                    });

                    $('#tray-comment-block').remove();

                    theme.chooseProductRating();
                    theme.sendProductReview();

                }
            })
        },

        chooseProductRating: function() {
            $('#form-comments .rateBlock .starn').on('click', function(){

                let message = $(this).data('message');
                let rating = $(this).data('id');

                $(this).parent().find('#rate').html(message);
                $(this).closest('form').find('#nota_comentario').val(rating);

                $(this).parent().find('.starn').removeClass('star-on');

                $(this).prevAll().addClass('star-on');

                $(this).addClass('star-on');

            });
        },

        sendProductReview: function() {
            $('#form-comments').on('submit', function(event){

                let form = $(this);

                $.ajax({
                    url: form.attr('action'),
                    method: 'post',
                    dataType: 'json',
                    data: form.serialize(),
                    success: function(response) {

                        form.closest('.product-comments').find('.blocoAlerta').hide();
                        form.closest('.product-comments').find('.blocoSucesso').show();

                        setTimeout(function(){

                            form.closest('.product-comments').find('.blocoSucesso').hide();
                            $('#form-comments #mensagem_coment').val('');

                            form.find('#nota_comentario').val('');
                            form.find('#rate').html('');

                            form.find('.starn').removeClass('star-on');

                        }, 8000);
                    },
                    error: function(response){

                        form.closest('.product-comments').find('.blocoSucesso').hide();
                        form.closest('.product-comments').find('.blocoAlerta').html(response.responseText).show();
                    }

                })

                event.preventDefault();
            })
        },

        organizeProductHistory: function(){

            let target = $('.products-history .container').get(0);

            if(!target){
                return;
            }

            let observer = new MutationObserver(function(mutationsList, observer){
                $.each(mutationsList, function(){
                    if(this.type == "childList" && $(this.target).prop('id') == "produtos"){

                        $('.products-history .container img[src*="sobconsulta"]').after('<div class="botao-commerce">Sob consulta</div>');

                        setTimeout(function () {
                            $('.products-history .history-loader').removeClass('show');
                        }, 200);

                        return false;

                    }
                });
            });

            observer.observe(target, { childList: true, subtree: true });

            $('.products-history').on('click', '#linksPag a', function (){
                $('.products-history #produtos').html('');
                $('.products-history .history-loader').addClass('show');
            });

        },

        loadProductVariantImage : function(id){
            $.ajax({
                url    : `/web_api/variants/${id}`,
                method : 'get',
                success: function (response){

                    let images = response.Variant.VariantImage;
                    
                    if(images.length){
                        theme.recreateProductGallery(images);
                    }

                },
                error: function (request, status, error) {
                    console.log(`[Theme] An error occurred while retrieving product variant image. Details: ${error}`);
                }
            });
        },

        detectProductVariantChanges: function(){

            let internal = this;

            $('.product-variants').on('click', '.lista_cor_variacao li[data-id]', function(){
                internal.loadProductVariantImage($(this).data('id'));
            });

            $('.product-variants').on('click', '.lista-radios-input', function(){
                internal.loadProductVariantImage($(this).find('input').val());
            });

            $('.product-variants').on('change', 'select', function(){
                internal.loadProductVariantImage($(this).val());
            });

            $('.infoSelects').on('change', function(){
                var optionSelected = $(this).find('option:selected');
                if (optionSelected.val().length){
                    var rel = optionSelected.attr('rel');
                    var image = [
                        {
                            https: rel,
                            thumbs: {
                                    90: {
                                        https: rel,
                                    },
                            }
                        },
                    ];
                    theme.recreateProductGallery(image);
                }
            });
            
        },


        /* Store reviews page */

        organizeStoreReviewsPage: function(){

            if($('.page-content .container .btns-paginator').length){
                $('.page-content .container .btns-paginator').parent().addClass('store-review-paginator');
            }

            $('.page-content .container').append('<div class="botao-commerce show-modal-store-review" data-toggle="modal-theme" data-target=".modal-store-reviews">Deixe seu depoimento</div>');
            $('#depoimento #aviso_depoimento').after('<button type="button" class="botao-commerce send-store-review">Enviar</button>');

            $('.page-content h2:first').appendTo('.modal-store-reviews .modal-info');
            $('#depoimento').appendTo('.modal-store-reviews .modal-info');

            $('#comentario_cliente').remove();
            $('.modal-store-reviews #depoimento a').remove();

            $('.page-depoimentos .page-content').addClass('show');
            $('.page-depoimentos').addClass('show-menu');

        },

        validateStoreReviewForm: function(){

            $('.modal-store-reviews #depoimento').validate({
                rules: {
                    nome_depoimento :{
                        required: true
                    },
                    email_depoimento :{
                        required: true,
                        email: true
                    },
                    msg_depoimento: {
                        required: true
                    },
                    input_captcha: {
                        required: true
                    }
                },
                messages: {
                    nome_depoimento :{
                        required: "Por favor, informe seu nome completo",
                    },
                    email_depoimento:{
                        required : "Por favor, informe seu e-mail",
                        email    : "Por favor, preencha com um e-mail v&aacute;lido",
                    },
                    msg_depoimento: {
                        required: "Por favor, escreva uma mensagem no seu depoimento",
                    },
                    input_captcha: {
                        required: "Por favor, preencha com o c&oacute;digo da imagem de verifica&ccedil;&atilde;o"
                    }
                },
                errorElement : 'span',
                errorClass   : 'error-block',
                errorPlacement: function(error, element){

                    if(element.prop('type') === 'radio'){
                        error.insertAfter(element.parent('.nota_dep'));
                    }

                    else if(element.is('textarea')){
                        error.insertAfter(element.parent().find('h5'));
                    }

                    else {
                        error.insertAfter(element);
                    }
                }
            } );

            $('.modal-store-reviews #depoimento .send-store-review').on('click', function() {

                let form = $('.modal-store-reviews #depoimento');
                let button = $(this);

                if (form.valid()) {

                    button.html('Enviando...').attr('disabled', true);
                    enviaDepoimentoLoja();

                }

            });

            /* Create observer to detect Tray return */

            let target = $('#aviso_depoimento').get(0);
            let config = { attributes: true };

            let observerReviewMessage = new MutationObserver(function(mutationsList, observer){
                $('.depoimentos-modal #depoimento .send-store-review').html('Enviar').removeAttr('disabled');
            });

            observerReviewMessage.observe(target, config);

        },


        /* News page */
        organizeNewsPage: function(){

            if(!window.location.href.includes('busca_noticias')){
                $('#listagemCategorias').parent().before('<h1>Not&iacute;cias</h1>')
            }
            $('.noticias').find('li').wrapInner('<div class="box-noticia"></div>');
            
            $('.page-busca_noticias .box-noticia').each(function(){
                let link = $(this).find('#noticia_imagem a').attr('href');
                $(this).find('p').after(`<a href="${link}" class="button-show">Ver mais</a>`);
            });

            $('.page-busca_noticias .page-content').addClass('show');
            $('.page-busca_noticias').addClass('show-menu');

        },


        /* Contact page */
        organizeContactPage: function(){

            $('.page-contact .page-content > .container').prepend(`
                <h1>Fale conosco</h1>
                <p class="description">Precisa falar com a gente? Utilize uma das op&ccedil;&otilde;es abaixo para entrar em contato conosco.</p>
                <div class="cols">
                    <div class="box-form">                        
                    </div>
                    <div class="info-form"></div>
                </div>
            `);

            $($('.page-content .container3').eq(1)).appendTo('.info-form');
            $($('.page-content .container3 .container2 .container2').eq(0)).appendTo('.box-form');

            if($('.info-form h3:contains(Empresa)').length){
                $('.info-form h3:contains(Empresa)').parent().insertBefore($('.info-form h3:contains(Endere)').parent());
            }

            $('.info-form h3:contains(Endere)').parent().after($('.map-iframe'));
            $('.page-contact form img.image').after('<div class="flex justify-end"><span class="botao-commerce flex align-center justify-center">Enviar</span></div>').remove();
            $('.page-contact #telefone_contato').removeAttr('onkeypress maxlength').addClass('phone-mask');


            if($('.page-contact .contato-telefones .block:nth-child(1)').length){

                let phoneNumberFormatted = $('.page-contact .contato-telefones .block:nth-child(1)').text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                $('.page-contact .contato-telefones .block:nth-child(1)').html(`<a href="tel:${phoneNumber}" title="Ligue para n&oacute;s">${phoneNumberFormatted}</a>`);

            }

            if($('.page-contact .contato-telefones .block:nth-child(2)').length){

                let phoneNumberFormatted = $('.page-contact .contato-telefones .block:nth-child(2)').text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                $('.page-contact .contato-telefones .block:nth-child(1)').html(`<a href="tel:${phoneNumber}" title="Ligue para n&oacute;s">${phoneNumberFormatted}</a>`);

            }

            $('.page-contact .page-content').addClass('active');

        },


        /* Gifts page */
        gifts: function(){
            $('#form_presentes input[type="image"]').prev().html('<div class="botao-commerce">Continuar Comprando</div>');
            $('#form_presentes input[type="image"]').wrap('<div class="relative-button"></div>').after('<button class="botao-commerce">Avan&ccedil;ar</button>').remove();
        },


        /* Newsletter page */
        organizeNewsletterPage: function(){

            if($('.page-newsletter .formulario-newsletter').length){

                $('.page-newsletter .formulario-newsletter .box-captcha input, .page-newsletter .formulario-newsletter .box-captcha-newsletter input').attr('placeholder', 'Digite o c&oacute;digo ao lado').trigger('focus');
                $('.formulario-newsletter .newsletterBTimg').html('Enviar').removeClass().addClass('botao-commerce');

            } else {

                $('.page-newsletter .page-content').addClass('success-message-newsletter');
                $('.page-newsletter .page-content.success-message-newsletter .board p:first-child a').addClass('botao-commerce').html('Voltar para p&aacute;gina inicial');

            }

            setTimeout(function () {
                $('.page-newsletter .page-content').addClass('show');
            }, 200);

        },
        
        /* To Action in ajax.html */ 
        updateCartTotal: function() {
            
            var cartLink = $('.cart-toggle').attr('data-link');
            var session = $('html').attr('data-session');
            
            $.ajax({
                method: 'GET',
                url: '/web_api/cart/' + session
            }).success(function (cartProducts) {
                
                if (cartProducts.length) {
                    
                    var cartTotalProducts = 0;
                    
                    $.each(cartProducts, function(cartProductKey, cartProductItem){
                        var cartProduct = cartProductItem.Cart;
                        
                        cartTotalProducts = cartTotalProducts + parseInt(cartProduct.quantity);
                    });
                    
                    $('.header .cart-toggle .cart-quantity').text(cartTotalProducts);
                    
                } else {
                    
                    $('.header .cart-toggle .cart-quantity').text('0');
                    
                }
                
            }).fail(function (error) {
                var response = $.parseJSON(error.responseText);
                
                $('.header .cart-toggle .cart-quantity').text('0');
            });
            
        },
        
        menuMobile: function() {
            
            $('#menu-mobile').fadeIn('fast', function(){
                $('#menu-mobile').addClass('open');
                $('#menu-mobile').addClass('open-content');
            });
            
        },
        
        cartSidebar: function() {
            
            var cartLink = $('.cart-toggle').attr('data-link');
            var session = $('html').attr('data-session');
            
            $.ajax({
                method: 'GET',
                url: '/web_api/cart/' + session
            }).success(function (cartProducts) {
                
                if (cartProducts.length) {
                    
                    var cartTotal = 0;
                    var cartTotalProducts = 0;
                    var cartHtml = '';
                    
                    cartHtml += '<ul>';
                    
                    $.each(cartProducts, function(cartProductKey, cartProductItem){
                        var cartProduct = cartProductItem.Cart;
                        var cartProductName = (cartProduct.product_name).split('<br />')[0];
                        var cartProductVariant1 = '';
                        var cartProductVariant2 = '';
                        
                        if (typeof (cartProduct.product_name).split('<br />')[1] != 'undefined') {
                            cartProductVariant1 = (cartProduct.product_name).split('<br />')[1];
                        }
                        
                        if (typeof (cartProduct.product_name).split('<br />')[2] != 'undefined') {
                            cartProductVariant2 = (cartProduct.product_name).split('<br />')[2];
                        }
                        
                        cartHtml += '<li data-id="' + cartProduct.product_id + '" data-variation="' + cartProduct.variant_id + '" data-bought-together="' + cartProduct.bought_together_id + '">';
    
                        if (typeof cartProduct.product_image.thumbs != 'undefined' && cartProduct.product_image.thumbs && typeof cartProduct.product_image.thumbs[180] != 'undefined' && cartProduct.product_image.thumbs[180]) {
                            cartHtml += '<a href="' + cartProduct.product_url.https + '"><img src="' + cartProduct.product_image.thumbs[180].https + '"></a>';
                        }
                        
                        cartHtml += '<div class="cart-sidebar-product-info">';
                        cartHtml += '<h4><a href="' + cartProduct.product_url.https + '">' + cartProductName + '</a></h4>';
                        
                        if (cartProductVariant1) {
                            cartHtml += '<p>' + cartProductVariant1 + '</p>';
                        }
    
                        if (cartProductVariant2) {
                            cartHtml += '<p>' + cartProductVariant2 + '</p>';
                        }
                        
                        cartHtml += '<small>Quantidade: ' + cartProduct.quantity + '</small>';
                        cartHtml += '<span>R$ ' + (parseFloat(cartProduct.price) * parseInt(cartProduct.quantity)).toFixed(2).replace('.', ',') + '</span>';
                        cartHtml += '</div>';
                        cartHtml += '<div class="cart-sidebar-product-remove"><a href="javascript: void(0);" rel="noreferrer noopener"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"><path d="M17,5V4a2,2,0,0,0-2-2H9A2,2,0,0,0,7,4V5H4A1,1,0,0,0,4,7H5V18a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V7h1a1,1,0,0,0,0-2ZM15,4H9V5h6Zm2,3H7V18a1,1,0,0,0,1,1h8a1,1,0,0,0,1-1Z" transform="translate(-3 -2)" fill-rule="evenodd"/><path d="M9,9h2v8H9Z" transform="translate(-3 -2)"/><path d="M13,9h2v8H13Z" transform="translate(-3 -2)"/></svg></a></div>';
                        cartHtml += '</li>';
                        
                        cartTotal = cartTotal + (parseFloat(cartProduct.price) * parseInt(cartProduct.quantity));
                        
                        cartTotalProducts = cartTotalProducts + parseInt(cartProduct.quantity);
                    });
                    
                    cartHtml += '</ul>';
                    
                    cartHtml += '<div class="cart-sidebar-footer">';
                    cartHtml += '<div class="cart-sidebar-footer-total">';
                    cartHtml += '<strong>Total</strong>';
                    cartHtml += '<span>R$ ' + cartTotal.toFixed(2).replace('.', ',') + '</span>';
                    cartHtml += '</div>';
                    cartHtml += '<div class="cart-sidebar-footer-buttons">';
                    cartHtml += '<a href="javascript: void(0);" rel="noreferrer noopener" class="toggle-sidebar-close">Continuar comprando</a>';
                    cartHtml += '<a href="' + cartLink + '">Finalizar compra</a>';
                    cartHtml += '</div>';
                    cartHtml += '</div>';
                    
                    $('.cart-sidebar-empty').removeClass('open');
                    $('.cart-sidebar .cart-sidebar-content').html(cartHtml);
                    $('.cart-sidebar .cart-sidebar-content').addClass('open');
                    $('.header .cart-toggle .cart-quantity').text(cartTotalProducts);
                    
                } else {
                    
                    $('.cart-sidebar-empty').addClass('open');
                    $('.cart-sidebar .cart-sidebar-content').html('');
                    $('.cart-sidebar .cart-sidebar-content').removeClass('open');
                    $('.header .cart-toggle .cart-quantity').text('0');
                    
                }
                
                $('.cart-sidebar').fadeIn('fast', function(){
                    $('.cart-sidebar').addClass('open');
                    $('.cart-sidebar').addClass('open-content');
                });
                
            }).fail(function (error) {
                var response = $.parseJSON(error.responseText);
                
                $('.cart-sidebar-empty').addClass('open');
                $('.cart-sidebar .cart-sidebar-content').html('');
                $('.cart-sidebar .cart-sidebar-content').removeClass('open');
                $('.header .cart-toggle .cart-quantity').text('0');
                
                $('.cart-sidebar').fadeIn('fast', function(){
                    $('.cart-sidebar').addClass('open');
                    $('.cart-sidebar').addClass('open-content');
                });
            });
            
        },
        
        filterToggle: function() {
            
            if ($('body').hasClass('filter-open')) {
                
                $('.filter-toggle').removeClass('open-content');
                $('.filter-buttons').removeClass('open');
                
                setTimeout(function(){
                    $('.filter-toggle-background').fadeOut('fast', function(){
                        $('.filter-toggle').removeClass('open');
                        $('body').removeClass('filter-open');
                    });
                }, 500);
                
            } else {
                
                $('.filter-toggle').addClass('open');
                
                $('.filter-toggle-background').fadeIn('fast', function(){
                    $('.filter-toggle').addClass('open-content');
                    $('body').addClass('filter-open');
                    
                    setTimeout(function(){
                        $('.filter-buttons').addClass('open');
                    }, 500);
                });
                
            }
            
        },
        
        offerbutton: function(){
            
            var offerbutton_cron_day = '';
            var offerbutton_cron_month = '';
            var offerbutton_cron_year = '';
            
            if (theme.settings.offerInfiniteCron) {
                var offerInfiniteDate = new Date();
                var offerInfiniteMonth = offerInfiniteDate.getMonth() + 1;

                offerbutton_cron_day = offerInfiniteDate.getDate() < 10 ? '0' + offerInfiniteDate.getDate() : offerInfiniteDate.getDate();
                offerbutton_cron_month = offerInfiniteMonth < 10 ? '0' + offerInfiniteMonth : offerInfiniteMonth;
                offerbutton_cron_year = offerInfiniteDate.getFullYear();
            } else if ($('#offerbutton-cron-date').length) {
                var offerbutton_cron_date = $('#offerbutton-cron-date').val();
                var offerbutton_cron_date_val = moment(offerbutton_cron_date, 'YYYY-MM-DD');

                if (offerbutton_cron_date_val.isValid()) {
                    var offerbutton_cron_date_start = new Date();
                    var offerbutton_cron_date_end = new Date(offerbutton_cron_date + ' 23:59:59');

                    if (offerbutton_cron_date_end > offerbutton_cron_date_start) {
                        offerbutton_cron_day = offerbutton_cron_date.split('-')[2];
                        offerbutton_cron_month = offerbutton_cron_date.split('-')[1];
                        offerbutton_cron_year = offerbutton_cron_date.split('-')[0];
                    }
                }
            }
            
            if ($('#offer-button-products').length && !getCookie('offerbutton_close') && (($('#offer-button-products .offer-button-top p').length && offerbutton_cron_day && offerbutton_cron_month && offerbutton_cron_year) || !$('#offer-button-products .offer-button-top p').length)) {
                
                $('#offer-button-products').addClass('active');
                
                $(document).delegate('#offer-button-products .offer-button-thumb div', 'click', function(){                    
                    $('#offer-button-products .offer-button-content').fadeIn('fast', function(){
                        $('#offer-button-products').addClass('open');
                        $('#offer-button-products').addClass('open-content');
                    });
                });
                
                $(document).delegate('#offer-button-products .offer-button-top .offer-button-close', 'click', function(){
                    $('#offer-button-products').removeClass('open-content');
                    
                    setTimeout(function(){
                        $('#offer-button-products .offer-button-content').fadeOut('fast', function(){
                            $('#offer-button-products').removeClass('open');
                        });
                    }, 500);
                });
                
                $(document).delegate('#offer-button-products .offer-button-content', 'click', function(element){
                    if ($(element.target).hasClass('offer-button-content')) {
                        $('#offer-button-products').removeClass('open-content');
                    
                        setTimeout(function(){
                            $('#offer-button-products .offer-button-content').fadeOut('fast', function(){
                                $('#offer-button-products').removeClass('open');
                            });
                        }, 500);
                    }
                });
                
                $(document).delegate('#offer-button-products .offer-button-thumb a', 'click', function(){
                    $('#offer-button-products').removeClass('active');
                    
                    setCookie('offerbutton_close', '1', 3);
                });
                
                if (offerbutton_cron_day && offerbutton_cron_month && offerbutton_cron_year) {
                    var start = new Date();
                    var end = new Date(offerbutton_cron_year + '-' + offerbutton_cron_month + '-' + offerbutton_cron_day + ' 23:59:59');
                    var seconds = Math.floor((end - (start)) / 1000);
                    var time = new Number();

                    time = seconds;

                    function offerbuttonCountdown(time) {
                        var days = Math.floor(time/24/60/60);
                        var hoursLeft = Math.floor((time) - (days*86400));
                        var hours = Math.floor(hoursLeft/3600);
                        var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
                        var minutes = Math.floor(minutesLeft/60);
                        var remainingSeconds = time % 60;

                        var text_days = '';
                        var text_hours = '';
                        var text_minutes = '';
                        var text_seconds = '';

                        if (parseInt(days) < 10) {
                            text_days = '0' + days;
                        } else {
                            text_days = days;
                        }

                        if (parseInt(hours) < 10) {
                            text_hours = '0' + hours;
                        } else {
                            text_hours = hours;
                        }

                        if (parseInt(minutes) < 10) {
                            text_minutes = '0' + minutes;
                        } else {
                            text_minutes = minutes;
                        }

                        if (parseInt(remainingSeconds) < 10) {
                            text_seconds = '0' + remainingSeconds;
                        } else {
                            text_seconds = remainingSeconds;
                        }

                        if (parseInt(text_days)) {
                            $('#offer-button-products .offer-button-top p span').html(text_days + ':' + text_hours + ':' + text_minutes + ':' + text_seconds);
                        } else {
                            $('#offer-button-products .offer-button-top p span').html(text_hours + ':' + text_minutes + ':' + text_seconds);
                        }

                      if (time == 0) {
                        $('#offer-button-products .offer-button-top p span').html('00:00:00');
                        $('#offer-button-products').remove();
                      } else {
                        time--;
                        setTimeout(function() { offerbuttonCountdown(time); }, 1000);
                      }
                    }

                    offerbuttonCountdown(time);
                } else {
                    $('#offer-button-products .offer-button-top p').remove();
                    $('.offer-button-container').addClass('offer-button-no-cron');
                }
                
                function offerbuttonScroll() {
                    var scroll = $(document).scrollTop() + window.innerHeight;
                    var element_height = (window.innerHeight - $('#offer-button-products .offer-button-thumb').height()) / 2;
                    
                    if ($('.newsletter').length) {
                        var element_top = $('.newsletter').offset().top - $('#offer-button-products .offer-button-thumb').height();
                        var footer = $('.newsletter').offset().top + element_height;
                    } else {
                        var element_top = $('.footer').offset().top - $('#offer-button-products .offer-button-thumb').height();
                        var footer = $('.footer').offset().top + element_height;
                    }
                    
                    if (scroll > footer) {
                        $('#offer-button-products .offer-button-thumb').css('top', element_top + 'px');
                        $('#offer-button-products .offer-button-thumb').css('position', 'absolute');
                    } else {
                        $('#offer-button-products .offer-button-thumb').removeAttr('style');
                    }
                }
                
                $(document).scroll(function(){
                    offerbuttonScroll();
                });
                
                offerbuttonScroll();
                
            }
            
        },
        
        offerbar: function(){
            
            var offerbar_cron_day = '';
            var offerbar_cron_month = '';
            var offerbar_cron_year = '';
            
            if (theme.settings.offerInfiniteCron) {
                var offerInfiniteDate = new Date();
                var offerInfiniteMonth = offerInfiniteDate.getMonth() + 1;

                offerbar_cron_day = offerInfiniteDate.getDate() < 10 ? '0' + offerInfiniteDate.getDate() : offerInfiniteDate.getDate();
                offerbar_cron_month = offerInfiniteMonth < 10 ? '0' + offerInfiniteMonth : offerInfiniteMonth;
                offerbar_cron_year = offerInfiniteDate.getFullYear();
            } else if ($('#offerbar-cron-date').length) {
                var offerbar_cron_date = $('#offerbar-cron-date').val();
                var offerbar_cron_date_val = moment(offerbar_cron_date, 'YYYY-MM-DD');

                if (offerbar_cron_date_val.isValid()) {
                    var offerbar_cron_date_start = new Date();
                    var offerbar_cron_date_end = new Date(offerbar_cron_date + ' 23:59:59');

                    if (offerbar_cron_date_end > offerbar_cron_date_start) {
                        offerbar_cron_day = offerbar_cron_date.split('-')[2];
                        offerbar_cron_month = offerbar_cron_date.split('-')[1];
                        offerbar_cron_year = offerbar_cron_date.split('-')[0];
                    }
                }
            }
            
            if ($('#offer-bar').length && !getCookie('offerbar_close') && (($('#offer-bar p').length && offerbar_cron_day && offerbar_cron_month && offerbar_cron_year) || !$('#offer-bar p').length)) {
                
                $('#offer-bar').addClass('active');
                
                $(document).delegate('#offer-bar .offer-bar-close', 'click', function(){
                    $('#offer-bar').removeClass('active');
                    
                    setCookie('offerbar_close', '1', 3);
                });
                
                if (offerbar_cron_day && offerbar_cron_month && offerbar_cron_year) {
                    var start = new Date();
                    var end = new Date(offerbar_cron_year + '-' + offerbar_cron_month + '-' + offerbar_cron_day + ' 23:59:59');
                    var seconds = Math.floor((end - (start)) / 1000);
                    var time = new Number();

                    time = seconds;

                    function offerbarCountdown(time) {
                        var days = Math.floor(time/24/60/60);
                        var hoursLeft = Math.floor((time) - (days*86400));
                        var hours = Math.floor(hoursLeft/3600);
                        var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
                        var minutes = Math.floor(minutesLeft/60);
                        var remainingSeconds = time % 60;

                        var text_days = '';
                        var text_hours = '';
                        var text_minutes = '';
                        var text_seconds = '';

                        if (parseInt(days) < 10) {
                            text_days = '0' + days;
                        } else {
                            text_days = days;
                        }

                        if (parseInt(hours) < 10) {
                            text_hours = '0' + hours;
                        } else {
                            text_hours = hours;
                        }

                        if (parseInt(minutes) < 10) {
                            text_minutes = '0' + minutes;
                        } else {
                            text_minutes = minutes;
                        }

                        if (parseInt(remainingSeconds) < 10) {
                            text_seconds = '0' + remainingSeconds;
                        } else {
                            text_seconds = remainingSeconds;
                        }

                        if (parseInt(text_days)) {
                            $('#offer-bar p span').html(text_days + ':' + text_hours + ':' + text_minutes + ':' + text_seconds);
                        } else {
                            $('#offer-bar p span').html(text_hours + ':' + text_minutes + ':' + text_seconds);
                        }

                      if (time == 0) {
                        $('#offer-bar p span').html('00:00:00');
                        $('#offer-bar').remove();
                      } else {
                        time--;
                        setTimeout(function() { offerbarCountdown(time); }, 1000);
                      }
                    }

                    offerbarCountdown(time);
                } else {
                    $('#offer-bar p').remove();
                }
                
            }
            
        },
        
        offerslide: function(){
            
            var offerslide_cron_day = '';
            var offerslide_cron_month = '';
            var offerslide_cron_year = '';
            
            if (theme.settings.offerInfiniteCron) {
                var offerInfiniteDate = new Date();
                var offerInfiniteMonth = offerInfiniteDate.getMonth() + 1;

                offerslide_cron_day = offerInfiniteDate.getDate() < 10 ? '0' + offerInfiniteDate.getDate() : offerInfiniteDate.getDate();
                offerslide_cron_month = offerInfiniteMonth < 10 ? '0' + offerInfiniteMonth : offerInfiniteMonth;
                offerslide_cron_year = offerInfiniteDate.getFullYear();
            } else if ($('#offerslide-cron-date').length) {
                var offerslide_cron_date = $('#offerslide-cron-date').val();
                var offerslide_cron_date_val = moment(offerslide_cron_date, 'YYYY-MM-DD');

                if (offerslide_cron_date_val.isValid()) {
                    var offerslide_cron_date_start = new Date();
                    var offerslide_cron_date_end = new Date(offerslide_cron_date + ' 23:59:59');

                    if (offerslide_cron_date_end > offerslide_cron_date_start) {
                        offerslide_cron_day = offerslide_cron_date.split('-')[2];
                        offerslide_cron_month = offerslide_cron_date.split('-')[1];
                        offerslide_cron_year = offerslide_cron_date.split('-')[0];
                    }
                }
            }
            
            if ($('#offer-slide').length && (($('#offer-slide .section-header p').length && offerslide_cron_day && offerslide_cron_month && offerslide_cron_year) || !$('#offer-slide .section-header p').length)) {
                
                $('#offer-slide').addClass('active');
                
                var swiper_slides = parseInt($('.section-showcase .list-product-offer').attr('data-slides'));
                var swiper_limit_slides = swiper_slides + 1;
                var swiper_number = $('.section-showcase .list-product-offer').length + 1;
                
                $('.section-showcase .list-product-offer .swiper').each(function(){
                    if ($(this).find('.item').length < swiper_limit_slides) {
                        var aux = 1;
                        var total = swiper_limit_slides / parseInt($(this).find('.item').length);
                        var html = $(this).find('.swiper-wrapper').html();

                        while (aux <= total) {
                            $(this).find('.swiper-wrapper').append(html);

                            aux++;
                        }
                    }

                    $(this).addClass('list-product-swiper-' + swiper_number);

                    new Swiper(this, {
                        spaceBetween: 10,
                        loop: true,
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        pagination: {
                            el                : '.list-product-swiper-' + swiper_number + ' .dots',
                            bulletClass       : 'dot',
                            bulletActiveClass : 'dot-active',
                            clickable         : true
                        },
                        navigation: {
                          nextEl: '.list-product-swiper-' + swiper_number + ' .next',
                          prevEl: '.list-product-swiper-' + swiper_number + ' .prev',
                        },
                        breakpoints: {
                          1201: {
                            spaceBetween: 25,
                            slidesPerView: swiper_slides,
                            slidesPerGroup: swiper_slides
                          },
                          921: {
                            spaceBetween: 25,
                            slidesPerView: 4,
                            slidesPerGroup: 4
                          },
                          768: {
                            spaceBetween: 20,
                            slidesPerView: 3,
                            slidesPerGroup: 3
                          }
                        }
                    });

                    swiper_number++;
                });
                
                if (offerslide_cron_day && offerslide_cron_month && offerslide_cron_year) {
                    var start = new Date();
                    var end = new Date(offerslide_cron_year + '-' + offerslide_cron_month + '-' + offerslide_cron_day + ' 23:59:59');
                    var seconds = Math.floor((end - (start)) / 1000);
                    var time = new Number();

                    time = seconds;

                    function offerslideCountdown(time) {
                        var days = Math.floor(time/24/60/60);
                        var hoursLeft = Math.floor((time) - (days*86400));
                        var hours = Math.floor(hoursLeft/3600);
                        var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
                        var minutes = Math.floor(minutesLeft/60);
                        var remainingSeconds = time % 60;

                        var text_days = '';
                        var text_hours = '';
                        var text_minutes = '';
                        var text_seconds = '';

                        if (parseInt(days) < 10) {
                            text_days = '0' + days;
                        } else {
                            text_days = days;
                        }

                        if (parseInt(hours) < 10) {
                            text_hours = '0' + hours;
                        } else {
                            text_hours = hours;
                        }

                        if (parseInt(minutes) < 10) {
                            text_minutes = '0' + minutes;
                        } else {
                            text_minutes = minutes;
                        }

                        if (parseInt(remainingSeconds) < 10) {
                            text_seconds = '0' + remainingSeconds;
                        } else {
                            text_seconds = remainingSeconds;
                        }

                        if (parseInt(text_days)) {
                            $('#offer-slide .section-header p span').html(text_days + ':' + text_hours + ':' + text_minutes + ':' + text_seconds);
                        } else {
                            $('#offer-slide .section-header p span').html(text_hours + ':' + text_minutes + ':' + text_seconds);
                        }

                      if (time == 0) {
                        $('#offer-slide .section-header p span').html('00:00:00');
                        $('#offer-slide').remove();
                      } else {
                        time--;
                        setTimeout(function() { offerslideCountdown(time); }, 1000);
                      }
                    }

                    offerslideCountdown(time);
                } else {
                    $('#offer-slide .section-header p').remove();
                }
                
            }
            
        }

    };

    $(function(){

        theme.resets();
        theme.recoveryStoreId();
        theme.setNavWidth();
        theme.instagramFeed();
        theme.offerbutton();
        theme.offerbar();
        theme.offerslide();

        setTimeout(function(){
            theme.processRteElements();
            theme.loadThemeVersion();
            theme.initLazyload();
            theme.initMasks();
            theme.initCookieAlert();
            theme.initPopupNewsletter();
            theme.toggleModalTheme();
        },20);
        
        $('.header-search-wrapper .header-search-button').click(function(){
            $('.header-search-wrapper').toggleClass('active');
            $('.header-search-form').toggleClass('active');
            
            if ($('.header-search-form').hasClass('active')) {
                $('.header-search-form-content input.input-search').trigger('focus');
            }
        });
        
        $(document).delegate('.nav-mobile li.sub > a', 'click', function(element){
            element.preventDefault();

            $(this).closest('li').toggleClass('open');

            return false;
        });
        
        $(document).delegate('.header-menu', 'click', function(){
            theme.menuMobile();
        });
        
        $('.cart-toggle').click(function(){
            theme.cartSidebar();
        });
        
        $(document).delegate('.cart-sidebar-product-remove a', 'click', function(){
            var session = $('html').attr('data-session');
            var product = $(this).closest('li');
            var product_id = parseInt(product.attr('data-id'));
            var variant_id = '/' + product.attr('data-variation');
            var bought_together_id = product.attr('data-bought-together') !== '' ? '/' + product.attr('data-bought-together') : '';
    
            fetch('/web_api/carts/' + session + '/' + product_id + variant_id + bought_together_id, {
                method: "DELETE",
            }).then(response => response.json()).then(result => {
                product.fadeOut('fast', function(){
                    product.remove();
                    
                    theme.cartSidebar();
                });
            }).catch(err => {
                console.error('Falha', err);
            });
        });
        
        $(document).delegate('.toggle-sidebar-close', 'click', function(element){
            if ($(element.target).hasClass('toggle-sidebar-close')) {
                $('.toggle-sidebar').removeClass('open-content');
                
                setTimeout(function(){
                    $('.toggle-sidebar').fadeOut('fast', function(){
                        $('.toggle-sidebar').removeClass('open');
                    });
                }, 500);
            }
        });
        
        $(document).delegate('.toggle-sidebar-close', 'touchstart', function(element){
            if ($(element.target).hasClass('toggle-sidebar-close')) {
                $('.toggle-sidebar').removeClass('open-content');
                
                setTimeout(function(){
                    $('.toggle-sidebar').fadeOut('fast', function(){
                        $('.toggle-sidebar').removeClass('open');
                    });
                }, 500);
            }
        });
        
        $('.button-filter-toggle').click(function(){
            theme.filterToggle();
        });
        
        $(document).delegate('.filter-toggle-close', 'click', function(){
            theme.filterToggle();
        });
        
        $(document).delegate('.filter-toggle-background', 'click', function(){
            theme.filterToggle();
        });
      
        if($('html').hasClass('page-home')){
            setTimeout(function(){
                theme.bannerHome();
                theme.loadNews();
            }, 40);
            
            theme.storeReviewsIndex();
        }

        else if($('html').hasClass('page-newsletter')){
            theme.organizeNewsletterPage();
        }

        else if($('html').hasClass('page-catalog') || $('html').hasClass('page-search')){
            theme.slideCatalog();
            theme.sortMobile();
        }

        else if($('html').hasClass('page-product')){
            if ($('.tag-price-discount').length) {
                window.product_discount_html = $('.tag-price-discount').html();
            } else {
                window.product_discount_html = false;
            }
            
            theme.initProductGallery();
            theme.toggleProductVideo();
            theme.detectProductVariantChanges();
            theme.goToProductReviews();
            theme.getShippingRates();
            theme.productBuyTogether();
            theme.productTabsAction();
            theme.productReviews();
            theme.organizeProductHistory();
        }

        else if ($('html').hasClass('page-busca_noticias')){
            theme.organizeNewsPage();
            theme.generateBreadcrumb('news-page-listing');
        }

        else if ($('html').hasClass('page-noticia')){
            theme.generateBreadcrumb('news-page');
        }

        else if ($('html').hasClass('page-depoimentos')){
            theme.organizeStoreReviewsPage();
            theme.validateStoreReviewForm();
        }

        else if($('html').hasClass('page-contact')){
            theme.organizeContactPage();
        }

        else if($('html').hasClass('page-finalizar_presentes')){
            theme.gifts();
        }
        
        new Swiper('.header-top-benefits', {
            loop: true,
            effect: 'fade',
            autoplay :{
                delay: 3000,
                disableOnInteraction : false
            }
        });
        
        if ($('.featured-categories').length) {
           var featured_total = $('.featured-categories .swiper-slide').length;
            
           $('.featured-categories').addClass('featured-categories-' + featured_total);
            
           if (featured_total >= 8) {
               $('.featured-categories').removeClass('featured-categories-no-slide');
               
               new Swiper('.featured-categories .swiper', {
                    spaceBetween: 20,
                    loop: false,
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    navigation: {
                        nextEl: '.featured-categories .next',
                        prevEl: '.featured-categories .prev'
                    },
                    breakpoints: {
                      768: {
                        spaceBetween: 40,
                        slidesPerView: 'auto',
                        slidesPerGroupAuto: true
                      }
                    }
               }); 
           }
        }
        
        if ($('.featured-brands').length) {
           var featured_total = $('.featured-brands .swiper-slide').length;
            
           $('.featured-brands').addClass('featured-brands-' + featured_total);
            
           if (featured_total >= 8) {
               $('.featured-brands').removeClass('featured-brands-no-slide');
               
               new Swiper('.featured-brands .swiper', {
                    spaceBetween: 20,
                    loop: false,
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    navigation: {
                        nextEl: '.featured-brands .next',
                        prevEl: '.featured-brands .prev'
                    },
                    breakpoints: {
                      768: {
                        spaceBetween: 40,
                        slidesPerView: 'auto',
                        slidesPerGroupAuto: true
                      }
                    }
                });
           }
        }
        
        $('.pagination-select').change(function(){
            var page_number = parseInt($(this).val());
            var page_url = '';
            
            $('.pagination-numbers a').each(function(){
                if (parseInt($(this).text()) == page_number) {
                    page_url = $(this).attr('href');
                }
            });
            
            if (page_url) {
                window.location = page_url;
            }
        });
        
        var swiper_slides = parseInt($('.section-showcase .list-product').attr('data-slides'));
        var swiper_limit_slides = swiper_slides + 1;
        var swiper_number = 1;
        
        $('.section-showcase .list-product:not(.list-product-offer) .swiper').each(function(){
            if ($(this).find('.item').length < swiper_limit_slides) {
                var aux = 1;
                var total = swiper_limit_slides / parseInt($(this).find('.item').length);
                var html = $(this).find('.swiper-wrapper').html();
                
                while (aux <= total) {
                    $(this).find('.swiper-wrapper').append(html);
                    
                    aux++;
                }
            }
            
            $(this).addClass('list-product-swiper-' + swiper_number);
        
            new Swiper(this, {
                spaceBetween: 10,
                loop: true,
                slidesPerView: 2,
                slidesPerGroup: 2,
                pagination: {
                    el                : '.list-product-swiper-' + swiper_number + ' .dots',
                    bulletClass       : 'dot',
                    bulletActiveClass : 'dot-active',
                    clickable         : true
                },
                navigation: {
                  nextEl: '.list-product-swiper-' + swiper_number + ' .next',
                  prevEl: '.list-product-swiper-' + swiper_number + ' .prev',
                },
                breakpoints: {
                  1201: {
                    spaceBetween: 25,
                    slidesPerView: swiper_slides,
                    slidesPerGroup: swiper_slides
                  },
                  921: {
                    spaceBetween: 25,
                    slidesPerView: 4,
                    slidesPerGroup: 4
                  },
                  768: {
                    spaceBetween: 20,
                    slidesPerView: 3,
                    slidesPerGroup: 3
                  }
                }
            });
            
            swiper_number++;
        });
        
        if ($('.section-noticias-content').length) {
            setTimeout(function() {
                $.ajax({
                    url: 'busca_noticias.php?loja=' + document.getElementsByTagName('html')[0].getAttribute('data-store') + '&' + document.getElementsByTagName('html')[0].getAttribute('data-files'),
                    type: 'GET',
                    dataType: 'html',
                    contentType: 'charset=iso-8859-1',
                    success: function(result) {
                        var html = result.split('<ul class="noticias">')[1].split('</ul>')[0].split('alt=""').join('alt="NotÃ­cia"').split('href=').join('aria-label="NotÃ­cia" href=');
                        
                        $('.section-noticias-content').html('<ul>' + html + '</ul>');
                    }
                })
            }, 400);
        }
        
        $('.product-wrapper .product-form .product-social-share > button').click(function(){
            $('.product-social-share-content').toggleClass('active');
        });

    });

}(jQuery));