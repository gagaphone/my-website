<script>
$(document).ready(function() {
    $('#pagepiling').pagepiling({
        direction: 'vertical',
        scrollingSpeed: 700,
        easing: 'easeInQuart',

        // Section order matches your HTML
        anchors: ['home', 'about', 'experience', 'education', 'services'],

        navigation: {
            textColor: '#000',
            bulletsColor: '#000',
            position: 'right',
            tooltips: ['Home', 'About', 'Experience', 'Education', 'Services']
        },

        verticalCentered: true,
        loopBottom: false,
        loopTop: false,
        css3: true,
        sectionSelector: '.section',

        afterRender: function(){
            console.log('PagePiling initialized with correct section order.');
        }
    });
});
</script>