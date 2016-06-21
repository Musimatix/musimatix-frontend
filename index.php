<!DOCTYPE html>
<html lang="ru">
<?php include $_SERVER['DOCUMENT_ROOT'].'/templates/partials/head.php';?>
<body>
    <div class="page page--main">
        <?php include $_SERVER['DOCUMENT_ROOT'].'/templates/partials/header.php'; ?>
        <div class="page-content">
            <div class="fs-block">
                <div class="p-inner">
                    <div class="fs-block__icon">
                        <a href="/">
                            <?php include $_SERVER['DOCUMENT_ROOT'].'/templates/partials/logo-text.php'; ?>
                        </a>
                    </div>
                    <div class="fs-block__title">
                        <h1 class="h1">Find a perfect match to your music or lyrics</h1>
                        <button class="ui-btn ui-btn--text">What is Musimatix?</button>
                    </div>
                    <div class="fs-block__content">
                        <div class="start-changer">

                            <div class="start-item">
                                <div class="start-item__icon">
                                    <img src="../images/start-1.png">
                                </div>
                                <div class="start-item__btn">
                                    <a class="ui-btn ui-btn--brand ui-btn--brand--1" href="/need-lyrics">
                                        <i>Got music, need lyrics</i>
                                    </a>
                                </div>
                            </div>

                            <div class="start-item">
                                <div class="start-item__icon">
                                    <img src="images/start-2.png">
                                </div>
                                <div class="start-item__btn">
                                    <a class="ui-btn ui-btn--brand ui-btn--brand--2" href="/need-music">
                                        <i>Got lyrics, need music</i>
                                    </a>
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
