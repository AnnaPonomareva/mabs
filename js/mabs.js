(function(G) {
    'use strict';
    var container = $('#container');
    var search = $('#search');
    var popup = $('div#popup');

    G.container = container;
    G.search = search;
    G.popup = popup;

    function clearPointSelect() {
        foreachPoint(function(point) {
            point.select(false, false);
        });
    }

    G.clearPointSelect = clearPointSelect;

    function selectPointByPrefix() {
        var prefix = search.val();
        var series = container.highcharts().series;
        var i, j;

        if (prefix !== "") {
            for (i = series.length - 1; i >= 0; i -= 1) {
                for (j = series[i].data.length - 1; j >= 0; j -= 1) {
                    if (series[i].data[j].name.search(prefix) === 0) {
                        series[i].data[j].select(true, true);
                        return series[i].data[j];
                    }
                }
            }
        }
    }

    G.selectPointByPrefix = selectPointByPrefix;

    function showPopup(pointX, pointY, x, y, point) {
        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        popup.html($('#mabInfo').tmpl(point));
        var popupWidth = popup.width() + 20; // add padding
        var popupHeight = popup.height() + 16; // add padding

        clearPointSelect();
        selectPointByXY(pointX, pointY);
        setPopupPosition(popup, popupWidth, popupHeight, windowWidth, windowHeight, x, y);

        popup.fadeIn();
    }

    G.showPopup = showPopup;

    function redrowPopup(pointX, pointY, x, y, point) {
        popup.fadeOut();
        showPopup(pointX, pointY, x, y, point);
    }

    G.redrowPopup = redrowPopup;

    function findSelectedPoint() {
        var chart = container.highcharts();

        var selectedPoints = chart.getSelectedPoints();
        return selectedPoints[0];
    }

    G.findSelectedPoint = findSelectedPoint;

    function clearSearch() {
        search.val("");
    }

    G.clearSearch = clearSearch;

    function foreachPoint(foo) {
        var i, j;
        var series = container.highcharts().series;

        for (i = series.length - 1; i >= 0; i -= 1) {
            for (j = series[i].data.length - 1; j >= 0; j -= 1) {
                foo(series[i].data[j]);
            }
        }
    }

    G.foreachPoint = foreachPoint;

//    private functions

    function selectPointByXY(x, y) {
        foreachPoint(function(point) {
            if ((point.x === x) && (point.y === y)) {
                point.select(true, true);
            }
        });
    }

    function setPopupPosition(popup, popupWidth, popupHeight, windowWidth, windowHeight, x, y) {
        if (x + popupWidth > windowWidth) {
            if (x - popupWidth > 0) {
                popup.css('left', x - popupWidth);
            } else {
                if ((windowWidth - x - popupWidth) > popupWidth - x) {
                    popup.css('left', 0);
                } else {
                    popup.css('left', windowWidth - popupWidth);
                }
            }
        } else {
            popup.css('left', x);
        }

        if ((y + popupHeight > windowHeight) && (y - popupHeight > 0)) {
            if (y - popupHeight > 0) {
                popup.css('top', y - popupHeight);
            } else {
                if ((windowHeight - y - popupHeight) > popupHeight - y) {
                    popup.css('top', 0);
                } else {
                    popup.css('top', windowHeight - popupHeight);
                }
            }
        } else {
            popup.css('top', y);
        }
    }
} (this));