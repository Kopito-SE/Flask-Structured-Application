// Registration page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const username = document.getElementById('username');

    // Real-time validation
    if (username) {
        username.addEventListener('input', utils.debounce(function() {
            validateUsername(this.value);
        }, 500));
    }

    if (password) {
        password.addEventListener('input', function() {
            validatePassword(this.value);
        });
    }

    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            validatePasswordMatch();
        });
    }

    // Form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous errors
            utils.clearErrors(registerForm);
            
            // Validate all fields
            const isUsernameValid = validateUsername(username.value);
            const isPasswordValid = validatePassword(password.value);
            const doPasswordsMatch = validatePasswordMatch();
            
            if (isUsernameValid && isPasswordValid && doPasswordsMatch) {
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                utils.showLoading(submitBtn);
                
                try {
                    // Form will submit normally
                    registerForm.submit();
                } catch (error) {
                    utils.hideLoading(submitBtn);
                    console.error('Registration error:', error);
                }
            }
        });
    }

    // Validation functions
    function validateUsername(value) {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        
        if (value.length < 3) {
            utils.showError(username, 'Username must be at least 3 characters long');
            return false;
        }
        
        if (!usernameRegex.test(value)) {
            utils.showError(username, 'Username can only contain letters, numbers, and underscores');
            return false;
        }
        
        return true;
    }

    function validatePassword(value) {
        if (value.length < 6) {
            utils.showError(password, 'Password must be at least 6 characters long');
            return false;
        }
        
        // Check for password strength (optional)
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        
        if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
            // Show warning but don't block submission
            const warningDiv = document.createElement('div');
            warningDiv.className = 'validation-warning';
            warningDiv.textContent = 'Tip: Use uppercase, lowercase, and numbers for a stronger password';
            password.parentNode.appendChild(warningDiv);
        }
        
        return true;
    }

    function validatePasswordMatch() {
        if (password.value !== confirmPassword.value) {
            utils.showError(confirmPassword, 'Passwords do not match');
            return false;
        }
        return true;
    }
});