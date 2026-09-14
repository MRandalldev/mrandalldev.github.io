/* =========================================================
   ELEMENTS
========================================================= */

const titleScreen =
    document.getElementById('title-screen');

const menuScreen =
    document.getElementById('menu-screen');

const enterPrompt =
    document.querySelector('.enter-prompt');

const transitionOverlay =
    document.getElementById('transition-overlay');

const menuLinks =
    document.querySelectorAll('nav a');

const backButtons =
    document.querySelectorAll('.back-button');


/* =========================================================
   AUDIO
========================================================= */

const startSound =
    new Audio('sounds/Title.mp3');

startSound.preload = 'auto';
startSound.load();


const selectSound =
    new Audio('sounds/select.mp3');

selectSound.preload = 'auto';
selectSound.load();


const cursorSound =
    new Audio('sounds/Cursor_move.mp3');

cursorSound.preload = 'auto';
cursorSound.volume = 1;


const backSound =
    new Audio('sounds/Back.mp3');

backSound.preload = 'auto';
backSound.load();


/* =========================================================
   STATE
========================================================= */

let isStarting = false;

let isTransitioning = false;

let lastCursorSoundTime = 0;

const cursorSoundCooldown = 50;


/* =========================================================
   TITLE → MENU
========================================================= */

function revealMenu() {

    titleScreen.classList.add('hidden-screen');

    menuScreen.classList.remove('hidden-screen');

    menuScreen.classList.add('menu-reveal');


    setTimeout(function () {

        menuScreen.classList.remove('menu-reveal');

    }, 900);

}


function startPortfolio() {

    if (isStarting) {
        return;
    }


    isStarting = true;


    enterPrompt.classList.add('starting');

    titleScreen.classList.add('flash');


    /*
    You trimmed the silence from the MP3,
    so we now begin at the actual beginning.
    */

    startSound.currentTime = 1.3;

    startSound.play();


    setTimeout(function () {

        titleScreen.classList.add('vhs-out');

    }, 180);


    setTimeout(function () {

        transitionOverlay.classList.add('active');

    }, 620);


    setTimeout(function () {

        revealMenu();

    }, 950);


    setTimeout(function () {

        transitionOverlay.classList.remove('active');

    }, 1350);

}


titleScreen.addEventListener(
    'click',
    startPortfolio
);


document.addEventListener(
    'keydown',
    function (event) {

        if (event.key === 'Enter') {

            startPortfolio();

        }

    }
);


/* =========================================================
   CURSOR SOUND
========================================================= */

menuLinks.forEach(function (link) {

    link.addEventListener(
        'mouseenter',
        function () {

            const now = Date.now();


            if (
                now - lastCursorSoundTime
                <
                cursorSoundCooldown
            ) {

                return;

            }


            lastCursorSoundTime = now;


            cursorSound.currentTime = 0;

            cursorSound.play();

        }
    );

});


/* =========================================================
   SCREEN TRANSITION FUNCTION
========================================================= */

function changeScreen(
    currentScreen,
    nextScreen,
    sound
) {

    /*
    Prevent somebody from clicking five things
    while the screen is already transitioning.
    */

    if (isTransitioning) {

        return;

    }


    isTransitioning = true;


    if (sound) {

        sound.currentTime = 0.4;

        sound.play();

    }


    transitionOverlay.classList.add('active');


    /*
    Halfway through the animation,
    the screen is black.

    THAT is when we secretly swap screens.
    */

    setTimeout(function () {

        currentScreen.classList.add(
            'hidden-screen'
        );


        nextScreen.classList.remove(
            'hidden-screen'
        );


        /*
        If this is a scrollable portfolio page,
        always begin at the top.
        */

        nextScreen.scrollTop = 0;

    }, 400);


    /*
    Let the black overlay disappear.
    */

    setTimeout(function () {

        transitionOverlay.classList.remove(
            'active'
        );

    }, 800);


    /*
    Unlock navigation after the transition.
    */

    setTimeout(function () {

        isTransitioning = false;

    }, 850);

}


/* =========================================================
   MENU → CONTENT PAGE
========================================================= */

menuLinks.forEach(function (link) {

    link.addEventListener(
        'click',
        function (event) {

            event.preventDefault();


            const targetID =
                link.getAttribute('href');


            const targetScreen =
                document.querySelector(targetID);


            changeScreen(
                menuScreen,
                targetScreen,
                selectSound
            );

        }
    );

});


/* =========================================================
   CONTENT PAGE → MENU
========================================================= */

backButtons.forEach(function (button) {

    button.addEventListener(
        'click',
        function () {

            /*
            Find the content page that contains
            whichever Back button was pressed.
            */

            const currentScreen =
                button.closest('.content-screen');


            changeScreen(
                currentScreen,
                menuScreen,
                backSound
            );

        }
    );

});