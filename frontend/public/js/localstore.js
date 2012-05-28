//Set default structure for new database
var defaults = {
	"categories": [{'id':0,'name':'None','value':'none'}],
	"data": []
};

//Store.clear();

//Initialise Database
var db = new Store("Bookmarks",defaults);

//Define Embedly URL
var API = "http://api.embed.ly/1/oembed?"+encodeURI("maxwidth=200&url=");

//Function to add URL to localStorage
function add(button){
	button.disabled = "disabled";	//Disable Save button
	var URL = document.getElementById('URL').value;
	var catid = document.getElementById('catid').value;
	var cat = document.getElementById('cat').value;
	var data = db.get('data');		//Retrieve data from localStorage
	var c = data.length;
	var flag = true;
	
	for(var i=0;i<c;i++)			//Check if URL already exists
	{
		if(data[i].url == URL)
		{
			flag = false;
			break;
		}
	}
	
	if(flag)						//Insert into LocalStorage if URL is new
	{
		$.ajax({
			'url':API+encodeURI(URL),
			'dataType':'jsonp',
			success:function(embedly){
				if(catid == 0 && cat.toLowerCase() != 'none')	//Add new category if selected category not in database
				{
					var cats = db.get('categories');
					var tid = cats[cats.length-1].id+1;
					cats.push({'id':tid,'name':cat,'value':cat.toLowerCase()});
					db.set('categories',cats);
					catid = tid;
					suggestCats();
				}
				var content = "";
				if('html' in embedly)			//Set content either as HTML or thumbnail depending on the existence of either
					content = embedly.html;
				else
					content = '<img src="'+embedly.thumbnail_url+'" width="200" />';
				
				var bookmark = {				//Create a bookmark structure to be inserted into database
					"time": Date.now(),
					"category": catid,
					"url": URL,
					"provider_url": embedly.provider_url,
					"description": embedly.description,
					"title": embedly.title,
					"content": content
				};
				
				data.push(bookmark);			//Add new bookmark to dataset
				db.set('data',data);			//set new bookmark collection
				createchild(bookmark.title,bookmark.content);	//Generate tile for new bookmark
			}
		});
	}
		else
			alert("Already exists!");
		button.disabled = false;
}

//Function to generate new Bookmark Tile
function createchild(heading,content){
	var child=$(document.createElement("div"));
	var span=$(document.createElement("span"));
	var childcontent=$(document.createElement("div"));
	child.addClass("child");
	span.addClass("childhead");
	span.html(heading);
	childcontent.addClass("childcont");
	childcontent.html(content);
	child.append(span);
	child.append(childcontent);
	
	$(".wrap").append(child);
}

//Function to list all the Stored Bookmarks
function populate(){
	var data = db.get('data');
	var n = data.length;
	for(var i=0;i<n;i++)
	{
		createchild(data[i].title,data[i].content);
	}
}

//Function to filter by Category
function category(cat)
{
	$(".wrap").html(" ");
	var data = db.get('data');
	var n = data.length;
	var absent = true;
	for(var i=0;i<n;i++)
		if(data[i].category.toLowerCase() == cat.toLowerCase())
		{
			absent = false;
			createchild(data[i].title,data[i].content)
		}
	if(absent)
		$(".wrap").html("No bookmark present");
}

//Function to search bookmarks. Acceptable format.. <title:value|description:value|content:value> or <value>
function Search(expression)
{
	$('.wrap').html(' ');
	var q = expression.split("|");
	params = {};
	var qn = q.length;
	for(var i=0; i<qn; i++)
	{
		var tmp = q[i].split(":");
		if(tmp.length == 1)
		{
			params.title = tmp[0];
			params.description = tmp[0];
			params.content = tmp[0];
			break;
		}
		if(tmp[0]!="title" && tmp[0]!="description" && tmp[0]!="content")
		{
			alert("Invalid query");
			return;
		}
		params[tmp[0]] = tmp[1];
	}

	var data = db.get('data');
	var n = data.length;
	var absent = true;
	for(var i=0; i<n; i++)
	{
		for(key in params)
		{
			var pattern = new RegExp(".*"+escape(params[key])+".*","gi");
			if(pattern.test(data[i][key]))
			{
				absent = false;
				createchild(data[i].title,data[i].content)
				break;
			}
		}
	}
	if(absent)
	{
		$('.wrap').html("No bookmark found");
	}
}

//Generate tiles for all the bookmarks in DB
populate();
suggestCats();

//Add suggestion list to categories
function suggestCats() {
	var availableCats = db.get('categories');
	$( "#cat" ).autocomplete({
		minLength: 0,
		source: availableCats,
		focus: function( event, ui ) {
			$( "#cat" ).val( ui.item.name );
			return false;
		},
		select: function( event, ui ) {
			$( "#cat" ).val( ui.item.name );
			$( "#catid" ).val( ui.item.id );
			return false;
		}
	})
	.data( "autocomplete" )._renderItem = function( ul, item ) {
		return $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( "<a>" + item.name + "</a>" )
			.appendTo( ul );
	};
}