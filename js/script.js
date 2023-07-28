unorganized_list = [];

const form = document.querySelector('form');
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const fd = new FormData(form);

    const obj = Object.fromEntries(fd);
    // console.log(obj.list_items);
    unorganized_list.push(obj.list_items)
    // console.log(unorganized_list)
    document.getElementById('list_items').value='';
});

document.getElementById('submit_list').onclick = function() {
    var compsAndCount = randomizeComparisons(unorganized_list)
    comparisons = compsAndCount[0];
    numComparisons = compsAndCount[1];
    // console.log(comparisons)
    // console.log(numComparisons)
    compare(comparisons, unorganized_list, numComparisons)
};

function randomizeComparisons(unorganized_list) {
    var comparisons = [];
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
    var numComparisons = comparisons.length;
    console.log("comparions:")
    console.log(comparisons)
    return [comparisons, numComparisons];
};

var item_one = document.getElementById('item_one');
var item_two = document.getElementById('item_two');

function compare(comparisons, unorganized_list, numComparisons){
    var savedChoices = {};
    var count = 1;
    var pointsDict = {};
    for (x in comparisons) {
        item = comparisons[x];
        var to_compare = item.split(',');
        console.log(item);
        console.log(to_compare);

        var priority;
        
        item_one.addEventListener('click', function() {priority = 1});
        item_two.addEventListener('click', function() {priority = 2});
        console.log(priority);
    }
};