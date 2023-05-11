const AccountType = Object.freeze({
    Unknown: 0,
    SavingAccount: 1,
    CheckingAccount: 2,
});

const AccountTypeName = [
    "Unbekannt",
    "Sparkonto",
    "Kontokorrentkonto"
];

const AccountTypesVisible = [
    AccountTypeName[AccountType.SavingAccount],
    AccountTypeName[AccountType.CheckingAccount]
];

class AccountError extends Error {}

class BankAccountBase {
    AccountOwner = '';
    AccountType = 0;
    Balance = 0;
    ID = 0;

    constructor(ID) {
        if (ID == null) {
            throw new AccountError("Fehler: Undefinierte Konto-ID");
        }

        this.ID = ID;
    }
}

class BankSavingAccount extends BankAccountBase {
    constructor(ID) {
        super(ID);
        this.AccountType = AccountType.SavingAccount;
    }
}

class BankCheckingAccount extends BankAccountBase {
    constructor(ID) {
        super(ID);
        this.AccountType = AccountType.CheckingAccount;
    }
}

const AccountTypeClasses = [
    null,
    BankSavingAccount,
    BankCheckingAccount
];

class BankAccountListBase {
    #aAccounts = [];
    #iIDPoolMax = 0;
    #iIDPoolMin = 0;
    _atListType = 0;

    constructor(IDPoolMin, IDPoolMax) {
        if (IDPoolMax - IDPoolMin <= 0) {
            throw new AccountError('Fehler: Ungültiger ID-Pool');
        }

        this.#iIDPoolMin = IDPoolMin;
        this.#iIDPoolMax = IDPoolMax;
    }

    AddAccount(AccountOwner) {
        if (this.FreeSpace < 1) {
            throw new AccountError("Fehler: Kontoliste ist voll!");
        }

        let clsAccount = AccountTypeClasses[this._atListType];
        let iAvailableID = this.#GetAvailableID();
        if (iAvailableID != -1) {
            let aAccount = new clsAccount(iAvailableID);
            aAccount.AccountOwner = AccountOwner;
            this.#aAccounts.push(aAccount);

            return true;
        }
        return false;
    }

    GetAccountList() {
        return this.#aAccounts;
    }

    #GetAvailableID() {
        // alle IDs sammeln
        let aIDs = [];
        this.#aAccounts.forEach((element) => {
            aIDs.push(element.ID);
        });

        // freie ID finden
        let iAvailableID = -1;
        for (let i = this.#iIDPoolMin; i <= this.#iIDPoolMax; i++) {
            if (!aIDs.includes(i)) {
                iAvailableID = i;
                break;
            }
        }

        return iAvailableID;
    }

    get FreeSpace() {
        return this.TotalAvailableSpace - this.#aAccounts.length;
    }

    get TotalAvailableSpace() {
        return this.#iIDPoolMax - this.#iIDPoolMin + 1;
    }

    IDPoolContains(ID) {
        return (this.#iIDPoolMin <= ID) && (ID <= this.#iIDPoolMax);
    }

    RemoveAccount(AccountID) {
        let i = 0;
        for (let i = 0; i <= this.#aAccounts.length - 1; i++) {
            if (this.#aAccounts[i].ID == AccountID) {
                this.#aAccounts.splice(i, 1);
                return true;
            }
        }

        return false;
    }
}

class BankSavingAccountList extends BankAccountListBase {
    constructor(IDPoolMin, IDPoolMax) {
        super(IDPoolMin, IDPoolMax);
        this._atListType = AccountType.SavingAccount;
    }
}

class BankCheckingAccountList extends BankAccountListBase {
    constructor(IDPoolMin, IDPoolMax) {
        super(IDPoolMin, IDPoolMax);
        this._atListType = AccountType.CheckingAccount;
    }
}

class AccountManager {
    #aCheckingAccounts;
    #aSavingAccounts;
    #sLastError = '';

    constructor() {
        this.#aSavingAccounts = new BankSavingAccountList(10, 19);
        this.#aCheckingAccounts = new BankCheckingAccountList(20, 29);
    }

    AddAccount(Type, AccountOwner) {
        if (Type == AccountType.Unknown) {
            throw new AccountError('Fehler: Ungültiger Konto-Typ');
        }

        try {
            switch (Type) {
                case AccountType.SavingAccount:
                    return this.#aSavingAccounts.AddAccount(AccountOwner);
                case AccountType.CheckingAccount:
                    return this.#aCheckingAccounts.AddAccount(AccountOwner);
            }
        } catch (err) {
            // AccountError abfangen
            if (err instanceof AccountError) {
                this.#sLastError = err.message;
                return false;
            } else {
                throw err;
            }
        }
    }

    get CheckingAccounts() {
        return this.#aCheckingAccounts;
    }

    get LastError() {
        return this.#sLastError;
    }

    get SavingAccounts() {
        return this.#aSavingAccounts;
    }

    RemoveAccount(ID) {
        if (this.#aCheckingAccounts.IDPoolContains(ID)) {
            return this.#aCheckingAccounts.RemoveAccount(ID);
        }

        if (this.#aSavingAccounts.IDPoolContains(ID)) {
            return this.#aSavingAccounts.RemoveAccount(ID);
        }

        return false;
    }
}