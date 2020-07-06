const components = {};
components.alertMessage = `
<div id="alert-wrapper">
    <div class="alert">ALERT</div>
    <div class="alert" id="alertTitle"></div>
</div>`
components.registerScreen = `
<div class="register-container">
    <div class="register-form">
        <div class="title">Mindx Chat</div>
        <form id="form-register">
            <div class="name-wrapper">
                <div class="input-wrapper">
                    <input type="text" autocomplete="off" name="firstName" placeholder="First Name...">
                    <div class="error" id="error-first-name"></div>
                </div>
                <div class="input-wrapper">
                    <input type="text" autocomplete="off" name="lastName" placeholder="Last Name...">
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
`
components.chatScreen = `
<div class="chat-container">
    <div class="chat-header">Minx Chat</div>
    <div class="main">
        <div class="conversation-details">
            <div class="coversation-title">Fuckin Stranger</div>
            <div class="list-message"></div>
            <div class="input-message-area">
                <div class="image-message-container"></div>
                <form id="send-message-form">
                    <div class="image-input">
                    <input type="file" multiple name="images" accept="image/png, image/jpeg, image/jpg">
                    <label for="file"><i class="fa fa-camera" aria-hidden="true"></i></label>
                    </div>
                    <textarea type="text" autofocus="true" spellcheck="false" placeholder="Type a message..."></textarea>
                    <button><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                </form>
            </div>
        </div>
    </div>
</div>
`
components.unchooseImageButton = `<div class='close-btn'><i class="fa fa-times" aria-hidden="true"></i></div>`
components.logOut = `
<button id="logout">Log out</button>`

