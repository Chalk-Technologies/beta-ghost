import { docReady } from './helpers';

const ignoreClassNames = ['g-linked-features__item', 'g-related-posts__item', 'features']
docReady(() => {
    // const adjustImageGallery = () => {
    //     const images = document.querySelectorAll('.kg-gallery-image img');
    //
    //     images.forEach((image) => {
    //         const container = image.closest('.kg-gallery-image');
    //         const width = image.attributes.width.value;
    //         const height = image.attributes.height.value;
    //         const ratio = width / height;
    //         container.style.flex = `${ratio} 1 0%`;
    //     })
    // }

    const moveLinkedFeatureDivs = () => {
        const featureDivs = document.querySelectorAll('.g-linked-features__item')
        featureDivs.forEach((featureDiv)=>{
            // get the other class names
            // filter out any classes we don't care about
            let tagClassName = ""
            const classNames = featureDiv.classList
            // get the first non-match
            classNames.forEach((className) => {
                if (!ignoreClassNames.includes(className)) {
                    tagClassName = className
                }
            })
            // get the matching div
            const newParentDivs = document.querySelectorAll('#'+tagClassName)
            newParentDivs.forEach((newParentDiv) => {
                featureDiv.childNodes.forEach(child => {

                    const clone = child.cloneNode(true)
                    newParentDiv.appendChild(clone)
                })
            })
            // featureDiv.remove()
            // move the div to the matching other div
            // featureDiv.parentElement = newParentDiv[0]

        })
    }

    // todo add events
    // cta_location  nav, homepage hero, pricing page, feature page, etc. (this would be an important one for us to have for conversion rate optimization)
    // lead_type - what type of request they had such as request info, demo request, gated resource, etc.
    //     entry_point  the Gleap path that led into the conversion, such as 'book demo' button, 'send me info' button, etc.
    const addGleapBotListeners = () => {
        if (!window.Gleap) {
            console.log("gleap not loaded")
            return
        }
        // register a listener to move events up the chain
        Gleap.registerCustomAction((customAction) => {
            // For custom actions triggered within tickets, customAction.shareToken will be set to identify the ticket.
            if (customAction.name.startsWith("ga4_")) {
                gtag('event', customAction.name.replace(/^(ga4_)/,""), {
                    currency: 'EUR',
                    value: 0, // set to a monetary value if this lead has one, otherwise leave as 0 or omit
                    lead_source: 'gleap_bot' // optional custom parameter, use whatever fits your setup
                });
            }
        });
        const openGleapWidget = (e)=>{
            e.preventDefault()
            const botId = e.target.dataset.gleapBotId
            Gleap.startBot(botId||"6a99c4ba3efb670651e0ce74", false)
            gtag('event', 'gleap_open', {
                currency: 'EUR',
                value: 0, // set to a monetary value if this lead has one, otherwise leave as 0 or omit
                lead_source: 'gleap_bot' // optional custom parameter, use whatever fits your setup
            });
        }
        // get all buttons with the attribute
        const matchingElements = document.querySelectorAll("a[href*='tally.so']");
        matchingElements.forEach(el=>{
            el.addEventListener("click", openGleapWidget)
        })
        // more with a specific workflow
        const gleapElements = document.querySelectorAll("[href*='gleapBotId=']");
        gleapElements.forEach(el=>{
            // get the id
            const href = el.getAttribute("href")
            if (href) {
                const gleapBotId = new URL(href).searchParams.get("gleapBotId")
                if (gleapBotId) {
                    el.setAttribute("data-gleap-bot-id", gleapBotId)
                    el.addEventListener("click", openGleapWidget)
                }
            }
        })
        const moreGleapElements = document.querySelectorAll("[data-gleap-bot-id]")
        moreGleapElements.forEach(el=>{
            el.addEventListener("click", openGleapWidget)
        })

    }
    var lastScrollTop = 0;

    const scrollHeader = () => {
        const isScrollingDown = lastScrollTop < window.scrollY
        const isSmallWindow = window.innerWidth <= 900
        if (isSmallWindow) {
            document.getElementById("gh-head").style = "";
        } else if (isScrollingDown) {
            document.getElementById("gh-head").style.transform = "translateX(-50%) translateY(-100px)";
            document.getElementById("gh-head").style.opacity = "0";
        } else {
            document.getElementById("gh-head").style.transform = "translateX(-50%)";
            document.getElementById("gh-head").style.opacity = "1";

        }
        lastScrollTop = window.scrollY
    }
    //
    // const makeTOC = () => {
    //     const $toc = document.querySelector('.js-toc');
    //
    //     if ($toc) {
    //         tocbot.init({
    //             tocSelector: '.js-toc',
    //             contentSelector: '.js-post-content',
    //             orderedList: false,
    //             headingSelector: 'h1[id], h2[id], h3[id]',
    //             ignoreSelector: '.kg-card h1, .kg-card h2, .kg-card h3',
    //             hasInnerContainers: true,
    //             headingsOffset: 40,
    //             scrollSmoothOffset: -40,
    //             onClick: () => {
    //                 const event = new Event('toc-link-clicked', { bubbles: true });
    //                 $toc.dispatchEvent(event);
    //             }
    //         });
    //     }
    // }

    // adjustImageGallery();
    // makeTOC();
    moveLinkedFeatureDivs();
    window.onscroll = scrollHeader
    addGleapBotListeners()
    // fitvids('.js-post-content');
})
