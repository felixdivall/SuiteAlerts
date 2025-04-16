(function () {
    if (typeof Swal === 'undefined') {
      console.error('SweetAlert2 not loaded');
      return;
    }
  
    console.log('SweetAlert override active');
  
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;
  
    window.alert = function (message) {
      try {
        Swal.fire({
          icon: 'warning',
          title: 'Alert',
          text: message,
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error('SweetAlert2 alert failed:', error);
        originalAlert(message);
      }
    };
  
    window.confirm = function (message) {
      return new Promise((resolve) => {
        try {
          Swal.fire({
            icon: 'question',
            title: 'Confirm',
            text: message,
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel'
          }).then((result) => {
            resolve(result.isConfirmed);
          });
        } catch (error) {
          console.error('SweetAlert2 confirm failed:', error);
          resolve(originalConfirm(message));
        }
      });
    };
  
    window.prompt = function (message, defaultValue) {
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
          });
        } catch (error) {
          console.error('SweetAlert2 prompt failed:', error);
          resolve(originalPrompt(message, defaultValue));
        }
      });
    };
  })();