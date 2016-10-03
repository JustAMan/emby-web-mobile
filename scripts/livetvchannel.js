define(["datetime","listView"],function(datetime,listView){function isSameDay(date1,date2){return date1.toDateString()===date2.toDateString()}function renderPrograms(page,result){for(var html="",currentItems=[],currentStartDate=null,i=0,length=result.Items.length;i<length;i++){var item=result.Items[i],itemStartDate=datetime.parseISO8601Date(item.StartDate);currentStartDate&&isSameDay(currentStartDate,itemStartDate)||(currentItems.length&&(html+="<h1>"+datetime.toLocaleDateString(itemStartDate,{weekday:"long",month:"long",day:"numeric"})+"</h1>",html+='<div is="emby-itemscontainer" class="vertical-list">'+listView.getListViewHtml({items:currentItems,enableUserDataButtons:!1,showParentTitle:!0,image:!1,showProgramTime:!0,mediaInfo:!1,parentTitleWithTitle:!0})+"</div>"),currentStartDate=itemStartDate,currentItems=[]),currentItems.push(item)}page.querySelector("#childrenContent").innerHTML=html}function loadPrograms(page,channelId){ApiClient.getLiveTvPrograms({ChannelIds:channelId,UserId:Dashboard.getCurrentUserId(),HasAired:!1,SortBy:"StartDate",EnableTotalRecordCount:!1,EnableImages:!1,ImageTypeLimit:0}).then(function(result){renderPrograms(page,result),Dashboard.hideLoadingMsg()})}window.LiveTvChannelPage={renderPrograms:loadPrograms}});