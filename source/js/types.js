/**
 * Enum für alle Kontotypen
 */
const AccountType = Object.freeze({
    Unknown: 0,
    SavingAccount: 1,
    CheckingAccount: 2,
});

/**
 * Liste alle Kontotyp-Bezeichnungen
 */
const AccountTypeName = [
    "Unbekannt",
    "Sparkonto",
    "Kontokorrentkonto"
];

/**
 * Liste der auf der GUI auswählbaren Kontotypen
 */
const AccountTypesVisible = [
    AccountTypeName[AccountType.SavingAccount],
    AccountTypeName[AccountType.CheckingAccount]
];

/**
 * Exception für alle Konto-Fehler
 */
class AccountError extends Error {}

/**
 * Basisklasse für ein Konto
 */
class BankAccountBase {
    CreationDate = '';
    Name = '';
    Owner = '';
    Type = 0;
    Balance = 0;
    ID = 0;

    /**
     * Konstruktor zur Erzeugung eines Kontos
     * @param {number} ID Kontonummer
     */
    constructor(ID) {
        if (ID == null) {
            throw new AccountError("Fehler: Undefinierte Konto-ID");
        }

        this.ID = ID;
        this.CreationDate = new Date();
    }
}

/**
 * Klasse für ein Sparkonto
 */
class BankSavingAccount extends BankAccountBase {
    /**
     * Konstruktor zur Erzeugung eines Sparkontos
     * @param {number} ID Kontonummer
     */
    constructor(ID) {
        super(ID);
        this.Type = AccountType.SavingAccount;
    }
}

/**
 * Klasse für ein Kontokorrentkonto
 */
class BankCheckingAccount extends BankAccountBase {
    /**
     * Konstruktor zur Erzeugung eines Kontokorrentkontos
     * @param {number} ID Kontonummer
     */
    constructor(ID) {
        super(ID);
        this.Type = AccountType.CheckingAccount;
    }
}

/**
 * Liste der Konto-Klassen, zugeordnet zu den Kontotypen
 */
const AccountTypeClasses = [
    null,
    BankSavingAccount,
    BankCheckingAccount
];

/**
 * Basisklasse für eine Kontoliste
 */
class BankAccountListBase {
    #aAccounts = [];
    #iIDPoolMax = 0;
    #iIDPoolMin = 0;
    _atListType = 0;

    /**
     * Konstruktor zur Erzeugung einer Kontoliste
     * @param {number} IDPoolMin Kleinste generierbare Kontonummer in der Liste
     * @param {number} IDPoolMax Größte generierbare Kontonummer in der Liste
     * @param {AccountType} ListType Kontotyp der in der Liste vorhandenen Konten
     */
    constructor(IDPoolMin, IDPoolMax, ListType) {
        if (IDPoolMax - IDPoolMin <= 0) {
            throw new AccountError('Fehler: Ungültiger ID-Pool');
        }

        this._atListType = ListType;
        this.#iIDPoolMin = IDPoolMin;
        this.#iIDPoolMax = IDPoolMax;

        // Kontodaten laden
        this.LoadFromLocalStorage();
    }

    /**
     * Kontodaten zur Liste hinzufügen
     * @param {string} AccountName Kontobezeichnung
     * @param {string} AccountOwner Kontoinhaber
     * @returns 
     */
    AddAccount(AccountName, AccountOwner) {
        if (this.FreeSpace < 1) {
            throw new AccountError('Fehler: Kontoliste vom Typ ' + AccountTypeName[this._atListType] + ' ist voll!');
        }

        // Accountklasse abholen und freie ID suchen
        let clsAccount = AccountTypeClasses[this._atListType];
        let iAvailableID = this.#GetAvailableID();

        if (iAvailableID != -1) {
            // Konto anlegen
            let aAccount = new clsAccount(iAvailableID);
            aAccount.Name = AccountName;
            aAccount.Owner = AccountOwner;
            this.#aAccounts.push(aAccount);

            // speichern
            this.SaveToLocalStorage();
            return aAccount;
        }
        return null;
    }

    /**
     * Getter für die Konten in dieser Liste
     */
    get AccountList() {
        return this.#aAccounts;
    }

    /**
     * Konto zu der ID suchen
     * @param {number} ID Kontonummer
     * @returns Kontodaten oder null, falls das Konto nicht vorhanden ist
     */
    GetAccount(ID) {
        for (let i = 0; i <= this.#aAccounts.length - 1; i++) {
            if (this.#aAccounts[i].ID == ID) {
                return this.#aAccounts[i];
            }
        }
    }

    /**
     * Freie Kontonummer in der Liste suchen
     * @returns freie Kontonummer in der Liste oder -1, falls kein Platz mehr frei ist
     */
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

    /**
     * Getter für die Anzahl der freien Kontonummern in der Kontoliste
     */
    get FreeSpace() {
        return this.TotalAvailableSpace - this.#aAccounts.length;
    }

    /**
     * Prüfen, ob eine Kontonummer im ID-Pool liegt
     * @param {number} ID Kontonummer 
     * @returns Boolean, ob die Kontonummer im ID-Pool liegt
     */
    IDPoolContains(ID) {
        return (this.#iIDPoolMin <= ID) && (ID <= this.#iIDPoolMax);
    }

    /**
     * Alle Daten der Liste aus dem LocalStorage laden
     */
    LoadFromLocalStorage() {
        if (localStorage.getItem(AccountTypeName[this._atListType]) == null) {
            return;
        }

        let jsonItems = JSON.parse(localStorage.getItem(AccountTypeName[this._atListType]));

        jsonItems.forEach((element) => {
            // Datum zurück nach Datums-Wert formatieren (wurde durch JSON als String gespeichert)
            element.CreationDate = new Date(Date.parse(element.CreationDate));
        });

        this.#aAccounts = jsonItems;
    }

    /**
     * Konto aus der Liste entfernen
     * @param {number} ID Kontonummer
     * @returns Boolean, ob das Konto aus der Liste entfernt wurde
     */
    RemoveAccount(ID) {
        let i = 0;
        for (let i = 0; i <= this.#aAccounts.length - 1; i++) {
            if (this.#aAccounts[i].ID == ID) {
                this.#aAccounts.splice(i, 1);

                // speichern
                this.SaveToLocalStorage();
                return true;
            }
        }

        return false;
    }

    /**
     * Alle Daten der Liste im LocalStorage speichern
     */
    SaveToLocalStorage() {
        let sAccounts = JSON.stringify(this.#aAccounts);
        localStorage.setItem(AccountTypeName[this._atListType], sAccounts);
    }

    /**
     * Getter für die Anzahl aller möglichen Kontonummern, welche theoretisch in der Liste gespeichert werden können
     */
    get TotalAvailableSpace() {
        return this.#iIDPoolMax - this.#iIDPoolMin + 1;
    }
}

/**
 * Klasse für eine Kontoliste aus Sparkonten
 */
class BankSavingAccountList extends BankAccountListBase {
    /**
     * Konstruktor zur Erzeugung einer Sparkonto-Liste
     * @param {number} IDPoolMin Kleinste generierbare Kontonummer in der Liste
     * @param {number} IDPoolMax Größte generierbare Kontonummer in der Liste
     */
    constructor(IDPoolMin, IDPoolMax) {
        super(IDPoolMin, IDPoolMax, AccountType.SavingAccount);
    }
}

/**
 * Klasse für eine Kontoliste aus Kontokorrentkonten
 */
class BankCheckingAccountList extends BankAccountListBase {
    /**
     * Konstruktor zur Erzeugung einer Kontokorrentkonto-Liste
     * @param {number} IDPoolMin Kleinste generierbare Kontonummer in der Liste
     * @param {number} IDPoolMax Größte generierbare Kontonummer in der Liste
     */
    constructor(IDPoolMin, IDPoolMax) {
        super(IDPoolMin, IDPoolMax, AccountType.CheckingAccount);
    }
}

/**
 * Klasse für Kontoverwaltung
 */
class AccountManager {
    #aCheckingAccounts;
    #aSavingAccounts;
    #sLastError = '';
    #aValueList = [];

    /**
     * Konstruktor zur Erzeugung der Kontoverwaltung
     */
    constructor() {
        this.#aSavingAccounts = new BankSavingAccountList(100, 199);
        this.#aCheckingAccounts = new BankCheckingAccountList(200, 299);
    }

    /**
     * Kontodaten hinzufügen
     * @param {AccountType} Type Kontotyp 
     * @param {string} AccountName Kontoname
     * @param {string} AccountOwner Kontoinhaber
     * @returns Kontodaten, wenn das Konto angelegt wurde, oder null, wenn es nicht angelegt werden konnte
     */
    AddAccount(Type, AccountName, AccountOwner) {
        if (Type == AccountType.Unknown) {
            throw new AccountError('Fehler: Ungültiger Konto-Typ');
        }

        try {
            switch (Type) {
                case AccountType.SavingAccount:
                    return this.#aSavingAccounts.AddAccount(AccountName, AccountOwner);
                case AccountType.CheckingAccount:
                    return this.#aCheckingAccounts.AddAccount(AccountName, AccountOwner);
            }
        } catch (err) {
            // AccountError abfangen
            if (err instanceof AccountError) {
                this.#sLastError = err.message;
                return null;
            } else {
                throw err;
            }
        }
    }

    /**
     * Konto zu der angegebenen Kontonummer suchen
     * @param {number} ID Kontonummer
     * @returns Kontodaten, wenn das Konto gefunden wurde, oder null, falls nicht
     */
    GetAccount(ID) {
        let aAccount = this.#aSavingAccounts.GetAccount(ID);
        if (aAccount != null) {
            return aAccount;
        }

        aAccount = this.#aCheckingAccounts.GetAccount(ID);
        if (aAccount != null) {
            return aAccount;
        }

        return null;
    }

    /**
     * Getter für eine Liste anzeibarer Kontodaten (z.B. für eine DropDownBox) - beinhaltet IDs und Anzeigedaten
     */
    get AccountSelectionValues() {
        let aAccounts = this.Accounts;
        let aResult = [];

        aAccounts.forEach((element) => {
            aResult.push({
                'ID': element.ID,
                'displayText': 'Kontonr. ' + element.ID + ' | Name ' + element.Name + ' | Inhaber ' + element.Owner
            });
        });

        return aResult;
    }

    /**
     * Getter für alle Kontos aller Kontotypen
     */
    get Accounts() {
        let aAccs = [].concat(this.#aSavingAccounts.AccountList, this.#aCheckingAccounts.AccountList);
        return aAccs;
    }

    /**
     * Getter für die Kontoliste der Kontokorrentkonten
     */
    get CheckingAccounts() {
        return this.#aCheckingAccounts;
    }

    /**
     * Getter des zuletzt aufgetretenen Fehler
     */
    get LastError() {
        return this.#sLastError;
    }

    /**
     * Alle Kontodaten im LocalStorage speichern
     */
    SaveToLocalStorage() {
        this.#aSavingAccounts.SaveToLocalStorage();
        this.#aCheckingAccounts.SaveToLocalStorage();
    }

    /**
     * Getter für alle Sparkonten
     */
    get SavingAccounts() {
        return this.#aSavingAccounts;
    }

    /**
     * Konto entfernen
     * @param {number} ID Kontonummer
     * @returns Boolean, ob das Konto entfernt werden konnte
     */
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