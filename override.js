(function () {
    if (typeof Swal === 'undefined') {
      console.error('SweetAlert2 not loaded');
      return;
    }

    console.log('SweetAlert override active');

    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;
    let lastMessage = '';
    let lastType = '';
    let lastDefaultValue = '';

    // Add at the top with other variables
    let isFromButton = false;

    // Function to create and show the button
    function showButton() {
      const button = document.createElement('button');
      let countdown = 10;
      button.textContent = `Show Alert Again (${countdown})`;
      button.style.position = 'fixed';
      button.style.bottom = '20px';
      button.style.right = '20px';
      button.style.zIndex = 999999;
      button.style.padding = '10px 16px';
      button.style.backgroundColor = '#3085d6';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.borderRadius = '8px';
      button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      button.style.cursor = 'pointer';
      button.style.fontSize = '14px';

      button.addEventListener('click', () => {
        isFromButton = true;
        if (lastType === 'alert') {
          window.alert(lastMessage);
        } else if (lastType === 'confirm') {
          window.confirm(lastMessage);
        } else if (lastType === 'prompt') {
          window.prompt(lastMessage, lastDefaultValue);
        }
        button.remove();
        clearInterval(countdownInterval);
      });

      document.body.appendChild(button);

      const countdownInterval = setInterval(() => {
        countdown--;
        button.textContent = `Show Alert Again (${countdown})`;
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        button.remove();
      }, 10000);
    }

    const successStrings = [
      'is valid',
    ]

    window.alert = function (message) {
      lastMessage = message;
      lastType = 'alert';
      try {
        Swal.fire({
          icon: successStrings.some(str => message.includes(str)) ? 'success' : 'warning',
          title: 'Alert',
          text: message,
          confirmButtonText: 'OK'
        }).then(() => {
          if (!isFromButton) showButton();
          isFromButton = false;
        });
      } catch (error) {
        console.error('SweetAlert2 alert failed:', error);
        originalAlert(message);
        if (!isFromButton) showButton();
        isFromButton = false;
      }
    };

    // Similar changes for confirm and prompt functions
    window.confirm = function (message) {
      lastMessage = message;
      lastType = 'confirm';
      
      const result = Swal.fire({
        icon: 'question',
        title: 'Confirm',
        text: message,
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        allowEscapeKey: false,
        returnValue: true
      });

      result.then((response) => {
        if (!isFromButton) showButton();
        isFromButton = false;
      });

      return result.isConfirmed;
    };

    window.prompt = function (message, defaultValue) {
      lastMessage = message;
      lastType = 'prompt';
      lastDefaultValue = defaultValue;
      return new Promise((resolve) => {
        try {
          Swal.fire({
            icon: 'question',
            title: 'Prompt',
            text: message,
            input: 'text',
            inputValue: defaultValue || '',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            resolve(result.isConfirmed ? result.value : null);
            if (!isFromButton) showButton();
            isFromButton = false;
          });
        } catch (error) {
          console.error('SweetAlert2 prompt failed:', error);
          resolve(originalPrompt(message, defaultValue));
          if (!isFromButton) showButton();
          isFromButton = false;
        }
      });
    };
})();