import Account from './AccountsScheme.js'

class AccountsService{
    async createAccount(login, password, isAdmin) {
    const newAccount = await Account.create({ login, password, isAdmin });
    return newAccount;
}

    
async validate(credentials) {
    const user = await Account.findOne({
        login: credentials.login,
        password: credentials.password
    });

    return user ? user.toObject() : null; 
}

}

export default new AccountsService()