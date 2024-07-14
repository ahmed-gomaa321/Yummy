// ################################################## sideNav ##########################################################
const btnBars = $('#btnBars');
const btnX = $('#btnX');
const mainNav = $('#mainNav');
const sideNav = $('#sideNav');
const mainNavWidth = mainNav.outerWidth(true);
// Initial position of sideNav
sideNav.css('left', -mainNavWidth);

// transition lis
$(".linksNav").animate({
    top: 100
}, 500);

function openSideNav() {
    btnX.removeClass('d-none');
    btnBars.addClass('d-none');
    sideNav.animate({
        left: 0
    }, 500);
    for (let i = 0; i < 5; i++) {
        $(".linksNav").eq(i).animate({
            top: 0
        }, (i + 5) * 100)
    }
}
// Click event for btnBars
btnBars.on('click', openSideNav);

function closeSideNav() {
    btnX.addClass('d-none');
    btnBars.removeClass('d-none');
    sideNav.animate({
        left: -mainNavWidth
    }, 500);
    $(".linksNav").animate({
        top: 100
    }, 500)
}
// Click event for btnX
btnX.on('click', closeSideNav);

$(".aside-btn").on('click', () => {
    if ($('#sideNav').css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})

// #######################################
// show loader
function showLoder() {
    $(function () {
        $('.loading').fadeIn(500 , function () {
            $('body').css({ 'overflow': 'hidden' })
        })
    })
}

// hide loader
function hideLoder() {
    $(function () {
        $('.loading').fadeOut(500, function () {
            $('body').css({ 'overflow': 'auto' })
        })
    })
}

// #########################################

// home images
window.addEventListener('load', async function () {
    showLoder()
    $('#searchForm').css('display', 'none');
    $('#contact').css('display', 'none');
    let data = await homeApi();
    displayMeals(data);
    hideLoder();
})

// home data 
async function homeApi() {
    try {
        showLoder();
        let response = await fetch(`${baseUrl}/search.php?s`)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
        return data.meals; //array
    } catch (err) {
        console.log("error", err)
        throw err
    }
}

// fetch data (search by name)
const baseUrl = `https://www.themealdb.com/api/json/v1/1`
async function searchByName(name) {
    try {
        showLoder();
        let response = await fetch(`${baseUrl}/search.php?s=${name}`)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
        return data.meals; //array
    } catch (err) {
        console.log("error", err)
        throw err
    }
}

// display meals
function displayMeals(data) {
    let box = '';
    for (let i = 0; i < data.length; i++) {
        box += `
            <div class="col-md-3 py-3 display-meals">
                <div onclick="mealDetails('${data[i].idMeal}')" class="card img-cursor rounded border-0 position-relative overflow-hidden">
                    <img src="${data[i].strMealThumb}" class="card-img-top" alt="${data[i].strMeal}">
                    <div class="card-layer position-absolute">
                    <h3 class="card-title ms-2 position-absolute top-50 translate-middle-y">${data[i].strMeal}</h5>
                    </div>
                </div>
            </div>
        `;
    }
    document.querySelector("#showMeals .container .row").innerHTML = box;
}

// event on input search by name
$('#nameSearch').on('input', async function () {
    if ($('#nameSearch').val() == null) {
        return;
    }
    let data = await searchByName($('#nameSearch').val());   //array 
    displayMeals(data);
    hideLoder();
})


// fetch data (search by first letter)
async function searchByFirstLetter(letter) {
    try {
        showLoder();
        let response = await fetch(`${baseUrl}/search.php?f=${letter}`)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
        return data.meals; //array
    } catch (err) {
        console.log("error", err)
        throw err
    }
}

// event on input search by first letter
$('#letterSearch').on('input', async function () {
    if ($('#letterSearch').val() == null) {
        return;
    }
    let data = await searchByFirstLetter($('#letterSearch').val());   //array 
    displayMeals(data);
    hideLoder();
})


// show inputs when click on search link and close navbar
$('#searchLink').on('click', function (e) {
    e.preventDefault();
    $('#contact').css('display', 'none');
    $('#searchForm').css('display', 'block');
    closeSideNav()
    document.querySelector("#showMeals .container .row").innerHTML = "";
});

// fetch data (categories)
async function searchByCategory() {
    try {
        showLoder();
        let response = await fetch(`${baseUrl}/categories.php`)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }
        let data = await response.json();
        console.log(data);
        return data.categories; //array
    } catch (err) {
        console.log("error", err)
        throw err
    }
}

// display meals by categories
function displayCategories(data) {
    let box = "";
    for (let i = 0; i < data.length; i++) {

        box += `
            <div class="col-md-3 py-3 display-meals">
                <div onclick="searchByFilterCategory('${data[i].strCategory}')" class="card img-cursor position-relative rounded bg-transparent overflow-hidden text-center">
                    <img class="w-100 rounded" src="${data[i].strCategoryThumb}" alt="${data[i].strCategory}">
                    <div class="card-layer position-absolute">
                        <h1>${data[i].strCategory}</h1>
                        <p>${data[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
            </div>
        `
    }
    document.querySelector("#showMeals .container .row").innerHTML = box;
}


// event on link (search by category)

$('#categoriesLink').on('click', async function (e) {
    showLoder();
    e.preventDefault();
    $('#searchForm').css('display', 'none');
    $('#contact').css('display', 'none');
    let data = await searchByCategory();
    displayCategories(data);
    closeSideNav();
    hideLoder();
})

// fetch data and display meals by (filter category)
async function searchByFilterCategory(name) {
    try {
        showLoder();
        let response = await fetch(`${baseUrl}/filter.php?c=${name}`)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }
        let data = await response.json();
        console.log(data);
        data = data.meals;
        displayMeals(data.slice(0, 20));
        hideLoder();
        // return data.meals; //array
    } catch (err) {
        console.log("error", err)
        throw err
    }
}

// fetch data (area)
async function filterNameArea() {
    try {
        showLoder();
        let response = await fetch(`${baseUrl}/list.php?a=list`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }
        let data = await response.json();
        console.log(data);
        return data.meals; //array
    } catch (err) {
        console.log("error", err)
        throw err
    }
}

// display Area
function displayArea(data) {
    let box = ``;
    data.forEach(ele => {
        box += `
            <div class="col-md-3 py-3 display-meals">
                <div onclick="filterMealsArea('${ele.strArea}')" class="country text-center img-cursor">
                    <i class="fa-solid fa-house-laptop fa-4x"></i>
                    <h3>${ele.strArea}</h3>
                </div>
            </div>
        `
    })
    document.querySelector("#showMeals .container .row").innerHTML = box;
}

// event when click to display names country 
$('#areaLink').on('click', async function (e) {
    showLoder();
    e.preventDefault();
    $('#searchForm').css('display', 'none');
    $('#contact').css('display', 'none');
    let data = await filterNameArea();
    displayArea(data);
    closeSideNav();
    hideLoder();
});

// fetch and display meals country (area By name)
async function filterMealsArea(area) {
    try {
        showLoder();
        let response = await fetch(`${baseUrl}/filter.php?a=${area}`)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }
        let data = await response.json();
        console.log(data);
        data = data.meals;
        displayMeals(data.slice(0, 20));
        hideLoder();
    } catch (err) {
        console.log("error", err)
        throw err
    }
}

// #############################################
// fetch data (ingredient)
async function filterNameIngredient() {
    try {
        showLoder();
        let response = await fetch(`${baseUrl}/list.php?i=list`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }
        let data = await response.json();
        console.log(data);
        return data.meals; //array
    } catch (err) {
        console.log("error", err)
        throw err
    }
}

// display ingredient
function displayIngredient(data) {
    let box = ``;
    for (let i = 0; i < 20; i++) {
        box += `
            <div class="col-md-3 py-3 display-meals">
            <div onclick="filterMealsIngredient('${data[i].strIngredient}')" class="country text-center img-cursor">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <h3>${data[i].strIngredient}</h3>
                <p>${data[i].strDescription ? data[i].strDescription.split(" ").slice(0, 20).join(" ") : ''}</p>
            </div>
            </div>
            `
        3
    }
    document.querySelector("#showMeals .container .row").innerHTML = box;
}

// event when click to display names Ingredient 
$('#ingredientLink').on('click', async function (e) {
    showLoder();
    e.preventDefault();
    $('#searchForm').css('display', 'none');
    $('#contact').css('display', 'none');
    let data = await filterNameIngredient();
    displayIngredient(data);
    closeSideNav();
    hideLoder();
});

// fetch and display meals country (area By name)
async function filterMealsIngredient(name) {
    try {
        showLoder();
        let response = await fetch(`${baseUrl}/filter.php?i=${name}`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
        data = data.meals;
        displayMeals(data.slice(0, 20));
        hideLoder();
    } catch (err) {
        console.log("error", err)
        throw err
    }
}

// fetch data (meal details)
async function mealDetails(id) {
    try {
        showLoder();
        let response = await fetch(`${baseUrl}/lookup.php?i=${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }
        let data = await response.json();
        data = data.meals;
        console.log(data);
        displayMealDetails(data);
        hideLoder();
    } catch (err) {
        console.log("error", err)
        throw err
    }
}

// display meal Details

function displayMealDetails(data) {
    let box = '';
    for (let i = 0; i < data.length; i++) {
        // Prepare ingredients list
        let ingredientsList = '';
        for (let j = 1; j <= 20; j++) {
            if (data[i][`strIngredient${j}`]) {
                ingredientsList += `
                    <li class="py-1 px-2 me-1 ingredientList rounded mb-2">
                        ${data[i][`strMeasure${j}`] ? data[i][`strMeasure${j}`] : ''} ${data[i][`strIngredient${j}`]}
                    </li>
                `;
            }
        }
        // Construct the HTML for each meal
        box += `
            <div class="col-md-4 py-5 display-meals">
                <div class="imgDetails text-white rounded">
                    <img class="w-100 rounded" src="${data[i].strMealThumb}" alt="${data[i].strMeal}">
                    <h4 class="mt-2">${data[i].strMeal}</h4>
                </div>
            </div>
            <div class="col-md-8 py-5 display-meals">
                <h2>Instructions</h2>
                <p class="my-2">${data[i].strInstructions}</p>
                <h3>Area : ${data[i].strArea}</h3>
                <h3>Category : ${data[i].strCategory}</h3>
                <h3>Recipes :</h3>
                <ul id="ingredient" class="d-flex flex-wrap list-unstyled">
                    ${ingredientsList}
                </ul>
                <h3 class="mb-3">Tags :</h3>
                <ul id="tagId" class="d-flex flex-wrap g-5 list-unstyled">
                    <li class="py-1 px-2 rounded tagList">
                        ${data[i].strTags ? data[i].strTags.split(",") : 'no tags'}
                    </li>
                </ul>
                <a href="${data[i].strSource}" target="_blank" class="btn btn-success me-1">Source</a>
                <a href="${data[i].strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
            </div>
        `;
    }
    document.querySelector("#showMeals .container .row").innerHTML = box;
}


// ###################################################
// regex
// show inputs when click on contact link and close navbar
$('#contactLink').on('click', function (e) {
    e.preventDefault();
    $('#searchForm').css('display', 'none');
    $('#contact').css('display', 'block');
    contactUs();
    closeSideNav();
    document.querySelector("#showMeals .container .row").innerHTML = "";
});

// check name validation
function checkName() {
    let namevalidation = /^[a-zA-Z ]{3,15}$/;
    return namevalidation.test($("#nameInput").val());
}

// check email validation
function checkEmail() {
    let emailValidation = /^[a-zA-Z]+[.][a-zA-Z0-9]+\@[a-zA-Z]+\.[a-zA-Z]{3,5}$/;
    return emailValidation.test($("#emailInput").val());
}

// check phone validtaion
function checkPhone() {
    let phoneValidation = /^(00201|\+201|01)[0-2 5]{1}[0-9]{8}$/;
    return phoneValidation.test($("#phoneInput").val())
}

// check age validation
function checkAge() {
    let ageValidation = /^(1[89]|[2-9]\d)$/;
    return ageValidation.test($("#ageInput").val());
}

// check password validation
function checkPassword() {
    let passwordValidation = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:<>?]).{8,}$/;
    return passwordValidation.test($("#passwordInput").val())
}

// check repassword
function checkRePassword() {
    return $("#rePassword").val() == $("#passwordInput").val();
}

// contact us
function contactUs() {
    $("#nameInput").on(('input'), function () {
        if (checkName()) {
            $("#nameInput").removeClass("is-invalid");
            $("#nameInput").addClass("is-valid");
            $("#nameInput").next().fadeOut(100);
            enableButton();
        }
        else {
            $("#nameInput").addClass("is-invalid");
            $("#nameInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled", true);
        }
    })

    $("#emailInput").on(('input'), function () {
        if (checkEmail()) {
            $("#emailInput").removeClass("is-invalid");
            $("#emailInput").addClass("is-valid");
            $("#emailInput").next().fadeOut(100);
            enableButton();
        }
        else {
            $("#emailInput").addClass("is-invalid");
            $("#emailInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled", true);
        }
    })

    $("#phoneInput").on(('input'), function () {
        if (checkPhone()) {
            $("#phoneInput").removeClass("is-invalid");
            $("#phoneInput").addClass("is-valid");
            $("#phoneInput").next().fadeOut(100);
            enableButton();
        }
        else {
            $("#phoneInput").addClass("is-invalid");
            $("#phoneInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled", true);
        }
    })

    $("#ageInput").on(('input'), function () {
        if (checkAge()) {
            $("#ageInput").removeClass("is-invalid");
            $("#ageInput").addClass("is-valid");
            $("#ageInput").next().fadeOut(100);
            enableButton();
        }
        else {
            $("#ageInput").addClass("is-invalid");
            $("#ageInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled", true);
        }

    })

    $("#passwordInput").on(('input'), function () {
        if (checkPassword()) {
            $("#passwordInput").removeClass("is-invalid");
            $("#passwordInput").addClass("is-valid");
            $("#passwordInput").next().fadeOut(100);
            enableButton();
        }
        else {
            $("#passwordInput").addClass("is-invalid");
            $("#passwordInput").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled");
        }

    })

    $("#rePassword").on(('input'), function () {
        if (checkRePassword() && $("#passwordInput").val() != "") {
            $("#rePassword").removeClass("is-invalid");
            $("#rePassword").addClass("is-valid");
            $("#rePassword").next().fadeOut(100);
            enableButton();
        }
        else {
            $("#rePassword").addClass("is-invalid");
            $("#rePassword").next().fadeIn(500);
            document.getElementById("buttonId").setAttribute("disabled");
        }

    })
}

// check all inputs valid
function enableButton() {
    if ($("#nameInput").hasClass("is-valid") && $("#emailInput").hasClass("is-valid") && $("#phoneInput").hasClass("is-valid") && $("#ageInput").hasClass("is-valid") && $("#passwordInput").hasClass("is-valid") && $("#rePassword").hasClass("is-valid")) {
        document.getElementById("buttonId").removeAttribute("disabled");
    }
    else {
        document.getElementById("buttonId").setAttribute("disabled", true);
    }
}

// clear inputs
function clearInputs() {
    $("#nameInput").val("");
    $("#emailInput").val("");
    $("#phoneInput").val("");
    $("#ageInput").val("");
    $("#passwordInput").val("");
    $("#rePassword").val("");
    $("#nameInput").removeClass("is-valid");
    $("#emailInput").removeClass("is-valid");
    $("#phoneInput").removeClass("is-valid");
    $("#ageInput").removeClass("is-valid");
    $("#passwordInput").removeClass("is-valid");
    $("#rePassword").removeClass("is-valid");
    document.getElementById("buttonId").setAttribute("disabled", true);
}

// click button
$("#buttonId").on(('click'), function () {
    clearInputs();
})
