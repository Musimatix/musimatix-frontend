<!DOCTYPE html>
<html lang="ru">
<?php include $_SERVER['DOCUMENT_ROOT'].'/templates/partials/head.php';?>
<body>
    <div class="page page--app page--need-lirycs">
        <?php include $_SERVER['DOCUMENT_ROOT'].'/templates/partials/header.php'; ?>
        <div class="page-content">
            <div class="app js-app _state-lyrics-edit">
                <div class="p-inner">
                    
                    <!-- Edit song -->
                    <div class="a-block">
                        <div class="a-block__controls">
                            <div class="_left">
                                <a href="#!" class="a-control js-edit-lyr-btn">
                                    <i class="iconic iconic--arr-left"></i>
                                </a>
                                <a href="/need-lyrics/" class="a-control js-lyr-new-btn">
                                    <i class="iconic iconic--plus-sq"></i>
                                </a>
                                <a href="#!" class="a-control js-search-lyr-tab-btn">
                                    <i class="iconic iconic--search"></i>
                                </a>
                            </div>
                            <div class="_right">
                                <a href="#!" class="a-control a-control--one a-control--orange js-edit-rhytm-btn">
                                    <i class="iconic iconic--arr-right"></i>
                                </a>

                                <a href="#!" class="a-control a-control--one a-control--orange js-find-lyr-match-btn">
                                    <i class="iconic iconic--arr-right"></i>
                                </a>
                            </div>

                        </div>

                        <div class="a-block__content">

                            <div class="js-edit-song-block">
                                <div class="a-block__head">
                                    <span>Lyrics Editor</span>
                                </div>
                                <div class="a-block__inner">
                                    <div class="song-edit-block js-song-edit-block">
                                        <div class="song-edit-input js-song-edit-input">
                                            <textarea class="ui-input-row js-edit-song-ta" rows="1" placeholder="Please, type in your lyrics"></textarea>
                                        </div>
                                       <!--  <div class="song-edit-input js-song-edit-input">
                                            <textarea class="ui-input-row js-edit-song-ta" rows="1" placeholder="">К самовару подбегаю,</textarea>
                                        </div>
                                        <div class="song-edit-input js-song-edit-input">
                                            <textarea class="ui-input-row js-edit-song-ta" rows="1" placeholder="">А пузатый от меня</textarea>
                                        </div>
                                        <div class="song-edit-input js-song-edit-input">
                                            <textarea class="ui-input-row js-edit-song-ta" rows="1" placeholder="">Убежал, как от огня</textarea>
                                        </div>
                                        <div class="song-edit-input js-song-edit-input">
                                            <textarea class="ui-input-row js-edit-song-ta" rows="1" placeholder=""></textarea>
                                        </div>
                                        <div class="song-edit-input js-song-edit-input">
                                            <textarea class="ui-input-row js-edit-song-ta" rows="1" placeholder=""></textarea>
                                        </div> -->
                                        <div class="song-edit-input js-song-edit-input">
                                            <textarea class="ui-input-row js-edit-song-ta" rows="1" placeholder=""></textarea>
                                        </div>
                                    </div>
                                    <button class="ui-plus-btn js-add-more-row-btn">
                                        <i class="iconic iconic--plus-sq"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="js-rhytm-song-block">
                                <div class="a-block__head">
                                    <span>Rhytm Editor</span>
                                </div>
                                <div class="a-block__inner">
                                    <div class="rhytm-edit-block js-rhytm-edit-block">
                                        <div class="rhytm-edit-input js-rhytm-edit-input">
                                            <span class="js-rm rm rm--down" data-start="0" data-length="2" data-type="+">We</span><span class="js-rm rm rm--up" data-start="2" data-length="4" data-type="?">'ll </span><span class="js-rm rm rm--down" data-start="4" data-length="5" data-type="-">l be </span><span class="js-rm rm rm--down" data-start="9" data-length="4" data-type="+">sing</span><span class="js-rm rm rm--up" data-start="13" data-length="16" data-type="-">ing</span>
                                        </div>
                                        <div class="rhytm-edit-input js-rhytm-edit-input">
                                            <span class="js-rm rm rm--up" data-start="0" data-length="2" data-type="+">Wh</span><span class="js-rm rm rm--quest" data-start="3" data-length="2" data-type="?">n </span><span class="js-rm rm rm--up" data-start="9" data-length="3" data-type="+">e w</span><span class="js-rm rm rm--down" data-start="12" data-length="4" data-type="-">inni</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="js-searching-block">
                                <div class="a-block__head">
                                    <span>Database search</span>
                                </div>
                                <div class="a-block__inner">
                                    <div class="search-input js-main-search-wr">
                                        <div class="search-input__inner">
                                            <input class="search-input__field form-row__input js-main-search-inp" autocomplete="off" type="text" name="song_name" placeholder="Type keywords to find lyrics">
                                        </div>
                                        <div class="auto-result js-main-search-res"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

        </div>
    </div>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/templates//partials/footer.php'; ?>
    <?php include $_SERVER['DOCUMENT_ROOT'].'/templates//partials/scripts.php'; ?>
</body>
</html>
