var utils = (function () {

    'use strict';

    return {
        initIosValidationFn: initIosValidationFn,
        stringToColorFn: stringToColorFn,
        formatContentFn: formatContentFn,
        detectCCFn: detectCCFn,
        isYoutubeLinkFn: isYoutubeLinkFn,
        isFacebookLinkFn: isFacebookLinkFn,
        isSoundcloudLinkFn: isSoundcloudLinkFn,
        isTwitterLinkFn: isTwitterLinkFn,
        isInstagramLinkFn: isInstagramLinkFn,
        setEndOfDateFn: setEndOfDateFn,
        getInfoFromTitleFn: getInfoFromTitleFn,
        getUrlPartsFn: getUrlPartsFn,
        base64VideoUrlFn: base64VideoUrlFn,
        removeEmptyVideosFn: removeEmptyVideosFn,
        showAlertFn: showAlertFn,
        clearAlerts: clearAlerts,
        promiseRequest: promiseRequest,
        DVRrecord: DVRrecord
    };
    
    function initIosValidationFn() {
        if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
            var alertDiv = $('<div>', {
                class: 'ios-alert',
                text: 'Yout.com may not work well on iOS devices.'
            });

            $('body').addClass('ios-device').append(alertDiv);
        }
    }

    function stringToColorFn(str) {
        if (!str) return;

        var hash = 0;

        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        return intToRGBFn(hash);
    }

    function intToRGBFn(i) {
        var c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        var color = "00000".substring(0, 6 - c.length) + c;

        return "#" + color;
    }

    function formatContentFn(content) {
        var match, matches = [], youtubeMatches = [];
        var usernameRegex = /(?:^|\W)@(\w+)(?!\w)/g;
        var youtubeRegex = /^.*?(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)(?:(\?t|&start)=(\d+))?.*/g;

        while (match = usernameRegex.exec(content)) {
            matches.push(match[1].replace(/\s/g, ''));
        }

        while (match = youtubeRegex.exec(content)) {
            youtubeMatches.push(match[0]);
        }

        for (var i = 0; i < matches.length; i++) {
            content = content.replace('@' + matches[i], '<a href="/@' + matches[i] + '">@' + matches[i] + '</a>');
        }

        for (var j = 0; j < youtubeMatches.length; j++) {
            var anchorLink;
            var videoInfo = getYoutubeIdsFromUrlFn(youtubeMatches[j]);

            if(videoInfo.list && videoInfo.id) {
                anchorLink = '/playlist/?list=' + videoInfo.list + '&v=' + videoInfo.id;
            } else if (videoInfo.id) {
                anchorLink = '/video/' + videoInfo.id;
            } else if (videoInfo.list) {
                anchorLink = '/playlist/?list=' + videoInfo.list;
            }

            content = content.replace(youtubeMatches[j], '<a href="' + anchorLink + '">' + youtubeMatches[j] + '</a>');
        }

        return content;
    }

    function detectCCFn(number) {
        // visa
        var re = new RegExp("^4");
        if (number.match(re) !== null) {
            return "visa";
        }

        // Mastercard
        // Updated for Mastercard 2017 BINs expansion
        if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) {
            return "mastercard";
        }

        // AMEX
        re = new RegExp("^3[47]");
        if (number.match(re) !== null) {
            return "amex";
        }

        // Discover
        re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
        if (number.match(re) !== null) {
            return "discover";
        }

        // Diners
        re = new RegExp("^36");
        if (number.match(re) !== null) {
            return "diners";
        }

        // Diners - Carte Blanche
        re = new RegExp("^30[0-5]");
        if (number.match(re) !== null) {
            return "diners";
        }

        // JCB
        re = new RegExp("^35(2[89]|[3-8][0-9])");
        if (number.match(re) !== null) {
            return "jcb";
        }

        // Visa Electron
        re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
        if (number.match(re) !== null) {
            return "visa";
        }

        return "";
    }

    function isYoutubeLinkFn(terms) {
        var videoInfo = getYoutubeIdsFromUrlFn(terms);

        if (!videoInfo) { return; }

        if(videoInfo.list && videoInfo.id) {
            return window.location.href = '/playlist/?list=' + videoInfo.list + '&v=' + videoInfo.id;
        } else if (videoInfo.id) {
            return window.location.href = '/video/' + videoInfo.id;
        } else if (videoInfo.list) {
            return window.location.href = '/playlist/?list=' + videoInfo.list;
        }
    }

    function isFacebookLinkFn(url) {
        var videoInfo = getFacebookIdsFromUrlFn(url);

        if (videoInfo.artist && videoInfo.videoId) {
            return window.location.href = '/facebook/' + videoInfo.artist + '/' + videoInfo.videoId + '/';
        }
    }

    function isSoundcloudLinkFn(url) {
        var videoInfo = getSoundcloudIdsFromUrlFn(url);

        if (videoInfo.artist && videoInfo.videoId) {
            return window.location.href = '/soundcloud/' + videoInfo.artist + '/' + videoInfo.videoId + '/';
        }
    }

    function isTwitterLinkFn(url) {
        var videoInfo = getTwitterIdsFromUrlFn(url);

        if (videoInfo.artist && videoInfo.videoId) {
            return window.location.href = '/twitter/' + videoInfo.artist + '/' + videoInfo.videoId + '/';
        }
    }

    function isInstagramLinkFn(url) {
        var videoInfo = getInstagramIdsFromUrlFn(url);

        if (videoInfo.videoId) {
            return window.location.href = '/instagram/' + videoInfo.videoId + '/';
        }
    }

    function setEndOfDateFn(endDay) {
        endDay = endDay.split('.');
        endDay = endDay[0].split(':');

        return endDay[0] + ' hrs ' + endDay[1] + ' min ' + endDay[2] + 'sec';
    }

    function getInfoFromTitleFn(originalTitle) {
        var info = {
            original: originalTitle,
            title: '',
            artist: ''
        };
        var description = info.original;
        description = description.split('-');

        if (description.length > 1) {
            info.artist = description[0].trim();
            description.shift();
            info.title = description.join(' - ').trim();
        } else {
            try {
                info.title = description.join();
            } catch (e) {
                info.title = description;
            }
        }

        return info;
    }

    function getUrlPartsFn(item) {
        var url = {url: '', protocol: ''};
        var urlParts = item.split('//');

        url.protocol = urlParts[0];
        urlParts = urlParts[1].split('.');
        urlParts.shift();
        url.url = urlParts.join('.');

        return url;
    }

    function base64VideoUrlFn(options) {
        var url;

        if (options.id) {
            url = 'https://www.youtube.com/watch?v=' + options.id;
        } else {
            url = options.url;
        }

        return btoa(unescape(encodeURIComponent(url)));
    }

    function removeEmptyVideosFn(videos) {
        return videos.filter(
            function(item){
                return (item.id.videoId || item.id.playlistId);
            }
        );
    }

    function clearAlerts(container) {
        container.find('.alert').remove();
    }

    function showAlertFn(type, message, container, place, callback) {
        var alertDiv = $('<div>', {
            class: 'alert small alert-' + type + ' text-center',
            html: message
        });

        clearAlerts(container);
        container.find(place).append(alertDiv);

        if (callback) {
            callback();
        }
    }

    function promiseRequest(method, endpoint, params, token) {
        token = token ? token : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbF9mb3JfYXBpX2FjY2VzcyI6ImpvaG5AbmFkZXIubXgifQ.YPt3Eb3xKekv2L3KObNqMF25vc2uVCC-aDPIN2vktmA';

        var requestParams = {
            url: endpoint,
            method: method,
            contentType: 'application/json',
            dataType: 'json',
            headers: { token: token }
        };
        var p;

        if (params) {
            if (method.toLowerCase() === 'get') {
                requestParams.data = params;
            } else {
                requestParams.data = JSON.stringify(params);
            }
        }

        p = $.ajax(requestParams);
        p = p.then(
            function (response) {
                return response
            },
            function (error) {
                return $.Deferred().reject(error.responseJSON.error || 'We are having some errors, please try again later or contact us.');
            }
        );

        return p;
    }

    function DVRrecord(params, callback) {
        var endpoint = 'https://dvr.yout.com/' + params.format;
        var form = document.createElement("form");

        form.setAttribute("method", "post");
        form.setAttribute("action", endpoint);

        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = i;
                input.value = params[i];
                form.appendChild(input);
            }
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        if (callback) {
            callback();
        }
    }

    // PRIVATE
    function getSoundcloudIdsFromUrlFn(url) {
        var regexp = /^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/;
        var response = {videoId: null, artist: null};

        if (url.match(regexp) && url.match(regexp)[2]) {
            var artistSong = url.match(regexp)[2].split('/');

            response.artist = artistSong[0];
            response.videoId = artistSong[1];
        }

        return response;
    }

    function getTwitterIdsFromUrlFn(url) {
        var regexp = /(?:(?:http|https):\/\/)?(?:www.)?twitter.com\/(?:(?:\w)*#!\/)?(?:status\/)?([\w\-]*)?\/(?:[\w\-]*)?\/([\w\-]*)/g;
        var response = {videoId: null, artist: null};

        if (url.match(regexp)) {
            var result = url.match(regexp)[0].split('/');

            response.artist = result[3];
            response.videoId = result[5];
        }

        return response;
    }

    function getInstagramIdsFromUrlFn(url) {
        var regexp = /(?:(?:http|https):\/\/)?(?:www.)?instagram.com\/(?:(?:\w)*#!\/)?([\w\-]*)?\/(?:[\w\-]*)?\/([\w\-]*)/g;
        var response = {videoId: null};

        if (url.match(regexp)) {
            var result = url.match(regexp)[0].split('/');

            response.videoId = result[4];
        }

        return response;
    }

    function getFacebookIdsFromUrlFn(url) {
        var regexp = /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?([\w\-]*)?\/(?:[\w\-]*)?\/([\w\-]*)/g;
        var response = {videoId: null, artist: null};

        if (url.match(regexp)) {
            var result = url.match(regexp)[0].split('/');

            response.artist = result[result.length - 3];
            response.videoId = result[result.length - 1];
        }

        return response;
    }

    function getYoutubeIdsFromUrlFn(url) {
        var data;

        if (!url) { return; }

        url = url.replace(/(>|<)/gi, '');
        url = url.split(/(vi\/|\?|\/v\/|youtu\.be\/|\/embed\/)/);
        var urlParams = url[2];

        if (urlParams) {
            data = urlParamsToJson(urlParams);
        }

        return data;

        function urlParamsToJson(params) {
            var data = {id: null, list: null};
            params = params.split('&');

            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');

                if (param[0] === 'v' && param[1].length === 11) {
                    data.id = param[1];
                } else if (param[0] === 'list') {
                    data.list = param[1];
                } else if (param[0].length === 11) {
                    data.id = param[0];
                }
            }

            return data;
        }
    }

}());








function verifyActionQualityFn() {
                var target = $(this);
                var quality = target.val();

                reloadSliderRange();

                if (containerClasses.indexOf('uli-usr') >= 0) {
                    if (['192', '256', '320', '1080'].indexOf(quality) >= 0) {
                        return container.find('.recorder-action').html($('#better_quality_information').html());
                    }
                } else if (containerClasses.indexOf('li-usr') >= 0) {
                    if (['256', '320', '1080'].indexOf(quality) >= 0) {
                        return container.find('.recorder-action').html($('#better_quality_information').html());
                    }
                }

                renderActionButtonFn();
            }

            function renderActionButtonFn() {
                container.find('.recorder-action').html($('#video_action').html());
                container.find('.recorder-type').text(container.find('.option-switch.active').data('format'));
            }

            function initFn() {
                getHotnessFn();

                if (!video_error) {
                    toggleFormatFn();
                    youtubeVideoInfoFn();
                } else {
                    container.find('.video-loading').hide();
                    container.find('.video-loaded').show();
                }
            }

            function reloadSliderRange() {
                if (!videoRange.end) {
                    return;
                }

                if (containerClasses.indexOf('uli-usr') >= 0 || containerClasses.indexOf('li-usr') >= 0) {
                    var startAt = secondsToTimeFn(0);
                    var endAt = secondsToTimeFn(videoRange.end);

                    videoSettings.settingsFrom.val(startAt);
                    videoSettings.settingsTo.val(endAt);

                    manuallyUpdateSliderFn();
                }
            }

            function toggleFormatFn(e) {
                var target, codeName;

                $('.after-record').addClass('hidden');
                $('.btn-recorder').removeClass('hidden');

                reloadSliderRange();
                renderActionButtonFn();

                container.find('[name=audio-quality]').val(initialAudioQuality);
                container.find('[name=video-quality]').val(initialVideoQuality);

                verifyActionClippingFn();

                if (e) {
                    target = $(this);
                    codeName = target.data('code');

                    if (codeName) {
                        e.preventDefault();
                    }
                } else {
                    target = container.find('[data-code=audio]');
                    codeName = target.data('code');
                    recorderSettings.type = 'mp3';
                }

                if (videoInfo) {
                    if (codeName === 'video') {
                        recorderSettings.type = 'mp4';
                        container.find('.recorder-type').text('MP4');
                        container.find('.settings-artist-container').hide();
                        container.find('.settings-title-container').find('input').val(videoInfo.original);
                    } else {
                        recorderSettings.type = 'mp3';
                        container.find('.recorder-type').text('MP3');
                        container.find('.settings-artist-container').show();
                        container.find('.settings-title-container').find('input').val(videoInfo.title);
                        container.find('.settings-artist-container').find('input').val(videoInfo.artist)
                    }
                }

                target.closest('div').find('.active').removeClass('active');
                target.addClass('active');
                container.find('.selection_quality').removeClass('active');
                container.find('.quality_' + codeName).addClass('active');
            }

            function playVideoFn() {
                var p = getFormatsFn();

                p.then(
                    function () {
                        var video = document.createElement('video');

                        video.autoplay = true;
                        video.controls = true;
                        video.controlsList = 'nodownload';
                        video.src = videoPlayerUrl;

                        container.find('.video-loaded .video-frame').html(video);
                    }
                );
            }

            function getHotnessFn() {
                $.ajax({
                    method: 'GET',
                    contentType: 'application/json',
                    dataType: 'json',
                    url: '/api/hotness',
                    headers: {
                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbF9mb3JfYXBpX2FjY2VzcyI6ImpvaG5AbmFkZXIubXgifQ.YPt3Eb3xKekv2L3KObNqMF25vc2uVCC-aDPIN2vktmA'
                    },
                    success: function (response) {
                        var result = response.result;

                        if (result.length > 3) {
                            result.length = 3;
                        }

                        for (var i = 0; i < result.length; i ++) {
                            renderHotnessItemFn(result[i]);
                        }
                    },
                    error: function (error) {
                        console.warn(error);
                    }
                });
            }

            function youtubeVideoInfoFn() {
                new window.YT.Player('player', {
                    height: '1',
                    width: '1',
                    videoId: video_id,
                    host: 'https://www.youtube.com',
                    events: {
                        'onReady': function (event) {
                            var videoItem = event.target;
                            var videoData = videoItem.v.videoData;

                            if (!videoData.title) {
                                console.warn('No video information');

                                if (!video_error) {
                                    window.location.href = '/video/' + video_id + '/e/'
                                }
                            }

                            $('.com-recommend').removeClass('hidden').attr('data-title', videoData.title);

                            container.find('.video-loading').hide();
                            container.find('.video-loaded').show();

                            videoInfo = utils.getInfoFromTitleFn(videoData.title);
                            videoTitle = videoInfo.title;
                            videoArtist = videoInfo.artist;
                            sliderRange.max = videoRange.end = tempRange.to = videoItem.getDuration();

                            setTitleArtistFn(videoTitle, videoArtist);
                            startUiSliderFn();
                        }
                    }
                });
            }

            function manuallyUpdateSliderFn() {
                var init = validateRangeFormatFn(videoSettings.settingsFrom.val(), 0);
                var end = validateRangeFormatFn(videoSettings.settingsTo.val(), tempRange.to);

                slider.noUiSlider.set([init, end]);
            }

            function verifyActionClippingFn() {
                if (containerClasses.indexOf('uli-usr') >= 0 && recorderSettings.type === 'mp4') {
                    if (tempRange.from !== sliderRange.min || tempRange.to !== sliderRange.max) {
                        return container.find('.recorder-action').html($('#clipping_information').html());
                    }
                }

                renderActionButtonFn();
            }

            function startUiSliderFn() {
                window.noUiSlider.create(slider, {
                    start: [0, sliderRange.max],
                    connect: true,
                    step: 1,
                    range: {
                        'min': 0,
                        'max': sliderRange.max
                    }
                });

                slider.noUiSlider.on('update', updateSliderFn);

                function updateSliderFn (values) {
                    tempRange.from = parseInt(values[0]);
                    tempRange.to = parseInt(values[1]);

                    tempRange.init = secondsToTimeFn(tempRange.from);
                    tempRange.end = secondsToTimeFn(tempRange.to);

                    verifyActionClippingFn();

                    videoSettings.settingsFrom.val(tempRange.init);
                    videoSettings.settingsTo.val(tempRange.end);
                }
            }

            function secondsToTimeFn(totalSec) {
                var hours = parseInt(totalSec / 3600) % 24;
                var minutes = parseInt(totalSec / 60) % 60;
                var seconds = totalSec % 60;
                return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            }

            function validateRangeFormatFn(stringTime, limit) {
                stringTime = stringTime.replace(' ', '');
                var parts = stringTime.split(':');

                if (parts.length === 1) {
                    return (parseInt(stringTime)) ? parseInt(stringTime) : limit ;
                } else if (parts.length === 2) {
                    parts.unshift('00');
                } else if (parts.length > 3) {
                    return limit;
                }

                for (var i = 0; i < parts.length; i ++) {
                    parts[i] = parseInt(parts[i]) || 0;

                    if (parts[i] >= 60) {
                        return limit;
                    }
                }

                return parts[0] * 60 * 60 + parts[1] * 60 + parts[2];
            }

            function toggleTitleArtistFn() {
                var temp_title, temp_artist;

                temp_title = videoTitle;
                temp_artist = videoArtist;

                videoTitle = temp_artist;
                videoArtist = temp_title;

                setTitleArtistFn(videoTitle, videoArtist);
            }

            function setTitleArtistFn(title, artist) {
                videoSettings.settingsTitle.val(title || '');
                videoSettings.settingsArtist.val(artist || '');
            }

            function renderHotnessItemFn(item) {
                var template = $('#hotness_item_template').html();
                var html = $(template);

                if (item.thumbnail && item.thumbnail.thumbnail) {
                    html.find('.timeline-letter').remove();
                    html.find('.timeline-photo').css('background-image', 'url(/static/uploads/' + item.thumbnail.thumbnail + ')');
                } else if (item.photo_url) {
                    html.find('.timeline-letter').remove();
                    html.find('.timeline-photo').css('background-image', 'url(' + item.photo_url + ')');
                } else {
                    html.find('.timeline-photo').remove();
                    html.find('.timeline-letter').text(item.first_submitter[0].toUpperCase()).css('background-color', utils.stringToColorFn(item.first_submitter));
                }

                if (item.premium) {
                    html.find('.timeline-username').addClass('you-are-pro');
                }

                html.find('.timeline-thumb-wrap a').attr('href', '/@' + item.first_submitter);
                html.find('.timeline-username').attr('href', '/@' + item.first_submitter).text('@' + item.first_submitter);
                html.find('.date-ago').text(window.moment(new Date(item.date_created)).fromNow());
                html.find('.timeline-item-image').attr('href', '/video/' + item.video_id).css('background-image', 'url("https://i.ytimg.com/vi/' + item.video_id + '/hqdefault.jpg")');
                html.find('.timeline-item-title').text(item.title);

                hotnessListContainer.append($(html));
            }

            function getFormatsFn() {
                var videoId = video_id;

                if (!cache[videoId]) {
                    var p = $.ajax({
                        method: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        url: 'https://formats.yout.com/formats',
                        data: 'url=https://www.youtube.com/watch?v=' + videoId,
                        headers: {
                            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbF9mb3JfYXBpX2FjY2VzcyI6ImpvaG5AbmFkZXIubXgifQ.YPt3Eb3xKekv2L3KObNqMF25vc2uVCC-aDPIN2vktmA'
                        },
                        success: function (response) {
                            cache[videoId] = true;

                            var highDashUrl, lowDashUrl;
                            var highQuality = response.cache.filter(
                                function (item) {
                                    return (item.format_id === '22');
                                }
                            )[0];
                            var lowQuality = response.cache.filter(
                                function (item) {
                                    return (item.format_id === '18');
                                }
                            )[0];

                            var urlParts;

                            if (highQuality) {
                                urlParts = utils.getUrlPartsFn(highQuality.url);

                                highDashUrl = urlParts.protocol + '//redirector.' + urlParts.url;
                            }

                            if (lowQuality) {
                                urlParts = utils.getUrlPartsFn(lowQuality.url);

                                lowDashUrl = urlParts.protocol + '//redirector.' + urlParts.url;
                            }

                            videoPlayerUrl = lowDashUrl ? lowDashUrl : highDashUrl;

                            var target = $('.quality_video').find('select');

                            target.html('<option value="360">360p</option><option value="480">480p</option><option value="720">720p - HD</option>');

                            if (highDashUrl) {
                                target.append('<option value="1080">1080p - HD</option>');
                            }

                            recorderSettings.dash = highDashUrl;
                        },
                        error: function (error) {
                            console.warn(error);
                        }
                    });

                    p = p.then(
                        function () {},
                        function () {}
                    );

                    return p;
                } else {
                    return $.Deferred().resolve().promise();
                }
            }

            /*function startRecorderFn(e) {
                e.preventDefault();

                if (isRecording) { return; }

                var target = $(this);
                var params = {};
                var selected_quality;

                isRecording = true;
                target.addClass('m-progress');
                target.attr('disabled', 'disabled');

                params.video_id = video_id;
                params.video_url = utils.base64VideoUrlFn({id: params.video_id});
                params.format = recorderSettings.type;
                params.title = videoSettings.settingsTitle.val() ? videoSettings.settingsTitle.val() : videoTitle;
                params.artist = videoSettings.settingsArtist.val() ? videoSettings.settingsArtist.val() : videoArtist;
                params.start_time = (tempRange.from === sliderRange.min) ? false : tempRange.from;
                params.end_time = (tempRange.to === sliderRange.max) ? false : tempRange.to;
                params.thingy = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbF9mb3JfYXBpX2FjY2VzcyI6ImpvaG5AbmFkZXIubXgifQ.YPt3Eb3xKekv2L3KObNqMF25vc2uVCC-aDPIN2vktmA';

                if (params.format === 'mp3') {
                    selected_quality = $('.quality_audio select').val();
                } else {
                    selected_quality = $('.quality_video select').val();
                }

                if (params.format === 'mp3') {
                    params.audio_quality = selected_quality + 'k';

                    utils.DVRrecord(params, cleanLoaderFn);
                } else {
                    // WIKI: MP4
                    var dash_url = (!params.start_time && !params.end_time) ? recorderSettings.dash : null;

                    params.video_quality = selected_quality;

                    if (!params.start_time && !params.end_time && params.video_quality === '720' && !dash_url) {
                        var p = getFormatsFn();

                        p.then(
                            function () {
                                dash_url = recorderSettings.dash;

                                if (dash_url) {
                                    tryRecordWithDashFn(dash_url, params);
                                } else {
                                    utils.DVRrecord(params, cleanLoaderFn);
                                }
                            }
                        );
                    } else if (!params.start_time && !params.end_time && params.video_quality === '720' && dash_url) {
                        tryRecordWithDashFn(dash_url, params);
                    } else {
                        utils.DVRrecord(params, cleanLoaderFn);
                    }
                }
            }*/

            function tryRecordWithDashFn(dash_url, params) {
                if (/Android.+Firefox\//.test(navigator.userAgent)) {
                    utils.DVRrecord(params, cleanLoaderFn);
                } else {
                    var v = document.createElement('video');

                    v.addEventListener('error', function () { utils.DVRrecord(params, cleanLoaderFn); });
                    v.addEventListener('loadeddata', function () {
                        window.location.href = dash_url + '&title=' + params.title;

                        cleanLoaderFn();
                    });

                    v.src = dash_url;
                }
            }

            function cleanLoaderFn() {
                setTimeout(
                    function () {
                        isRecording = false;

                        $('.after-record').removeClass('hidden');
                        $('.btn-recorder').addClass('hidden').removeClass('m-progress');
                        $('.btn-recorder').removeAttr('disabled');
                    }, 1500
                );
            }










isRecording = false

function startRecorderFn() {

                if (isRecording) { return; }

                var target = $(this);
                var params = {};
                var selected_quality;

                isRecording = true;

                params.video_id = 'cwQgjq0mCdE';
                params.video_url = utils.base64VideoUrlFn({id: params.video_id});
                params.format = 'mp3';
                params.title = 'Teste';
                params.artist = 'tt';
                params.start_time = '00:00:00';
                params.end_time = '00:01:00';
                params.thingy = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbF9mb3JfYXBpX2FjY2VzcyI6ImpvaG5AbmFkZXIubXgifQ.YPt3Eb3xKekv2L3KObNqMF25vc2uVCC-aDPIN2vktmA';

                if (params.format === 'mp3') {
                    selected_quality = 128;
                } else {
                    selected_quality = $('.quality_video select').val();
                }

                if (params.format === 'mp3') {
                    params.audio_quality = selected_quality + 'k';

                    utils.DVRrecord(params, cleanLoaderFn);
                } else {
                    // WIKI: MP4
                    var dash_url = (!params.start_time && !params.end_time) ? recorderSettings.dash : null;

                    params.video_quality = selected_quality;

                    if (!params.start_time && !params.end_time && params.video_quality === '720' && !dash_url) {
                        var p = getFormatsFn();

                        p.then(
                            function () {
                                dash_url = recorderSettings.dash;

                                if (dash_url) {
                                    tryRecordWithDashFn(dash_url, params);
                                } else {
                                    utils.DVRrecord(params, cleanLoaderFn);
                                }
                            }
                        );
                    } else if (!params.start_time && !params.end_time && params.video_quality === '720' && dash_url) {
                        tryRecordWithDashFn(dash_url, params);
                    } else {
                        utils.DVRrecord(params, cleanLoaderFn);
                    }
                }
            }

startRecorderFn()