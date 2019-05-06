
$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbar-togle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#navbarNav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  //$("#navbarToggle").click(function (event) {
    //$(event.target).focus();
  //});
});


(function (global){
    var restaurant = {};

    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl ="https://davids-restaurant.herokuapp.com/categories.json";
    var categoriesTitleHtml = "snippets/categories-title-snippet.html";
    var categoryHtml = "snippets/category-snippet.html";

    //Convinience function for inserting ineerHTML for 'select'
    var insertHtml = function (selector, html) {
        // body...
        var targetElem = document.querySelector(selector)
        targetElem.innerHTML = html;
    }

    //showing loading icon inside element identified by 'selector'

    var showLoading = function (selector){
        var html = "<div class = 'text-center'>";
        html += "<img src = 'images/ajax-loader.gif></div>";
        insertHtml(selector,html);
    }




    //Return substitute of '{{propName}}'
    //with propValue in given 'string'
    var insertProperty = function (string, propName, propValue){
        var propToReplace = "{{"+propName+"}}";
        // g tells to replace are the property names in  the html
        string = string.replace(new RegExp(propToReplace, "g"),propValue);
        return string;
    };
    // ON page load (before images or CSS)
    document.addEventListener("DOMContentLoaded",function(event){
        //On first load, show home view
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(homeHtml,
            function(responseText){
            document.querySelector("#main-content").innerHTML = responseText;},
            false);
    });


    // load the menu categories view
    restaurant.loadMenuCategories = function (){
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowCategoriesHTML);
    };

    // Build HTML for the categories page based on the data from the server
    function buildAndShowCategoriesHTML(categories){
        // load title snippet of categories page
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
                //Retrieve single category snippet
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    function (categoryHtml){
                        var categoriesViewHtml =
                            buildCategoriesViewHtml(categories,
                                                    categoriesTitleHtml,
                                                    categoryHtml);

                        insertHtml("#main-content",categoriesViewHtml);
                    },
                    false);
            },
            false);

    };

    // Using categories data and snippets html
    // build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml){
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        //loop over categories
        for(var i=0; i<categories.length;i++){
            // Insert category values
            var html = categoryHtml;
            var name = ""+categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html, "name",name);
            html = insertProperty(html,"short_name",short_name);
            finalHtml += html;
        }
        finalHtml += "</section>";
        return finalHtml;

    }





    global.$restaurant = restaurant;


})(window);

