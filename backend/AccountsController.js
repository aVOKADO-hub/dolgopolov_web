import AccountsService from './AccountsService.js';

class AccountsController {
    async login(req, res) {
        try {
            res.status(200).json({ title: "Login Page" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // Validate login and send a JSON response
    async loginValidate(req, res) {
    try {
        const user = await AccountsService.validate(req.body);

        if (user) {
            // Check if isAdmin is correctly retrieved from the user document
            console.log("User document:", user); // Log entire user document

            const isAdmin = Boolean(user.isAdmin); // Ensure it’s boolean
            req.session.isAdmin = isAdmin; // Set in session for server-side use
            console.log("User isAdmin:", isAdmin); // Confirm correct value

            res.status(200).json({
                message: "Login successful",
                redirect: '/api/collections',
                isAdmin: isAdmin // Send isAdmin to frontend
            });
        } else {
            res.status(400).json({ error: "Can't find account" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}


    // Register logic without rendering (React will handle the frontend)
    async register(req, res) {
        try {
            res.status(200).json({ title: "Register Page" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async createAccount(req, res) {
        try {
            const isAdmin = Boolean(req.body.isAdmin); // Ensure isAdmin is a boolean
            await AccountsService.createAccount(req.body.login, req.body.password, isAdmin);

            res.status(200).json({ message: "Account created", redirect: '/api/login' });
        } catch (e) {
            res.status(500).json({ error: "Create account error: " + e.message });
        }
}   

}

export default new AccountsController();
