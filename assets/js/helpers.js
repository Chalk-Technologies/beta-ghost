export const docReady = (fn) => {
    if (
        document.readyState === 'complete' ||
        document.readyState === 'interactive'
    ) {
        setTimeout(fn, 1);
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};

export const isRTL = () => {
    const $html = document.querySelector('html');
    return ['ar', 'he', 'fa'].includes($html.getAttribute('lang'));
};

export const scrollTo = (to, callback, duration) => {
    function move(amount) {
        document.documentElement.scrollTop = amount;
        document.body.parentNode.scrollTop = amount;
        document.body.scrollTop = amount;
    }

    function position() {
        return (
            document.documentElement.scrollTop ||
            document.body.parentNode.scrollTop ||
            document.body.scrollTop
        );
    }

    const animationFrameReqFunc =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    const start = position();
    const change = to - start;
    const increment = 20;
    let currentTime = 0;
    duration = typeof duration === 'undefined' ? 500 : duration;

    const animateScroll = function () {
        currentTime += increment;
        const val = Math.easeInOutQuad(currentTime, start, change, duration);

        move(val);

        if (currentTime < duration) {
            animationFrameReqFunc(animateScroll);
        } else if (callback && typeof callback === 'function') {
            callback();
        }
    };
    animateScroll();
};

Math.easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) {
        return (c / 2) * t * t + b;
    }
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
};
