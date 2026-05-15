const likeButton = document.querySelector('.like-button');
const likeCount = document.getElementById('likeCount');
const downloadImageBtn = document.getElementById('downloadImageBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const copyToast = document.getElementById('copyToast');
const topActions = document.querySelector('.top-actions');
const mainImage = document.getElementById('mainImage');
const likeStorageKey = 'likeCount';
const likePressedKey = 'likePressed';
let copyFeedbackTimer;

function showLikeConfetti(target) {
  const colors = ['#111111', '#1f1f1f', '#2f7d32', '#4aa64f', '#ffffff'];
  const particleCount = 12;

  for (let i = 0; i < particleCount; i += 1) {
    const angle = (-155 + Math.random() * 130) * (Math.PI / 180);
    const distance = 22 + Math.random() * 34;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const size = 7 + Math.random() * 5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    const dot = document.createElement('span');
    dot.className = 'like-confetti';
    dot.style.left = `${38 + Math.random() * 24}%`;
    dot.style.top = `${34 + Math.random() * 20}%`;
    dot.style.background = color;
    dot.style.setProperty('--tx', `${x.toFixed(1)}px`);
    dot.style.setProperty('--ty', `${y.toFixed(1)}px`);
    dot.style.setProperty('--size', `${size.toFixed(1)}px`);
    target.appendChild(dot);

    dot.addEventListener('animationend', () => {
      dot.remove();
    });
  }
}

if (likeButton && likeCount) {
  const savedCount = Number(localStorage.getItem(likeStorageKey));
  let count = Number.isFinite(savedCount) && savedCount >= 0 ? savedCount : 0;
  const alreadyLiked = localStorage.getItem(likePressedKey) === '1';
  likeCount.textContent = String(count);

  if (alreadyLiked) {
    likeButton.classList.add('is-liked');
  }

  likeButton.addEventListener('click', () => {
    if (localStorage.getItem(likePressedKey) === '1') {
      showLikeConfetti(likeButton);
      return;
    }

    count += 1;
    likeCount.textContent = String(count);
    likeButton.classList.add('is-liked');
    localStorage.setItem(likeStorageKey, String(count));
    localStorage.setItem(likePressedKey, '1');
    showLikeConfetti(likeButton);
  });
}

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
      if (topActions) {
        const topActionsRect = topActions.getBoundingClientRect();
        const toastTop = Math.round(topActionsRect.bottom + 16);
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
