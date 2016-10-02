define([],function(){"use strict";return function(connectionManager){function performSync(server,options){console.log("Creating ContentUploader to server: "+server.Id),options=options||{};var uploadPhotos=options.uploadPhotos!==!1;return options.cameraUploadServers&&options.cameraUploadServers.indexOf(server.Id)===-1&&(uploadPhotos=!1),uploadPhotos?new Promise(function(resolve,reject){require(["contentuploader"],function(ContentUploader){new ContentUploader(connectionManager).uploadImages(server).then(function(){console.log("ContentUploaded succeeded to server: "+server.Id),syncOfflineUsers(server,options).then(resolve,reject)},function(){console.log("ContentUploaded failed to server: "+server.Id),syncOfflineUsers(server,options).then(resolve,reject)})})}):syncOfflineUsers(server,options)}function syncOfflineUsers(server,options){return options.syncOfflineUsers===!1?syncMedia(server,options):new Promise(function(resolve,reject){require(["offlineusersync"],function(OfflineUserSync){var apiClient=connectionManager.getApiClient(server.Id);(new OfflineUserSync).sync(apiClient,server).then(function(){console.log("OfflineUserSync succeeded to server: "+server.Id),syncMedia(server,options).then(resolve,reject)},reject)})})}function syncMedia(server,options){return new Promise(function(resolve,reject){require(["mediasync"],function(MediaSync){var apiClient=connectionManager.getApiClient(server.Id);(new MediaSync).sync(apiClient,server,options).then(resolve,reject)})})}var self=this;self.sync=function(server,options){if(!server.AccessToken&&!server.ExchangeToken)return console.log("Skipping sync to server "+server.Id+" because there is no saved authentication information."),Promise.resolve();var connectionOptions={updateDateLastAccessed:!1,enableWebSocket:!1,reportCapabilities:!1};return connectionManager.connectToServer(server,connectionOptions).then(function(result){return result.State===MediaBrowser.ConnectionState.SignedIn?performSync(server,options):(console.log("Unable to connect to server id: "+server.Id),Promise.reject())},function(err){throw console.log("Unable to connect to server id: "+server.Id),err})}}});