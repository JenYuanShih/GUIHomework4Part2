/*
File: table.js
Purpose: Provide dynamic multiplicative table generation for index.html. Basing on the user input in html forms.
As well as providing real-time validation for user-input. Include UI slider as a method of update table values, 
provide two-ways binding between slider UI and table inputs. Provide dynamic update to table whenever table values 
changes without the need for manual submission. Include UI tabs as a method to store table(s) into seperate tabs, 
allow user to go back and view previous table

Author: Jen Yuan Shih (JenYuan_Shih@student.uml.edu)
Last Updated: 11/21/2021 9:00PM EST
*/

$(document).ready(function(){
    //Adding custom jquery validation method to make sure the maximum column is bigger than minimum column
    jQuery.validator.addMethod("biggerCol", function (value, element) {
        var minCol = Number($('#col_min').val())
        var maxCol = Number(value)
        return (maxCol >= minCol) ? true : false;
    }, "The max column must be greater than the min column");

    //Adding custom jquery validation method to make sure the maximum row is bigger than minimum row
    jQuery.validator.addMethod("biggerRow", function (value, element) {
        var minRow = Number($('#row_min').val())
        var maxRow = Number(value)
        return (maxRow >= minRow) ? true : false;
    }, "The max row must be greater than the min row");

    var numberOfTabs = 0;
    //jquery UI tab widget initializer
    $("#tableTabs").tabs();
    sliderDynamicUpdate();

    /**
     * validation the value used to generate the table, and only generate table once all validation passes
     * rule includes: all input fields are required, values must be between -50 to 50, values enter must be an interger
     */
    var form = $("#tableForm");
    form.validate({
        focusInvalid: false,
        rules:{
            col_min: {
                required: true,
                range: [-50, 50]
            },
            col_max: {
                required: true,
                range: [-50, 50],
                biggerCol: true
            },
            row_min: {
                required: true,
                range: [-50, 50]
            },
            row_max: {
                required: true,
                range: [-50, 50],
                biggerRow: true
            }
        },
        messages:{
            col_min: {
                required: "Missing Input Value",
                range: "Enter an Integer From -50 to 50"
            },
            col_max: {
                required: "Missing Input Value",
                range: "Enter an Integer From -50 to 50",
            },
            row_min: {
                required: "Missing Input Value",
                range: "Enter an Integer From -50 to 50"
            },
            row_max: {
                required: "Missing Input Value",
                range: "Enter an Integer from -50 to 50"
            }
        },
        submitHandler: function (form) {
            generateTable();
        }
    });

    /**
     * tab controls: only create a new table tab if all the input are valid
     */
    var tabsHeader = document.getElementById("tabsHeader");
    var tabsContent = document.getElementById("tabsContent");
    $("#saveTableTab").click(function(){
        if(form.valid()){

            var colMin = Number(document.getElementById('col_min').value);
            var colMax = Number(document.getElementById('col_max').value);
            var rowMin = Number(document.getElementById('row_min').value);
            var rowMax = Number(document.getElementById('row_max').value);
    
            var tabTable = makeTable(colMin, colMax, rowMin, rowMax);
    
            var tab_li = document.createElement("li");
            tab_li.classList.add("tableTabsLi");
            var tab_a = document.createElement("a");
            var tab_title = document.createTextNode(colMin + "x" + colMax + "," + rowMin + "x" + rowMax);
            tab_a.href = "#tabs-"+ numberOfTabs;
            tab_a.appendChild(tab_title)
            tab_li.appendChild(tab_a);
    
            var tab_content_div = document.createElement("div")
            tab_content_div.classList.add("TableTabsDiv");
            tab_content_div.setAttribute('id', 'tabs-'+numberOfTabs);
            tab_content_div.appendChild(tabTable);
    
            tabsHeader.appendChild(tab_li);
            tabsContent.appendChild(tab_content_div);
            
            numberOfTabs += 1;
            $("#tableTabs").tabs("refresh");
            $('#tableTabs').tabs("option", "active", -1)
        }
    });
    /**
     * Tab controls: delete tabs if the input for tab deletion is valid (integer value
     * seperated by commas)
     */
    $("#deleteTableTab").click(function(){
        var currentTabs = document.getElementsByClassName("tableTabsLi");
        var currentTabsContent = document.getElementsByClassName("TableTabsDiv");
        var deleteTabIndexValArr = $("#deleteTabIndex").val().split(',').sort();

        var newDeletedArray = deleteTabIndexValArr.map(function (item) {
            return item.replace(/\D/g, '');
        });

        newDeletedArray.forEach(function(item, index){
            if(!isNaN(item) && 
            parseInt(Number(item)) == item && 
            !isNaN(parseInt(item, 10))){
                if(Number(item)<currentTabs.length){
                    currentTabs[item].classList.add("DELETED");
                    currentTabsContent[item].classList.add("DELETED")
                }
        }
        });

        $(".DELETED").remove();
        $("#tableTabs").tabs("refresh");
        $('#tableTabs').tabs("option", "active", -1)
        $('#deleteTabIndex').val('');
    })
});

//real-time update of slider ui base on form input
const dynamicInput = function(input, slider){
    $(slider).slider("value", $(input).val());
    $(slider).prop("value", $(input).val());
    $("#tableForm").submit();
}


/**
 * generateTable function will read the input from the form when the 
 * submit button is clicked. Perform validation to see if the input by 
 * user is valid for multiplicative table generation. If valid, 
 * generate table. 
 */
 const generateTable = function(){

    var colMin = Number(document.getElementById('col_min').value);
    var colMax = Number(document.getElementById('col_max').value);
    var rowMin = Number(document.getElementById('row_min').value);
    var rowMax = Number(document.getElementById('row_max').value);

    document.getElementById("tableWrapper").innerHTML = ("");
    var tableDiv = document.getElementById("tableWrapper");
    var completedTable = makeTable(colMin, colMax, rowMin, rowMax);
    tableDiv.appendChild(completedTable);
}

/**
 * Helper function to generate multiplicative table. Creating an HTML
 * table object size of ((c_max-c_min)*(r_max-r_min))
 * @param {*} c_min column minimum
 * @param {*} c_max column maximum
 * @param {*} r_min column minimum
 * @param {*} r_max column maximum
 * @returns HTMLTableSelectionElement that holds the dynamic 
 * multiplicative table 
 */
const makeTable = function(c_min, c_max, r_min, r_max){
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");
    var headRow = document.createElement("tr");
    headRow.appendChild(document.createElement("td"));
    for(var hr = c_min; hr <= c_max; hr++){
        var headRowCell = document.createElement("td");
        headRowCell.classList.add("headerCell");
        headRowCell.appendChild(document.createTextNode(hr))
        headRow.appendChild(headRowCell);
    }
    tblBody.appendChild(headRow);
    for(var r = r_min; r <= r_max; r++){
        var row = document.createElement("tr");
        var headColCell = document.createElement("td");
        headColCell.appendChild(document.createTextNode(r));
        headColCell.classList.add("headerCell");
        row.appendChild(headColCell);
        for(var c = c_min; c<=c_max; c++){
            var cell = document.createElement("td");
            if(c%2==0 && r%2==0){
                cell.classList.add("greyCell");
            }
            else if((c%2==1 || c%2==-1) && (r%2==1 || r%2==-1)){
                cell.classList.add("greyCell");
            }
            var cellContent = document.createTextNode(r*c);

            cell.appendChild(cellContent);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    tbl.appendChild(tblBody);
    return tbl;
}

/**
 * adding jQuery slider into the website, the slider starts from 0 with max of 50 
 * min of -50. The slider update the input field on real-time base on the current UI 
 * value of the slider. 
 */
function sliderDynamicUpdate(){
    $("#col_min_slider").slider({
        min: -50,
        max: 50,
        value: 0,
        slide: function(event, ui){
            $("#col_min").val(ui.value);
            $("#tableForm").submit();
        }
    });
    $("#col_max_slider").slider({
        min: -50,
        max: 50,
        value: 0,
        slide: function(event, ui){
            $("#col_max").val(ui.value);
            $("#tableForm").submit();
        }
    });

    $("#row_min_slider").slider({
        min: -50,
        max: 50,
        value: 0,
        slide: function(event, ui){
            $("#row_min").val(ui.value);
            $("#tableForm").submit();
        }
    });

    $("#row_max_slider").slider({
        min: -50,
        max: 50,
        value: 0,
        slide: function(event, ui){
            $("#row_max").val(ui.value);
            $("#tableForm").submit();
        }
    });
}