const downloadImageBtn = document.getElementById('downloadImageBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const copyToast = document.getElementById('copyToast');
const headerRow = document.querySelector('.header-row');
const mainImage = document.getElementById('mainImage');
let copyFeedbackTimer;

if (downloadImageBtn && mainImage) {
  downloadImageBtn.addEventListener('click', async () => {
    const imageUrl = mainImage.getAttribute('src');

    if (!imageUrl) {
      return;
    }

    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error('Image download failed');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const filename = imageUrl.split('/').pop() || 'image';
      const downloadLink = document.createElement('a');
      downloadLink.href = objectUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      window.open(imageUrl, '_blank');
    }
  });
}

if (copyLinkBtn && copyToast) {
  copyLinkBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      return;
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
      copyToast.style.left = '';
      if (mainImage) {
        const imageRect = mainImage.getBoundingClientRect();
        copyToast.style.top = `${Math.round(imageRect.top + imageRect.height / 2)}px`;
      } else {
        copyToast.style.top = '';
      }
    } else {
      copyToast.style.top = '';
      if (headerRow) {
        const headerRect = headerRow.getBoundingClientRect();
        const toastTop = Math.round(headerRect.bottom + 16);
        copyToast.style.top = `${toastTop}px`;
      }
    }

    copyToast.classList.add('is-visible');
    clearTimeout(copyFeedbackTimer);
    copyFeedbackTimer = setTimeout(() => {
      copyToast.classList.remove('is-visible');
    }, 1100);
  });
}

const zoomContainer = document.getElementById("zoomContainer");

if (zoomContainer) {
  const panzoom = Panzoom(zoomContainer, {
    minScale: 1,
    maxScale: 5,
    startScale: 2,
    contain: "none",
  });

  const parent = zoomContainer.parentElement;

  parent.addEventListener("wheel", panzoom.zoomWithWheel);

  parent.addEventListener("touchstart", panzoom.handleTouch, {
    passive: false,
  });

  parent.addEventListener("pointerdown", panzoom.handleDown);
}