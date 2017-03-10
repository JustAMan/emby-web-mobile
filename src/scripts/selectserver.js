define(['loading', 'layoutManager', 'appSettings', 'apphost', 'focusManager', 'connectionManager', 'backdrop', 'globalize', 'staticBackdrops', 'actionsheet', 'dom', 'material-icons', 'flexStyles', 'emby-scroller', 'emby-itemscontainer', 'cardStyle'], function (loading, layoutManager, appSettings, appHost, focusManager, connectionManager, backdrop, globalize, staticBackdrops, actionSheet, dom) {
    'use strict';

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function renderSelectServerItems(view, servers) {

        var items = servers.map(function (server) {

            return {
                name: server.Name,
                showIcon: true,
                icon: '&#xE307;',
                cardType: '',
                id: server.Id,
                server: server
            };

        });

        var html = items.map(function (item) {

            var cardImageContainer;

            if (item.showIcon) {
                cardImageContainer = '<i class="cardImageIcon md-icon">' + item.icon + '</i>';
            } else {
                cardImageContainer = '<div class="cardImage" style="' + item.cardImageStyle + '"></div>';
            }

            var cardBoxCssClass = 'cardBox';

            if (layoutManager.tv) {
                cardBoxCssClass += ' cardBox-focustransform';
            }

            var tagName = 'button';
            var innerOpening = '<div class="' + cardBoxCssClass + '">';
            var innerClosing = '</div>';

            return '\
<' + tagName + ' raised class="card overflowSquareCard loginSquareCard scalableCard overflowSquareCard-scalable" style="display:inline-block;" data-id="' + item.id + '" data-url="' + (item.url || '') + '" data-cardtype="' + item.cardType + '">\
' + innerOpening + '<div class="cardScalable card-focuscontent">\
<div class="cardPadder cardPadder-square"></div>\
<div class="cardContent">\
<div class="cardImageContainer coveredImage" style="background:#0288D1;border-radius:.15em;">\
'+ cardImageContainer + '</div>\
</div>\
</div>\
<div class="cardFooter">\
<div class="cardText cardTextCentered">' + item.name + '</div>\
</div>'+ innerClosing + '\
</'+ tagName + '>';

        }).join('');

        var itemsContainer = view.querySelector('.servers');
        itemsContainer.innerHTML = html;

        loading.hide();
    }

    function updatePageStyle(view, params) {

        if (params.showuser == '1') {
            view.classList.add('libraryPage');
            view.classList.remove('standalonePage');
        } else {
            view.classList.add('standalonePage');
            view.classList.remove('libraryPage');
        }
    }

    return function (view, params) {

        var self = this;
        var servers;

        var scrollX = !layoutManager.desktop;
        scrollX = false;

        function connectToServer(server) {

            loading.show();

            connectionManager.connectToServer(server, {
                enableAutoLogin: appSettings.enableAutoLogin()

            }).then(function (result) {

                loading.hide();
                startupHelper.handleConnectionResult(result, view);
            });
        }

        function deleteServer(server) {

            loading.show();

            connectionManager.deleteServer(server.Id).then(function () {

                loading.hide();
                loadServers();

            }, function () {

                loading.hide();
                loadServers();

            });
        }

        function onServerClick(server) {

            var menuItems = [];

            menuItems.push({
                name: globalize.translate('Connect'),
                id: 'connect'
            });

            menuItems.push({
                name: globalize.translate('Delete'),
                id: 'delete'
            });

            actionSheet.show({
                items: menuItems,
                title: server.Name

            }).then(function (id) {

                switch (id) {

                    case 'connect':
                        connectToServer(server);
                        break;
                    case 'delete':
                        deleteServer(server);
                        break;
                    default:
                        break;
                }
            });
        }

        function onServersRetrieved(result) {

            servers = result;
            renderSelectServerItems(view, result);
            view.querySelector('.pageHeader').classList.remove('hide');
            view.querySelector('.buttons').classList.remove('hide');

            if (layoutManager.tv) {
                focusManager.autoFocus(view);
            }
        }

        function loadServers() {

            loading.show();

            connectionManager.getAvailableServers().then(onServersRetrieved, function (result) {

                onServersRetrieved([]);
            });
        }

        function initContent() {

            updatePageStyle(view, params);

            if (scrollX) {
                view.querySelector('.mainContent').innerHTML = '<div is="emby-scroller" class="padded-top-focusscale padded-bottom-focusscale" data-mousewheel="false" data-horizontal="true" data-centerfocus="card"><div is="emby-itemscontainer" class="scrollSlider focuscontainer-x padded-left padded-right servers" style="display:block;text-align:center;"></div></div>';

            } else {
                view.querySelector('.mainContent').innerHTML = '<div is="emby-scroller" class="padded-top-focusscale padded-bottom-focusscale" data-mousewheel="false" data-horizontal="true" data-centerfocus="card"><div is="emby-itemscontainer" class="scrollSlider focuscontainer-x padded-left padded-right servers" style="display:block;text-align:center;"></div></div>';
            }

            view.querySelector('.btnOfflineText').innerHTML = globalize.translate('sharedcomponents#HeaderDownloadedMedia');

            if (appHost.supports('sync')) {
                view.querySelector('.btnOffline').classList.remove('hide');
            }
        }

        initContent();

        var backdropUrl = staticBackdrops.getRandomImageUrl();

        view.addEventListener("viewshow", function (e) {

            var isRestored = e.detail.isRestored;

            Emby.Page.setTitle(null);
            backdrop.setBackdrop(backdropUrl);

            if (!isRestored) {
                loadServers(!isRestored);
            }
        });

        view.querySelector('.btnAddServer').addEventListener("click", function (e) {

            Emby.Page.show('/connectlogin.html?mode=manualserver');
        });

        view.querySelector('.btnConnect').addEventListener("click", function (e) {

            Emby.Page.show('/connectlogin.html?mode=connect');
        });

        view.querySelector('.btnOffline').addEventListener("click", function (e) {

            Emby.Page.show('/offline/offline.html');
        });

        view.querySelector('.servers').addEventListener('click', function (e) {

            var card = dom.parentWithClass(e.target, 'card');

            if (card) {
                var url = card.getAttribute('data-url');

                if (url) {
                    Emby.Page.show(url);
                } else {

                    var id = card.getAttribute('data-id');
                    var server = servers.filter(function (s) {
                        return s.Id === id;
                    })[0];

                    onServerClick(server);
                }
            }
        });
    };

});