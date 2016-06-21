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
    var keywordsMin = 2;
    var newRowsCount = 4;
    
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

    var tempRhytmResponse;

    // ----------------
    var $editTa = $('.js-edit-song-ta');
    _songEditInit();

    // ----------------

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

        if (valueLenght >= keywordsMin) {
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

        if (valueLenght >= keywordsMin) {
            keyInputTimeout = setTimeout(function(){
                openKeySeacrchRes();
                // sendKeywordsForTags();
            },200);
        } else {
            closeKeySeacrchRes();
        }
    });

    $B.on('click', '.js-add-more-row-btn', function () {
        addMoreRows(4)
    });

    $B.on('click', '.js-res-song', function () {
        var $that = $(this);
        var id = $that.data('id');

        sendById(id);
    });

    $B.on('click', '.js-rm', function () {
        var $that = $(this);
        var type = $that.data('type');

        if (type == '+') {
            $that.removeClass('rm--up');
            $that.addClass('rm--down');
            $that.data('type', '-');
        } else if (type == '-') {
            $that.removeClass('rm--down');
            $that.addClass('rm--up');
            $that.data('type', '+');
        } else if (type == '?') {
            $that.removeClass('rm--quest');
            $that.addClass('rm--down');
            $that.data('type', '-')
        }

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

    // Нажатие на кнопку редактирования песни
    $B.on('click', '.js-edit-lyr-btn', function (e) {
        e.preventDefault();

        $('.js-app')
            .removeClass('_state-rhytm-edit')
            .addClass('_state-lyrics-edit');
    });

    // Нажатие на кнопку поиска по тексту
    $B.on('click', '.js-search-lyr-tab-btn', function (e) {
        e.preventDefault();

        $('.js-app')
            .removeClass('_state-rhytm-edit')
            .removeClass('_state-lyrics-edit')
            .addClass('_state-searching');

        $('.js-main-search-inp').focus();
    });

    // Нажатие на кнопку нового текста
    $B.on('click', '.js-lyr-new-btn', function (e) {
        e.preventDefault();

        $('.js-app')
            .removeClass('_state-rhytm-edit')
            .removeClass('_state-searching')
            .addClass('_state-lyrics-edit');
    });

    // Нажатие на кнопку и выполнение sendPresyllables()
    $B.on('click', '.js-edit-rhytm-btn', function (e) {
        e.preventDefault();
        var $that = $(this);
        sendPresyllables();
    });

    // Нажатие на кнопку и выполнение sendSimilarByLyrics()
    $B.on('click', '.js-find-lyr-match-btn', function (e) {
        e.preventDefault();
        var $that = $(this);
        sendSimilarByLyrics();
    });

    // Отправляем песню, чтобы получить ритмическую сетку
    function sendPresyllables() {
        var resTemplate = '';
        var sendData = sendDataTemplate.presyllables;

        sendData.presyllables.rows = getRowsFromSong();

        // console.log(sendData.presyllables.rows);

        responseToServer({
            url: sendUrl.presyllables,
            data: sendData,
            error: function() {
                alert('An error has occurred!');
            },
            success: function(response) {
                var cont = '';

                tempRhytmResponse = response;

                // console.log('Response: '+tempRhytmResponse.object+'\n\n');

              // tempRhytmResponse.syllables.rows = [{
              //   "plain": "Wesll be singing",
              //   "syl": [
              //     { "start": 0, "length": 5, "type": "+" },
              //     { "start": 6, "length": 2, "type": "?" },
              //     { "start": 9, "length": 2, "type": "-" },
              //     { "start": 13, "length": 3, "type": "-" },
              //   ]
              // }];
              
                $.each(tempRhytmResponse.syllables.rows, function(index, val) {
                    var plain = val.plain;
                    var rowData = val.syl;
                    var rhytms = '';
                    var plainLength = plain.length;

                    if (!rowData) {
                        cont += '<div class="rhytm-edit-input js-rhytm-edit-input">'+plain+'</div>';
                    } else {
                        var sortedSyl = rowData.sort(function(a,b) { return a.start > b.start})
                        // var plStart = 0;

                        for (var i = 0; i < plainLength; ++i) {

                            for (var j = 0; j < sortedSyl.length; j++) {
                                var start = sortedSyl[j].start;
                                var length = sortedSyl[j].length;
                                var type = sortedSyl[j].type;
                                var rm;
                                var rmType = '';

                                // console.log(start);

                                if (i == start) {
                                    rm = plain.substr(start,length);
                                    if (type == '+') {
                                        rmType = 'up';
                                    } else if (type == '-') {
                                        rmType = 'down';
                                    } else if (type == '?') {
                                        rmType = 'quest';
                                    }

                                    rhytms +='<span class="js-rm rm rm--'+rmType+'" data-start="'+start+'" data-length="'+length+'" data-type="'+type+'">'+rm+'</span>';

                                    i = start+length;
                                    // plStart = start+length;
                                }

                            }

                            rhytms +=plain.substr(i,1);
                            // plStart++;
                        }

                        cont += '<div class="rhytm-edit-input js-rhytm-edit-input">'+rhytms+'</div>';
                    }


                });

                resTemplate = cont;

                $('.js-rhytm-edit-block').html(resTemplate)

                $('.js-app')
                    .removeClass('_state-lyrics-edit')
                    .addClass('_state-rhytm-edit');
            }
        });

    }

    // Отправляем лирику, чтобы получить похожие по тектсу
    function sendSimilarByLyrics() {
        var resultContent = '';
        var resTemplate;
        var tagsIds = [];
        var keywords = '';
        var sendData = sendDataTemplate.similar2;

        // console.log('Send data: '+sendData.object);

        sendData.similar.rows = collectDataFromRhytms();

        sendData ={
              "object": "frontend.similar.request",
              "version": "1.0",
              "similar": {
                "lang": "rus",
                "limit": 5,
                "rows": [
                  {
                    "plain": "Я хочу напиться чаю",
                    "syl": [
                      { "start": 0, "length": 1, "type": "+" },
                      { "start": 2, "length": 2, "type": "-" },
                      { "start": 7, "length": 2, "type": "-" }
                    ]
                  },
                  {
                    "plain": "К самовару подбегаю,",
                    "syl": [
                      { "start": 4, "length": 2, "type": "-" },
                      { "start": 6, "length": 2, "type": "+" }
                    ]
                  },
                  {
                    "plain": ""
                  },
                  {
                    "plain": "А пузатый от меня"
                  },
                  {
                    "plain": "Убежал, как от огня",
                    "syl": [
                      { "start": 0, "length": 1, "type": "-" },
                      { "start": 1, "length": 2, "type": "-" },
                      { "start": 3, "length": 3, "type": "+" }
                    ]
                  }
                ],
                "keywords": "hello bye",
                "tags": [ 11, 5, 8 ]
              }
            };

        responseToServer({
            url: sendUrl.similar,
            data: sendData,
            error: function() {
                alert('Не нашли песен');
            },
            success: function(response) {
                var songsCount = response.songs.length;

                console.log(response);

                // console.log('Response: '+response.object+'\n\n');

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
                //         tags += '<span class="js-tag-btn" data-id="'+ val.id+'"><span>'+ val.name+'</span></span>'
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

                // $('.cols', $songsWr).html(resultContent);

            }
        });
    }


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
                console.log(response);
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

        keywords = $keyInput.val();
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

                // console.log(response);

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

    // Inits
    function _songEditInit() {
        autosize($('.js-edit-song-ta'));
        var inputsVal;

        $D.on('keydown', '.js-edit-song-ta', function (event) {
            var $that = $(this);
            var val = $that.val();


            if (event.keyCode == 13) {
                event.preventDefault();
                var $nextWr = $that.closest('.js-song-edit-input').next();

                if ($nextWr.length) {
                    $('.js-edit-song-ta', $nextWr).focus();
                } else {
                    addMoreRows();
                    $('.js-edit-song-ta', $that.closest('.js-song-edit-input').next()).focus();
                }
            }
        });

        $D.on('keyup focus blur', '.js-edit-song-ta', function (event) {
            checkInputValue();

            if ($(this).is(':focus')) {
                $('.js-app').addClass('_hide-placeholder')
            }
        });

        function checkInputValue() {
            $('.js-edit-song-ta').each(function(index, el) {
                var $innerThat = $(el);
                var val = $innerThat.val();

                if (val != '') {
                    $('.js-app').addClass('_hide-placeholder');
                    return false;
                }
                $('.js-app').removeClass('_hide-placeholder');
            });
        }
    }

    // Helpres
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


    function addMoreRows(count) {
        var count = count || 1;
        for (var i = 0; i < count; i++){
            $('.js-song-edit-block').append('<div class="song-edit-input js-song-edit-input"><textarea class="ui-input-row js-edit-song-ta" rows="1" placeholder=""></textarea> </div>')
        }
        autosize($('.js-edit-song-ta'));
    }

    function getRowsFromSong() {
        var $inputs = $('.js-edit-song-ta', '.js-song-edit-block');
        var res = [];

        $inputs.each(function(index, el) {
            var $that = $(el);
            var val = $.trim($that.val());
            var placeHolder = $that.attr('placeholder');

            if (val != '') {
                res.push(val);
            } else if (placeHolder != ''){
                res.push(placeHolder);
            }
        });

        return res;
    }

    function collectDataFromRhytms() {
        var res = [];

        $('.js-rhytm-edit-input').each(function(index, el) {
            var $that = $(el);
            var oneRow = {};

            oneRow.plain = $that.text();
            oneRow.syl = [];

            $('.js-rm', $that).each(function(index, el) {
                var $innerThat = $(this);
                var dataObj = [];

                dataObj.start = $innerThat.data('start');
                dataObj.length = $innerThat.data('length');
                dataObj.type = $innerThat.data('type');

                // if (data.type)

                oneRow.syl.push(dataObj);
            });
            
            res.push(oneRow)
        });

        return res;
    }

    
   
});

function responseToServer(options) {
    var settings = $.extend({
        type: options.type || 'POST',
        data: options.data || '',
        dataType: options.dataType || 'json',
        contentType: options.contentType || 'application/json',
        error: options.error || function() {},
        success: options.success || function() {}
    }, options );


    $.ajax({
        // beforeSend: function(xhrObj){
        //     xhrObj.setRequestHeader("Content-Type","application/json");
        //     xhrObj.setRequestHeader("Accept","application/json");
        // },
        url: settings.url,
        type: settings.type,
        data: JSON.stringify(settings.data),
        dataType: settings.dataType,
        error: settings.error,
        success: settings.success,
        // contentType: settings.contentType
    });
}

var serverName = 'http://138.201.157.2:8089/';

var sendUrl = {
     presyllables: serverName+'songs/search/presyllables'
    ,suggestTitle: serverName+'songs/search/suggest_title'
    ,byId: serverName+'songs/search/byid'
    ,similar: serverName+'songs/search/similar'
    ,tags: serverName+'env/tags&lang=rus'
};

var sendDataTemplate = {
    presyllables: {
        "object": "frontend.presyllables.request",
        "version": "1.0",
        "presyllables": {
            "rows": []
        }
    }
    ,suggestTitle: {
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
    ,similar2: {
        "object": "frontend.similar.request",
        "version": "1.0",
        "similar": {
            "lang": "rus",
            "limit": 5,
            "rows": [
                {
                    "plain": "",
                    "syl": [
                        { "start": 0, "length": 0, "type": "" },
                    ]
                }
            ]
        }
    }
    ,tags: {}

};
