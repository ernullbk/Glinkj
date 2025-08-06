document.addEventListener('deviceready', () => {
    const submitBtn = document.getElementById('submitBtn');
    const authLinkInput = document.getElementById('authLink');
    const messageDiv = document.getElementById('message');

    const setButtonState = (state, text) => {
        submitBtn.disabled = state === 'loading';
        submitBtn.innerText = text;
    };

    const showMessage = (text, color='') => {
        messageDiv.innerText = text;
        messageDiv.style.color = color;
    };

    const handleClick = async () => {
        const url = authLinkInput.value.trim();
        if (!url) {
            showMessage('لطفا لینک را وارد کنید', 'red');
            return;
        }

        setButtonState('loading', 'در حال بارگذاری...');
        showMessage('');

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (!data.JWT || typeof data.JWT !== 'string' || data.JWT.trim() === '') {
                throw new Error('Invalid JWT');
            }
            // Send JWT to background script for processing
            cordova.plugins.backgroundJs.sendAuthData(data.JWT);
            setButtonState('success', 'انجام شد!');
        } catch (error) {
            console.error(error);
            if (error.message.includes('Network')) {
                showMessage('اتصال اینترنت را بررسی کنید', 'red');
            } else if (error.message === 'Invalid JWT') {
                showMessage('لینک وارد شده نادرست است', 'red');
            } else {
                showMessage('لینک وارد شده نادرست است', 'red');
            }
            setButtonState('default', 'ارسال');
        }
    };

    document.getElementById('submitBtn').addEventListener('click', handleClick);
});
