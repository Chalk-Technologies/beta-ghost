(function() {
    const galleries = document.querySelectorAll('.kg-gallery-container');
    galleries.forEach(function (gallery) {
        const marker = gallery.closest('.kg-gallery-card')?.previousElementSibling;
        if (!marker?.matches('span[sliding-gallery]')) return;
        marker.remove();

        gallery.classList.add('sliding-gallery-container');
        gallery.closest('.kg-gallery-card')?.classList.replace('kg-width-wide', 'kg-width-full');
        gallery.querySelectorAll('.kg-gallery-row').forEach(function (row) {
            if (row.querySelector('.kg-gallery-image')) {
                row.replaceWith(...row.childNodes);
            }
        });
        const track = document.createElement('div');
        track.classList.add('track');
        const group = document.createElement('div');
        group.classList.add('sliding-gallery-group');
        gallery.querySelectorAll('.kg-gallery-image').forEach(function (image) {
            group.appendChild(image);
        });
        track.appendChild(group);
        gallery.appendChild(track);

        const images = Array.from(group.children);
        if (!images.length) return;

        function cloneImage(image) {
            const clone = image.cloneNode(true);
            clone.classList.add('sliding-gallery-copy');
            clone.setAttribute('aria-hidden', 'true');
            clone.setAttribute('inert', '');
            clone.removeAttribute('id');
            clone.querySelectorAll('[id]').forEach(function (element) {
                element.removeAttribute('id');
            });
            return clone;
        }

        function updateTrack() {
            track.querySelectorAll('.sliding-gallery-copy').forEach(function (copy) {
                copy.remove();
            });
            let width = group.getBoundingClientRect().width;
            while (width > 0 && width < gallery.clientWidth) {
                images.forEach(function (image) {
                    group.appendChild(cloneImage(image));
                });
                const nextWidth = group.getBoundingClientRect().width;
                if (nextWidth <= width) break;
                width = nextWidth;
            }
            const copy = group.cloneNode(true);
            copy.classList.add('sliding-gallery-copy');
            copy.setAttribute('aria-hidden', 'true');
            copy.setAttribute('inert', '');
            copy.querySelectorAll('[id]').forEach(function (element) {
                element.removeAttribute('id');
            });
            track.appendChild(copy);
        }

        images.forEach(function (image) {
            image.querySelectorAll('img').forEach(function (img) {
                if (!img.complete) img.addEventListener('load', updateTrack, {once: true});
            });
        });
        new ResizeObserver(updateTrack).observe(gallery);
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', updateTrack);
    });
})();
