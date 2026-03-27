/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Header Search
4. Init Menu
5. Init Video


******************************/

$(document).ready(function()
{
	"use strict";

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
	initVideo();

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

	5. Init Video

	*/

	function initVideo()
	{
		$(".vimeo").colorbox(
		{
			iframe:true,
			innerWidth:500,
			innerHeight:409,
			maxWidth: '90%'
		});
	}

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
