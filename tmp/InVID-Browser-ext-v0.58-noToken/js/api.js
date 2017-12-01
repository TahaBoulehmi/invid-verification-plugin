var video_thumbnails_lst = [];
var twitter_url = "https://twitter.com/search";
var tw_json = "";

/* Detect http link and make hyperlink */
function urlify(text) {
    if (text){
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function(url) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        })
    }
    return "";
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

/*Create a title in the div argument*/
function makeTitle(title, div){
    h3 = document.createElement("h3");
    h3.innerHTML = title;
    div.appendChild(h3);
}

/*Create table: 
left column: name
right column: key value from json file*/
function make_table(json, key_lst, name_lst){
    var table = document.createElement("table");
    for (var index in key_lst){
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var td = document.createElement("td");
        th.innerHTML = name_lst[index];
        td.innerHTML = urlify(String(json[key_lst[index]]));
        //createPopUp(th, lst_desc[index]);
        tr.appendChild(th);
        tr.appendChild(td);
        table.appendChild(tr);
    }
    return table
}

/* Update table created by the previous function */
function updateTable(json, key_lst, table)
{
    var list = table.getElementsByTagName("td");
    for (var index = 0; index < list.length; index++) {
        if (json[key_lst[index]])
            list[index].innerHTML = json[key_lst[index]];
    }
}

/* Diplay buttons "verification comments" and "maps"*/
function displayButtons(verif_number, locations, fb){
    var verif = document.getElementById("verif-content");
    var maps = document.getElementById("maps-content");
    var google = document.getElementById("google_search_btn");
    var yandex = document.getElementById("yandex_search_btn");
    //var timeline = document.getElementById("twitter-content");
    var twitter = document.getElementById("twitter_search_btn");
    if (verif_number == "0"){
        verif.setAttribute("style", "display: none;");
    } else {
        verif.setAttribute("style", "display: block;");
    }
    if (!locations || locations.length == 0){
        maps.setAttribute("style", "display: none;");
    } else {
        maps.setAttribute("style", "display: block;");
    }
    if (fb)
        twitter.setAttribute("style", "display: none;");
    //timeline.setAttribute("style", "");
    google.setAttribute("style", "");
    yandex.setAttribute("style", "");
}

function hideButtons() {
    var buttons_id = [ "verif-content", "maps-content", "google_search_btn", "yandex_search_btn",
        "twitter-content", "twitter_search_btn"
    ]
    for (id of buttons_id) {
        document.getElementById(id).setAttribute("style", "display: none");
    }
}

/* Clean element by id */
function cleanElement(id){
    var div = document.getElementById(id);
    /* Clear content*/
    while(div.hasChildNodes()){
        div.removeChild(div.firstChild);
    }
}

/* Place verification comments */
function placeComments(analysis_json){
    cleanElement("place-comments");
    var div = document.getElementById("place-comments");
    var video_comments = analysis_json.video_comments;
    var video_author_comments = analysis_json.video_author_comments;
    var video_author_url_comments = analysis_json.video_author_url_comments
    var video_publishedAt_comments = analysis_json.video_publishedAt_comments;
    var verification_comments = analysis_json.verification_comments;
    for(var count in video_comments) {
        index = verification_comments.indexOf(video_comments[count]);
        if (index != -1){
            var elem = document.createElement("p");
            elem.setAttribute("class", "comment");
            var author_head = '<a href="'+video_author_url_comments[count]+'"><strong>'+video_author_comments[count]+'</strong></a>'+" at <strong>" + video_publishedAt_comments[count] +"</strong>:<br>";
            elem.innerHTML = author_head + video_comments[count];
            div.appendChild(elem);
        }
    }
}

/* Thumbnails clickable */
function activeThumbnail(thumbnails_id){
// constants
var SHOW_CLASS = 'show',
HIDE_CLASS = 'hide',
ACTIVE_CLASS = 'active';

/* Change to magnifier tab */
$( '#'+ thumbnails_id ).on( 'click', 'a', function(e){
    e.preventDefault();
    var $tab = $( this ),
    href = $tab.attr( 'href' );

    $( '.active' ).removeClass( ACTIVE_CLASS );
    $( '#magnifier_tab' ).addClass( ACTIVE_CLASS );

    $( '.show' )                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    .removeClass( SHOW_CLASS )
    .addClass( HIDE_CLASS )
    .hide();
    
    $(href)
    .removeClass( HIDE_CLASS )
    .addClass( SHOW_CLASS )
    .hide()
    .fadeIn( 550 );

    var url_img = $tab.children()[0].src;
    callMagnifier(url_img);
});
}

/* Open reverse Search image tabs */
function imgSearch(){
    var search_url = "https://www.google.com/searchbyimage?&image_url="
    var lst = [];
    for (var count in video_thumbnails_lst){
        lst.push(search_url + video_thumbnails_lst[count]);
    }
    for (index in lst){
      if (typeof chrome != "undefined")
        chrome.tabs.create({url:lst[index]});
      else
        window.open(lst[index]);
    }
}

/*Open yandex search with thumbnails urls*/
function yandexImgSearch(){
    var search_url = "https://yandex.com/images/search?url=";
    var lst = [];
    for (var count in video_thumbnails_lst){
        lst.push(search_url + video_thumbnails_lst[count] + "&rpt=imageview");
    }
    for (index in lst){
      if (typeof chrome != "undefined")
        chrome.tabs.create({url:lst[index]});
      else
        window.open(lst[index]);
    }
}

/* Create Carousel html*/
function buildCarousel(carousel_id, thumbnails_id){
    var div = document.getElementById(carousel_id);
    var jssor1 = document.createElement("div");
    jssor1.setAttribute("id", "jssor_1");
    jssor1.setAttribute("style", "position:relative;margin:0 auto;top:0px;left:0px;width:800px;height:200px;overflow:hidden;visibility:hidden;background-color: #000000;");
    /* Loading div */
    var loading = document.createElement("div");
    loading.setAttribute("data-u", "loading");
    loading.setAttribute("style", "position:absolute;top:0px;left:0px;background-color:rgba(0,0,0,0.7);");
    var loading1 = document.createElement("div");
    loading1.setAttribute("style", "filter: alpha(opacity=70); opacity: 0.7; position: absolute; display: block; top: 0px; left: 0px; width: 100%; height: 100%;");
    var loading2 = document.createElement("div");
    loading2.setAttribute("style", "position:absolute;display:block;background:url('img/loading.gif') no-repeat center center;top:0px;left:0px;width:100%;height:100%;");
    loading.appendChild(loading1);
    loading.appendChild(loading2);
    jssor1.appendChild(loading);
    /* Thumbnails div */
    var thumb_div = document.createElement("div");
    thumb_div.setAttribute("id", thumbnails_id);
    thumb_div.setAttribute("data-u", "slides");
    thumb_div.setAttribute("style", "cursor:default;position:relative;top:25px;left:100px;width:600px;height:150px;overflow:hidden");
    jssor1.appendChild(thumb_div);
    /* Bullet Navigator */
    var b_navigator = document.createElement("div");
    b_navigator.setAttribute("data-u", "navigator");
    b_navigator.setAttribute("class", "jssorb03");
    b_navigator.setAttribute("style", "bottom:10px;right:10px;");
    var b_navigator1 = document.createElement("div");
    b_navigator1.setAttribute("data-u", "prototype");
    b_navigator1.setAttribute("style", "width:21px;height:21px;");
    var b_navigator2 = document.createElement("div");
    b_navigator2.setAttribute("data-u", "numbertemplate");
    b_navigator1.appendChild(b_navigator2);
    b_navigator.appendChild(b_navigator1);
    jssor1.appendChild(b_navigator);
    /*Arrow Navigator */
    var arrowleft = document.createElement("span");
    arrowleft.setAttribute("data-u", "arrowleft");
    arrowleft.setAttribute("class", "jssora03l");
    arrowleft.setAttribute("style", "top:0px;left:8px;width:55px;height:55px;");
    arrowleft.setAttribute("data-autocenter", "2");
    var arrowright = document.createElement("span");
    arrowright.setAttribute("data-u", "arrowright");
    arrowright.setAttribute("class", "jssora03r");
    arrowright.setAttribute("style", "top:0px;right:8px;width:55px;height:55px;");
    arrowright.setAttribute("data-autocenter", "2");
    jssor1.appendChild(arrowleft);
    jssor1.appendChild(arrowright);
    div.appendChild(jssor1);
}

/* Display or hide real size Thumbnail image */
function activePreview(){
    $(".mouse-preview").on(
    {
        mouseenter: function() 
        {
            var id = $(this).attr("name");
            var img = document.getElementById(id);
            img.style.display = "";
        },
        mouseleave: function()
        {
            var id = $(this).attr("name");
            var img = document.getElementById(id);
            img.style.display = "none";
        }
    });

}

/* place Thumbnails in the carousel */
function placeImages(carousel_id, thumbnails_id, preview_id, img_list){
    cleanElement(carousel_id);
    cleanElement(preview_id);
    buildCarousel(carousel_id, thumbnails_id);
    var prev = document.getElementById(preview_id);
    var div = document.getElementById(thumbnails_id);
    for (var count in img_list){
        //if (img_list[count].match(/https:\/\/i\.ytimg\.com\/*/) && !img_list[count].match(/maxresdefault\.jpg$/))
        //    continue;
        var id = "thumb-" + count;
        var div1 = document.createElement("div");
        var a = document.createElement("a");
        a.setAttribute("href", "#magnifier");
        a.setAttribute("name", id);
        a.setAttribute("class", "mouse-preview");
        var elem = document.createElement("img");
        elem.setAttribute("src", img_list[count]);
        elem.setAttribute("style", "max-height: 150px; max-width: 200px;");
        a.appendChild(elem);
        div1.appendChild(a);
        div.appendChild(div1);
        /*Add img preview*/
        var img = document.createElement("img");
        img.setAttribute("id", id);
        img.setAttribute("src", img_list[count]);
        img.setAttribute("style", "display: none; position: fixed; top: 0%; right: 0%; max-height: 250px;");
        prev.appendChild(img);
    }
    /* Thumbnails onclick */
    activeThumbnail(thumbnails_id);
    /* Preview onmouseover */
    activePreview();
    /* Active carousel */
    jssor_1_slider_init();

}

/* Create the google maps and and search Box*/
function createGoogleMaps(){
    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    /* get Current Location if possible */
     if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function (position) {
         initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         map.setCenter(initialLocation);
     });
 }

// Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var submit = document.getElementById("pac-button");
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submit);
  submit.addEventListener("click", function(){
      if(searchBox){
        google.maps.event.trigger(input, 'focus')
        google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
    }
  })

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });

}

/* change SearchBox value and submit it to the google map */
function updateMap(places){
    if (places != []){
        var searchBox = document.getElementById("pac-input");
        if(searchBox){
            searchBox.value =places;
            google.maps.event.trigger(searchBox, 'focus')
            google.maps.event.trigger(searchBox, 'keydown', { keyCode: 13 });
        }
    }
}

/* update the map with current search box value (correct display none bug)*/
function triggerMap(){
    var searchBox = document.getElementById("pac-input");
    if(searchBox){
        google.maps.event.trigger(searchBox, 'focus')
        google.maps.event.trigger(searchBox, 'keydown', { keyCode: 13 });
    }
}



/* Parse the YouTube json */
function parseYTJson(json){
    /* bool value */
    var hasPlaceComments;
    var hasUpdateMap;
    var hasPlaceImages;
    var hasDisplayButtons;

    /* List of indexes */
    var key_list_video_a = ["video_title", "video_description"];
    var name_list_video_a = ["Video title", "Video description"];
    var key_list_video_b = ["video_view_count", "video_like_count", "video_dislike_count", "video_duration", "video_upload_time", "video_licensed_content", "video_description_mentioned_locations", "video_recording_location_description"];
    var name_list_video_b = ["Video view count", "Like count", "Dislike count", "Duration", "Upload time", "Licensed content", "Description mentioned locations", "Recording location description"];
    var key_list_channel = ["channel_description", "channel_created_time", "channel_view_count", "channel_url", "channel_location"];
    var name_list_channel = ["Channel description", "Channel created time", "Channel view count", "Channel page", "Channel location"];
    var key_list_comment = ["video_comment_count", "num_verification_comments"];
    var name_list_comment = ["Video comment count", "Number verification comments"];

    function start(json) {
        /* Video Infos*/
        var div = document.getElementById("place-table");
        /*Video table*/
        makeTitle("Video:", div);
        var table = make_table(json,key_list_video_a, name_list_video_a);
        div.appendChild(table);
        div.appendChild(document.createElement("br"));
        table = make_table(json,key_list_video_b, name_list_video_b);
        div.appendChild(table);
        /*Channel table*/
        makeTitle("Channel:", div);
        table = make_table(json, key_list_channel, name_list_channel);
        div.appendChild(table);
        /* Comments*/
        makeTitle("Comments:", div);
        table = make_table(json, key_list_comment, name_list_comment);
        div.appendChild(table);

        /* Init variable */
        hasPlaceComments = false;
        hasUpdateMap = false;
        hasPlaceImages = false;
        video_thumbnails_lst = [];
        twitter_url = "";
        document.getElementById("twitter_search_btn").setAttribute("style", "display: none;");
        hasDisplayButtons = false;
    }

    function update(json) {
        var tables = document.getElementById("place-table").getElementsByTagName("table");
        /*Video table*/
        updateTable(json, key_list_video_a, tables[0]);
        updateTable(json, key_list_video_b, tables[1]);
        /*Channel table*/
        updateTable(json, key_list_channel, tables[2]);
        /* Comments*/
        updateTable(json, key_list_comment, tables[3]);
    }

    if (!document.getElementById("place-table").hasChildNodes())
        start(json);
    else
        update(json);

    /* Place verification comments */
    if (!hasPlaceComments && json.processing_status == "done")
    {
        placeComments(json);
        hasPlaceComments = true;
    }
    /* Update map*/
    if (!hasUpdateMap && json.video_description_mentioned_locations) {
        updateMap(json.video_description_mentioned_locations);
        hasUpdateMap = true;
    }

    if (!hasPlaceImages && json.video_thumbnails) {
        /* Place thumbnails */
        placeImages("place-carousel", "place-thumbnails", "place-preview", json.video_thumbnails);
        hasPlaceImages = true;
        /* Update Google search button */
        video_thumbnails_lst = json.video_thumbnails;
    }
    /* Update Twitter search button */
    if (json.twitter_search_url && twitter_url == "")
    {
        twitter_url = json.twitter_search_url;
        document.getElementById("twitter_search_btn").setAttribute("style", "");
    }
    /* Display buttons*/
    if (!hasDisplayButtons && (json.processing_status == "done" || (json.num_verification_comments && json.video_description_mentioned_locations))) {
        displayButtons(json.num_verification_comments, json.video_description_mentioned_locations, false);
        hasDisplayButtons = true;
    }
}


/*Parse the Facebook Json*/
function parseFBJson(json){
    /* boole value */
    var hasPlaceImages;
    var hasPlaceComments;
    var hasDisplayButtons;
    var hasUpdateMap;

    /* List of indexes */
    var key_list_video = ["video_id", "title", "length", "updated_time", "created_time", "content_category", "content_tags", "video_description"];
    var name_list_video = ["Video id", "Video title", "Duration", "Updated time", "Created time", "Content category", "Content tags", "Video description"];
    var key_list_from = ["from", "from_about", "from_category", "from_link", "from_fan_count", "from_description", "from_location_city", "from_location_country", "from_website"];
    var name_list_from = ["Page", "About", "Category", "Link", "Fan count", "Description", "Location city", "Location country", "Website"];
    var key_list_count = ["total_comment_count", "num_verification_comments"];
    var name_list_count = ["Video comment count", "Number verification comments"];

    function start(json) {
        /* Video Infos*/
        var div = document.getElementById("place-table")
        /*Video table*/
        makeTitle("Video:", div);
        var table = make_table(json, key_list_video, name_list_video);
        div.appendChild(table);
        /*Page table*/
        makeTitle("Page:", div);
        table = make_table(json, key_list_from, name_list_from);
        div.appendChild(table);
        /* Comments */
        makeTitle("Comments:", div);
        table = make_table(json, key_list_count, name_list_count);
        div.appendChild(table);
        hasPlaceImages = false;
        hasPlaceComments = false;
        hasDisplayButtons = false;
        hasUpdateMap = false;
    }

    function update(json) {
        var tables = document.getElementById("place-table").getElementsByTagName("table");
        /*Video table*/
        updateTable(json, key_list_video, tables[0]);
        /*Page table*/
        updateTable(json, key_list_from, tables[1]);
        /* Comments */
        updateTable(json, key_list_count, tables[2]);
    }

    if (!document.getElementById("place-table").hasChildNodes())
        start(json);
    else
        update(json);

    /* Place thumbnails */
    if (!hasPlaceImages && json.video_thumbnails) {
        placeImages("place-carousel", "place-thumbnails", "place-preview", json.video_thumbnails);
        hasPlaceImages = true;
    }
    /* Place verification comments */
    if (!hasPlaceComments && json.processing_status == "done") {
        placeComments(json);
        hasPlaceComments = true;
    }
    /* Update Google search button */
    video_thumbnails_lst = json.video_thumbnails;
    /*Display buttons*/
    if (!hasDisplayButtons && (json.processing_status == 'done' || (json.num_verification_comments && json.video_description_mentioned_locations))) {
        displayButtons(json.num_verification_comments, json.video_description_mentioned_locations, true);
        hasDisplayButtons = true;
    }

    /* Update map*/
    if (!hasUpdateMap && json.video_description_mentioned_locations) {
        updateMap(json.video_description_mentioned_locations);
        hasUpdateMap = true;
    }
}


/* Send requests for video analysis*/
function video_api_analysis(video_id, isProcess){
    cleanElement("fb-content");
    document.getElementById("fb-content").style.display = "none";
    var analysis_url = "http://caa.iti.gr/verify_videoV2?url=" + video_id;
    if (isProcess)
        analysis_url += "&reprocess=1"
    loaded_tw = false;
    document.getElementById("loader").style.display = "block";
    document.getElementById("api-content").style.display = "none";
    var response_done = false;

    /* return the error message for the error which occur */
    function get_error_message(err) {
        switch (err) {
            case "ERROR3":
            case "ERROR4":
            return "Sorry but we cannot process this video link";
            case "ERROR2":
            return "This is a wrong url. Please check it and try again.";
            default:
            return "There were an error while trying to process this video. Please check the link and try again.";
        }
    }

    /* Get response every 2 second until process done */
    function parse_response(data, url, callback) {
        callback(data);
        if (data["processing_status"] != "done")
        {
            $.getJSON(url, function(data) {
                setTimeout(function() {
                    parse_response(data, url, callback)
                }, 2000);
            }).fail(function( jqxhr, textStatus, error ) {
                console.error("parse_response : " + url);
                console.error(textStatus + ", " + error);
                request_fail(get_error_message(""));
            });
        }
        else {
            response_done = true;
            document.getElementById("loader").style.display = "none";
        }
    }

    function request_fail(msg) {
        document.getElementById("api-content").style.display = "none";
        document.getElementById("loader").style.display = "none";
        document.getElementById("loader_tw").style.display = "none";
        var errorElement = document.getElementById("error-content");
        errorElement.innerHTML = msg;
        errorElement.style.display = "block";
    }

    

    /* Start Analysis */
    $.getJSON(analysis_url, function(data) {
        document.getElementById("api-content").style.display = "block";
        /* Error Gestion */
        if (data["status"].startsWith("ERROR"))
        {
            console.error("error return : " + analysis_url);
            console.error(data["message"]);
            request_fail(get_error_message(data["status"]));
            return;
        }
        $.getJSON(analysis_url, function(data) {
            /* Youtube Response */
            var url;
            var callback;
            if (data["youtube_response"] !== undefined)
            {
                url = data["youtube_response"];
                callback = parseYTJson;
            }
            else /* Facebook response */
            {
                url = data["facebook_response"];
                callback = parseFBJson;
            }
            $.getJSON(url, function(data) {
                parse_response(data, url, callback);
            }).fail(function(jqxhr, textStatus, error) {
                console.error("yt or fb : " + url);
                console.error(textStatus + ", " + error);
                request_fail(get_error_message(""));
            })
            /* Twitter Part response */
            var url_twitter = data["twitter_shares"];
            $.getJSON(url_twitter, function parse_tw(data) {
                tw_json = makeJSON(data);
                if (data["processing_status"] != "done") {
                    $.getJSON(url_twitter, function(data) {
                        setTimeout(function() {
                            parse_tw(data);
                        }, 2000);
                    }).fail(function (jqxhr, textStatus, error) {
                        console.error("twitter loop : " + url_twitter);
                        console.error(textStatus + ", " + error);
                        request_fail(get_error_message(""));
                    });
                }
                else {
                    loaded_tw = true;
                    loadTimeline();
                    document.getElementById("loader_tw").style.display = "none";
                }
            }).fail(function( jqxhr, textStatus, error ) {
                console.error("start tw : " + url_twitter);
                console.error(textStatus + ", " + error);
                request_fail(get_error_message(""));
            });
        }).fail(function(jqxhr, textStatus, error) {
            console.error("get url : " + analysis_url);
            console.error(textStatus + ", " + error);
            request_fail(get_error_message(""));
        });
    }).fail(function( jqxhr, textStatus, error ) {
        console.error("start analysis : " + analysis_url);
        console.error(textStatus + ", " + error);
        request_fail(get_error_message(""));
    });
}



/*Get the video url and start youtube or facebook analysis*/
function submit_form(){
    var youtube_url = "https://www.youtube.com/watch?v=";
    var facebook_url = "https://www.facebook.com"
	var url = $("[name=video_url2]").val();
    var reprocessChecked = document.getElementById("api_reprocess").checked;
    document.getElementById("error-content").style.display = "none";
    hideButtons();
	if (url != "") {
        cleanElement("place-table");
        var video_id = url;
        if (url.substring(0, youtube_url.length) == youtube_url ||
            url.substring(0, facebook_url.length) == facebook_url) {
            video_api_analysis(url, reprocessChecked);
        }
        else {
            document.getElementById("api-content").style.display = "none";
            var errorElement = document.getElementById("error-content");
            errorElement.innerHTML = "Please enter a Youtube or a Facebook URL";
            errorElement.style.display = "block";
        }
    }
}

var form = document.getElementById("api");
if (form.addEventListener){
	form.addEventListener("submit", submit_form, false);
}
form.addEventListener("submit", function(e){
	e.preventDefault();
});

/* Google button : thumbnails reverse search */
document.getElementById("google_search_btn").onclick = function() {
    imgSearch();
}

/* Google button : thumbnails reverse search */
document.getElementById("yandex_search_btn").onclick = function() {
    yandexImgSearch();
};


/* Twitter button : search video in twitter */
document.getElementById("twitter_search_btn").onclick = function() {
  if (typeof chrome != "undefined")
    chrome.tabs.create({url:twitter_url});
  else
    window.open(twitter_url);
};

/* Twitter timeline */
function convertDate(date){
    var new_date = new Object();
    lst = String(date).split(" ");
    var new_month = "";
    var new_day = "";
    if (lst[2].charAt(0) == "0") {
        new_day = lst[2].replace("0", "");
    }
    else {
        new_day = lst[2];
    }
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (var index in months){
        if(lst[1] == months[index])
            new_month = parseInt(index) + 1;
    }
    new_date.month = new_month;
    new_date.day = new_day;
    new_date.year = lst[5];
    var hour = lst[3].split(":");
    new_date.hour = hour[0];
    new_date.minute = hour[1];
    new_date.second = hour[2];
    return new_date;
}

/* parse the json from twitter api and make json for the timeline */
function makeJSON(data){
    //console.log(data);
    var json = "";
    var obj = new Object();
    obj.title = new Object();
    obj.title.media = new Object();
    obj.title.media.url = "img/invid_logo.png";
    obj.title.text = new Object();
    obj.title.text.headline = "Twitter timeline";
    //obj.timeline.startDate = convertDate(data.aggregate_stats.min_tweet_timestamp);
    obj.events = [];
    for (var index in data.tweets) {
        obj_ex = new Object();
        obj_ex.media = new Object();
        //obj_ex.media.url = data.tweets[index].user.profile_image_url;
        //obj_ex.media.caption = "";
        //obj_ex.media.credit = data.tweets[index].user.description;
        obj_ex.media.thumbnail = "img/twitter_logo.png";
        obj_ex.start_date = convertDate(data.tweets[index].created_at);
        obj_ex.text = new Object();
        var user =  data.tweets[index].user.screen_name;
        var user_name = data.tweets[index].user.name;
        //var user_name = data.tweets[index].user.screen_name;
        var user_img = '<img src="' + data.tweets[index].user.profile_image_url_normal + '" />';
        obj_ex.text.headline = user_name + '<a href="https://twitter.com/'+ user + '" target="_blank"> @' + user + "</a>" + " " + user_img;
        obj_ex.text.text = data.tweets[index].text;
        obj.events.push(obj_ex);
    }
    json = obj;
    //console.log(json);
    return json;
}

var loaded_tw = false;

/* display timeline (correct display none bug timeline js) */
function loadTimeline(){
    cleanElement("place-timeline");
    var div = document.getElementById("place-timeline");
    var loader = document.createElement("div");
    loader.setAttribute("id", "loader_tw");
    loader.setAttribute("class", "loader");
    var tl = document.createElement("div");
    tl.setAttribute("id", "timeline-embed");
    tl.setAttribute("style", "width: 100%; height: 600px");
    if (loaded_tw) {
        loader.setAttribute("style", "display: none;");
        /* timeline disable */
        document.getElementById("twitter-content").setAttribute("style", "display: none");
        /*
        if (tw_json.events.length)
            document.getElementById("twitter-content").setAttribute("style", "");
        else
            document.getElementById("twitter-content").setAttribute("style", "display: none");*/
    } else {
        loader.setAttribute("style", "display: block;");
        tl.setAttribute("style", "width: 100%; height: 600px; display: none;");
    }
    div.appendChild(loader);
    div.appendChild(tl);
    timeline = new TL.Timeline('timeline-embed', tw_json);
}

/* Use for contextual menu */
function callApi(url){
    document.getElementById("apibox").value = url;
    submit_form();
}
var video_thumbnails_lst = [];
var twitter_url = "https://twitter.com/search";
var tw_json = "";