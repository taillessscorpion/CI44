const components = {};

components.registerScreen = `
<div class="register-container">
    <div class="register-form">
        <div class="title">Mindx Chat</div>
        <form id="form-register">
            <div class="name-wrapper">
                <div class="input-wrapper">
                    <input type="text" name="firstName" placeholder="First Name...">
                    <div class="error" id="error-first-name"></div>
                </div>
                <div class="input-wrapper">
                    <input type="text" name="lastName" placeholder="Last Name...">
                    <div class="error" id="error-last-name"></div>
                </div>
            </div>
            <div class="input-wrapper">
                <input type="text" name="email" placeholder="Email...">
                <div class="error" id="error-email"></div>
            </div>
            <div class="input-wrapper">
                <input type="password" name="password" placeholder="Password...">
                <img class="show-password" src="../images/show-password.jpg">
                <div class="error" id="error-password"></div>
            </div>
            <div class="input-wrapper">
                <input type="password" name="confirmPassword" placeholder="Confirm Password...">
                <img class="show-password" src="../images/show-password.jpg">
                <div class="error" id="error-confirm-password"></div>
            </div>
            <div class="submit-wrapper">
                <div>Already have an account? <span class="cursor-pointer" id=redirect-to-login>Login</span>
                </div>
                <button class="btn" type="submit">Register</button>
            </div>
        </form>
    </div>
</div>
<div id="alert-wrapper">
    <div class="alert">ALERT</div>
    <div class="alert" id="alertTitle"></div>
</div>
`
components.loginScreen = `
<div class="login-container">
    <div class="login-form">
        <div class="title">Mindx Chat</div>
        <form id="form-login">
            <div class="input-wrapper">
                <input type="text" name="email" placeholder="Email">
                <div class="error" id="error-email"></div>
            </div>
            <div class="input-wrapper">
                <input type="password" name="password" placeholder="Password">
                <img class="show-password" src="../images/show-password.jpg">
                <div class="error" id="error-password"></div>
            </div>
            <div class="submit-wrapper">
                <div>Don't have an account? <span class="cursor-pointer" id=redirect-to-register>Register</span></div>
                <button class="btn" type="submit">Login</button>
            </div>
        </form>
    </div>
</div>
<div id="alert-wrapper">
    <div class="alert">ALERT</div>
    <div class="alert" id="alertTitle"></div>
</div>
`
components.chatScreen = `<button id="logout">Log out</button>`