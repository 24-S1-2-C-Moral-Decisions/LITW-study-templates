function adjustCollapseBasedOnScreenSize() {
    const contents = document.querySelectorAll('.collapse');
    const closeElements = document.querySelectorAll('.close');
  
    if (window.innerWidth >= 1024) {
      contents.forEach(content => {
        content.classList.add('show');
        
      });
    } else {
      contents.forEach(content => {
        content.classList.remove('show');
      });
      closeElements.forEach(button => {
        button.setAttribute('aria-expanded', 'false');
        const img = button.querySelector('.toggle-icon');
        if (img) {
          img.src = '../img/down.svg'; 
        }
      });
      const firstContent = document.getElementById('collapse-0');
      if (firstContent) {
        firstContent.classList.add('show'); 
        const firstButton = document.querySelector(`[data-bs-target="#collapse-0"]`);
        if (firstButton) {
          firstButton.setAttribute('aria-expanded', 'true'); 
          const img = firstButton.querySelector('.toggle-icon');
          if (img) {
            img.src = '../img/up.svg'; 
          }
        }
      }
      toggleCollapseIcon()
    }
  }
  
  adjustCollapseBasedOnScreenSize();
  
  window.addEventListener('resize', adjustCollapseBasedOnScreenSize);
  
  function toggleCollapseIcon() {
    document.querySelectorAll('.close').forEach(button => {
      button.addEventListener('click', function () {
        const img = this.querySelector('.toggle-icon');
        
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
    
        if (isExpanded) {
          img.src = '../img/up.svg'; 
        } else {
          img.src = '../img/down.svg';    
        }
      });
    });
  }
  document.querySelectorAll('.form-check-input').forEach(input => {
    input.addEventListener('change', function () {
      const selectedLabel = this.nextElementSibling.textContent;
      const mobileAnswerLabel = this.closest('td').querySelector('#mobile-answer');
      if (mobileAnswerLabel) {
        mobileAnswerLabel.textContent = `${selectedLabel}`;
      }
    });
  });