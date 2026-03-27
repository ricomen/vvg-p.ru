/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Header Search
4. Init Menu
5. Init Timer
6. Init Lightbox


******************************/

$('.js-select-term').on('change', function(){
    var newPrice = 1000;
    if(this.value == '1_year'){
        newPrice = 1000;
    }else if(this.value == '6_months'){
          newPrice = 600;
    }else if(this.value == '1_month'){
          newPrice = 150;
    }
    $('.js-cost').attr('value',newPrice);
    $('.js-cost').attr('data-value',newPrice);
 });
 
 // hide/show donations table rows
 var donationTableRows = $('.js-table-donations tr');
 var startRow = 20;
 $('.js-donations-show-more').unbind('click').bind('click', function () {
     $.each(donationTableRows, function (i, val) {
         if(i < startRow){
             $(this).show();
         }
     });
     startRow += 10;
     console.log('click');
     return false;
 });
 
 //scroll to anchor
 $('a[href*="#anchor"]:not([href="#"])').click(function () {
     var target = $(this.hash);
     $('html,body').stop().animate({
         scrollTop: target.offset().top - 120
     }, 'linear');
 });
 jQuery(document).ready(function ($) {
     var hash = window.location.hash
     if (hash == '' || hash == '#' || hash == undefined) return false;
     var target = $(hash);
     headerHeight = 120;
     target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
     if (target.length) {
         $('html,body').animate({
             scrollTop: target.offset().top - 125 //offsets for fixed header
         }, 'linear');
 
     }
 });
 
 // to top button
 $(function () {
     const toTopBtn = $('.js-to-top-btn');
     var topOffset;
     toTopBtn.fadeOut(0);
     toTopBtn.click(function () {
         // скорость скролла
         const speed = 1000;
         // место скролла
         const top = $('body').offset().top;
         $('html, body').animate({scrollTop: top}, speed);
         return false;
     });
     $(window).on('scroll', function () {
         topOffset = $(this).scrollTop();
         if (topOffset > 500) {
             toTopBtn.fadeIn(1);
         } else {
             toTopBtn.fadeOut(1);
         }
     });
 });
 
 // highlight active menu item
 var url = window.location.pathname;
 
 if(url === '/'){
 
 }else{
     url = url.replace(/^\//,'');
 }
 $( ".main_nav_contaner a" ).each(function(index) {
     if (url.indexOf($(this).attr('href')) >= 0){
         $(this).addClass('active');
         $(this).parents('li').addClass('active');
     }
 });
 
 
 
    
     // fancybox 3 on Russian
     $.fancybox.defaults.i18n.ru = {
         CLOSE: "Закрыть",
         NEXT: "Далее",
         PREV: "Назад",
         ERROR: "Запрошенное содержимое не может быть загружено. <br/> Пожалуйста, повторите попытку позже.",
         PLAY_START: "Запуск слайд-шоу",
         PLAY_STOP: "Остановить слайд-шоу",
         FULL_SCREEN: "На весь экран",
         THUMBS: "Галерея",
         DOWNLOAD: "Скачать",
         SHARE: "Поделиться",
         ZOOM: "Увеличить"
     };
     $.fancybox.defaults.lang = 'ru';
 $.fancybox.defaults.touch = false;
 
 $.fn.hasAttr = function(name) {  
     return this.attr(name) !== undefined;
  };
 
 
 
 $(document).ready(function()
 {
     "use strict";
 
     $.fancybox.defaults.afterShow =  function( instance, current ) {
         let node = $(current.src), btn = $(current.opts.$orig);
         node.find('[name="resource_delivery"]').val(btn.hasAttr('data-delivery') ? btn.attr('data-delivery') : "");
         node.find('[name="resource_id"]').val(btn.hasAttr('data-id') ? btn.attr('data-id') : "");
         node.find('[name="resource_action"]').val(btn.hasAttr('data-action') ? btn.attr('data-action') : "");
       }
 
     /* 
 
     1. Vars and Inits
 
     */
 
     var header = $('.header');
     var hamb = $('.hamburger');
     var menuActive = false;
     var menu = $('.menu');
 
     setHeader();
 
     $(window).on('resize', function()
     {
         setHeader();
     });
 
     $(document).on('scroll', function()
     {
         setHeader();
     });
 
     initHeaderSearch();
     initMenu();
     initTimer();
     // initLightbox();
 
     /* 
 
     2. Set Header
 
     */
 
     function setHeader()
     {
         if($(window).scrollTop() > 100)
         {
             header.addClass('scrolled');
         }
         else
         {
             header.removeClass('scrolled');
         }
     }
 
     /* 
 
     3. Init Header Search
 
     */
 
     function initHeaderSearch()
     {
         if($('.search_button').length)
         {
             $('.search_button').on('click', function()
             {
                 if($('.header_search_container').length)
                 {
                     $('.header_search_container').toggleClass('active');
                 }
             });
         }
     }
 
     /* 
 
     4. Init Menu
 
     */
 
     function initMenu()
     {
         if(hamb.length)
         {
             if(menu.length)
             {
                 hamb.on('click', function()
                 {
                     if(menuActive)
                     {
                         closeMenu();
                     }
                     else
                     {
                         openMenu();
                     }
                 });	
 
                 $('.menu_close').on('click', function()
                 {
                     if(menuActive)
                     {
                         closeMenu();
                     }
                     else
                     {
                         openMenu();
                     }
                 });
             }
         }
     }
 
     function closeMenu()
     {
         menu.removeClass('active');
         menuActive = false;
     }
 
     function openMenu()
     {
         menu.addClass('active');
         menuActive = true;
     }
 
     /* 
 
     5. Init Timer
 
     */
 
     function initTimer()
     {
         if($('.event_timer').length)
         {
             // Uncomment line below and replace date
             // var target_date = new Date("April 7, 2018").getTime();
 
             // comment lines below
             var date = new Date();
             date.setDate(date.getDate() + 3);
             var target_date = date.getTime();
             //----------------------------------------
      
             // variables for time units
             var days, hours, minutes, seconds;
 
             var d = $('#day');
             var h = $('#hour');
             var m = $('#minute');
             var s = $('#second');
 
             setInterval(function ()
             {
                 // find the amount of "seconds" between now and target
                 var current_date = new Date().getTime();
                 var seconds_left = (target_date - current_date) / 1000;
              
                 // do some time calculations
                 days = parseInt(seconds_left / 86400);
                 seconds_left = seconds_left % 86400;
                  
                 hours = parseInt(seconds_left / 3600);
                 seconds_left = seconds_left % 3600;
                  
                 minutes = parseInt(seconds_left / 60);
                 seconds = parseInt(seconds_left % 60);
 
                 // display result
                 d.text(days);
                 h.text(hours);
                 m.text(minutes);
                 s.text(seconds); 
              
             }, 1000);
         }	
     }
 
     /*
 
     6. Init Lightbox
 
     */
 
     // function initLightbox()
     // {
     // 	if($('.gallery_item').length)
     // 	{
     // 		$('.colorbox').colorbox(
     // 		{
     // 			rel:'colorbox',
     // 			photo: true,
     // 			maxWidth: '90%'
     // 		});
     // 	}
     // }
 
     $('.js-has-childs > a').on('click', function (e) {
         e.preventDefault();
         $('+ ul', this).toggle();
     })
     $('input[data-ru-name="Телефон"]').mask("+7 (999) 999-99-99");
 });
 
 const itemCounters = Array.from(document.querySelectorAll(".count"));
 
 itemCounters?.forEach((countElement) => {
   const minusButton = countElement.querySelector("button:first-child");
   const plusButton = countElement.querySelector("button:nth-child(3)");
   const maxCount = countElement.dataset.max || 10;
   const inputElement = countElement.querySelector('input[type="text"]');
 
   minusButton.addEventListener("click", (e) => {
     e.preventDefault();
     let currentValue = parseInt(inputElement.value, 10);
     if (isNaN(currentValue) || currentValue < 1) return (currentValue = 1);
 
     inputElement.value = --currentValue;
     logicAfterCalcutalteValue({
       value: inputElement.value,
     });
   });
 
   plusButton.addEventListener("click", (e) => {
     e.preventDefault();
     let currentValue = parseInt(inputElement.value, 10);
     if (isNaN(currentValue)) return (currentValue = 1);
     if (currentValue >= maxCount) return (currentValue = maxCount);
 
     inputElement.value = ++currentValue;
     logicAfterCalcutalteValue({
       value: inputElement.value,
     });
   });
 
   const logicAfterCalcutalteValue = ({ value }) => {
     inputElement.setAttribute("value", value);
     inputElement.dispatchEvent(new Event("change", { bubbles: true }));
   };
 });
 
 const additionalNames = document.querySelector(".section-prayer__names");
 
 if (additionalNames) {
   const buttonAddName = additionalNames.querySelector("button");
 
   buttonAddName.onclick = (e) => {
     e.preventDefault();
     createNodeHandler(additionalNames.querySelectorAll("input").length);
   };
   const createNodeHandler = (id) => {
     if (id >= 10) return (buttonAddName.style.display = "none");
     const label = document.createElement("label");
     label.classList.add(".section-prayer__label");
     const input = document.createElement("input");
     input.placeholder = "Введите имя";
     input.name = "name";
     input.id = id;
     label.appendChild(input);
     additionalNames.appendChild(label);
   };
 }
 
 function slide(clicableBlock, activeClass) {
   clicableBlock.onclick = (e) => {
     e.preventDefault();
     clicableBlock.classList.toggle(activeClass);
     clicableBlock.nextElementSibling.classList.toggle(activeClass);
   };
 }
 
 const slidesMiracle = document.querySelectorAll(".section-miracle__header");
 
 slidesMiracle?.forEach((clicableBlock) => slide(clicableBlock, "active"));
 
 const btnsShowMore = document.querySelectorAll(".btn-show-more");
 
 btnsShowMore.forEach((btn) => {
   const hiddenElements = btn.previousElementSibling.querySelectorAll(".hidden");
   btn.onclick = (e) => {
     e.preventDefault();
     btn.classList.toggle("active");
     hiddenElements.forEach((el) => el.classList.toggle("hidden"));
 
     if (btn.classList.contains("active")) {
       btn.querySelector("span").textContent = "Скрыть";
       scrollToBlock(btn, btn.dataset.parentId);
     } else {
       btn.querySelector("span").textContent = "Развернуть все";
     }
   };
 });
 