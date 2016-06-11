var $W = $(window),
    $D = $(document),
    $H = $('html'),
    $B = $('body');

$D.ready(function($) {
    var $resultMain =$('.js-result-main');
    var $resultAll =$('.js-result-all');
    var $resultInner =$('.js-result-all-inner');
    var $resultPopup =$('.js-result-popup');

    var $removeTagBtn = $('.js-remove-tag-btn');
    var $removeAllTagBtn = $('.js-remove-all-tag-btn');
    var $tagsWr = $('.js-tags-wr');

    var $similarCount = $('.js-similar-count');
    var $keyInput = $('.js-key-input');

    var $songsWr = $('.js-songs-wr');
    var $songs = $('.js-song');
    var $songsTrigger =$('.song__content', $songs);

    var popupSpeed = 300;

    $B.on('click', '.js-page-nav-btn', function (e) {
        e.preventDefault();

        $resultInner.show();
        $resultAll.removeClass('_open');

        setTimeout(function() {
            $resultMain.css('height', 'auto');
        }, popupSpeed);
    });

    $songsTrigger.on('click', function(e){
        e.preventDefault();

        if ($B.hasClass('_popup-anim')) return;
        $B.addClass('_popup-anim');

        var $that = $(this);
        var $parent = $that.closest($songs);

        var id = $parent.data('id');
        var url = $parent.data('url');

        var wPos = $W.scrollTop();
        var wWidth = $W.width();
        var resAllOffsetTop = $resultAll.offset().top;

        // console.log(wPos);
        // console.log(wWidth);
        // console.log(resAllOffsetTop);


        $.ajax({
            url: url,
            type: 'POST',
            error: function() {
                 alert('An error has occurred!');
            },
            success: function(data) {
                 $resultPopup.html(data);
                 if (wPos > 0 && wWidth > 560) {
                     $('body, html').stop().animate({scrollTop:0}, '500', 'swing', function() { 
                         openPopup();
                     });
                 } else if (wPos == 0){
                     openPopup();
                 } else if (wWidth <= 560) {
                     $W.scrollTop(resAllOffsetTop);
                     openPopup();
                 }
            }
        });

    });

    $W.on('resize', function(){
        if ($resultAll.hasClass('_open')) {
            compareHeight();
        } else {
            $resultMain.css('height', 'auto');
        }
    });
    $W.resize();

    function openPopup() {
        $resultAll.addClass('_open');

        setTimeout(function() {
            $resultInner.hide();
            compareHeight();
            $B.removeClass('_popup-anim');
        }, popupSpeed);
    }

    function compareHeight() {
        $resultMain.css('height', 'auto');
        $resultPopup.css('height', 'auto');

        var hMain = $resultMain.outerHeight();
        var hPopup = $resultPopup.outerHeight();
        var maxH = 0;

        if (hMain >= hPopup) {
            maxH = hMain;
            $resultPopup.height(maxH);
        } else {
            maxH = hPopup;
            $resultMain.height(maxH);
        }
    }


    $(function () {
        var $mainSearchInput = $('.js-main-search-inp');
        var $mainSeacrhRes = $('.js-main-search-res');
        var $sendBtn = $('.js-send-btn');
        var $mainSongResult = $('.js-result-main-song');

        var $keySeacrhRes = $('.js-key-search-res');

        var $keySeacrhWr = $('.js-key-searh-wr');
        var $mainSeacrhWr = $('.js-main-search-wr');

        var $tagList = $('.js-tag-list');

        var inputTimeout;
        var keyInputTimeout;

        $D.on('click', function(e){
            var $target = $(e.target);

            if (!$target.closest($keySeacrhWr).length) {
                closeKeySeacrchRes();
            }

            if (!$target.closest($mainSeacrhWr).length) {
                closeMainSeacrchRes();
            }
        });

        $removeAllTagBtn.on('click', function(e){
            e.preventDefault();

            var $that = $(this);

            $('.js-remove-tag-btn').remove();
            $tagsWr.removeClass('_show');
            if (!$('.js-result-main-song .song').length) return;
            sendSimilar();
        });


        $mainSearchInput.on('keyup', function(e){
            var $that = $(this);
            var value = $that.val().trim();
            var valueLenght = value.length;

            clearTimeout(inputTimeout);

            if (valueLenght >= 3) {
                inputTimeout = setTimeout(function(){
                    sendSuggestTitle();
                },200);
            } else {
                closeMainSeacrchRes();
            }
        });

        $keyInput.on('keyup', function(e){
            var $that = $(this);
            var value = $that.val().trim();
            var valueLenght = value.length;

            if (!$('.js-result-main-song .song').length) return;

            if (e.keyCode == 13) {
                sendSimilar();
                closeKeySeacrchRes();
                return;
            }

            clearTimeout(keyInputTimeout);

            if (valueLenght >= 3) {
                keyInputTimeout = setTimeout(function(){
                    openKeySeacrchRes();
                    // sendKeywordsForTags();
                },200);
            } else {
                closeKeySeacrchRes();
            }
        });


        // $sendBtn.on('click', function(e){
        //     e.preventDefault();
        //     var $that = $(this);

        //     sendSuggestTitle();
        // });


        $B.on('click', '.js-res-song', function () {
            var $that = $(this);
            var id = $that.data('id');

            sendById(id);
        });

        $B.on('click', '.js-remove-tag-btn', function () {
            var $that = $(this);

            $that.remove();

            if (!$('.js-remove-tag-btn').length) {
                $tagsWr.removeClass('_show');
            }

            if (!$('.js-result-main-song .song').length) return;
            sendSimilar();
        });

        // Click on tag
        $B.on('click', '.js-add-tag-btn', function () {
            var $that = $(this);
            var id = $that.data('id');
            var name = $that.find('h5').text();

            var tagTemplat = '<span class="btn btn-tag btn--green js-remove-tag-btn" data-id="'+id+'"><span>'+name+'</span><i class="iconic iconic--cross"></i></span>'

            $tagList.append(tagTemplat);
            $tagsWr.addClass('_show');

            sendSimilar();
        });

        function sendSuggestTitle() {
            var inputValue = $mainSearchInput.val();
            var resTemplate;

            var sendData = sendDataTemplate.suggestTitle;

            sendData.suggestTitle.limit = 5;
            sendData.suggestTitle.keywords = inputValue;

            console.log('Send data: '+sendData.object);

            responseToServer({
                url: sendUrl.suggestTitle,
                data: sendData,
                error: function() {
                    alert('An error has occurred!');
                },
                success: function(response) {
                    var cont = '';

                    console.log('Response: '+response.object+'\n\n');

                    $.each(response.titles, function(index, val) {
                        var authorWr = '';
                        var authors = '';

                        if (val.authors){
                            $.each(val.authors, function(subIndex, subVal) {
                                authors += '<i data-id="'+subVal.id+'">'+subVal.name+'</i> ';
                            });
                            authorWr = '<span>by '+authors+'</span>';
                        } else {
                            authorWr = '';
                        }

                        cont +=''+
                            '<li class="js-res-song" data-id="'+val.id+'">'+
                                '<h5>'+val.title+'</h5>'+
                                authorWr+
                            '</li>';
                    });

                    resTemplate = '<ul>'+cont+'</ul>';

                    $mainSeacrhRes.html(resTemplate);
                    openMainSeacrchRes();
                }
            });

        }

        function sendById(id) {
            var resTemplate;

            var sendData = sendDataTemplate.byId;
            sendData.byId.ids = id;

            console.log('Send data: '+sendData.object);

            responseToServer({
                url: sendUrl.byId,
                data: sendData,
                error: function() {
                    alert('Не нашли песню');
                },
                success: function(response) {
                    var song = response.songs[0];
                    var tags = '';
                    var rowsWr = '';
                    var rows = '';

                    console.log('Response: '+response.object+'\n\n');

                    $.each(song.rowsTagged, function(index, val) {
                        val = val.replace(/{/g,"<i>")
                        val = val.replace(/}/g,"</i>")
                        rows += '<span>'+val+'</span>';
                    });

                    $.each(song.tags, function(index, val) {
                        tags += '<span class="js-tag-btn" data-id="'+ val.id+'"><span>'+ val.name+'</span></span>'
                    });

                    resTemplate = ''+
                    '<div class="song col-one" data-id="'+ song.id +'">'+
                        '<div cla<div class="song__head">'+
                            '<h4 class="song__title"><span>'+ song.title +'</span></h4>'+
                            '<p class="song__subtitle">by <span>'+ song.group +'</span></p>'+
                        '</div>'+
                        '<div class="song__content">'+
                            '<p class="song__text">'+
                                rows+
                            '</p>'+
                        '</div>'+
                        '<div class="song__footer">'+ tags +'</div>'+
                    '</div>'+
                    '<div class="result-main__edit">'+
                        '<a href="#!" class="btn btn--white btn--trans btn--big">'+
                            '<i class="iconic iconic--pen"></i>'+
                            '<span>Edit song</span>'+
                        '</a>'+
                    '</div>';

                    closeMainSeacrchRes();
                    $mainSongResult.html(resTemplate);
                    sendSimilar(id);
                }
            });

        }

        // $('.result-subsearch__filters').on('click', function(e){
        //     e.preventDefault();
        //     var $that = $(this);

        //     sendSimilar(2);
        // });

        function sendSimilar(id) {
            var resultContent = '';
            var resTemplate;
            var tagsIds = [];
            var keywords = '';
            var sendData = sendDataTemplate.similar;
            var id = id || $('.js-result-main-song .song').data('id');

            sendData.similar.id = id;

            $('.js-remove-tag-btn').each(function(index, el) {
               tagsIds.push($(el).data('id'));
            });
            if (tagsIds.length) sendData.similar.tags = tagsIds;

            keywords = $keyInput.val().trim();
            if (keywords.length) sendData.similar.keywords = keywords;

            console.log('Send data: '+sendData.object);

            responseToServer({
                url: sendUrl.similar,
                data: sendData,
                error: function() {
                    alert('Не нашли песен');
                },
                success: function(response) {
                    var songsCount = response.songs.length;

                    console.log('Response: '+response.object+'\n\n');

                    if (songsCount > 0) {
                        $similarCount.addClass('_active');
                        $('i', $similarCount).html(songsCount);
                    } else {
                        $similarCount.removeClass('_active');
                        $('i', $similarCount).html(0);
                    }


                    $.each(response.songs, function(index, song) {
                        var tags = '';
                        var rowsWr = '';
                        var rows = '';

                        $.each(song.rowsTagged, function(index, val) {
                            val = val.replace(/{/g,"<i>")
                            val = val.replace(/}/g,"</i>")
                            rows += '<span>'+val+'</span>';
                        });

                        $.each(song.tags, function(index, val) {
                            tags += '<span class="js-tag-btn" data-id="'+ val.id+'"><span>'+ val.name+'</span></span>'
                        });

                        resTemplate = ''+
                            '<div class="song song--item col-one js-song" data-id="'+ song.id +'">'+
                                '<div cla<div class="song__head">'+
                                    '<h4 class="song__title"><span>'+ song.title +'</span></h4>'+
                                    '<p class="song__subtitle">by <span>'+ song.group +'</span></p>'+
                                '</div>'+
                                '<div class="song__content">'+
                                    '<p class="song__text">'+
                                        rows+
                                    '</p>'+
                                '</div>'+
                                '<div class="song__footer">'+ tags +'</div>'+
                            '</div>';


                        resultContent += resTemplate;
                        
                    });    

                    $('.cols', $songsWr).html(resultContent);

                }
            });
        }

        function sendKeywordsForTags() {
            var resultContent = '';
            var resTemplate;
            var keywords = '';
            var sendData = sendDataTemplate.tags;

            keywords = $keyInput.val().trim();

            console.log('Send data: '+sendData.object);

            responseToServer({
                url: sendUrl.tags,
                data: sendData,
                error: function() {
                    alert('Не нашли тегов');
                },
                success: function(response) {
                    var songsCount = response.songs.length;

                    console.log('Response: '+response.object+'\n\n');

                    console.log(response);

                    // if (songsCount > 0) {
                    //     $similarCount.addClass('_active');
                    //     $('i', $similarCount).html(songsCount);
                    // } else {
                    //     $similarCount.removeClass('_active');
                    //     $('i', $similarCount).html(0);
                    // }


                    // $.each(response.songs, function(index, song) {
                    //     var tags = '';
                    //     var rowsWr = '';
                    //     var rows = '';

                    //     $.each(song.rowsTagged, function(index, val) {
                    //         val = val.replace(/{/g,"<i>")
                    //         val = val.replace(/}/g,"</i>")
                    //         rows += '<span>'+val+'</span>';
                    //     });

                    //     $.each(song.tags, function(index, val) {
                    //         tags += '<span class="btn btn--green js-tag-btn" data-id="'+ val.id+'"><span>'+ val.name+'</span></span>'
                    //     });

                    //     resTemplate = ''+
                    //         '<div class="song song--item col-one js-song" data-id="'+ song.id +'">'+
                    //             '<div cla<div class="song__head">'+
                    //                 '<h4 class="song__title"><span>'+ song.title +'</span></h4>'+
                    //                 '<p class="song__subtitle">by <span>'+ song.group +'</span></p>'+
                    //             '</div>'+
                    //             '<div class="song__content">'+
                    //                 '<p class="song__text">'+
                    //                     rows+
                    //                 '</p>'+
                    //             '</div>'+
                    //             '<div class="song__footer">'+ tags +'</div>'+
                    //         '</div>';


                    //     resultContent += resTemplate;
                        
                    // });    

                    $('.cols', $songsWr).html(resultContent);

                }
            });
        }

        function openMainSeacrchRes() {
            $mainSearchInput.addClass('_open');
            $mainSeacrhRes.addClass('_open');
        }

        function closeMainSeacrchRes() {
            $mainSearchInput.removeClass('_open');
            $mainSeacrhRes.removeClass('_open');
        }

        function openKeySeacrchRes() {
            $keyInput.addClass('_open');
            $keySeacrhRes.addClass('_open');
        }

        function closeKeySeacrchRes() {
            $keyInput.removeClass('_open');
            $keySeacrhRes.removeClass('_open');
        }

    });
    
   
});

function responseToServer(options) {
    var settings = $.extend({
        type: options.type || 'POST',
        data: options.data || '',
        dataType: options.dataType || 'json',
        error: options.error || function() {},
        success: options.success || function() {}
    }, options );


    $.ajax({
        url: settings.url,
        type: settings.type,
        data: settings.data,
        dataType: settings.dataType,
        error: settings.error,
        success: settings.success
    });
}

var serverName = 'http://cells.care:8089/';

var sendUrl = {
     suggestTitle: serverName+'songs/search/suggest_title'
    ,byId: serverName+'songs/search/byid'
    ,similar: serverName+'songs/search/similar'
    ,tags: serverName+'env/tags&lang=rus'
};

var sendDataTemplate = {
    suggestTitle: {
        "object": "frontend.suggest.title.request",
        "version": "1.0",
        "suggestTitle": {
            "lang": "eng",
            "limit": 5
        }
    }
    ,byId: {
        "object": "frontend.byid.request",
        "version": "1.0",
        "byId": {
            "lang": "eng",
            "ids": []
        }
    }
    ,similar: {
        "object": "frontend.similar.request",
        "version": "1.0",
        "similar": {
            "lang": "eng",
            "id": 0,
            "limit": 5
        }
    }
    ,tags: {}

};
