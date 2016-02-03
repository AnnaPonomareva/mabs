(function() {
    $(document).ready(function () {
        'use strict';
        var availableTags = [];

        $.get('mab-info.json', function (mabs) {
            container.highcharts({
                chart: {
                    type: 'scatter',
                    zoomType: 'xy',
                    events: {
                        redraw: function () {
                            var that = findSelectedPoint();
                            if (that !== undefined) {
                                redrowPopup(that.x, that.y, that.plotX + 80, that.plotY + 70, that);
                            }
                        }
                    }
                },
                title: {
                    text: 'MABs'
                },
                subtitle: {
                    text: 'Monoclonal antibodies 1997-2015 by type'
                },
                tooltip: {
                    pointFormatter: function () {
                        return this.name + '<br/><b>(HC: ' + this.x_h.toFixed(2) + '%, LC: ' + this.y_l.toFixed(2) + '%)</b>';
                    },
                    shared: true
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function (e) {
                                    showPopup(this.x, this.y, this.plotX + 80, this.plotY + 70, this);
                                }
                            }
                        },
                        marker: {
                            lineWidth: 1
                        }
                    }
                },
                xAxis: {
                    title: {
                        text: 'VH'
                    },
                    gridLineWidth: 1
                },
                yAxis: {
                    title: {
                        text: 'VL'
                    },
                    gridLineWidth: 1
                },
                series: [
                    {
                        name: 'Chimeric',
                        color: '#cc0000',
                        data: mabs.xi,
                        marker: {
                            symbol: "triangle",
                            radius: 5
                        }
                    },
                    {
                        name: "Chimeric/humanized",
                        color: '#ff6600',
                        data: mabs.xizu,
                        marker: {
                            symbol: "circle",
                            radius: 4
                        }
                    },
                    {
                        name: 'Humanized',
                        color: '#FFCC00',
                        data: mabs.zu,
                        marker: {
                            symbol: "diamond",
                            radius: 5
                        }
                    },
                    {
                        name: 'Human',
                        color: '#006600',
                        data: mabs.u,
                        marker: {
                            symbol: "square",
                            radius: 4
                        }
                    },
                    {
                        name: 'BIOCAD',
                        color: '#0000ff',
                        data: mabs.biocad,
                        marker: {
                            symbol: "triangle-down",
                            radius: 5
                        }
                    }
                ],
                credits: {
                    enabled: false
                }
            });

            foreachPoint(function(point) {
                availableTags.push(point.name);
            })

        });

        $('body').on('click', 'div#popup > div#popup-close', function () {
            popup.fadeOut();
            clearPointSelect();
            clearSearch();
        });

        $('#search-lable').click(function () {
            clearPointSelect();
            var that = selectPointByPrefix();
            popup.fadeOut();
            if (that !== undefined) {
                showPopup(that.x, that.y, that.plotX + 80, that.plotY + 70, that);
            }
        });

        search.click(function () {
            clearSearch();
        });

        search.keypress(function (e) {

            if (e.which === 13) {
                clearPointSelect();
                var that = selectPointByPrefix();
                popup.fadeOut();
                if (that !== undefined) {
                    showPopup(that.x, that.y, that.plotX + 80, that.plotY + 70, that);
                }
            }
        });

        search.autocomplete({
            source: function( request, response ) {
                var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
                response( $.grep( availableTags, function( item ){
                    return matcher.test( item );
                }) );
            }
        });
    });
}());
