define(['emby-tabs', 'emby-button'], function () {
    'use strict';

    var tabOwnerView;
    var queryScope = document.querySelector('.skinHeader');

    function setTabs(view, selectedIndex, builder) {

        var viewMenuBarTabs;

        if (!view) {
            if (tabOwnerView) {

                document.body.classList.remove('withTallToolbar');
                viewMenuBarTabs = queryScope.querySelector('.viewMenuBarTabs');
                viewMenuBarTabs.innerHTML = '';
                viewMenuBarTabs.classList.add('hide');
                tabOwnerView = null;
            }
            return;
        }

        viewMenuBarTabs = queryScope.querySelector('.viewMenuBarTabs');

        if (!tabOwnerView) {
            viewMenuBarTabs.classList.remove('hide');
        }

        if (tabOwnerView !== view) {

            var index = 0;

            var indexAttribute = selectedIndex == null ? '' : (' data-index="' + selectedIndex + '"');
            viewMenuBarTabs.innerHTML = '<div is="emby-tabs"' + indexAttribute + ' class="tabs-viewmenubar"><div class="emby-tabs-slider" style="white-space:nowrap;">' + builder().map(function (t) {

                var tabClass = 'emby-tab-button';

                var tabHtml;

                if (t.href) {
                    tabHtml = '<button onclick="Dashboard.navigate(this.getAttribute(\'data-href\'));" type="button" data-href="' + t.href + '" is="emby-button" class="' + tabClass + '" data-index="' + index + '"><div class="emby-button-foreground">' + t.name + '</div></button>';
                } else {
                    tabHtml = '<button type="button" is="emby-button" class="' + tabClass + '" data-index="' + index + '"><div class="emby-button-foreground">' + t.name + '</div></button>';
                }

                index++;
                return tabHtml;

            }).join('') + '</div></div>';

            document.body.classList.add('withTallToolbar');
            tabOwnerView = view;
            return true;
        }

        viewMenuBarTabs.querySelector('[is="emby-tabs"]').selectedIndex(selectedIndex);

        tabOwnerView = view;
        return false;
    }

    function getTabsElement() {
        return document.querySelector('.tabs-viewmenubar');
    }

    return {
        setTabs: setTabs,
        getTabsElement: getTabsElement
    };
});