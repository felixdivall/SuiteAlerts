(function () {
  if (typeof Swal === 'undefined') {
    console.error('SweetAlert2 not loaded');
    return;
  }

  console.log('SweetAlert override active');

  // Store original confirm
  window.__nativeConfirm = window.__nativeConfirm || window.confirm;

  const originalAlert = window.alert;
  let lastMessage = '';
  let lastType = '';
  let isFromButton = false;

  // Optional: "Show Again" button (still works)
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

    const countdownInterval = setInterval(() => {
      countdown--;
      button.textContent = `Show Alert Again (${countdown})`;
    }, 1000);

    button.addEventListener('click', () => {
      isFromButton = true;
      if (lastType === 'alert') {
        window.alert(lastMessage);
      } else if (lastType === 'confirm') {
        window.confirm(lastMessage);
      }
      button.remove();
      clearInterval(countdownInterval);
    });

    document.body.appendChild(button);

    setTimeout(() => {
      clearInterval(countdownInterval);
      button.remove();
    }, 10000);
  }

  const successStrings = ['is valid'];

  // Override alert
  window.alert = function (message) {
    lastMessage = message;
    lastType = 'alert';

    return Swal.fire({
      icon: successStrings.some(str => message.includes(str)) ? 'success' : 'warning',
      title: 'Alert',
      text: message,
      confirmButtonText: 'OK'
    }).then(() => {
      if (!isFromButton) showButton();
      isFromButton = false;
    });
  };

  // Override confirm for specific NetSuite delete
  window.confirm = function (message) {
    if (message.includes("Are you sure you want to delete")) {
      lastMessage = message;
      lastType = 'confirm';

      Swal.fire({
        icon: 'warning',
        title: 'Confirm',
        text: message,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            // Manually run the delete logic (not via onclick)
            if (typeof num_deletes === 'function') {
              const proceed = num_deletes(false);
              if (!proceed) {
                console.warn("num_deletes(false) returned false. Aborting.");
                return;
              }
            }

            const form = document.forms['body_actions'];
            if (form) {
              form.action = '/app/common/media/mediaitemfolders.nl?folder=-15&_grpDelete=T&folder=-15';
              form.submit();
              console.log("Form submitted manually via SweetAlert2 confirm");
            } else {
              console.warn("Form 'body_actions' not found");
            }
          } catch (e) {
            console.error("Manual delete failed:", e);
          }
        } else {
          console.log("User cancelled SweetAlert2 confirm");
        }

        if (!isFromButton) showButton();
        isFromButton = false;
      });

      // Prevent NetSuite from continuing the default logic
      return false;
    }

    // Let all other confirm calls behave normally
    return window.__nativeConfirm(message);
  };
})();