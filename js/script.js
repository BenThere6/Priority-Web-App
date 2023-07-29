const form = document.querySelector('form');
var item_one = document.getElementById('item_one');
var item_two = document.getElementById('item_two');
var entered_item = document.getElementById('list_items')
var doneBtn = document.getElementById('done');
var ETScreen = document.getElementById('enter_items_screen');
var UCScreen = document.getElementById('user_choice_screen');
var VLScreen = document.getElementById('view_list_screen');
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

form.addEventListener('submit', function(e) {
    e.preventDefault();
    unorganized_list.push(entered_item.value);
    $('#unsorted_list').append('<li>' + entered_item.value + '</li>');
    entered_item.value='';
});

doneBtn.addEventListener('click', function() {
    randomizeComparisons()
    y = 0;
    pointsInit();
    compare();
    showUserChoiceScreen();
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
    // console.log("randomized comparions:")
    // console.log(comparisons)
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
    showEnterItemsScreen();
}

function pointsKeeper() {
    if (priority == 1) {
        pointsObject[to_compare[0]] += 100;
    } else {
        pointsObject[to_compare[1]] += 100;
    }
    // console.log(pointsObject);
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

function showEnterItemsScreen() {
    ETScreen.style.display = 'block';
    UCScreen.style.display = 'none';
    VLScreen.style.display = 'none';
}

function showUserChoiceScreen() {
    ETScreen.style.display = 'none';
    UCScreen.style.display = 'block';
    VLScreen.style.display = 'none';
}

function showViewListScreen() {
    ETScreen.style.display = 'none';
    UCScreen.style.display = 'none';
    VLScreen.style.display = 'block';
}

init();