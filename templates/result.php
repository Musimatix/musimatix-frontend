<!DOCTYPE html>
<html lang="ru">
<?php include 'partials/head.php';?>
<body>
    <div class="page page--result">
        <?php include 'partials/header.php'; ?>

        <div class="page-content">
            <div class="result-wr">

                <div class="result-main js-result-main">
                    <div class="result-main__search">
                        <div class="search-input js-main-search-wr">
                            <div class="search-input__inner">
                                <i class="search-input__icon iconic iconic--search js-send-btn"></i>
                                <input class="search-input__field form-row__input js-main-search-inp" autocomplete="off" type="text" name="song_name" placeholder="Type to find song">
                            </div>
                            <div class="auto-result js-main-search-res"></div>
                        </div>
                    </div>
                    <div class="result-main__song js-result-main-song">
                        <?php // include 'partials/song.php'; ?>
                    </div>
                </div>

                <div class="result-all js-result-all">
                    <div class="result-all-inner js-result-all-inner">
                        <div class="result-subsearch cols cols--two">
                            <div class="col-one">
                                <div class="result-subsearch__text js-similar-count">
                                    <span><i>0</i> matches found</span>
                                </div>
                                <div class="result-subsearch__filters">
                                    <div>sort by: <span>relevance</span></div>
                                </div>
                            </div>
                            <div class="col-one">
                                <div class="search-input js-key-search-wr">
                                    <div class="search-input__inner">
                                        <i class="search-input__icon iconic iconic--filter"></i>
                                        <input class="search-input__field form-row__input js-key-input" autocomplete="off" type="text" name="song_filter" placeholder="Type to refine matches">
                                    </div>
                                    <div class="auto-result js-key-search-res">
                                        <ul>
                                            <li class="js-add-tag-btn" data-id="2"><i class="iconic iconic--plus"></i><h5>First Person</h5></li>
                                            <li class="js-add-tag-btn" data-id="3"><i class="iconic iconic--plus"></i><h5>Rock</h5></li>
                                            <li class="js-add-tag-btn" data-id="4"><i class="iconic iconic--plus"></i><h5>Blues</h5></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="result-tags js-tags-wr">
                            <div class="result-tags__list js-tag-list">
                            </div>
                            <div class="result-tags__remove">
                                <span class="btn btn-remove-all btn--grey btn--trans btn--small js-remove-all-tag-btn"><i class="iconic iconic--cross"></i><span>Remove filters</span></span>
                            </div>
                        </div>
                        
                        <div class="result-songs js-songs-wr">
                            <div class="cols cols--two">
                                <?php //include 'partials/songs.php'; ?>
                            </div>
                        </div>
                    </div>

                    <div class="result-all-popup js-result-popup">
                        <?php // include 'partials/detailed_ajax.php'; ?>
                    </div>
                </div>
            </div>
        </div>

        <?php include 'partials/footer.php'; ?>
    </div>
    <?php include 'partials/scripts.php'; ?>
</body>
</html>
