var item_form = document.getElementById('item_form');
var list_nameEL = document.getElementById('list_name');
var save_form = document.getElementById('save_form');
var item_one = document.getElementById('item_one');
var item_two = document.getElementById('item_two');
var entered_item = document.getElementById('list_items')
var doneBtn = document.getElementById('done');
var mainScreen = document.getElementById('main_screen');
var ETScreen = document.getElementById('enter_items_screen');
var UCScreen = document.getElementById('user_choice_screen');
var VLScreen = document.getElementById('view_list_screen');
var PLScreen = document.getElementById('previous_lists_screen');
var sort_newBtn = document.getElementById('sort_new');
var view_sortedBtn = document.getElementById('view_sorted');
var list_box_container = document.getElementById('list_box_container');
var errorMessage1 = document.getElementById('error_message_1');
var errorMessage2 = document.getElementById('error_message_2');
var unorganized_list = [];
var sorted_list = [];
var comparisons = [];
var to_compare = [];
var pointsObject = {};
var savedChoices = {};
var y;
var priority;
var numComparisons;
var item;
var list_name;

item_form.addEventListener('submit', function(e) {
    e.preventDefault();
    var user_input = entered_item.value.trim();
    if (unorganized_list.includes(user_input)) {
        errorMessage1.textContent = 'Item is already in the list.';
        entered_item.value='';
    }
    else if (user_input === '') {
        errorMessage1.textContent = 'Please enter an item.';
        entered_item.value='';
    }
    else {
        errorMessage1.textContent = '';
        unorganized_list.push(user_input);
        $('#unsorted_list').prepend('<li>' + user_input + '</li>');
        entered_item.value='';
        entered_item.focus();
    }
});

sort_newBtn.addEventListener('click', function() {
    errorMessage1.textContent = '';
    errorMessage2.textContent = '';
    unorganized_list = [];
    sorted_list = [];
    comparisons = [];
    to_compare = [];
    pointsObject = {};
    savedChoices = {};
    sorted_list = [];
    document.getElementById('unsorted_list').innerHTML = '';
    document.getElementById('sorted_list').innerHTML = '';
    showEnterItemsScreen();
});

view_sortedBtn.addEventListener('click', function() {
    errorMessage1.textContent = '';
    errorMessage2.textContent = '';
    createFinalElements();
    showPreviousListsScreen();
});

doneBtn.addEventListener('click', function() {
    if (unorganized_list.length === 0 || unorganized_list.length === 1){
        errorMessage1.textContent = 'List needs at least two items'
    } else if (unorganized_list.length > 1){
        errorMessage1.textContent = '';
        randomizeComparisons()
        y = 0;
        pointsInit();
        compare();
        showUserChoiceScreen();
    }
    
});

item_one.addEventListener('click', function() {
    priority = 1;
    if (y<comparisons.length) {
        pointsKeeper();
        savedChoices[item] = to_compare[0];
        y++;
        if (y<comparisons.length) {
            compare();
        } else {
            tiebreakers();
        }
    }
});

item_two.addEventListener('click', function() {
    priority = 2;
    if (y<comparisons.length) {
        pointsKeeper();
        savedChoices[item] = to_compare[1];
        y++;
        if (y<comparisons.length) {
            compare();
        } else {
            tiebreakers();
        }
    }
});

save_form.addEventListener('submit', function(e) {
    e.preventDefault();
    list_name = list_nameEL.value.trim();

    var existingData = JSON.parse(localStorage.getItem('prioritized_lists')) || {};

    if (existingData.hasOwnProperty(list_name)) {
        errorMessage2.textContent = 'List name already exists in local storage.';
        list_nameEL.value = '';
    } else {
        errorMessage2.textContent = '';
        saveList();
        list_nameEL.value = '';
        save_form.style.display = 'none';
    }

    
});

function randomizeComparisons() {
    length = unorganized_list.length;
    x = 0;
    while (x != length) {
        y = x + 1;
        while (y != length) {
            if (x != y) {
                comparisons.push(unorganized_list[x] + ',' + unorganized_list[y])
            }
            y += 1;
        }
        x += 1;
    }
    comparisons = comparisons.sort((a, b) => 0.5 - Math.random());
    numComparisons = comparisons.length;
};

function compare() {
    item = comparisons[y];
    to_compare = item.split(',');
    item_one.textContent = to_compare[0];
    item_two.textContent = to_compare[1];
};

function pointsInit() {
    for (i=0;i<unorganized_list.length;i++) {
        pointsObject[unorganized_list[i]] = 0;
    }
}

function init() {
    createFinalElements();
    showPreviousListsScreen();
}

function pointsKeeper() {
    if (priority == 1) {
        pointsObject[to_compare[0]] += 100;
    } else {
        pointsObject[to_compare[1]] += 100;
    }
};

function tiebreakers() {
    var noTies = false;
    while (!noTies) {
        noTies = true;
        for (i=0;i<pointsObject.length;i++) {
            x = pointsObject[i];
            for (j=0;j<pointsObject.length;j++) {
                y = pointsObject[j];
                if (x != y) {
                    if (pointsObject[x] == pointsObject[y]) {
                        noTies = false;
                        var comparison = x+','+y;
                        var mirrorComparison = y+','+x;
                        if (savedChoices.includes(comparison)) {
                            choice = savedChoices[comparison];
                            pointsObject[choice] += 1;
                        } else if (savedChoices.includes(mirrorComparison)) {
                            choice = savedChoices[mirrorComparison];
                            pointsObject[choice] += 1;
                        }
                    }
                }
            }
        }
    }
    list_sorter();
}

function list_sorter() {
    var sortedArray = Object.entries(pointsObject).sort((a,b) => b[1]-a[1]).reverse()
    for (i=0;i<sortedArray.length;i++) {
        var item = sortedArray[i];
        sorted_list.push(item[0]);
    }
    sorted_list.reverse();
    for (i=0;i<sorted_list.length;i++) {
        $('#sorted_list').append('<li>' + sorted_list[i] + '</li>');
    }
    showViewListScreen();
}

// function showMainScreen() {
//     hideAllScreens();
//     mainScreen.style.display = 'block';
// }

function showEnterItemsScreen() {
    hideAllScreens();
    ETScreen.style.display = 'block';
    entered_item.focus();
}

function showUserChoiceScreen() {
    hideAllScreens();
    UCScreen.style.display = 'block';
}

function showViewListScreen() {
    hideAllScreens();
    VLScreen.style.display = 'block';
    save_form.style.display = 'block';
}

function showPreviousListsScreen() {
    hideAllScreens();
    PLScreen.style.display = 'block';
}

function hideAllScreens() {
    ETScreen.style.display = 'none';
    UCScreen.style.display = 'none';
    VLScreen.style.display = 'none';
    PLScreen.style.display = 'none';
    save_form.style.display = 'none';
}

function createFinalElements() {
    list_box_container.innerHTML = '';
    var prioritized_lists = JSON.parse(localStorage.getItem('prioritized_lists'));

    for (var listName in prioritized_lists) {
        if (prioritized_lists.hasOwnProperty(listName)) {
            var list = prioritized_lists[listName];

            var div = document.createElement('div');
            div.classList.add('list_box');

            var deleteButton = createDeleteButton(listName);
            div.appendChild(deleteButton);

            var listNameEl = document.createElement('h3');
            listNameEl.classList.add('scroll');
            var listElement = createListElement(list);

            listNameEl.textContent = listName;
            listNameEl.style.textAlign = 'center';

            div.appendChild(listNameEl);
            div.appendChild(listElement);

            list_box_container.appendChild(div);
        }
    }
}

function createDeleteButton(listName) {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete_button');

    deleteButton.addEventListener('click', function() {
        deleteList(listName);
        list_box_container.removeChild(deleteButton.parentElement);
    });

    return deleteButton;
}

function createListElement(list) {
    var listElement = document.createElement('ol');
    listElement.classList.add('lists');
    listElement.classList.add('scroll');

    for (var i = 0; i < list.length; i++) {
        var listItem = document.createElement('li');
        listItem.classList.add('list_items')
        listItem.textContent = list[i];
        listElement.appendChild(listItem);
    }

    return listElement;
}

function deleteList(listName) {
    var prioritized_lists = JSON.parse(localStorage.getItem('prioritized_lists'));
    delete prioritized_lists[listName];
    localStorage.setItem('prioritized_lists', JSON.stringify(prioritized_lists));
}


function saveList() {
    var prioritized_lists = {};
    const objectExists = (localStorage.getItem('prioritized_lists') !== null);
    if (objectExists) {
        prioritized_lists = JSON.parse(localStorage.getItem('prioritized_lists'));
    } 
    prioritized_lists[list_name] = sorted_list;
    localStorage.setItem('prioritized_lists', JSON.stringify(prioritized_lists));
}

function adjustPadding() {
    const header = document.getElementById('main-header');
    const content = document.getElementById('content');
    const headerHeight = header.offsetHeight;

    // Add header height to content padding-top
    content.style.paddingTop = headerHeight + 'px';
}

document.addEventListener('DOMContentLoaded', () => {
    adjustPadding();
    window.addEventListener('resize', adjustPadding);
});

init();