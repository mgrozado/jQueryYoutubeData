/*
Author: Maximiliano García Rozado
Date: 08/16/2012.
Main function:
	name: getYoutubeDataInformation(video, callback)
	parameters: video (id of the video), callback (sync callback that uses the data)
	description: "This function returns a async set of data with the youtube video information,
	if it is needed to execute a sync function with the data you should pass it as second parameter.
	This callback must recieve only data as parameter"
	Example:
		var data = getYoutubeDataInformation('xxxxxxxx',callback);
Data properties
	title : "Video Title"
	description : "Video Description"
	thumbnailCollection : "Collection of thumbnail of the video"
    thumbnailUrl : "Hard coded url of the mid-video thumbnail"
    author : "Object containing the name and profile url of the author"
    statistics : "Object containing the statistics of views and favorited"
    published : "Published date"
    updated : "Updated date"
    duration : "Seconds duration"
    keywords : "Registered keywords of the video"
    link : "Watch link of the video"

*/
function getJsonp(url, data, successCallback, errorCallback) {
    $.ajax({
        type: 'get',
        url: url,
        data: data,
        dataType: 'jsonp',
        jsonpCallback: 'callback',  //borrar despues del deploy
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (errorCallback != undefined)
                errorCallback(XMLHttpRequest, textStatus, errorThrown);
            else
                showMessage('Error', errorThrown);
        },
        success: function (data, textStatus, XMLHttpRequest) {
            if (successCallback != undefined)
                successCallback(data, textStatus, XMLHttpRequest);
        }
    });
};


function getYoutubeDataInformation(video, callback) {
    var datos = new Object(); 
    var url = "http://gdata.youtube.com/feeds/api/videos/"+video;
    getJsonp(url, 'v=2&alt=json-in-script', function (data) {
        datos.title = data.entry['title'].$t;
        datos.description = (data.entry['media$group'].media$description.$t.length > 150 ? data.entry['media$group'].media$description.$t.substring(0, 149) + "..." : data.entry['media$group'].media$description.$t);
        datos.thumbnailCollection = data.entry["media$group"].media$thumbnail;
        datos.thumbnailUrl = "http://img.youtube.com/vi/" + video + "/2.jpg";
        datos.author = { name: data.entry["author"][0].name, profileUrl: "http://www.youtube.com/user/" + data.entry["author"][0].name };
        datos.statistics = { viewsCount: data.entry["yt$statistics"].viewCount, favoriteCount: data.entry["yt$statistics"].favoriteCount };
        datos.published = data.entry["published"].$t;
        datos.updated = data.entry["updated"].$t;
        datos.duration = data.entry["media$group"].media$content[0].duration;
        datos.keywords = data.entry["media$group"].media$keywords.$t;
        datos.link = data.entry["link"][0].$t;

        callback(datos);

    });
    callback(datos);   
    return datos;
}
