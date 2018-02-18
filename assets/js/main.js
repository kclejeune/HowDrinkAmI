/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)',
        xxsmall: '(max-width: 360px)'
    });

    $(function () {

        var baseLine = 0;
        var reactionTime = 0;
        var baseLineReaction;
        var showNumberTime = 0;
        var numberOfReactions = 0;
        var randomReactionNumber = 0;


        $stopTimer = function (event) {
            var timeNumberSelected = $getCurrentTime();
            $("#reactionNumber").find("p").text("");
            if (showNumberTime < timeNumberSelected && randomReactionNumber == event.data.button) {
                reactionTime += timeNumberSelected - showNumberTime;
                numberOfReactions++;
            }

            if (numberOfReactions < 3) {
                $getReaction();
            } else {
                reactionTime = reactionTime / 3;
                //$(".reactionTestStartBtn").css('visibility', 'visible');
                if (baseLine === 1) {
                    addCookie(reactionTime);
                    baseLine = 0;
                    $("#resultBaseH2").text("" + Math.round(reactionTime) + " ms");
                    window.location.href = "./index.html#BaseReactionTimeResults";
                } else {
                    $("#resultsH2").text("BAC: " + reactionToBAC());
                    $("#resultsH3").text(reactionToPhrase());
                    window.location.href = "./index.html#ReactionTimeResults"
                }
            }
        };

        $getReaction = function () {
            var waitTime = Math.round($getRandomNumber() * 1000);
            showNumberTime = $getCurrentTime() + waitTime;
            randomReactionNumber = Math.floor($getRandomNumber());

            setTimeout(function () {
                $("#reactionNumber").find("p").text(randomReactionNumber);
            }, waitTime);
        };

        $("#btn1").click({button: 1}, $stopTimer);
        $("#btn2").click({button: 2}, $stopTimer);
        $("#btn3").click({button: 3}, $stopTimer);
        $("#btn4").click({button: 4}, $stopTimer);

        $(".begin").click(function () {
            baseLine = 1;
        });

        $(".reactionTestStartBtn").click(function () {
            reactionTime = 0;
            showNumberTime = 0;
            numberOfReactions = 0;
            randomReactionNumber = 0;


            if (getCookie() == null && baseLine != 1) {
                alert("Please set base reaction time.")
                window.location.href = "./index.html#settings";
            } else {
                baseLineReaction = parseFloat(getCookie());
                $(".reactionTestStartBtn").css('visibility', 'hidden');
            }
            $getReaction();

        });


        $getCurrentTime = function () {
            return Math.round((new Date()).getTime());
        };

        $getRandomNumber = function () {
            return (Math.random() * 4 + 1);
        };

        function addCookie(base) {
            window.localStorage.setItem("baseLine", base);
        }

        function getCookie() {
            return window.localStorage.getItem("baseLine");
        }

        function reactionToBAC() {
            var reactionDelta = reactionTime - baseLineReaction;
            if (reactionDelta < 44.22)
                return "0.0-0.04";
            if (reactionDelta >= 44.22 && reactionDelta < 77.56)
                return "0.04-0.07";
            if (reactionDelta >= 77.56 && reactionDelta < 110.89)
                return "0.07-0.10";
            if (reactionDelta >= 110.89 && reactionDelta < 144.22)
                return "0.10-0.13";
            if (reactionDelta >= 144.22 && reactionDelta < 177.56)
                return "0.13-0.16";
            if (reactionDelta >= 177.56 && reactionDelta < 222)
                return "0.16-0.20";
            if (reactionDelta >= 222)
                return "> 0.20";
        }

        function reactionToPhrase() {
            var reactionDelta = reactionTime - baseLineReaction;
            if (reactionDelta < 44.22)
                return "No loss of coordination, slight euphoria and loss of shyness. Mildly relaxed and maybe a little lightheaded.";
            if (reactionDelta >= 44.22 && reactionDelta < 77.56)
                return "Some minor impairment of reasoning and memory, lowering of caution. Your behavior may become exaggerated and emotions intensified.";
            if (reactionDelta >= 77.56 && reactionDelta < 110.89)
                return "Your reaction time is starting to be impaired. It is illegal to drive at this level.";
            if (reactionDelta >= 110.89 && reactionDelta < 144.22)
                return "Significant impairment of motor coordination, speech balance, vision, hearing and loss of good judgment.";
            if (reactionDelta >= 144.22 && reactionDelta < 177.56)
                return "Loss of motor control. Judgment and perception are severely impaired.";
            if (reactionDelta >= 177.56 && reactionDelta < 222)
                return "Nausea may appear. Experiencing loss of motor control, judgment, and perception.";
            if (reactionDelta >= 222)
                return "May need help to stand or walk. Blackouts are likely at this level. Dangerous levels of alcohol are in your body. It’s probably best to stop."
        }

        var $window = $(window),
            $body = $('body'),
            $wrapper = $('#wrapper'),
            $header = $('#header'),
            $footer = $('#footer'),
            $main = $('#main'),
            $main_articles = $main.children('article');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function () {
            window.setTimeout(function () {
                $body.removeClass('is-loading');
            }, 100);
        });

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Fix: Flexbox min-height bug on IE.
        if (skel.vars.IEVersion < 12) {

            var flexboxFixTimeoutId;

            $window.on('resize.flexbox-fix', function () {

                clearTimeout(flexboxFixTimeoutId);

                flexboxFixTimeoutId = setTimeout(function () {

                    if ($wrapper.prop('scrollHeight') > $window.height())
                        $wrapper.css('height', 'auto');
                    else
                        $wrapper.css('height', '100vh');

                }, 250);

            }).triggerHandler('resize.flexbox-fix');

        }

        // Nav.
        var $nav = $header.children('nav'),
            $nav_li = $nav.find('li');

        // Add "middle" alignment classes if we're dealing with an even number of items.
        if ($nav_li.length % 2 == 0) {

            $nav.addClass('use-middle');
            $nav_li.eq(($nav_li.length / 2)).addClass('is-middle');

        }

        // Main.
        var delay = 325,
            locked = false;

        // Methods.
        $main._show = function (id, initial) {

            var $article = $main_articles.filter('#' + id);

            // No such article? Bail.
            if ($article.length == 0)
                return;

            // Handle lock.

            // Already locked? Speed through "show" steps w/o delays.
            if (locked || (typeof initial != 'undefined' && initial === true)) {

                // Mark as switching.
                $body.addClass('is-switching');

                // Mark as visible.
                $body.addClass('is-article-visible');

                // Deactivate all articles (just in case one's already active).
                $main_articles.removeClass('active');

                // Hide header, footer.
                $header.hide();
                $footer.hide();

                // Show main, article.
                $main.show();
                $article.show();

                // Activate article.
                $article.addClass('active');

                // Unlock.
                locked = false;

                // Unmark as switching.
                setTimeout(function () {
                    $body.removeClass('is-switching');
                }, (initial ? 1000 : 0));

                return;

            }

            // Lock.
            locked = true;

            // Article already visible? Just swap articles.
            if ($body.hasClass('is-article-visible')) {

                // Deactivate current article.
                var $currentArticle = $main_articles.filter('.active');

                $currentArticle.removeClass('active');

                // Show article.
                setTimeout(function () {

                    // Hide current article.
                    $currentArticle.hide();

                    // Show article.
                    $article.show();

                    // Activate article.
                    setTimeout(function () {

                        $article.addClass('active');

                        // Window stuff.
                        $window
                            .scrollTop(0)
                            .triggerHandler('resize.flexbox-fix');

                        // Unlock.
                        setTimeout(function () {
                            locked = false;
                        }, delay);

                    }, 25);

                }, delay);

            }

            // Otherwise, handle as normal.
            else {

                // Mark as visible.
                $body
                    .addClass('is-article-visible');

                // Show article.
                setTimeout(function () {

                    // Hide header, footer.
                    $header.hide();
                    $footer.hide();

                    // Show main, article.
                    $main.show();
                    $article.show();

                    // Activate article.
                    setTimeout(function () {

                        $article.addClass('active');

                        // Window stuff.
                        $window
                            .scrollTop(0)
                            .triggerHandler('resize.flexbox-fix');

                        // Unlock.
                        setTimeout(function () {
                            locked = false;
                        }, delay);

                    }, 25);

                }, delay);

            }

        };

        $main._hide = function (addState) {

            var $article = $main_articles.filter('.active');

            // Article not visible? Bail.
            if (!$body.hasClass('is-article-visible'))
                return;

            // Add state?
            if (typeof addState != 'undefined'
                && addState === true)
                history.pushState(null, null, '#');

            // Handle lock.

            // Already locked? Speed through "hide" steps w/o delays.
            if (locked) {

                // Mark as switching.
                $body.addClass('is-switching');

                // Deactivate article.
                $article.removeClass('active');

                // Hide article, main.
                $article.hide();
                $main.hide();

                // Show footer, header.
                $footer.show();
                $header.show();

                // Unmark as visible.
                $body.removeClass('is-article-visible');

                // Unlock.
                locked = false;

                // Unmark as switching.
                $body.removeClass('is-switching');

                // Window stuff.
                $window
                    .scrollTop(0)
                    .triggerHandler('resize.flexbox-fix');

                return;

            }

            // Lock.
            locked = true;

            // Deactivate article.
            $article.removeClass('active');

            // Hide article.
            setTimeout(function () {

                // Hide article, main.
                $article.hide();
                $main.hide();

                // Show footer, header.
                $footer.show();
                $header.show();

                // Unmark as visible.
                setTimeout(function () {

                    $body.removeClass('is-article-visible');

                    // Window stuff.
                    $window
                        .scrollTop(0)
                        .triggerHandler('resize.flexbox-fix');

                    // Unlock.
                    setTimeout(function () {
                        locked = false;
                    }, delay);

                }, 25);

            }, delay);


        };

        // Articles.
        $main_articles.each(function () {

            var $this = $(this);

            // Close.
            $('<div class="close">Close</div>')
                .appendTo($this)
                .on('click', function () {
                    location.hash = '';
                });

            // Prevent clicks from inside article from bubbling.
            $this.on('click', function (event) {
                event.stopPropagation();
            });

        });

        // Events.
        $body.on('click', function (event) {

            // Article visible? Hide.
            if ($body.hasClass('is-article-visible'))
                $main._hide(true);

        });

        $window.on('keyup', function (event) {

            switch (event.keyCode) {

                case 27:

                    // Article visible? Hide.
                    if ($body.hasClass('is-article-visible'))
                        $main._hide(true);

                    break;

                default:
                    break;

            }

        });

        $window.on('hashchange', function (event) {

            // Empty hash?
            if (location.hash == ''
                || location.hash == '#') {

                // Prevent default.
                event.preventDefault();
                event.stopPropagation();

                // Hide.
                $main._hide();

            }

            // Otherwise, check for a matching article.
            else if ($main_articles.filter(location.hash).length > 0) {

                // Prevent default.
                event.preventDefault();
                event.stopPropagation();

                // Show article.
                $main._show(location.hash.substr(1));

            }

        });

        // Scroll restoration.
        // This prevents the page from scrolling back to the top on a hashchange.
        if ('scrollRestoration' in history)
            history.scrollRestoration = 'manual';
        else {

            var oldScrollPos = 0,
                scrollPos = 0,
                $htmlbody = $('html,body');

            $window
                .on('scroll', function () {

                    oldScrollPos = scrollPos;
                    scrollPos = $htmlbody.scrollTop();

                })
                .on('hashchange', function () {
                    $window.scrollTop(oldScrollPos);
                });

        }

        // Initialize.

        // Hide main, articles.
        $main.hide();
        $main_articles.hide();

        // Initial article.
        if (location.hash != ''
            && location.hash != '#')
            $window.on('load', function () {
                $main._show(location.hash.substr(1), true);
            });

    });

})(jQuery);
