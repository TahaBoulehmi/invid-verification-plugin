/* Clean element by id */
function cleanElement(id){
    var div = document.getElementById(id);
    /* Clear content*/
    while(div.hasChildNodes()){
        div.removeChild(div.firstChild);
    }
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

var thumbnails_google_start_url = "https://www.google.com/searchbyimage?&image_url=";
var thumbnails_yandex_start_url = "https://yandex.com/images/search?url=";
var thumbnails_yandex_end_url = "&rpt=imageview";
var thumbnails_bing_start_url = "https://www.bing.com/images/search?q=imgurl:";
var thumbnails_bing_end_url = "&view=detailv2&iss=sbi";

function get_images(url){
	var youtube_url = "https://www.youtube.com/watch?v=";
	var video_id = url;
	if (url.substring(0, youtube_url.length) == youtube_url)
		video_id = url.split('v=')[1].split('&')[0];
	var img_url = "http://img.youtube.com/vi/%s/%d.jpg";
	var search_url = thumbnails_google_start_url;
	var finish_url = ""
	var yandex = document.getElementById("yandex_engine");
	var bing = document.getElementById("bing_engine");
	if (yandex.checked) {
		search_url = thumbnails_yandex_start_url;
		finish_url = thumbnails_yandex_end_url;
	}
	else if (bing.checked) {
		search_url = thumbnails_bing_start_url;
		finish_url = thumbnails_bing_end_url;
	}
	var img_arr = ["","","",""];
	for (count = 0; count < 4; count++){
		img_arr[count] = search_url + img_url.replace("%s", video_id).replace("%d", count) + finish_url;
		img_url = "http://img.youtube.com/vi/%s/%d.jpg";
	}
	return img_arr;
}

function clickThumbnails(){
	$(".yt_thumbnail").on( 'click', function(e){
		e.preventDefault();
		var url = $( this ).attr('href');
		var search_url = thumbnails_google_start_url;
		var finish_url = "";
		var yandex = document.getElementById("yandex_engine");
		if (yandex.checked) {
			search_url = thumbnails_yandex_start_url;
			finish_url = thumbnails_yandex_end_url;
		}
		else if (bing.checked) {
			search_url = thumbnails_bing_start_url;
			finish_url = thumbnails_bing_end_url;
		}
		window.open(search_url + url + finish_url, '_blank');
    });
}

function add_thumbnails(lst_url){
	cleanElement("place-video-thumbnails");
	var div = document.getElementById("place-video-thumbnails");
	for (index in lst_url){
		var img = document.createElement("img");
		/*var search_url = "https://www.google.com/searchbyimage?&image_url=";
		var search_url2 = "https://yandex.com/images/search?url=";
		var finish_url2 = "&rpt=imageview";
		var search_url3 = "https://www.bing.com/images/search?q=";
		var finish_url3 = "&view=detailv2";*/
		var img_url = lst_url[index]
			.replace(thumbnails_google_start_url, "")
			.replace(thumbnails_yandex_start_url, "")
			.replace(thumbnails_yandex_end_url, "")
			.replace(thumbnails_bing_start_url, "")
			.replace(thumbnails_bing_end_url, "");
		var a = document.createElement("a");
		a.setAttribute("href", img_url);
		a.setAttribute("class", "yt_thumbnail");
		img.setAttribute("src", img_url);
		a.appendChild(img);
		a.appendChild(document.createElement("br"));
		div.appendChild(a);
	}
}

function submit_form(){
	var url = $("[name=video_url]").val();
	if (url != "") {
		var lst = get_images(url);
		add_thumbnails(lst);
		clickThumbnails();
		for (index in lst){
      if (typeof chrome != "undefined")
        chrome.tabs.create({url:lst[index]});
      else
        window.open(lst[index]);
		}
	}
}

var form = document.getElementById("video_form");
if (form.addEventListener){
	form.addEventListener("submit", submit_form, false);
}
form.addEventListener("submit", function(e){
	e.preventDefault();
});