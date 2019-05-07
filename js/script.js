
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

    var menuItemsUrl ="https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemsTitleHtml = "snippets/menu-items-title.html";
    var menuItemHtml = "snippets/menu-item.html";
    //Convinience function for inserting ineerHTML for 'select'
    var insertHtml = function (selector, html) {
        // body...
        var targetElem = document.querySelector(selector)
        targetElem.innerHTML = html;
    }

    //showing loading icon inside element identified by 'selector'

    var showLoading = function (selector){
        var html = "<div class = 'text-center'>";
        html += "<img src = 'images/ajax-loader.gif'></div>";
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



    var switchMenuToActive = function () {
        // body...
        //remove 'active' from home botton
        var classes = document.querySelector("#HomeButton").className;
        classes = classes.replace(new RegExp("active", "g"),"");
        document.querySelector("#HomeButton").className = classes;

        //add 'active' to menu navbar if not already there
        classes = document.querySelector("#MenuButton").className;
        if (classes.indexOf("active") == -1) {
            classes += "active";
            document.querySelector("#MenuButton").className = classes;
        }
    }
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

        switchMenuToActive();
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
                        // Switch CSS class active to menu button
                        switchMenuToActive();
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


    // laod the menu items view
    // 'categoryShort' is the short-name for a category
    restaurant.loadMenuItems = function (categoryShort) {
        // body...
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            menuItemsUrl + categoryShort,
            buildAndShowMenuItemsHTML);
    };

    function buildAndShowMenuItemsHTML(categorymenuitems){
        // load the title snippet if menu item
        $ajaxUtils.sendGetRequest(
            menuItemsTitleHtml,
            function (menuItemsTitleHtml){
                // retrieve the menu-item html
                $ajaxUtils.sendGetRequest(
                    menuItemHtml,
                    function (menuItemHtml){
                        var MenuItemsViewHtml = buildMenuItemsViewHtml(
                            categorymenuitems,
                            menuItemsTitleHtml,
                            menuItemHtml
                            );

                        insertHtml("#main-content",MenuItemsViewHtml);

                    },
                    false);
            },
            false);

    };

    // using the menu item data and html
    // building a MenuItemViewHtml to be inserted into page
    function buildMenuItemsViewHtml(categorymenuitems,menuitemtitlehtml,menuitemhtml){
        var name = categorymenuitems.category.name;
        var special_instructions = categorymenuitems.category.special_instructions;
        var final_html = insertProperty(menuitemtitlehtml,"name",name);
        final_html = insertProperty(menuitemtitlehtml,"special_instructions",special_instructions);
        final_html += "<section class='row'>";

        var menuitems = categorymenuitems.menu_items;
        var catShortName = categorymenuitems.category.short_name;
        for (var i = 0; i < menuitems.length; i++) {
            html = menuitemhtml;
            // insrt menu item values

            var short_name=menuitems[i].short_name;
            var price_small = menuitems[i].price_small;
            var small_portion_name = menuitems[i].small_portion_name;
            var price_large = menuitems[i].price_large;
            var large_portion_name = menuitems[i].large_portion_name;
            var description = menuitems[i].description;
            var name = menuitems[i].name;

            html = insertProperty(html,"catShortName",short-name);
            html = insertProperty(html,"short-name",catShortName);
            html = insertItemPrice(html,"price_small",price_small);
            html = insertItemPortionName(html,"small_portion_name",small_portion_name);
            html = insertItemPrice(html,"price_large",price_large);
            html = insertItemPortionName(html,"large_portion_name",large_portion_name);
            html = insertProperty(html,"description",description);
            html = insertProperty(html,"name",name);


            // Add clearfix after every second menu item
            if (i % 2 != 0) {
             html +=
                 "<div class='clearfix d-sm-none d-md-block'></div>";
            }

            final_html += html;
        }
        final_html += "</section>";
        return final_html;
    };


    // Appends price with '$' if price exists
    function insertItemPrice(html,
                             pricePropName,
                             priceValue) {
      // If not specified, replace with empty string
      if (!priceValue) {
        return insertProperty(html, pricePropName, "");;
      }

      priceValue = "$" + priceValue.toFixed(2);
      html = insertProperty(html, pricePropName, priceValue);
      return html;
    }


    // Appends portion name in parens if it exists
    function insertItemPortionName(html,
                                   portionPropName,
                                   portionValue) {
      // If not specified, return original string
      if (!portionValue) {
        return insertProperty(html, portionPropName, "");
      }

      portionValue = "(" + portionValue + ")";
      html = insertProperty(html, portionPropName, portionValue);
      return html;
    }




    global.$restaurant = restaurant;


})(window);

