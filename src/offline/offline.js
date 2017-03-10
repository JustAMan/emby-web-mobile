define(['globalize', 'connectionManager', 'focusManager', 'cardBuilder', 'emby-itemscontainer', 'flexStyles', 'scrollStyles'], function (globalize, connectionManager, focusManager, cardBuilder) {
    'use strict';

    return function (view, params) {

        function mergeInto(list1, list2) {

            for (var i = 0, length = list2.length; i < length; i++) {
                list1.push(list2[i]);
            }
        }

        function getLatestItems(type) {

            var promises = connectionManager.getApiClients().map(function (apiClient) {
                return apiClient.getLatestOfflineItems({
                    MediaType: type,
                    Limit: 20
                });
            });

            return Promise.all(promises).then(function (responses) {

                var items = [];
                for (var i = 0, length = responses.length; i < length; i++) {
                    mergeInto(items, responses[i]);
                }

                return items;
            });
        }

        function loadLatestSection(section) {

            return getLatestItems(section.getAttribute('data-mediatype')).then(function (items) {

                cardBuilder.buildCards(items, {
                    parentContainer: section,
                    itemsContainer: section.querySelector('.itemsContainer'),
                    shape: 'backdrop',
                    preferThumb: true,
                    inheritThumb: false,
                    scalable: true
                });

                return Promise.resolve();
            }, function() {
                return Promise.resolve();
            });
        }

        function loadLatest() {

            var sections = view.querySelectorAll('.latestSection');
            var promises = [];

            for (var i = 0, length = sections.length; i < length; i++) {
                promises.push(loadLatestSection(sections[i]));
            }

            return Promise.all(promises);
        }

        function renderLocalFolders(parentElement, items, serverName) {

            var html = '<div class="verticalSection padded-left padded-right">';
            html += '<h2 class="sectionTitle">' + (serverName || 'Server') + '</h2>';

            var id = 'section' + new Date().getTime();
            html += '<div id="' + id + '" is="emby-itemscontainer" class="itemsContainer vertical-wrap"></div>';
            html += '</div>';

            parentElement.insertAdjacentHTML('beforeend', html);

            cardBuilder.buildCards(items, {
                itemsContainer: parentElement.querySelector('#' + id),
                shape: 'backdrop',
                preferThumb: true,
                scalable: true
            });
        }

        function loadServerFolders(parentElement, apiClient) {

            return apiClient.getLocalFolders().then(function (items) {

                if (items.length) {
                    renderLocalFolders(parentElement, items, apiClient.serverName());
                }

                return Promise.resolve();
            });
        }

        function loadAllServerFolders() {

            var offlineServers = view.querySelector('.offlineServers');
            offlineServers.innerHTML = '';

            var promises = connectionManager.getApiClients().map(function (apiClient) {
                return loadServerFolders(offlineServers, apiClient);
            });

            return Promise.all(promises);
        }

        function loadOfflineCategories() {

            var promises = [];

            promises.push(loadLatest());
            promises.push(loadAllServerFolders());

            return Promise.all(promises);
        }

        function autoFocus() {

            focusManager.autoFocus(view);
        }

        view.addEventListener('viewshow', function (e) {

            Emby.Page.setTitle(globalize.translate('Offline'));

            var isRestored = e.detail.isRestored;

            if (!isRestored) {

                loadOfflineCategories().then(autoFocus);
            }
        });
    };
});