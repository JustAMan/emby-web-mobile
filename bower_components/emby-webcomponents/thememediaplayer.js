define(["playbackManager","userSettings"],function(playbackManager,userSettings){"use strict";function playThemeMedia(items,ownerId){if(items.length){if(!currentOwnerId&&playbackManager.isPlaying())return;currentThemeIds=items.map(function(i){return i.Id}),currentOwnerId=ownerId,enabled(items[0].MediaType)&&playbackManager.play({items:items,fullscreen:!1,enableRemotePlayers:!1})}else currentOwnerId&&playbackManager.stop(),currentOwnerId=null}function enabled(mediaType){return"Video"===mediaType?userSettings.enableThemeVideos():userSettings.enableThemeSongs()}function loadThemeMedia(item){require(["connectionManager"],function(connectionManager){var apiClient=connectionManager.currentApiClient();apiClient.getThemeMedia(apiClient.getCurrentUserId(),item.Id,!0).then(function(themeMediaResult){var ownerId=themeMediaResult.ThemeVideosResult.Items.length?themeMediaResult.ThemeVideosResult.OwnerId:themeMediaResult.ThemeSongsResult.OwnerId;if(ownerId!==currentOwnerId){var items=themeMediaResult.ThemeVideosResult.Items.length?themeMediaResult.ThemeVideosResult.Items:themeMediaResult.ThemeSongsResult.Items;playThemeMedia(items,ownerId)}})})}var currentOwnerId,currentThemeIds=[];document.addEventListener("viewshow",function(e){var state=e.detail.state||{},item=state.item;if(item)return void loadThemeMedia(item);var viewOptions=e.detail.options||{};viewOptions.supportsThemeMedia||playThemeMedia([],null)},!0)});