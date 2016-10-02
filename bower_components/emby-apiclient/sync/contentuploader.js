define(["localassetmanager"],function(localAssetManager){"use strict";return function(connectionManager){function getFilesToUpload(files,uploadHistory){return files.filter(function(file){return!!file&&0===uploadHistory.FilesUploaded.filter(function(u){return getUploadId(file)===u.Id}).length})}function getUploadId(file){return CryptoJS.SHA1(file+"1").toString()}function uploadNext(files,index,server,apiClient,resolve,reject){var length=files.length;return index>=length?void resolve():void uploadFile(files[index],apiClient).then(function(){uploadNext(files,index+1,server,apiClient,resolve,reject)},function(){uploadNext(files,index+1,server,apiClient,resolve,reject)})}function uploadFile(file,apiClient){return new Promise(function(resolve,reject){require(["fileupload","cryptojs-sha1"],function(FileUpload){var name="camera image "+(new Date).getTime(),url=apiClient.getUrl("Devices/CameraUploads",{DeviceId:apiClient.deviceId(),Name:name,Album:"Camera Roll",Id:getUploadId(file),api_key:apiClient.accessToken()});console.log("Uploading file to "+url),(new FileUpload).upload(file,name,url).then(resolve,reject)})})}var self=this;self.uploadImages=function(server){return LocalAssetManager.getCameraPhotos().then(function(photos){if(!photos.length)return Promise.resolve();var apiClient=connectionManager.getApiClient(server.Id);return apiClient.getContentUploadHistory().then(function(uploadHistory){return photos=getFilesToUpload(photos,uploadHistory),console.log("Found "+photos.length+" files to upload"),new Promise(function(resolve,reject){uploadNext(photos,0,server,apiClient,resolve,reject)})},function(){return Promise.resolve()})})}}});