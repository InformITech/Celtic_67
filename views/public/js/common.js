


function signIn() {
    try {
        window.location.href = '/newUser';
    } catch (error) {
        console.error('Error toggling user block:', error);
    }
}

function Eyefunc() {
    let show = document.getElementById('Pass')
    let logo = document.getElementById('logo')
    if (show.type == "password") {
        show.type = "text"
        logo.className = "fa fa-eye"
    } else {
        logo.className = "fa fa-eye-slash"
        show.type = "password"
    }
}


function Eyefunc2() {
    let show = document.getElementById('Pass2')
    let logo = document.getElementById('logo2')
    if (show.type == "password") {
        show.type = "text"
        logo.className = "fa fa-eye"
    } else {
        logo.className = "fa fa-eye-slash"
        show.type = "password"
    }
}

let err = document.getElementById('errorShow')
let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
let nameRegex = /^[A-Za-z\s'-]+$/
let usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function usernameVerify(username) {
    let err = document.getElementById('errorShow')
    if (username.length > 4) {
        if (!usernameRegex.test(username)) {
            err.innerHTML = "Username should consist of characters & numbers"
            return false
        } else {
            return true
        }
    } else {
        err.innerHTML = "Username required"
        return false
    }
}

function emailVerify(email) {
    let err = document.getElementById('errorShow')
    if (!emailRegex.test(email)) {
        err.innerHTML = "Enter your email properly"
    } else {
        return true
    }
}

function nameVerify(name) {
    let err = document.getElementById('errorShow')
    if (name.length > 2) {
        if (!nameRegex.test(name)) {
            err.innerHTML = "Name should only have Alphabets"
            return false
        } else {
            return true
        }
    } else {
        err.innerHTML = "Name should have minimum 3 characters"
        return false
    }
}

function passwordVerify(password) {
    let err = document.getElementById('errorShow')
    if (password.length > 7) {
        if (!passwordRegex.test(password)) {
            err.innerHTML = "Password should contain <br> Atleast 1 lowercase <br> 1 Uppercase <br> 1 Integer <br> 1 Special character (e.g., !, @, #, $, %, ^, &, *)"
        } else {
            return true
        }
    } else {
        err.innerHTML = "Password Should have minimum 8 characters"
    }
}
async function formVerify() {
    try {
        let err = document.getElementById('errorShow')
        let name = document.getElementById('namebox').value
        let email = document.getElementById('mailbox').value
        let username = document.getElementById('userbox').value
        let password = document.getElementById('Pass').value
        let password2 = document.getElementById('Pass2').value
        let data = {}

        if(password === password2) {
            if (nameVerify(name) && emailVerify(email) && usernameVerify(username) && passwordVerify(password)) {
                data.name = name
                data.email = email
                data.username = username
                data.password = password
                let response = await fetch('/signIn', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (response.status === 200) {
                    let signUpform = document.getElementById('loginMain');
                    let otpBox = document.getElementById('otpBox');
                    signUpform.style.display = "none";
                    otpBox.style.display = "block";
                    document.getElementById('timer').innerText = '60';
                    setInterval(updateTimer, 1000);
                } else if (response.status === 465) {
                    err.innerHTML = "Already a user please login";
                } else if (response.status === 466) {
                    err.innerHTML = "Sorry username already exists";
                }
            }
        } else {
            err.innerHTML = "Passwords Doesn't Match..!"
        }


    } catch (error) {
        console.error('Error in formVerify:', error);
    }
}



async function loginVerification() {
    let email = document.getElementById('mailbox').value
    let password = document.getElementById('Pass').value
    let err = document.getElementById('errorShow')
    let data = {}

    try {
        if (emailVerify(email) && passwordVerify(password)) {
            data.email = email
            data.password = password
            let response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (response.status === 200) {
                let signUpform = document.getElementById('loginMain')
                let otpBox = document.getElementById('otpBox')
                signUpform.style.display = "none"
                otpBox.style.display = "block"
                document.getElementById('timer').innerText = '60';
                setInterval(updateTimer, 1000);
            } else if (response.status === 468) {
                err.innerHTML = "Incorrect password"
            } else if (response.status === 488) {
                err.innerHTML = "No User Found"
            }
        }
    } catch (e) {
        console.error(e);
    }
}


async function adminVerification() {
    let email = document.getElementById('mailbox').value
    let password = document.getElementById('Pass').value
    let err = document.getElementById('errorShow')
    let data = {}
    if (emailVerify(email) && passwordVerify(password)) {
        data.email = email
        data.password = password

        let response = await fetch('/admin/adminVerify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (response.status === 200) {
            let signUpform = document.getElementById('loginMain')
            let otpBox = document.getElementById('otpBox')
            signUpform.style.display = "none"
            otpBox.style.display = "block"
            document.getElementById('timer').innerText = '60';
            setInterval(updateTimer, 1000);
        } else if (response.status === 467) {
            err.innerHTML = "Password Incorrect"
        } else if (response.status === 465) {
            err.innerHTML = "No Details Found"
        }
    } else {
        err.innerHTML = 'Please enter Valid details'
    }
}



function updateVerification() {
    let name = document.getElementById('namebox').value
    let username = document.getElementById('usernamebox').value

    if (nameVerify(name) && usernameVerify(username)) {
        return true
    } else {
        return false
    }
}


async function passChangeVerification() {
    let err = document.getElementById('errorShow')
    let email = document.getElementById('mailbox').value
    if (emailVerify(email)) {
        let response = await fetch('/forgotMail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })

        if (response.status === 200) {
            let signUpform = document.getElementById('loginMain');
            let otpBox = document.getElementById('otpBox');
            signUpform.style.display = "none";
            otpBox.style.display = "block";
            document.getElementById('timer').innerText = '60';
            setInterval(updateTimer, 1000);
        } else {
            err.innerHTML = "No Email Found"
        }
    }
}


async function forgotOtp() {
    let passwordOtp = document.getElementById('otp').value
    let otpError = document.getElementById('otpError')
    if (passwordOtp.length === 6 && !isNaN(passwordOtp)) {
        let response = await fetch('/otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ passwordOtp })
        })
        if (response.status === 200) {
            let otpBox = document.getElementById('otpBox')
            let passbox = document.getElementById('passCollection')
            otpBox.style.display = "none";
            passbox.style.display = "block";
        }
    } else {
        otpError.innerHTML = "Incorrect Otp"
    }
}

function forgotPasswordVerify() {
    let pass1 = document.getElementById('Pass').value
    let pass2 = document.getElementById('Pass2').value
    let passError = document.getElementById('passError')
    if (pass1 === pass2) {
        if (pass1.length > 7) {
            if (passwordVerify(pass1)) {
                return true
            } else {
                passError.innerHTML = "Password should contain <br> Atleast 1 lowercase <br> 1 Uppercase <br> 1 Integer <br> 1 Special character (e.g., !, @, #, $, %, ^, &, *)"
                return false
            }
        } else {
            passError.innerHTML = "Password should have Minimum 8 Characters"
            return false
        }
    } else {
        passError.innerHTML = "Both Passwords Should be Same"
        return false
    }
}


async function resending() {
    let email = document.getElementById('mailbox').value
    let response = await fetch('/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    if (response.status === 200) {
        let otpError = document.getElementById('otpError')
        otpError.innerHTML = "Otp Sent Sucessfully"
        document.getElementById('timer').innerText = '60';
    }
}



function updateTimer() {
    const timerElement = document.getElementById('timer');
    let seconds = parseInt(timerElement.innerText);
    let otpError = document.getElementById('otpError')
    if (seconds <= 0) {
        otpError.innerHTML = "Otp Expired"
        clearInterval(timerInterval);
        timerElement.innerText = '0';
    } else {
        seconds--;
        timerElement.innerText = seconds;
    }
}


async function resendingAdmin() {
    let email = document.getElementById('mailbox').value
    let response = await fetch('/admin/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    if (response.status === 200) {
        let otpError = document.getElementById('otpError')
        otpError.innerHTML = "Otp Sent Sucessfully"
        document.getElementById('timer').innerText = '60';

    }
}


function otpVerify() {
    let passwordOtp = document.getElementById('otp').value
    let otpError = document.getElementById('otpError')
    if (passwordOtp.length === 6 && !isNaN(passwordOtp)) {
        return true
    } else {
        otpError.innerHTML = "Enter Valid Otp"
        return false
    }
}