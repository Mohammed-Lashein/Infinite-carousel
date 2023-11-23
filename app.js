const bgImage = document.querySelector('.bg-image')
const carousel = document.querySelector('.carousel')
const imagesInCarousel = document.querySelectorAll('.carousel img')
const totalNumberOfCarouselImages = imagesInCarousel.length
const leftArrow = document.querySelector('.left-arrow')
const rightArrow = document.querySelector('.right-arrow')

rightArrow.addEventListener('click', handleRightArrowClick)
leftArrow.addEventListener('click', handleLeftArrowClick)

let currentIndex = 0
let prevIndex
// let amountOfCarouselTranslation = imagesInCarousel[currentIndex].getBoundingClientRect().width + 20 // the 20px are the gap
let amountOfCarouselTranslation = 520

/* In the article, the developer recommended using the getBoundingClientRect method and the x property , but it seems that the width property is the correct one to use here since we want the (width) of the img . 

>> I will try both and see how to solve it .

>> I returned back! The one that worked for me was  the width property and not the x one , since that the x property returns the distance in px from the viewport edge to the edge of the element (Think of it as the margin of the element) .  */

function handleRightArrowClick() {
	carousel.classList.add('sliding-transition')
	prevIndex = currentIndex
	currentIndex = (currentIndex + 1) % totalNumberOfCarouselImages
	carousel.style.transform = `translateX(-${amountOfCarouselTranslation}px)`
	bgImage.src = imagesInCarousel[currentIndex].src.slice(0, -3) + '1000'
	/* What is the use of the above line of code ?
	>> To understand it, you need to visit picsum photos website to understand what does numbers in the img src indicate . 

	Here, we just want to have an image of 1000px width and height because we will use that image as a background for the body . 
	
	*/

	setTimeout(() => {
		carousel.appendChild(imagesInCarousel[prevIndex])
		/* The idea of the code : By appending that child at the end of the container, and with our knowledge that no single node can exist simultaneously at two places in the same time (this piece of information is available at MDN Docs in the reference of appendChild method), thus we're moving that node to the end of the carousel . */

		carousel.style.transform = 'translateX(0)'
		carousel.classList.remove('sliding-transition')
		/* What is the importance of this setTimeout ? 
    >>  It is important to do some tasks equal to the number of lines in it : 
    1. We want to move the previous img to the end of the carousel to have the infinite transition effect . 

    2. We need to remove the sliding-transition class and I don't know why till now .  
    >> After experimenting, the importance of removing the  sliding-transition class is that when we change the order of DOM elements, due to that transition added by the class, we will see a flickering of the change of the order of DOM elements, which we want to instead happen silently . 
    
    3. We need to reset the translation we gave as a style to the carousel so that we can add another one (if we didn't do that, we will simply not be able to move the carousel since it got just a fixed translation value that has been applied once . You can try removing that line to see the effect )
     */

		/* I spent almost 4hrs in 2 days trying to know why the transition happended abruptly although I am doing everything correct . After searching and trial and error, I found that since the images are coming from an external source, the getBoundingClientRect() didn't count the width of the image correctly (sometimes it returned to me 20px by making the width of the img is zero, other times it returned 520px which I wanted . So, the better approach is to hardcode that value to ensure consistency among the transition .) 
		
		Although the article writer mentioned that, but I didn't pay much attention since I was focused on finding the problem with the timing of the setTimeouts (which happened to have no problems at all . )*/
	}, 600)
}

function handleLeftArrowClick() {
	prevIndex = currentIndex
	currentIndex = (currentIndex - 1 + totalNumberOfCarouselImages) % totalNumberOfCarouselImages
	/* I asked chatGPT to give me examples for the above formula so that I can understand better, here is what I got : 

Let's visualize how the currentIndex is calculated for indices ranging from 0 to 3 using the formula:

	currentIndex = (currentIndex - 1 + totalImages) % totalImages;

Assuming totalImages is 4 (indices 0 to 3), let's calculate currentIndex for each step:

	1. Initial state:
		currentIndex = 0

	2. Clicking the left arrow once:
		currentIndex = (0-1 + 4) % 4 = (3)%4 = 3

	3. Clicking the left arrow again:
		currentIndex = (3-1 + 4) % 4 = (6)%4 = 2
		
	4. Clicking the left arrow one more time:
		currentIndex = (2-1 + 4) % 4 = (5)%4 = 1

	5.Clicking the left arrow again:
		currentIndex = (1-1 + 4) % 4 = (4)%4 = 0

This cycle demonstrates how the currentIndex changes as you click the left arrow repeatedly, moving through indices 0, 3, 2, 1, and back to 0 in a loop for a carousel with 4 images.

================

	My comment about the above explanation : The examples provided solid explanation for things I didn't understand like: 
	1. Why did we add the totalImages count to the calculation in the parenthesis ?
	2. Why did we use the modulo operator ?

	I will demonstrate the importance of these using the 1st example provided above .

	1. In the parens - let's imagine that there is no +totalImages, the result of subtraction will be -1 . 
	In array access of elements, -1 means that the element doesn't exist in the array, but we want to access the last element in the array (whose index is 3 here ) , so we add totalImages .
	(-1 + 4 ) = 3 
	2. then : 
		3 % 4 = 3 . 

		So we get the required index we want . (In this example, the modulu operator seemed of no value , but in other cases it will be important . )

		Let's click the left arrow again and apply the formula with full explanation : 
		- Now currentIndex is 3 
		- We want to move to img at index 2 

		By applying the formula : 
		(currentIndex - 1 + totalImages ) = (3-1 + 4) = 2+4 = 6 

		- side note : I wrote the numbers close to the mathematical sign this way as it was suggested in clean code book, and practically it proved to make readability much better - 

		then: 
		6%4 = 2 (the currentIndex value that we want) . 

		Thus the above formula is a good one because it will make sure that if we get a value less than zero (like what happened with us on accessing the last element in the array when we were at index zero) we will convert it in such a way to allow us get the last element in the array, and this formula works with other indices as well . 

		My adive: Take you time to understand the formula and play with the carousel and try to make it yourself . Be patient and believe that it's okay to take some time in order to understand a new thing . Personally speaking, it took me almost a week to finish it . I can't deny that I was frustrated with all the time taken, but take your time and remember that the goal is learning a new thing each day . 
	*/

	carousel.insertBefore(imagesInCarousel[currentIndex], carousel.firstElementChild)
	carousel.style.transform = `translateX(-${amountOfCarouselTranslation}px)`
	/* The above line of code seems a bit weird, why we're inserting the the required img before the first child of the carousel ?
	>> The reason above this decision can't be explained in a written way but instead it should be observed , but I can give you a hint : 
	Remember that in our carousel here we're changing the place -and thus the order - of the elements in the carousel . 
	
	So not in every time carousel.firstChild is actually img 1 , but it depends.*/

	/* Also, when you try to implement the carousel yourself, don't forget to add 'px' after the number you get as the size of the img . Trust me, it will save you a bunch of minutes of running through the code trying to figure out why it is not working .  */

	bgImage.src = imagesInCarousel[currentIndex].src.slice(0, -3) + '1000'
	setTimeout(() => {
		carousel.style.transform = ''
		carousel.classList.add('sliding-transition')
	}, 50)

	setTimeout(() => {
		carousel.classList.remove('sliding-transition')
	}, 600)
}

/* Final comment about this project : 

If you look closely in the two functions that handle the carousel, you will find that the translation is taking an effect using the same sign (which is -ve) although the two directions are different . How is this possible ?

>> This one also can't be explained in a written way . But by looking at how the DOM elements are re-ordered once you click one of the two arrows and making the transition last longer (a couple of seconds) you will understand why both of the translations have the same sign . */
